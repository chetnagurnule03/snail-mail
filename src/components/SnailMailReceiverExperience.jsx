import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, ContactShadows, Outlines } from '@react-three/drei';
import * as THREE from 'three';

/** -------------------------------------------------------------
 *  3D ANIMATED SNAIL MESSENGER CRAWLING ON PATH FOR RECEIVER 🐌💌
 * ------------------------------------------------------------- */
function ReceiverSnail3D({ progress }) {
  const snailRef = useRef();

  useFrame((state) => {
    if (!snailRef.current) return;
    const clock = state.clock.getElapsedTime();
    const currentX = THREE.MathUtils.lerp(-8.0, 8.0, progress);
    snailRef.current.position.x = currentX;
    snailRef.current.position.y = Math.abs(Math.sin(clock * 6)) * 0.04;
  });

  return (
    <group ref={snailRef} position={[-8.0, 0, 0]} scale={1.2}>
      {/* Snail Body */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.7, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshToonMaterial color="#ffb703" />
        <Outlines thickness={0.03} color="#2b2013" />
      </mesh>

      {/* Snail Eye Stalks */}
      <group position={[0.22, 0.45, 0]}>
        <mesh position={[0, 0.18, -0.08]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshToonMaterial color="#ffb703" />
        </mesh>
        <mesh position={[0, 0.32, -0.08]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshToonMaterial color="#222222" />
        </mesh>

        <mesh position={[0, 0.18, 0.08]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshToonMaterial color="#ffb703" />
        </mesh>
        <mesh position={[0, 0.32, 0.08]}>
          <sphereGeometry args={[0.05, 10, 0]} />
          <meshToonMaterial color="#222222" />
        </mesh>
      </group>

      {/* Spiral Shell */}
      <group position={[-0.1, 0.5, 0]}>
        <mesh rotation={[0, 0, 0]} castShadow>
          <torusGeometry args={[0.34, 0.18, 14, 28]} />
          <meshToonMaterial color="#e07a5f" />
          <Outlines thickness={0.03} color="#2b2013" />
        </mesh>
      </group>

      {/* 💌 Envelope on Shell */}
      <group position={[-0.1, 0.85, 0]} rotation={[0, 0, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.06, 0.38]} />
          <meshToonMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 8]} />
          <meshToonMaterial color="#e63946" />
        </mesh>
      </group>

      <Sparkles position={[0, 0.8, 0]} count={10} scale={1.2} size={3.5} speed={0.6} color="#ffd23f" />
    </group>
  );
}

/** -------------------------------------------------------------
 *  RECEIVER EXPERIENCE COMPONENT (NO LOGIN REQUIRED)
 * ------------------------------------------------------------- */
export default function SnailMailReceiverExperience({ letter, onBackToGame }) {
  const [timeLeft, setTimeLeft] = useState(60); // 60s journey
  const [isRevealed, setIsRevealed] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const SNAIL_QUOTES = [
    "I'm on my way! 🐌",
    "This letter is important! 💌",
    "Almost there...",
    "Just a little further! 🐌💨",
    "Delivering special mail to your doorstep! ✨",
  ];

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsRevealed(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRevealed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % SNAIL_QUOTES.length);
    }, 12000);

    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, [timeLeft]);

  const progress = Math.min(1.0, (60 - timeLeft) / 60);

  const handleSkipTimer = () => {
    setTimeLeft(0);
    setIsRevealed(true);
  };

  return (
    <div style={styles.container}>
      {/* 3D Canvas Background */}
      <div style={styles.canvasWrapper}>
        <Canvas camera={{ position: [0, 2.5, 6.0], fov: 45 }}>
          <color attach="background" args={['#bfe8f7']} />
          <hemisphereLight skyColor="#bfe8f7" groundColor="#94c77d" intensity={1.1} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />

          {/* Path */}
          <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[60, 4]} />
            <meshToonMaterial color="#cbb994" />
          </mesh>
          <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <meshToonMaterial color="#94c77d" />
          </mesh>

          <ReceiverSnail3D progress={progress} />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI * 0.45} />
          <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2.0} />
        </Canvas>
      </div>

      {/* Transit Journey Overlay Card */}
      {!isRevealed ? (
        <div style={styles.journeyCard}>
          <div style={styles.badge}>🐌 Snail Express Messenger in Transit</div>
          <h2 style={styles.quoteText}>{SNAIL_QUOTES[quoteIndex]}</h2>

          {/* Progress Bar */}
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressBar, width: `${progress * 100}%` }} />
          </div>

          <div style={styles.timerRow}>
            <span style={styles.timerText}>
              ⏱️ Delivery ETA: 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
            <button style={styles.skipBtn} onClick={handleSkipTimer}>
              ⚡ Speed Up Snail
            </button>
          </div>
        </div>
      ) : (
        /* Revealed Letter Parchment Modal */
        <div style={styles.letterOverlay}>
          <div style={styles.letterCard}>
            <div style={styles.letterHeader}>
              <div style={styles.stampBadge}>
                <span style={{ fontSize: '1.8rem' }}>🐌</span>
              </div>
              <div>
                <p style={styles.letterMeta}>Snail Express Delivery</p>
                <h1 style={styles.letterTitle}>💌 A Letter For You!</h1>
              </div>
            </div>

            <div style={styles.letterBody}>
              <div style={styles.recipientRow}>
                <span><strong>To:</strong> {letter?.recipient_name || 'Friend'}</span>
                <span><strong>From:</strong> {letter?.sender_name || 'A Neighbor'}</span>
              </div>

              {letter?.subject && (
                <h3 style={styles.subjectText}>Subject: {letter.subject}</h3>
              )}

              <div style={styles.messageBox}>
                <p style={styles.messageText}>
                  {letter?.body || 'Wishing you a magical and peaceful day in the village!'}
                </p>
              </div>
            </div>

            <div style={styles.letterFooter}>
              <button style={styles.actionBtn} onClick={onBackToGame}>
                🏡 Enter 3D Village World
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: '#bfe8f7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasWrapper: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  journeyCard: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255, 250, 241, 0.94)',
    backdropFilter: 'blur(10px)',
    padding: '24px 32px',
    borderRadius: 24,
    border: '3px solid #e3d7bf',
    boxShadow: '0 16px 40px rgba(70,50,30,0.25)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    maxWidth: 480,
    width: '90%',
    textAlign: 'center',
  },
  badge: {
    background: '#e07a5f',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: 999,
    fontSize: '0.82rem',
    fontWeight: 800,
  },
  quoteText: {
    margin: '4px 0',
    fontSize: '1.4rem',
    color: '#4a2c11',
    fontWeight: 800,
  },
  progressTrack: {
    width: '100%',
    height: 12,
    background: '#e8dfce',
    borderRadius: 999,
    overflow: 'hidden',
    border: '1px solid #d4c7b0',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #ffb703, #e07a5f)',
    borderRadius: 999,
    transition: 'width 1s linear',
  },
  timerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  timerText: {
    fontSize: '0.9rem',
    color: '#7a5c3e',
    fontWeight: 700,
  },
  skipBtn: {
    background: '#2a9d8f',
    color: '#ffffff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  letterOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(40, 30, 20, 0.55)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    padding: 16,
  },
  letterCard: {
    background: '#fffaf1',
    borderRadius: 24,
    width: '100%',
    maxWidth: 520,
    boxShadow: '0 24px 60px rgba(50,35,20,0.35)',
    border: '3px solid #e3d7bf',
    overflow: 'hidden',
    animation: 'popIn 0.4s ease-out',
  },
  letterHeader: {
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #fae1c5 0%, #f4f1de 100%)',
    borderBottom: '2px solid #e8dfce',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  stampBadge: {
    width: 54,
    height: 54,
    borderRadius: 16,
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2.5px dashed #e07a5f',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  },
  letterMeta: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#8c5a3c',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  letterTitle: {
    margin: '2px 0 0 0',
    fontSize: '1.4rem',
    color: '#4a2c11',
    fontWeight: 800,
  },
  letterBody: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  recipientRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    color: '#5c381e',
    paddingBottom: 10,
    borderBottom: '1px dashed #e3d7bf',
  },
  subjectText: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#4a2c11',
    fontWeight: 700,
  },
  messageBox: {
    background: '#ffffff',
    padding: '1.25rem',
    borderRadius: 16,
    border: '1.5px solid #e3d7bf',
    minHeight: 120,
  },
  messageText: {
    margin: 0,
    fontSize: '1.05rem',
    color: '#3d2616',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  letterFooter: {
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid #e8dfce',
    display: 'flex',
    justifyContent: 'center',
  },
  actionBtn: {
    background: '#e07a5f',
    color: '#ffffff',
    border: 'none',
    padding: '0.85rem 2rem',
    borderRadius: 999,
    fontSize: '1rem',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(224,122,95,0.35)',
  },
};
