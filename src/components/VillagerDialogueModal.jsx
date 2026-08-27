import React, { useState } from 'react';

/** -------------------------------------------------------------
 *  VILLAGER DIALOGUE & INTERACTION MODAL WITH SNAIL MAIL DISPATCH
 * ------------------------------------------------------------- */
export default function VillagerDialogueModal({ villager, onClose, onSendMail }) {
  const [friendshipLevel, setFriendshipLevel] = useState(villager.friendship || 1);
  const [activeTab, setActiveTab] = useState('talk');
  const [giftGiven, setGiftGiven] = useState(false);
  const [talkIndex, setTalkIndex] = useState(0);

  if (!villager) return null;

  const dialogues = [
    `"Hello there, wanderer! Isn't it a lovely day to be in ${villager.name}'s garden?"`,
    `"I was just tending to the sunflowers near my cottage. Have you seen how bright they grow?"`,
    `"If you send a letter via Snail Mail, the postmaster snail delivers it right to my door!"`,
  ];

  const handleGiveGift = () => {
    if (!giftGiven) {
      setGiftGiven(true);
      setFriendshipLevel((prev) => Math.min(prev + 1, 5));
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Header Banner */}
        <div style={styles.header}>
          <div style={styles.profileBadge}>
            <span style={{ fontSize: '2rem' }}>👤</span>
          </div>
          <div>
            <h2 style={styles.name}>{villager.name}</h2>
            <p style={styles.job}>{villager.job || 'Village Resident'} • Cottage #{villager.id}</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Friendship Heart Level Meter */}
        <div style={styles.friendshipRow}>
          <span style={{ fontSize: '0.85rem', color: '#8c5a3c', fontWeight: 700 }}>Friendship:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <span key={lvl} style={{ fontSize: '1.1rem', opacity: lvl <= friendshipLevel ? 1 : 0.25 }}>
                ❤️
              </span>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#e07a5f', fontWeight: 700 }}>
            Lvl {friendshipLevel}/5
          </span>
        </div>

        {/* Dialogue Body */}
        <div style={styles.body}>
          <p style={styles.dialogueText}>
            {dialogues[talkIndex % dialogues.length]}
          </p>

          {/* Action Tabs */}
          <div style={styles.actionGrid}>
            <button
              style={styles.actionBtnPrimary}
              onClick={() => setTalkIndex((prev) => prev + 1)}
            >
              💬 Chat More
            </button>
            <button
              style={{
                ...styles.actionBtnSecondary,
                opacity: giftGiven ? 0.6 : 1,
              }}
              onClick={handleGiveGift}
            >
              🎁 {giftGiven ? 'Gift Given Today' : 'Give Fresh Flower'}
            </button>
            <button
              style={styles.actionBtnMail}
              onClick={() => {
                onClose();
                if (onSendMail) onSendMail(villager);
              }}
            >
              📮 Send Snail Mail 🐌💌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(50, 38, 25, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    padding: 16,
  },
  card: {
    background: '#fffaf1',
    borderRadius: 24,
    width: '100%',
    maxWidth: 460,
    boxShadow: '0 20px 50px rgba(70,50,30,0.3)',
    border: '3px solid #e3d7bf',
    overflow: 'hidden',
  },
  header: {
    padding: '1.25rem 1.5rem',
    background: 'linear-gradient(135deg, #fae1c5 0%, #f4f1de 100%)',
    borderBottom: '2px solid #e8dfce',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    position: 'relative',
  },
  profileBadge: {
    width: 52,
    height: 52,
    borderRadius: 999,
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    border: '2px solid #e07a5f',
  },
  name: {
    margin: 0,
    fontSize: '1.3rem',
    color: '#4a2c11',
    fontWeight: 800,
  },
  job: {
    margin: '2px 0 0 0',
    fontSize: '0.85rem',
    color: '#7a5c3e',
    fontWeight: 600,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: '#8a7a63',
    cursor: 'pointer',
  },
  friendshipRow: {
    padding: '0.75rem 1.5rem',
    background: '#fdf0d5',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderBottom: '1px solid #e8dfce',
  },
  body: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  dialogueText: {
    fontSize: '1.05rem',
    color: '#3d2616',
    lineHeight: 1.5,
    fontStyle: 'italic',
    background: '#ffffff',
    padding: '1rem 1.2rem',
    borderRadius: 16,
    border: '1.5px solid #e3d7bf',
    margin: 0,
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  actionBtnPrimary: {
    background: '#e07a5f',
    color: '#ffffff',
    border: 'none',
    padding: '0.7rem 1rem',
    borderRadius: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(224,122,95,0.3)',
  },
  actionBtnSecondary: {
    background: '#70e000',
    color: '#1b4332',
    border: 'none',
    padding: '0.7rem 1rem',
    borderRadius: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(112,224,0,0.3)',
  },
  actionBtnMail: {
    gridColumn: '1 / -1',
    background: '#2a9d8f',
    color: '#ffffff',
    border: 'none',
    padding: '0.8rem 1rem',
    borderRadius: 14,
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '0.95rem',
    boxShadow: '0 4px 14px rgba(42,157,143,0.35)',
  },
};
