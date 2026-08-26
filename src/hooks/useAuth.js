import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => {
        setSession(data?.session ?? null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const signInWithEmail = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signInAsGuest = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
    } catch (e) {
      // Fallback guest session for offline/demo mode
      const mockGuest = {
        user: {
          id: 'guest-demo-user-id',
          is_anonymous: true,
          email: 'guest@snailmail.local'
        }
      };
      setSession(mockGuest);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    user: session?.user ?? null,
    isAnonymous: Boolean(session?.user?.is_anonymous),
    loading,
    signInWithEmail,
    signInAsGuest,
    signOut,
  };
}
