import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Outlines, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { letterService } from '../lib/supabase';
import { RenderBouquetSVG } from './BouquetBuilder';

function ToonOutline({ thickness = 0.03, color = '#1a0b2e' }) {
  return <Outlines thickness={thickness} color={color} screenspace={false} />;
}

/** -------------------------------------------------------------
 *  3D ANIMATED BAT MESSENGER MODEL 🦇
 * ------------------------------------------------------------- */
function ReceiverBat3D({ progress, isDelivered }) {
  const batRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  useFrame((state) => {
    if (!batRef.current) return;
    const clock = state.clock.getElapsedTime();

    if (!isDelivered) {
      // Fluttering wing animation
      const flap = Math.sin(clock * 22) * 0.5;
      if (leftWingRef.current) leftWingRef.current.rotation.z = 0.2 + flap;
      if (rightWingRef.current) rightWingRef.current.rotation.z = -0.2 - flap;

      // Fast flying trajectory
      batRef.current.position.x = (progress - 0.5) * 16.0;
      batRef.current.position.y = 2.2 + Math.sin(clock * 4) * 0.35;
      batRef.current.position.z = Math.cos(clock * 3) * 0.4;
      batRef.current.rotation.y = Math.PI / 2;
    } else {
      batRef.current.position.x = 0;
      batRef.current.position.y = 1.25;
      batRef.current.position.z = 0;
      batRef.current.rotation.y = 0;
    }
  });

  return (
    <group ref={batRef} position={[-8, 2.2, 0]} scale={1.2}>
      {/* Bat Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshToonMaterial color="#2b1e3a" />
        <ToonOutline thickness={0.025} color="#12091f" />
      </mesh>

      {/* Bat Head & Pointed Ears */}
      <group position={[0, 0.22, 0.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshToonMaterial color="#2b1e3a" />
          <ToonOutline thickness={0.025} color="#12091f" />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.12, 0.22, 0]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.07, 0.22, 4]} />
          <meshToonMaterial color="#7209b7" />
        </mesh>
        <mesh position={[0.12, 0.22, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.07, 0.22, 4]} />
          <meshToonMaterial color="#7209b7" />
        </mesh>
        {/* Glowing Yellow Eyes */}
        <mesh position={[-0.07, 0.04, 0.18]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshToonMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.07, 0.04, 0.18]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshToonMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Flapping Wings */}
      <group ref={leftWingRef} position={[-0.25, 0.05, 0]}>
        <mesh position={[-0.45, 0, 0]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.9, 0.04, 0.45]} />
          <meshToonMaterial color="#4a1259" />
        </mesh>
      </group>
      <group ref={rightWingRef} position={[0.25, 0.05, 0]}>
        <mesh position={[0.45, 0, 0]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.9, 0.04, 0.45]} />
          <meshToonMaterial color="#4a1259" />
        </mesh>
      </group>

      {/* Envelope Held in Claws ✉️ */}
      {!isDelivered && (
        <group position={[0, -0.25, 0.15]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.28, 0.05]} />
            <meshToonMaterial color="#f4f1de" />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshToonMaterial color="#7209b7" />
          </mesh>
        </group>
      )}
    </group>
  );
}

/** -------------------------------------------------------------
 *  3D ANIMATED SNAIL MESSENGER MODEL 🐌
 * ------------------------------------------------------------- */
function ReceiverSnail3D({ progress, isDelivered }) {
  const snailRef = useRef();

  useFrame((state) => {
    if (!snailRef.current) return;
    const clock = state.clock.getElapsedTime();

    if (!isDelivered) {
      snailRef.current.position.x = (progress - 0.5) * 14.0;
      snailRef.current.position.y = Math.sin(clock * 6) * 0.04;
      snailRef.current.rotation.y = Math.PI / 2;
    } else {
      snailRef.current.position.x = 0;
      snailRef.current.position.y = 0;
      snailRef.current.rotation.y = 0;
    }
  });

  return (
    <group ref={snailRef} position={[-7, 0, 0]} scale={1.4}>
      <mesh position={[-0.15, 0.62, 0.05]} rotation={[0, 0, -0.2]} castShadow>
        <sphereGeometry args={[0.52, 16, 16]} />
        <meshToonMaterial color="#d4a373" />
        <ToonOutline thickness={0.03} color="#5c381e" />
      </mesh>
      <mesh position={[0.3, 0.28, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.9, 10, 16]} />
        <meshToonMaterial color="#faedcd" />
        <ToonOutline thickness={0.03} color="#5c381e" />
      </mesh>
      <group position={[0.62, 0.5, 0]}>
        <mesh position={[-0.08, 0.18, 0.1]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshToonMaterial color="#faedcd" />
        </mesh>
        <mesh position={[-0.08, 0.32, 0.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshToonMaterial color="#2b2013" />
        </mesh>
        <mesh position={[-0.08, 0.18, -0.1]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshToonMaterial color="#faedcd" />
        </mesh>
        <mesh position={[-0.08, 0.32, -0.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshToonMaterial color="#2b2013" />
        </mesh>
      </group>
      {!isDelivered && (
        <group position={[-0.15, 1.05, 0.05]} rotation={[0, 0.3, 0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.34, 0.06]} />
            <meshToonMaterial color="#f4f1de" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshToonMaterial color="#e63946" />
          </mesh>
        </group>
      )}
    </group>
  );
}

const SNAIL_QUOTES = [
  "I'm on my way! 🐌",
  "Slow and steady wins the letter race...",
  "Almost there! Carrying your letter with care 💌",
  "Just a little further! 🐌💨",
];

const BAT_QUOTES = [
  "Flying your letter over! 🦇",
  "Fast air delivery! ⚡",
  "Almost there... 💌",
  "Delivery incoming! 🦇💨",
];

export default function SnailMailReceiverExperience({ letterId }) {
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [timeLeft, setTimeLeft] = useState(60);
  const [isDelivered, setIsDelivered] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    async function fetchLetter() {
      if (!letterId) return;
      const data = await letterService.getLetterById(letterId);
      if (data) {
        setLetter(data);
        const duration = data.delivery_method === 'bat' ? 15 : 60;
        setTimeLeft(duration);
      }
      setLoading(false);
    }
    fetchLetter();
  }, [letterId]);

  useEffect(() => {
    if (!letter || isDelivered) return;

    const totalTime = letter.delivery_method === 'bat' ? 15 : 60;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDelivered(true);
          setProgress(1.0);
          return 0;
        }
        const newTime = prev - 1;
        setProgress((totalTime - newTime) / totalTime);
        return newTime;
      });
    }, 1000);

    const quotes = letter.delivery_method === 'bat' ? BAT_QUOTES : SNAIL_QUOTES;
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, totalTime === 15 ? 3500 : 8000);

    return () => {
      clearInterval(interval);
      clearInterval(quoteInterval);
    };
  }, [letter, isDelivered]);

  const handleSpeedUp = () => {
    setTimeLeft(1);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>🐌</div>
        <p style={{ color: '#5c381e', fontWeight: 700 }}>Finding your Snail Mail letter...</p>
      </div>
    );
  }

  if (!letter) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Letter Not Found 📭</h2>
        <p>This letter link may have expired or is invalid.</p>
        <button style={styles.homeBtn} onClick={() => (window.location.href = window.location.origin)}>
          🏡 Go to Village
        </button>
      </div>
    );
  }

  const isBat = letter.delivery_method === 'bat';
  const quotes = isBat ? BAT_QUOTES : SNAIL_QUOTES;

  return (
    <div style={styles.container}>
      {/* Top Header Bar */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          {isBat ? '🦇 Bat Air Express Messenger' : '🐌 Snail Mail Messenger'}
        </div>
        <button style={styles.exploreBtn} onClick={() => (window.location.href = window.location.origin)}>
          🎮 Play Snail Mail Game
        </button>
      </div>

      {/* 3D Scene Viewport */}
      <div style={styles.canvasWrapper}>
        <Canvas camera={{ position: [0, 2.5, 6.5], fov: 45 }}>
          <color attach="background" args={isBat ? ['#1a0b2e'] : ['#bfe8f7']} />
          <ambientLight intensity={isBat ? 0.6 : 0.9} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />

          {isBat ? (
            <ReceiverBat3D progress={progress} isDelivered={isDelivered} />
          ) : (
            <ReceiverSnail3D progress={progress} isDelivered={isDelivered} />
          )}

          {/* Grass Floor */}
          <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshToonMaterial color={isBat ? '#2d1b4e' : '#94c77d'} />
          </mesh>
          <Sparkles count={50} scale={15} color={isBat ? '#f72585' : '#ffe5ec'} />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI * 0.48} />
        </Canvas>

        {/* Reaction Bubble during journey */}
        {!isDelivered && (
          <div style={styles.reactionBubble}>
            {quotes[quoteIndex]}
          </div>
        )}
      </div>

      {/* Controls & Letter Display Card */}
      <div style={styles.cardContainer}>
        {!isDelivered ? (
          <div style={styles.journeyCard}>
            <div style={styles.timerBadge}>
              ⏳ {isBat ? 'Bat Air Transit' : 'Snail Transit'}: {timeLeft}s remaining
            </div>
            <p style={styles.journeyText}>
              A letter from <strong>{letter.sender_name}</strong> is traveling to you!
            </p>
            <div style={styles.progressBarBg}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${progress * 100}%`,
                  background: isBat ? '#7209b7' : '#e07a5f',
                }}
              />
            </div>
            <button
              style={{
                ...styles.speedBtn,
                background: isBat ? '#7209b7' : '#2a9d8f',
              }}
              onClick={handleSpeedUp}
            >
              {isBat ? '⚡ Speed Up Bat Flight' : '⚡ Speed Up Snail'}
            </button>
          </div>
        ) : (
          /* Opened Letter View */
          <div style={styles.openedLetterCard}>
            <div style={styles.letterStamp}>
              {isBat ? '🦇' : '🐌'}
            </div>
            <div style={styles.letterHeader}>
              <div>
                <span style={styles.letterFromLabel}>From: </span>
                <span style={styles.letterFromName}>{letter.sender_name}</span>
              </div>
              <div>
                <span style={styles.letterFromLabel}>To: </span>
                <span style={styles.letterFromName}>{letter.recipient_name}</span>
              </div>
            </div>

            <h3 style={styles.letterSubject}>{letter.subject}</h3>
            
            {/* Attached Bouquet Rendering */}
            {letter.bouquet && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '0.8rem 0' }}>
                <RenderBouquetSVG bouquet={letter.bouquet} width={190} height={210} />
              </div>
            )}

            <div style={styles.letterBody}>{letter.body}</div>

            <div style={styles.letterFooter}>
              <span>Delivered via {isBat ? 'Bat Air Express 🦇' : 'Snail Express 🐌'}</span>
              <button
                style={{
                  ...styles.replyBtn,
                  background: isBat ? '#7209b7' : '#e07a5f',
                }}
                onClick={() => (window.location.href = window.location.origin)}
              >
                💌 Send Letter Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#faf6ee',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
  },
  loadingContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#faf6ee',
    gap: 12,
  },
  spinner: {
    fontSize: '3rem',
    animation: 'pulse 1.5s infinite',
  },
  header: {
    height: 54,
    background: '#ffffff',
    borderBottom: '2px solid #e3d7bf',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.25rem',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#4a2c11',
  },
  exploreBtn: {
    background: '#2a9d8f',
    color: '#ffffff',
    border: 'none',
    padding: '0.45rem 1rem',
    borderRadius: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  canvasWrapper: {
    flex: 1,
    position: 'relative',
    background: '#bfe8f7',
  },
  reactionBubble: {
    position: 'absolute',
    top: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#ffffff',
    padding: '0.6rem 1.25rem',
    borderRadius: 20,
    fontWeight: 800,
    color: '#4a2c11',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    border: '2px solid #e3d7bf',
    fontSize: '0.95rem',
  },
  cardContainer: {
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    background: '#ffffff',
    borderTop: '2px solid #e3d7bf',
  },
  journeyCard: {
    maxWidth: 460,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    textAlign: 'center',
  },
  timerBadge: {
    background: '#fdf0d5',
    color: '#c68a4c',
    fontWeight: 800,
    padding: '0.35rem 0.9rem',
    borderRadius: 12,
    fontSize: '0.88rem',
  },
  journeyText: {
    margin: 0,
    color: '#4a2c11',
    fontSize: '0.95rem',
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    background: '#e3d7bf',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  speedBtn: {
    color: '#ffffff',
    border: 'none',
    padding: '0.55rem 1.2rem',
    borderRadius: 12,
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '0.85rem',
    marginTop: 4,
  },
  openedLetterCard: {
    maxWidth: 520,
    width: '100%',
    background: '#fffef9',
    border: '2px solid #e3d7bf',
    borderRadius: 16,
    padding: '1.25rem 1.5rem',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  },
  letterStamp: {
    position: 'absolute',
    top: 14,
    right: 16,
    fontSize: '2rem',
  },
  letterHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    marginBottom: 10,
  },
  letterFromLabel: {
    color: '#8a7a63',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  letterFromName: {
    color: '#4a2c11',
    fontWeight: 800,
    fontSize: '0.95rem',
  },
  letterSubject: {
    margin: '0 0 10px 0',
    color: '#e07a5f',
    fontSize: '1.15rem',
    fontWeight: 800,
  },
  letterBody: {
    fontSize: '0.95rem',
    lineHeight: 1.55,
    color: '#332211',
    whiteSpace: 'pre-wrap',
    background: '#fdfbfa',
    padding: '0.85rem',
    borderRadius: 10,
    border: '1.5px solid #f3e9dc',
  },
  letterFooter: {
    marginTop: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#8a7a63',
    fontWeight: 600,
  },
  replyBtn: {
    color: '#ffffff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: 10,
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  homeBtn: {
    background: '#2a9d8f',
    color: '#ffffff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: 12,
    fontWeight: 800,
    cursor: 'pointer',
  },
};
