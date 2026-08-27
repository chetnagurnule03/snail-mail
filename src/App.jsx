import React, { useState, useEffect } from 'react';
import { useCharacter } from './hooks/useCharacter';
import { letterService } from './lib/supabase';
import GardenScene from './components/GardenScene';
import VillagerDialogueModal from './components/VillagerDialogueModal';
import Composer from './components/Composer';
import SnailMailReceiverExperience from './components/SnailMailReceiverExperience';

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

const SMALL_PETS = [
  { id: 'bunny', name: '🐰 Bunny' },
  { id: 'cat', name: '🐱 Cat' },
  { id: 'dog', name: '🐶 Dog' },
  { id: 'fox', name: '🦊 Fox' },
  { id: 'frog', name: '🐸 Frog' },
  { id: 'squirrel', name: '🐿️ Squirrel' },
];

export default function App() {
  const { character, loading: charLoading, saving, save } = useCharacter();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isMailComposerOpen, setIsMailComposerOpen] = useState(false);
  const [preselectedVillager, setPreselectedVillager] = useState(null);
  const [resetCameraSignal, setResetCameraSignal] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Shared Letter Receiver Experience State
  const [sharedLetter, setSharedLetter] = useState(null);
  const [isReceiverMode, setIsReceiverMode] = useState(false);

  // Snail Mail Toast & 3D Deliveries State
  const [mailToast, setMailToast] = useState(null);
  const [activeSnailDeliveries, setActiveSnailDeliveries] = useState([]);

  // Villager Interaction State
  const [nearVillager, setNearVillager] = useState(null);
  const [activeDialogueVillager, setActiveDialogueVillager] = useState(null);

  // Check URL for Shared Letter Link on startup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pathMatch = window.location.pathname.match(/\/mail\/(.+)/)?.[1];
    const hashMatch = window.location.hash.match(/mail\/(.+)/)?.[1];
    const letterId = params.get('letter') || pathMatch || hashMatch;

    if (letterId) {
      letterService.getLetterById(letterId).then(({ data }) => {
        if (data) {
          setSharedLetter(data);
          setIsReceiverMode(true);
        }
      });
    }
  }, []);

  const toggleMount = () => {
    setIsMounted((prev) => !prev);
  };

  const handleOpenMailComposer = (villager = null) => {
    setPreselectedVillager(villager);
    setIsMailComposerOpen(true);
  };

  const handleLetterSent = (recipientName = 'Villager') => {
    setIsMailComposerOpen(false);
    setMailToast(`Letter sent to ${recipientName}! 🐌💌`);

    // Add 3D Snail Messenger Delivery
    const newDelivery = {
      id: Date.now(),
      recipient: recipientName,
      progress: 0,
      startX: -2.8,
      startZ: 4.5,
      targetX: -24.0,
      targetZ: -26.0,
    };
    setActiveSnailDeliveries((prev) => [...prev, newDelivery]);

    setTimeout(() => {
      setMailToast(null);
    }, 4000);
  };

  const handleRemoveSnailDelivery = (deliveryId) => {
    setActiveSnailDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
  };

  // Render Receiver Experience if opening a shared link
  if (isReceiverMode && sharedLetter) {
    return (
      <SnailMailReceiverExperience
        letter={sharedLetter}
        onBackToGame={() => {
          setIsReceiverMode(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }}
      />
    );
  }

  if (charLoading || !character) {
    return <Centered>Waking up your village world…</Centered>;
  }

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Storybook World Canvas */}
      <GardenScene
        character={character}
        resetCameraSignal={resetCameraSignal}
        isMounted={isMounted}
        toggleMount={toggleMount}
        setNearVillager={setNearVillager}
        onOpenDialogue={setActiveDialogueVillager}
        activeSnailDeliveries={activeSnailDeliveries}
        onRemoveSnailDelivery={handleRemoveSnailDelivery}
      />

      {/* Top HUD Bar */}
      <div style={styles.hud}>
        <div style={styles.badge}>
          🐌 {character.name || 'Little Wanderer'} {saving ? '(saving…)' : ''}
        </div>
        <button
          style={{ ...styles.pill, background: isMounted ? '#e76f51' : '#e07a5f' }}
          onClick={toggleMount}
        >
          {isMounted ? '🚶 Dismount [E]' : '🐴 Ride Horse [E]'}
        </button>
        <button style={styles.pillSecondary} onClick={() => handleOpenMailComposer()}>
          📮 Send Snail Mail
        </button>
        <button style={styles.pillSecondary} onClick={() => setIsCustomizerOpen(true)}>
          🎨 Customize
        </button>
        <button style={styles.pillGhost} onClick={() => setResetCameraSignal(Date.now())}>
          🎥 Reset View [R]
        </button>
      </div>

      {/* Near Villager Interactive Prompt */}
      {nearVillager && !isMounted && !activeDialogueVillager && (
        <div
          onClick={() => setActiveDialogueVillager(nearVillager)}
          style={styles.villagerPrompt}
        >
          💬 Press [E] to talk to {nearVillager.name} ({nearVillager.job || 'Villager'})
        </div>
      )}

      {/* Snail Mail Dispatch Toast Notification */}
      {mailToast && (
        <div style={styles.mailToast}>
          {mailToast}
        </div>
      )}

      {/* Bottom Features Summary Bar */}
      <div style={styles.featuresBar}>
        <div style={styles.featureItem}>🧭 Explore</div>
        <div style={styles.featureItem} onClick={toggleMount}>🐴 Ride Horse</div>
        <div style={styles.featureItem} onClick={() => setActiveDialogueVillager(nearVillager || { name: 'Oliver', job: 'Gardener', id: 1 })}>💬 Talk to Villagers</div>
        <div style={styles.featureItem}>❤️ Make Friends</div>
        <div style={styles.featureItem} onClick={() => handleOpenMailComposer()}>📮 Send Snail Mail</div>
      </div>

      {/* Villager Dialogue Modal */}
      {activeDialogueVillager && (
        <VillagerDialogueModal
          villager={activeDialogueVillager}
          onClose={() => setActiveDialogueVillager(null)}
          onSendMail={(v) => handleOpenMailComposer(v)}
        />
      )}

      {/* Snail Mail Composer Modal */}
      {isMailComposerOpen && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: 640 }}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#5b4a34' }}>
                📮 Compose Snail Mail Letter 🐌💌
              </h2>
              <button
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#8a7a63' }}
                onClick={() => setIsMailComposerOpen(false)}
              >
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              <Composer
                user={{ id: 'local_player', name: character?.name || 'Wanderer' }}
                defaultRecipient={preselectedVillager?.name || ''}
                onLetterSent={() => handleLetterSent(preselectedVillager?.name || 'Oliver')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Controls Hint Overlay */}
      <div style={styles.controlsHint}>
        {isMounted ? '🐴 WASD: Ride Horse' : '⌨️ WASD: Move'} | 🖱️ Left Drag: Rotate 360° | 📜 Scroll: Zoom | ⌨️ E: {nearVillager ? `Talk to ${nearVillager.name}` : isMounted ? 'Dismount' : 'Ride'}
      </div>

      {/* Character Customizer Overlay Modal */}
      {isCustomizerOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#5b4a34' }}>
                🎨 Customize Character & Companions
              </h2>
              <button
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#8a7a63' }}
                onClick={() => setIsCustomizerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  value={character.name || ''}
                  onChange={(e) => save({ name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Companion Pet 1</label>
                <div style={styles.grid2}>
                  {SMALL_PETS.map((p) => (
                    <button
                      key={p.id}
                      style={{
                        ...styles.choiceBtn,
                        borderColor: character.pet1_type === p.id ? '#e07a5f' : '#e3d7bf',
                        background: character.pet1_type === p.id ? '#fdf0ed' : '#fffaf1',
                      }}
                      onClick={() => save({ pet1_type: p.id })}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

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
  villagerPrompt: {
    position: 'absolute',
    top: '110px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ffb5a7',
    color: '#4a2c11',
    padding: '10px 24px',
    borderRadius: '999px',
    fontSize: '15px',
    fontWeight: 700,
    border: '2.5px solid #ffffff',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    zIndex: 20,
    animation: 'bounce 1.5s infinite',
  },
  mailToast: {
    position: 'absolute',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#2a9d8f',
    color: '#ffffff',
    padding: '12px 28px',
    borderRadius: '999px',
    fontSize: '16px',
    fontWeight: 800,
    border: '3px solid #ffffff',
    boxShadow: '0 8px 24px rgba(42,157,143,0.4)',
    zIndex: 50,
  },
  featuresBar: {
    position: 'absolute',
    bottom: 56,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 12,
    background: 'rgba(255, 250, 240, 0.88)',
    backdropFilter: 'blur(8px)',
    padding: '6px 18px',
    borderRadius: 999,
    border: '1.5px solid #e0c987',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  featureItem: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#5c381e',
    cursor: 'pointer',
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
