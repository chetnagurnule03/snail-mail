import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const DEFAULT_CHARACTER = {
  name: 'Little Wanderer',
  skin_tone: '#f2c9a0',
  hair_color: '#7a4a2b',
  hair_style: 'wanderer_cap',
  outfit_color: '#c9a7e0',
  outfit_style: 'wanderer_coat',
  accessory: 'backpack',
  position: { x: 0, y: 0, z: 0 },
};

export function useCharacter(userId) {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setCharacter(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError || !data) {
          setCharacter({ user_id: userId, ...DEFAULT_CHARACTER });
        } else {
          setCharacter({ ...DEFAULT_CHARACTER, ...data });
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCharacter({ user_id: userId, ...DEFAULT_CHARACTER });
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const save = useCallback(
    async (patch) => {
      if (!userId) return;
      const next = { ...character, ...patch, user_id: userId };
      setCharacter(next);
      setSaving(true);
      setError(null);

      const { data, error: saveError } = await supabase
        .from('characters')
        .upsert(next, { onConflict: 'user_id' })
        .select()
        .single();

      setSaving(false);
      if (saveError) {
        setError(saveError);
      } else if (data) {
        setCharacter({ ...DEFAULT_CHARACTER, ...data });
      }
    },
    [character, userId]
  );

  return { character, loading, saving, error, save };
}
