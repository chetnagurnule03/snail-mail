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
      id: 'letter-snitch-1',
      sender_name: 'Golden Snitch Dispatch',
      sender_email: 'snitch@snailmail.local',
      recipient_name: 'Seeker',
      recipient_email: 'seeker@hogwarts.edu',
      subject: '⚡ Golden Snitch Express Delivery',
      body: 'Congratulations!\n\nThis letter was delivered via the Golden Snitch Express Webhook Notifier. Your scheduled message has officially landed in your mailbox.\n\nCatch the Snitch!',
      deliver_at: past2Days,
      status: 'delivered',
      stamp_type: 'golden_snitch',
      stationery_theme: 'classic_parchment',
      wax_color: '#d4af37',
      webhook_url: 'https://httpbin.org/post',
      created_at: past2Days
    },
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
      webhook_url: '',
      created_at: new Date(now.getTime() - 1000000).toISOString()
    }
  ];

  localStorage.setItem(MOCK_LETTERS_KEY, JSON.stringify(defaultSeed));
  return defaultSeed;
};

// Dispatch Snitch Webhook Alert
export const triggerSnitchWebhook = async (letter) => {
  if (!letter.webhook_url) return { success: false, message: 'No Webhook URL configured for this letter.' };

  try {
    const payload = {
      event: 'snail_email.letter_delivered',
      timestamp: new Date().toISOString(),
      letter: {
        id: letter.id,
        sender_name: letter.sender_name,
        recipient_name: letter.recipient_name,
        recipient_email: letter.recipient_email,
        subject: letter.subject,
        stamp_type: letter.stamp_type,
        deliver_at: letter.deliver_at,
        status: 'delivered'
      }
    };

    const res = await fetch(letter.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return {
      success: res.ok,
      status: res.status,
      message: res.ok ? 'Golden Snitch webhook dispatched successfully!' : `Webhook responded with HTTP ${res.status}`
    };
  } catch (err) {
    return { success: false, message: `Webhook delivery error: ${err.message}` };
  }
};

// Supabase API Wrappers with Fallback
export const authService = {
  async signInWithGitHub() {
    if (!isSupabaseConfigured() || !supabase) {
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
      options: { redirectTo: window.location.origin }
    });
  },

  async signOut() {
    if (!isSupabaseConfigured() || !supabase) {
      localStorage.removeItem('snail_demo_user');
      return { error: null };
    }
    return await supabase.auth.signOut();
  },

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
  async getLetters() {
    if (!isSupabaseConfigured() || !supabase) {
      const mockData = getInitialMockLetters();
      const now = new Date();
      const updated = mockData.map(l => {
        if (new Date(l.deliver_at) <= now && l.status === 'in_transit') {
          // Trigger webhook on status transition
          if (l.webhook_url) triggerSnitchWebhook(l);
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

  async createLetter(letterData) {
    if (!isSupabaseConfigured() || !supabase) {
      const mockLetters = getInitialMockLetters();
      const isDelivered = new Date(letterData.deliver_at) <= new Date();
      const newLetter = {
        id: `letter-${Date.now()}`,
        ...letterData,
        status: isDelivered ? 'delivered' : 'in_transit',
        created_at: new Date().toISOString()
      };

      if (isDelivered && newLetter.webhook_url) {
        triggerSnitchWebhook(newLetter);
      }

      const updatedList = [newLetter, ...mockLetters];
      localStorage.setItem(MOCK_LETTERS_KEY, JSON.stringify(updatedList));
      return { data: [newLetter], error: null };
    }

    const { data, error } = await supabase
      .from('letters')
      .insert([letterData])
      .select();

    if (data && data[0] && data[0].status === 'delivered' && data[0].webhook_url) {
      triggerSnitchWebhook(data[0]);
    }

    return { data, error };
  }
};
