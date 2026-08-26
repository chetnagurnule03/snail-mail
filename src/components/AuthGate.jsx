import { useState } from 'react';

export default function AuthGate({ onSignInWithEmail, onSignInAsGuest }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await onSignInWithEmail(email);
      setStatus('sent');
    } catch (err) {
      setStatus(err.message || 'error');
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.title}>🐌 Snail Mail</h1>
        <p style={styles.tagline}>Some things are worth delivering slowly.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Send me a magic link
          </button>
        </form>

        {status === 'sent' && (
          <p style={styles.hint}>Check your inbox for a sign-in link ✉️</p>
        )}
        {status && status !== 'sent' && status !== 'sending' && (
          <p style={{ ...styles.hint, color: '#b3453a' }}>{status}</p>
        )}

        <div style={styles.divider}>or</div>

        <button type="button" style={styles.guestButton} onClick={onSignInAsGuest}>
          Peek inside as a guest
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#fffaf1',
    borderRadius: 24,
    padding: '2.5rem 2rem',
    width: 320,
    boxShadow: '0 12px 30px rgba(120, 90, 60, 0.15)',
    textAlign: 'center',
  },
  title: { margin: 0, fontStyle: 'italic' },
  tagline: { color: '#8a7a63', marginTop: 4, marginBottom: 24, fontStyle: 'italic' },
  form: { display: 'flex', flexDirection: 'column', gap: 10 },
  input: {
    padding: '0.7rem 0.9rem',
    borderRadius: 12,
    border: '1px solid #e3d7bf',
    fontSize: '1rem',
  },
  button: {
    padding: '0.7rem 0.9rem',
    borderRadius: 12,
    border: 'none',
    background: '#e07a5f',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  hint: { marginTop: 12, fontSize: '0.85rem', color: '#6f8f5c' },
  divider: { margin: '18px 0', color: '#c2b596', fontSize: '0.8rem' },
  guestButton: {
    padding: '0.6rem 0.9rem',
    borderRadius: 12,
    border: '1px solid #cbb994',
    background: 'transparent',
    color: '#7a5c3e',
    cursor: 'pointer',
    width: '100%',
  },
};
