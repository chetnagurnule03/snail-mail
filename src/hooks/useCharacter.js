import { useCallback, useEffect, useState } from 'react';

const DEFAULT_CHARACTER = {
  name: 'Little Wanderer',
  skin_tone: '#f2c9a0',
  hair_color: '#7a4a2b',
  hair_style: 'wanderer_cap',
  outfit_color: '#c9a7e0',
  outfit_style: 'wanderer_coat',
  accessory: 'backpack',
  pet1_type: 'bunny',
  has_horse: true,
  position: { x: 0, y: 0, z: 0 },
};

const STORAGE_KEY = 'snail_mail_character';

export function useCharacter() {
  const [character, setCharacter] = useState(DEFAULT_CHARACTER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCharacter({ ...DEFAULT_CHARACTER, ...parsed });
      }
    } catch (err) {
      console.warn('Failed to parse local character data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(
    async (patch) => {
      setSaving(true);
      setError(null);

      setCharacter((prev) => {
        const next = { ...prev, ...patch };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (err) {
          console.warn('Failed to save character to localStorage:', err);
          setError(err);
        }
        return next;
      });

      setTimeout(() => {
        setSaving(false);
      }, 300);
    },
    []
  );

  return { character, loading, saving, error, save };
}
