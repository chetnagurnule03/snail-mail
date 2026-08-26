import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are properly set up
export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-actual-anon-key-here'
  );
};

// Create Supabase Client instance (fallback to dummy client if unconfigured)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Mock Seed Data for Demonstration Mode
const MOCK_LETTERS_KEY = 'snail_email_mock_letters';

const getInitialMockLetters = () => {
  const stored = localStorage.getItem(MOCK_LETTERS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore error */ }
  }
  
  const now = new Date();
  const future3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const past2Days = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const defaultSeed = [
    {
      id: 'letter-1',
      sender_name: 'Lady Eleanor',
      sender_email: 'eleanor@victorianpost.io',
      recipient_name: 'Arthur Pendelton',
      recipient_email: 'arthur@example.com',
      subject: 'A Time Capsule for Next Year',
      body: 'Dearest Arthur,\n\nI am writing to you from the past using Snail Express. Ensure you do not open this until the appointed hour. May time be gentle with you.\n\nWarmest regards,\nLady Eleanor',
      deliver_at: future3Days,
      status: 'in_transit',
      stamp_type: 'royal_snail',
      stationery_theme: 'classic_parchment',
      wax_color: '#9b111e',
      created_at: new Date(now.getTime() - 1000000).toISOString()
    },
    {
      id: 'letter-2',
      sender_name: 'GitHub Bot',
      sender_email: 'octocat@github.com',
      recipient_name: 'Developer',
      recipient_email: 'dev@snailmail.local',
      subject: 'Welcome to Snail Email Repository',
      body: 'Hello Explorer!\n\nYour repository is successfully configured and ready to be pushed to GitHub and connected to Supabase.\n\nHappy Coding!',
      deliver_at: past2Days,
      status: 'delivered',
      stamp_type: 'golden_leaf',
      stationery_theme: 'cyber_postal',
      wax_color: '#d4af37',
      created_at: past2Days
    }
  ];

  localStorage.setItem(MOCK_LETTERS_KEY, JSON.stringify(defaultSeed));
  return defaultSeed;
};

// Supabase API Wrappers with Fallback
export const authService = {
  // Sign in with GitHub OAuth
  async signInWithGitHub() {
    if (!isSupabaseConfigured() || !supabase) {
      // Demo mock login
      const mockUser = {
        id: 'user-demo-123',
        email: 'developer@github.com',
        user_metadata: { full_name: 'GitHub Explorer', avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' }
      };
      localStorage.setItem('snail_demo_user', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    }

    return await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    });
  },

  // Sign Out
  async signOut() {
    if (!isSupabaseConfigured() || !supabase) {
      localStorage.removeItem('snail_demo_user');
      return { error: null };
    }
    return await supabase.auth.signOut();
  },

  // Get current user session
  async getCurrentUser() {
    if (!isSupabaseConfigured() || !supabase) {
      const demoUser = localStorage.getItem('snail_demo_user');
      return demoUser ? JSON.parse(demoUser) : null;
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

// Database Operations
export const letterService = {
  // Fetch Letters
  async getLetters() {
    if (!isSupabaseConfigured() || !supabase) {
      const mockData = getInitialMockLetters();
      // Auto update status based on deliver_at
      const now = new Date();
      const updated = mockData.map(l => {
        if (new Date(l.deliver_at) <= now && l.status === 'in_transit') {
          return { ...l, status: 'delivered' };
        }
        return l;
      });
      localStorage.setItem(MOCK_LETTERS_KEY, JSON.stringify(updated));
      return { data: updated, error: null };
    }

    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Send a New Letter
  async createLetter(letterData) {
    if (!isSupabaseConfigured() || !supabase) {
      const mockLetters = getInitialMockLetters();
      const newLetter = {
        id: `letter-${Date.now()}`,
        ...letterData,
        status: new Date(letterData.deliver_at) <= new Date() ? 'delivered' : 'in_transit',
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
