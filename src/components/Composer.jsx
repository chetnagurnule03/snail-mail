import React, { useState } from 'react';
import { Send, Clock, Sparkles, Shield, Check, Copy, Eye, Bell } from 'lucide-react';
import { letterService } from '../lib/supabase';

const STAMPS = [
  { id: 'royal_snail', name: 'Royal Snail', icon: '🐌', color: 'from-amber-600 to-yellow-500' },
  { id: 'golden_snitch', name: 'Golden Snitch', icon: '🪙⚡', color: 'from-yellow-400 via-amber-300 to-amber-600' },
  { id: 'golden_leaf', name: 'Golden Autumn', icon: '🍂', color: 'from-orange-500 to-amber-700' },
  { id: 'vintage_owl', name: 'Postmaster Owl', icon: '🦉', color: 'from-purple-600 to-indigo-800' },
];

export default function Composer({ user, defaultRecipient = '', onLetterSent }) {
  const [recipientName, setRecipientName] = useState(defaultRecipient);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [senderName, setSenderName] = useState(user?.name || 'Wanderer');
  const [stampType, setStampType] = useState('royal_snail');
  const [isSealing, setIsSealing] = useState(false);

  // Unique Share Link Modal State
  const [shareModalData, setShareModalData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipientName || !body) return;

    setIsSealing(true);

    const letterId = `snl_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
    const origin = window.location.origin + window.location.pathname;
    const shareUrl = `${origin}?letter=${letterId}`;

    const letterData = {
      id: letterId,
      sender_id: user?.id || 'local_player',
      sender_name: senderName || 'Anonymous Wanderer',
      sender_email: 'player@village.local',
      recipient_name: recipientName,
      recipient_email: 'friend@village.local',
      subject: subject || 'A cozy letter from the village 💌',
      body,
      stamp_type: stampType,
      share_url: shareUrl,
      deliver_at: new Date().toISOString(),
    };

    setTimeout(async () => {
      await letterService.createLetter(letterData);
      setIsSealing(false);

      // Open Share Modal with Unique Shareable Link
      setShareModalData({
        letterId,
        shareUrl,
        recipientName,
      });

      if (onLetterSent) onLetterSent();
    }, 900);
  };

  const handleCopyLink = () => {
    if (!shareModalData?.shareUrl) return;
    navigator.clipboard.writeText(shareModalData.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={styles.composerContainer}>
      {!shareModalData ? (
        <form onSubmit={handleSend} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Sender Name</label>
            <input
              type="text"
              placeholder="Your name..."
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Recipient Name (Friend or Villager)</label>
            <input
              type="text"
              placeholder="Friend's name..."
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Letter Subject (Optional)</label>
            <input
              type="text"
              placeholder="Subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Message</label>
            <textarea
              rows={4}
              placeholder="Write your cozy letter here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Choose Postal Stamp</label>
            <div style={styles.stampRow}>
              {STAMPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  style={{
                    ...styles.stampBtn,
                    borderColor: stampType === s.id ? '#e07a5f' : '#e3d7bf',
                    background: stampType === s.id ? '#fdf0ed' : '#fffaf1',
                  }}
                  onClick={() => setStampType(s.id)}
                >
                  <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSealing}
            style={{
              ...styles.submitBtn,
              opacity: isSealing ? 0.7 : 1,
            }}
          >
            {isSealing ? '🐌 Sealing with Wax…' : '💌 Send Letter & Generate Share Link'}
          </button>
        </form>
      ) : (
        /* Share Modal Overlay */
        <div style={styles.shareCard}>
          <div style={styles.successIcon}>🐌💌</div>
          <h2 style={styles.shareTitle}>Your letter is ready!</h2>
          <p style={styles.shareSubtitle}>
            Copy this link and send it to your friend via WhatsApp, Instagram, or SMS.
          </p>

          <div style={styles.urlBox}>
            <input
              type="text"
              readOnly
              value={shareModalData.shareUrl}
              style={styles.urlInput}
            />
            <button style={styles.copyBtn} onClick={handleCopyLink}>
              {copied ? '✓ Copied!' : '📋 Copy Link'}
            </button>
          </div>

          <div style={styles.btnRow}>
            <button
              style={styles.previewBtn}
              onClick={() => {
                window.location.href = shareModalData.shareUrl;
              }}
            >
              👁️ Preview Letter Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  composerContainer: {
    padding: '0.5rem 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#8a7a63',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '0.65rem 0.85rem',
    borderRadius: 12,
    border: '1.5px solid #e3d7bf',
    fontSize: '0.95rem',
    background: '#ffffff',
    outline: 'none',
  },
  textarea: {
    padding: '0.75rem 0.85rem',
    borderRadius: 12,
    border: '1.5px solid #e3d7bf',
    fontSize: '0.95rem',
    background: '#ffffff',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  stampRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  stampBtn: {
    padding: '0.55rem 0.8rem',
    borderRadius: 12,
    border: '1.5px solid #e3d7bf',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#5c381e',
  },
  submitBtn: {
    marginTop: 6,
    background: 'linear-gradient(135deg, #e07a5f 0%, #d62828 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '0.9rem 1.5rem',
    borderRadius: 14,
    fontSize: '1rem',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(224,122,95,0.35)',
  },
  shareCard: {
    background: '#ffffff',
    borderRadius: 20,
    padding: '1.75rem 1.5rem',
    border: '2px solid #e3d7bf',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 10,
  },
  successIcon: {
    fontSize: '3rem',
  },
  shareTitle: {
    margin: 0,
    fontSize: '1.4rem',
    color: '#4a2c11',
    fontWeight: 800,
  },
  shareSubtitle: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#7a5c3e',
    lineHeight: 1.4,
  },
  urlBox: {
    display: 'flex',
    width: '100%',
    gap: 8,
    marginTop: 8,
  },
  urlInput: {
    flex: 1,
    padding: '0.65rem 0.85rem',
    borderRadius: 12,
    border: '1.5px solid #e3d7bf',
    fontSize: '0.82rem',
    background: '#fdf0d5',
    color: '#4a2c11',
    fontWeight: 600,
  },
  copyBtn: {
    background: '#2a9d8f',
    color: '#ffffff',
    border: 'none',
    padding: '0.65rem 1.1rem',
    borderRadius: 12,
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(42,157,143,0.3)',
  },
  btnRow: {
    display: 'flex',
    gap: 10,
    marginTop: 6,
    width: '100%',
  },
  previewBtn: {
    flex: 1,
    background: '#e07a5f',
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};
