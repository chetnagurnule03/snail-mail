import { useAuth } from './hooks/useAuth';
import { useCharacter } from './hooks/useCharacter';
import AuthGate from './components/AuthGate';
import GardenScene from './components/GardenScene';

const OUTFIT_COLORS = ['#c9a7e0', '#f2a6a0', '#a6d0e0', '#e0c987'];

export default function App() {
  const { user, loading: authLoading, signInWithEmail, signInAsGuest, signOut } =
    useAuth();
  const {
    character,
    loading: charLoading,
    saving,
    save,
  } = useCharacter(user?.id);

  if (authLoading) {
    return <Centered>Loading your little world…</Centered>;
  }

  if (!user) {
    return <AuthGate onSignInWithEmail={signInWithEmail} onSignInAsGuest={signInAsGuest} />;
  }

  if (charLoading || !character) {
    return <Centered>Waking up your garden…</Centered>;
  }

  const cycleOutfit = () => {
    const currentIndex = OUTFIT_COLORS.indexOf(character.outfit_color);
    const next = OUTFIT_COLORS[(currentIndex + 1) % OUTFIT_COLORS.length];
    save({ outfit_color: next });
  };

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <GardenScene character={character} />

      <div style={styles.hud}>
        <div style={styles.badge}>
          🐌 {character.name} {saving ? '(saving…)' : ''}
        </div>
        <button style={styles.pill} onClick={cycleOutfit}>
          Change outfit color
        </button>
        <button style={styles.pillGhost} onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8a7a63',
        fontSize: '1.1rem',
      }}
    >
      {children}
    </div>
  );
}

const styles = {
  hud: {
    position: 'absolute',
    top: 16,
    left: 16,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    background: 'rgba(255,250,241,0.9)',
    padding: '0.5rem 0.9rem',
    borderRadius: 999,
    fontSize: '0.9rem',
    color: '#5b4a34',
  },
  pill: {
    background: '#e07a5f',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.9rem',
    borderRadius: 999,
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  pillGhost: {
    background: 'transparent',
    color: '#7a5c3e',
    border: '1px solid #cbb994',
    padding: '0.5rem 0.9rem',
    borderRadius: 999,
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};
