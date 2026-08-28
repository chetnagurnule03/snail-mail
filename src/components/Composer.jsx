import React, { useState } from 'react';
import { Send, Clock, Sparkles, Shield, Check, Copy, Eye, Bell } from 'lucide-react';
import { letterService } from '../lib/supabase';
import BouquetBuilder, { RenderBouquetSVG } from './BouquetBuilder';

const STAMPS = [
  { id: 'royal_snail', name: 'Royal Snail', icon: '🐌', color: 'from-amber-600 to-yellow-500' },
  { id: 'golden_snitch', name: 'Golden Snitch', icon: '🪙⚡', color: 'from-yellow-400 via-amber-300 to-amber-600' },
  { id: 'vintage_owl', name: 'Postmaster Owl', icon: '🦉', color: 'from-purple-600 to-indigo-800' },
  { id: 'night_bat', name: 'Night Bat', icon: '🦇', color: 'from-purple-800 to-slate-900' },
];

export default function Composer({ user, defaultRecipient = '', onLetterSent }) {
  const [recipientName, setRecipientName] = useState(defaultRecipient);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [senderName, setSenderName] = useState(user?.name || 'Wanderer');
  const [stampType, setStampType] = useState('royal_snail');
  const [deliveryMethod, setDeliveryMethod] = useState('snail'); // 'snail' | 'bat'
  const [isSealing, setIsSealing] = useState(false);

  // Custom Bouquet State
  const [attachedBouquet, setAttachedBouquet] = useState(null);
  const [isBouquetBuilderOpen, setIsBouquetBuilderOpen] = useState(false);

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
      delivery_method: deliveryMethod,
      bouquet: attachedBouquet,
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
        deliveryMethod,
      });

      if (onLetterSent) onLetterSent(recipientName, deliveryMethod);
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
      {isBouquetBuilderOpen ? (
        <BouquetBuilder
          onDone={(bouquetData) => {
            setAttachedBouquet(bouquetData);
            setIsBouquetBuilderOpen(false);
          }}
          onCancel={() => setIsBouquetBuilderOpen(false)}
        />
      ) : !shareModalData ? (
        <form onSubmit={handleSend} style={styles.form}>
          {/* Dual Delivery Method Selector */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Choose Express Delivery Method</label>
            <div style={styles.deliveryRow}>
              <button
                type="button"
                style={{
                  ...styles.deliveryBtn,
                  borderColor: deliveryMethod === 'snail' ? '#e07a5f' : '#e3d7bf',
                  background: deliveryMethod === 'snail' ? '#fdf0ed' : '#fffaf1',
                  boxShadow: deliveryMethod === 'snail' ? '0 0 0 2px #e07a5f' : 'none',
                }}
                onClick={() => setDeliveryMethod('snail')}
              >
                <span style={{ fontSize: '1.6rem' }}>🐌</span>
                <div>
                  <div style={styles.deliveryTitle}>Snail Express</div>
                  <div style={styles.deliverySub}>Cozy Path Journey (~60s)</div>
                </div>
              </button>

              <button
                type="button"
                style={{
                  ...styles.deliveryBtn,
                  borderColor: deliveryMethod === 'bat' ? '#7209b7' : '#e3d7bf',
                  background: deliveryMethod === 'bat' ? '#f3e8ff' : '#fffaf1',
                  boxShadow: deliveryMethod === 'bat' ? '0 0 0 2px #7209b7' : 'none',
                }}
                onClick={() => setDeliveryMethod('bat')}
              >
                <span style={{ fontSize: '1.6rem' }}>🦇</span>
                <div>
                  <div style={styles.deliveryTitle}>Bat Air Express</div>
                  <div style={styles.deliverySub}>Fast Air Flight (~15s)</div>
                </div>
              </button>
            </div>
          </div>

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

          {/* Attached Bouquet Section */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Custom Bouquet Gift (Optional)</label>
            {attachedBouquet ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem', background: '#fffaf1', borderRadius: 14, border: '1.5px solid #e07a5f' }}>
                <RenderBouquetSVG bouquet={attachedBouquet} width={70} height={75} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4a2c11' }}>
                    Custom Bouquet ({attachedBouquet.flowers?.length || 0} blooms)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7a5c3e' }}>
                    Wrap: {attachedBouquet.wrap?.name || 'Kraft Paper'} • Ribbon: {attachedBouquet.ribbon?.name || 'Silk'}
                  </div>
                </div>
                <button
                  type="button"
                  style={{ padding: '0.4rem 0.75rem', borderRadius: 8, border: '1px solid #e3d7bf', background: '#ffffff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setIsBouquetBuilderOpen(true)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  style={{ padding: '0.4rem 0.75rem', borderRadius: 8, border: 'none', background: '#e63946', color: '#ffffff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setAttachedBouquet(null)}
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 14,
                  border: '1.5px dashed #e07a5f',
                  background: '#fdf0ed',
                  color: '#5c381e',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
                onClick={() => setIsBouquetBuilderOpen(true)}
              >
                <span>🌸 Build & Attach Custom Bouquet</span>
              </button>
            )}
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
              background: deliveryMethod === 'bat' ? 'linear-gradient(135deg, #7209b7 0%, #3a0ca3 100%)' : 'linear-gradient(135deg, #e07a5f 0%, #d62828 100%)',
              opacity: isSealing ? 0.7 : 1,
            }}
          >
            {isSealing ? (deliveryMethod === 'bat' ? '🦇 Sealing for Bat Express…' : '🐌 Sealing with Wax…') : (deliveryMethod === 'bat' ? '🦇 Send via Bat Air Express & Share Link' : '💌 Send via Snail Express & Share Link')}
          </button>
        </form>
      ) : (
        /* Share Modal Overlay */
        <div style={styles.shareCard}>
          <div style={styles.successIcon}>{shareModalData.deliveryMethod === 'bat' ? '🦇💌' : '🐌💌'}</div>
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
              style={{
                ...styles.previewBtn,
                background: shareModalData.deliveryMethod === 'bat' ? '#7209b7' : '#e07a5f',
              }}
              onClick={() => {
                window.location.href = shareModalData.shareUrl;
              }}
            >
              👁️ Preview {shareModalData.deliveryMethod === 'bat' ? 'Bat Flight' : 'Snail Journey'}
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
  deliveryRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  deliveryBtn: {
    padding: '0.6rem 0.8rem',
    borderRadius: 14,
    border: '1.5px solid #e3d7bf',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },
  deliveryTitle: {
    fontSize: '0.88rem',
    fontWeight: 800,
    color: '#4a2c11',
  },
  deliverySub: {
    fontSize: '0.72rem',
    color: '#7a5c3e',
    fontWeight: 600,
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
    color: '#ffffff',
    border: 'none',
    padding: '0.9rem 1.5rem',
    borderRadius: 14,
    fontSize: '1rem',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
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
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};
