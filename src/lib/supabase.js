import { createClient } from '@supabase/supabase-js';

// Fallback / Default Supabase Credentials
const SUPABASE_URL_KEY = 'SNAIL_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'SNAIL_SUPABASE_ANON_KEY';
const MOCK_LETTERS_KEY = 'SNAIL_MOCK_LETTERS_VAULT';

const defaultUrl = 'https://xyzcompany.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.dummy_key';

export function getSupabaseUrl() {
  return localStorage.getItem(SUPABASE_URL_KEY) || import.meta.env.VITE_SUPABASE_URL || defaultUrl;
}

export function getSupabaseAnonKey() {
  return localStorage.getItem(SUPABASE_ANON_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey;
}

export function isSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return url && key && url !== defaultUrl && !url.includes('xyzcompany');
}

export let supabase = null;

try {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (url && key) {
    supabase = createClient(url, key);
  }
} catch (e) {
  console.warn('Failed to initialize Supabase client:', e);
}

export function updateSupabaseConfig(url, anonKey) {
  if (url) localStorage.setItem(SUPABASE_URL_KEY, url);
  if (anonKey) localStorage.setItem(SUPABASE_ANON_KEY, anonKey);
  window.location.reload();
}

function getInitialMockLetters() {
  const stored = localStorage.getItem(MOCK_LETTERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse mock letters:', e);
    }
  }

  const sample = [
    {
      id: 'demo-letter-1',
      sender_name: 'Luna',
      sender_email: 'luna@storybook.local',
      recipient_name: 'Wanderer',
      recipient_email: 'player@village.local',
      subject: 'Welcome to Snail Mail Village! 🐌',
      body: 'Dear friend,\n\nWelcome to our cozy 3D village! Take your time exploring the gardens, visiting the market stalls, and riding your horse.\n\nWarmly,\nLuna',
      deliver_at: new Date(Date.now() - 3600 * 1000).toISOString(),
      stamp_type: 'royal_snail',
      stationery_theme: 'classic_parchment',
      wax_color: '#9b111e',
      status: 'delivered',
      created_at: new Date(Date.now() - 7200 * 1000).toISOString()
    }
  ];

  localStorage.setItem(MOCK_LETTERS_KEY, JSON.stringify(sample));
  return sample;
}

export const letterService = {
  async getLetters() {
    if (!isSupabaseConfigured() || !supabase) {
      const mockData = getInitialMockLetters();
      return { data: mockData, error: null };
    }

    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async getLetterById(id) {
    if (!id) return { data: null, error: 'No ID provided' };

    // Check localStorage first
    try {
      const mockLetters = getInitialMockLetters();
      const match = mockLetters.find(l => l.id === id || l.id === `letter-${id}` || l.id === `snl_${id}`);
      if (match) return { data: match, error: null };
    } catch (err) {
      console.warn('localStorage letter read error:', err);
    }

    // Check Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (data) return { data, error: null };
    }

    return { data: null, error: 'Letter not found' };
  },

  async createLetter(letterData) {
    if (!isSupabaseConfigured() || !supabase) {
      const mockLetters = getInitialMockLetters();
      const newLetter = {
        id: letterData.id || `snl_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`,
        ...letterData,
        status: 'delivered',
        created_at: new Date().toISOString()
      };

      const updatedList = [newLetter, ...mockLetters];
      localStorage.setItem(MOCK_LETTERS_KEY, JSON.stringify(updatedList));
      return { data: [newLetter], error: null };
    }

    const { data, error } = await supabase
      .from('letters')
      .insert([letterData])
      .select();

    return { data, error };
  }
};
