import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCharacter } from './hooks/useCharacter';
import AuthGate from './components/AuthGate';
import GardenScene from './components/GardenScene';

const OUTFIT_COLORS = ['#c9a7e0', '#e07a5f', '#84b574', '#76c8e3', '#ffb5a7', '#f4a261'];
const HAIR_COLORS = ['#7a4a2b', '#3d2616', '#e6c594', '#b55239', '#c9a7e0'];
const SKIN_TONES = ['#f2c9a0', '#fae1c5', '#d9a07b', '#8d5b4c', '#ffe0bd'];

const HAIR_STYLES = [
  { id: 'wanderer_cap', name: '🎩 Traveler Cap' },
  { id: 'cute_bob', name: '💇 Cute Bob' },
  { id: 'braids', name: '👧 Twin Braids' },
  { id: 'wavy_locks', name: '✨ Wavy Locks' },
];

const OUTFIT_STYLES = [
  { id: 'wanderer_coat', name: '🧥 Wanderer Coat' },
  { id: 'cozy_sweater', name: '🧶 Cozy Knit' },
  { id: 'gardener_overalls', name: '👖 Overalls' },
];

const ACCESSORIES = [
  { id: 'backpack', name: '🎒 Traveler Pack' },
  { id: 'cozy_scarf', name: '🧣 Knitted Scarf' },
  { id: 'flower_crown', name: '🌸 Flower Crown' },
  { id: 'round_glasses', name: '👓 Wire Glasses' },
  { id: 'none', name: '🚫 None' },
];

export default function App() {
  const { user, loading: authLoading, signInWithEmail, signInAsGuest, signOut } = useAuth();
  const { character, loading: charLoading, saving, save } = useCharacter(user?.id);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [resetCameraSignal, setResetCameraSignal] = useState(0);

  if (authLoading) {
    return <Centered>Loading your little world…</Centered>;
  }

  if (!user) {
    return <AuthGate onSignInWithEmail={signInWithEmail} onSignInAsGuest={signInAsGuest} />;
  }

  if (charLoading || !character) {
    return <Centered>Waking up your garden…</Centered>;
  }

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      {/* 3D Storybook World Canvas with 360 Camera Controls */}
      <GardenScene character={character} resetCameraSignal={resetCameraSignal} />

      {/* HUD Overlay Bar */}
      <div style={styles.hud}>
        <div style={styles.badge}>
          🐌 {character.name} {saving ? '(saving…)' : ''}
        </div>
        <button style={styles.pill} onClick={() => setIsCustomizerOpen(true)}>
          🎨 Customize Character
        </button>
        <button style={styles.pillSecondary} onClick={() => setResetCameraSignal(Date.now())}>
          🎥 Reset View [R]
        </button>
        <button style={styles.pillGhost} onClick={signOut}>
          Sign out
        </button>
      </div>

      {/* Controls Hint Overlay */}
      <div style={styles.controlsHint}>
        🖱️ Left Drag: Rotate 360° | 📜 Scroll: Zoom | ⌨️ WASD / Click: Move
      </div>

      {/* Character Customizer Overlay Modal */}
      {isCustomizerOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#5b4a34' }}>
                🎨 Customize Your Character
              </h2>
              <button
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#8a7a63' }}
                onClick={() => setIsCustomizerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              {/* Character Name */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  value={character.name || ''}
                  onChange={(e) => save({ name: e.target.value })}
                  style={styles.input}
                />
              </div>

              {/* Hairstyle */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Hairstyle</label>
                <div style={styles.grid2}>
                  {HAIR_STYLES.map((h) => (
                    <button
                      key={h.id}
                      style={{
                        ...styles.choiceBtn,
                        borderColor: character.hair_style === h.id ? '#e07a5f' : '#e3d7bf',
                        background: character.hair_style === h.id ? '#fdf0ed' : '#fffaf1',
                      }}
                      onClick={() => save({ hair_style: h.id })}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color Picker */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Hair Color</label>
                <div style={styles.swatchRow}>
                  {HAIR_COLORS.map((c) => (
                    <button
                      key={c}
                      style={{
                        ...styles.swatch,
                        backgroundColor: c,
                        boxShadow: character.hair_color === c ? '0 0 0 3px #e07a5f' : 'none',
                      }}
                      onClick={() => save({ hair_color: c })}
                    />
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Skin Tone</label>
                <div style={styles.swatchRow}>
                  {SKIN_TONES.map((s) => (
                    <button
                      key={s}
                      style={{
                        ...styles.swatch,
                        backgroundColor: s,
                        boxShadow: character.skin_tone === s ? '0 0 0 3px #e07a5f' : 'none',
                      }}
                      onClick={() => save({ skin_tone: s })}
                    />
                  ))}
                </div>
              </div>

              {/* Outfit Style */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Outfit Style</label>
                <div style={styles.grid2}>
                  {OUTFIT_STYLES.map((o) => (
                    <button
                      key={o.id}
                      style={{
                        ...styles.choiceBtn,
                        borderColor: character.outfit_style === o.id ? '#e07a5f' : '#e3d7bf',
                        background: character.outfit_style === o.id ? '#fdf0ed' : '#fffaf1',
                      }}
                      onClick={() => save({ outfit_style: o.id })}
                    >
                      {o.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfit Color Picker */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Outfit Color</label>
                <div style={styles.swatchRow}>
                  {OUTFIT_COLORS.map((c) => (
                    <button
                      key={c}
                      style={{
                        ...styles.swatch,
                        backgroundColor: c,
                        boxShadow: character.outfit_color === c ? '0 0 0 3px #e07a5f' : 'none',
                      }}
                      onClick={() => save({ outfit_color: c })}
                    />
                  ))}
                </div>
              </div>

              {/* Accessory */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Accessory</label>
                <div style={styles.grid2}>
                  {ACCESSORIES.map((a) => (
                    <button
                      key={a.id}
                      style={{
                        ...styles.choiceBtn,
                        borderColor: character.accessory === a.id ? '#e07a5f' : '#e3d7bf',
                        background: character.accessory === a.id ? '#fdf0ed' : '#fffaf1',
                      }}
                      onClick={() => save({ accessory: a.id })}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.pill} onClick={() => setIsCustomizerOpen(false)}>
                Done & Save
              </button>
            </div>
          </div>
        </div>
      )}
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
    zIndex: 10,
  },
  badge: {
    background: 'rgba(255,250,241,0.92)',
    padding: '0.55rem 1rem',
    borderRadius: 999,
    fontSize: '0.9rem',
    color: '#5b4a34',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  pill: {
    background: '#e07a5f',
    color: 'white',
    border: 'none',
    padding: '0.55rem 1rem',
    borderRadius: 999,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(224,122,95,0.3)',
  },
  pillSecondary: {
    background: '#457b9d',
    color: 'white',
    border: 'none',
    padding: '0.55rem 1rem',
    borderRadius: 999,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(69,123,157,0.3)',
  },
  pillGhost: {
    background: 'rgba(255,250,241,0.92)',
    color: '#7a5c3e',
    border: '1px solid #cbb994',
    padding: '0.55rem 1rem',
    borderRadius: 999,
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  controlsHint: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255,250,241,0.9)',
    color: '#5b4a34',
    padding: '0.5rem 1.2rem',
    borderRadius: 999,
    fontSize: '0.82rem',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    pointerEvents: 'none',
    zIndex: 10,
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(50,38,25,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: 16,
  },
  modalCard: {
    background: '#fffaf1',
    borderRadius: 20,
    width: '100%',
    maxWidth: 440,
    boxShadow: '0 16px 40px rgba(90,65,40,0.25)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #e8dfce',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBody: {
    padding: '1.25rem 1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  modalFooter: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e8dfce',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#8a7a63',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '0.6rem 0.8rem',
    borderRadius: 10,
    border: '1px solid #e3d7bf',
    fontSize: '0.95rem',
    background: '#ffffff',
    outline: 'none',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  choiceBtn: {
    padding: '0.5rem 0.75rem',
    borderRadius: 10,
    border: '1px solid #e3d7bf',
    fontSize: '0.82rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },
  swatchRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: '2px solid #ffffff',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
};
