import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/** -------------------------------------------------------------
 *  COLLISION & BOUNDARY HELPER
 * ------------------------------------------------------------- */
const OBSTACLES = [
  { name: 'Cottage', x: -2.6, z: -2.4, radius: 1.5 },
  { name: 'Pond', x: -1.6, z: 1.9, radius: 1.4 },
  { name: 'Tree1', x: -3.8, z: -1.2, radius: 0.7 },
  { name: 'Tree2', x: -2.4, z: -3.8, radius: 0.7 },
  { name: 'Tree3', x: 3.2, z: -3.2, radius: 0.7 },
  { name: 'Tree4', x: 3.8, z: -1.5, radius: 0.7 },
  { name: 'Tree5', x: 4.2, z: 1.2, radius: 0.7 },
];

function sanitizePlayableTarget(x, z) {
  let targetX = x;
  let targetZ = z;

  const distFromCenter = Math.sqrt(targetX * targetX + targetZ * targetZ);
  const maxRadius = 4.1;
  if (distFromCenter > maxRadius) {
    const angle = Math.atan2(targetZ, targetX);
    targetX = Math.cos(angle) * maxRadius;
    targetZ = Math.sin(angle) * maxRadius;
  }

  for (const obs of OBSTACLES) {
    const dx = targetX - obs.x;
    const dz = targetZ - obs.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < obs.radius) {
      const angle = Math.atan2(dz, dx);
      targetX = obs.x + Math.cos(angle) * (obs.radius + 0.05);
      targetZ = obs.z + Math.sin(angle) * (obs.radius + 0.05);
    }
  }

  return [targetX, targetZ];
}

/** -------------------------------------------------------------
 *  1. EXPANSIVE 360° MEADOW GROUND PLANE
 * ------------------------------------------------------------- */
function ExtendedMeadowTerrain() {
  return (
    <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#94c77d" roughness={0.8} />
    </mesh>
  );
}

/** -------------------------------------------------------------
 *  2. 360° PANORAMA ROLLING HILLS
 * ------------------------------------------------------------- */
function StorybookPanoramaHills() {
  return (
    <group position={[0, -1.2, 0]}>
      <mesh position={[-18, 1.2, -26]} scale={[22, 8, 22]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#8ab874" roughness={0.8} />
      </mesh>
      <mesh position={[18, 1.0, -28]} scale={[24, 9, 24]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#9ec891" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, -30]} scale={[28, 10, 28]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#7cb268" roughness={0.8} />
      </mesh>

      <mesh position={[-28, 1.5, -12]} scale={[22, 8, 22]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#84b574" roughness={0.85} />
      </mesh>
      <mesh position={[-26, 1.2, 12]} scale={[20, 7, 20]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#94c480" roughness={0.85} />
      </mesh>

      <mesh position={[28, 1.5, -12]} scale={[22, 8, 22]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#84b574" roughness={0.85} />
      </mesh>
      <mesh position={[26, 1.2, 12]} scale={[20, 7, 20]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#94c480" roughness={0.85} />
      </mesh>

      <mesh position={[-32, 4.0, -40]} scale={[40, 15, 40]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#6a9957" roughness={0.9} />
      </mesh>
      <mesh position={[32, 4.2, -42]} scale={[42, 16, 42]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#5e8c4f" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  3. BACKGROUND FOREST TREES
 * ------------------------------------------------------------- */
function BackgroundForest() {
  const treePositions = [
    { pos: [-14, 0.8, -22], scale: 1.6 },
    { pos: [-18, 1.2, -25], scale: 2.0 },
    { pos: [-8, 0.5, -23], scale: 1.4 },
    { pos: [8, 0.7, -22], scale: 1.7 },
    { pos: [15, 1.1, -26], scale: 2.1 },
    { pos: [20, 1.4, -28], scale: 2.4 },
    { pos: [-22, 1.8, -30], scale: 2.3 },
    { pos: [0, 1.0, -25], scale: 1.8 },
  ];

  return (
    <group>
      {treePositions.map((t, idx) => (
        <group key={idx} position={t.pos} scale={t.scale}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.2, 0.35, 1.6, 12]} />
            <meshStandardMaterial color="#5c3e28" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.0, 0]}>
            <sphereGeometry args={[1.1, 20, 20]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#7aa867' : '#88b574'} roughness={0.6} />
          </mesh>
          <mesh position={[-0.5, 2.6, 0.2]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="#94c480" roughness={0.6} />
          </mesh>
          <mesh position={[0.4, 2.7, -0.2]}>
            <sphereGeometry args={[0.75, 16, 16]} />
            <meshStandardMaterial color="#6a9957" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  4. SOFT FLUFFY SKY CLOUDS
 * ------------------------------------------------------------- */
function FluffyClouds() {
  const cloudsRef = useRef();

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.x = (state.clock.getElapsedTime() * 0.15) % 24 - 12;
    }
  });

  return (
    <group ref={cloudsRef}>
      {[
        { pos: [-14, 8.5, -18], scale: 1.8 },
        { pos: [-2, 9.2, -22], scale: 2.2 },
        { pos: [10, 8.8, -16], scale: 1.6 },
        { pos: [20, 9.5, -24], scale: 2.0 },
      ].map((c, idx) => (
        <group key={idx} position={c.pos} scale={c.scale}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.0, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.92} />
          </mesh>
          <mesh position={[0.7, -0.1, 0]}>
            <sphereGeometry args={[0.75, 14, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.92} />
          </mesh>
          <mesh position={[-0.7, -0.15, 0]}>
            <sphereGeometry args={[0.7, 14, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.92} />
          </mesh>
          <mesh position={[0.2, 0.5, 0]}>
            <sphereGeometry args={[0.65, 14, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  5. DISTANT FLYING BIRDS
 * ------------------------------------------------------------- */
function DistantBirds() {
  const birdsGroupRef = useRef();

  useFrame((state) => {
    if (birdsGroupRef.current) {
      const t = state.clock.getElapsedTime() * 0.4;
      birdsGroupRef.current.position.x = Math.sin(t * 0.5) * 8;
      birdsGroupRef.current.position.y = 7.5 + Math.cos(t * 0.3) * 0.5;
      birdsGroupRef.current.rotation.y = Math.cos(t * 0.5) * 0.3;
    }
  });

  return (
    <group ref={birdsGroupRef} position={[0, 7.5, -12]}>
      {[-0.8, 0, 0.8].map((offset, idx) => (
        <group key={idx} position={[offset * 0.8, idx * 0.2, offset * 0.5]}>
          <mesh position={[-0.1, 0, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.2, 0.02, 0.08]} />
            <meshStandardMaterial color="#556b2f" />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.2, 0.02, 0.08]} />
            <meshStandardMaterial color="#556b2f" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  6. CAMERA-RELATIVE WASD & ORBIT CONTROL ENGINE
 * ------------------------------------------------------------- */
function CharacterCameraController({ playerGroupRef, targetPos, setTargetPos, resetSignal }) {
  const { camera } = useThree();
  const orbitRef = useRef();
  const keysPressed = useRef({});

  // Reset Camera View handler
  useEffect(() => {
    if (resetSignal && orbitRef.current) {
      orbitRef.current.reset();
      if (playerGroupRef.current) {
        orbitRef.current.target.set(
          playerGroupRef.current.position.x,
          playerGroupRef.current.position.y + 0.8,
          playerGroupRef.current.position.z
        );
      }
    }
  }, [resetSignal]);

  // Keyboard Listeners (WASD + Arrows + R key reset)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = true;
      if (k === 'r' && orbitRef.current) {
        orbitRef.current.reset();
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!playerGroupRef.current) return;

    // 1. WASD Camera-Relative Movement
    const keys = keysPressed.current;
    const isW = keys['w'] || keys['arrowup'];
    const isS = keys['s'] || keys['arrowdown'];
    const isA = keys['a'] || keys['arrowleft'];
    const isD = keys['d'] || keys['arrowright'];

    if (isW || isS || isA || isD) {
      // Calculate camera horizontal forward & right vectors
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      camDir.y = 0; // Project to XZ plane
      camDir.normalize();

      const camRight = new THREE.Vector3();
      camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

      const moveVec = new THREE.Vector3(0, 0, 0);

      if (isW) moveVec.add(camDir);
      if (isS) moveVec.sub(camDir);
      if (isD) moveVec.sub(camRight); // Correct right direction
      if (isA) moveVec.add(camRight);

      if (moveVec.lengthSq() > 0) {
        moveVec.normalize();
        const moveSpeed = 3.5 * delta;

        let nextX = playerGroupRef.current.position.x + moveVec.x * moveSpeed;
        let nextZ = playerGroupRef.current.position.z + moveVec.z * moveSpeed;

        const [sanX, sanZ] = sanitizePlayableTarget(nextX, nextZ);
        setTargetPos([sanX, sanZ]);
      }
    }

    // 2. Smooth Orbit Target Tracking
    if (orbitRef.current) {
      const px = playerGroupRef.current.position.x;
      const py = playerGroupRef.current.position.y;
      const pz = playerGroupRef.current.position.z;

      orbitRef.current.target.x = THREE.MathUtils.lerp(orbitRef.current.target.x, px, 0.1);
      orbitRef.current.target.y = THREE.MathUtils.lerp(orbitRef.current.target.y, py + 0.8, 0.1);
      orbitRef.current.target.z = THREE.MathUtils.lerp(orbitRef.current.target.z, pz, 0.1);

      // 3. Basic Camera Obstacle Occlusion Check (Cottage collision guard)
      for (const obs of OBSTACLES) {
        const dx = camera.position.x - obs.x;
        const dz = camera.position.z - obs.z;
        const distToObs = Math.sqrt(dx * dx + dz * dz);
        if (distToObs < obs.radius + 0.2) {
          const pushOutAngle = Math.atan2(dz, dx);
          camera.position.x = obs.x + Math.cos(pushOutAngle) * (obs.radius + 0.25);
          camera.position.z = obs.z + Math.sin(pushOutAngle) * (obs.radius + 0.25);
        }
      }

      orbitRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={orbitRef}
      enablePan={false}
      enableZoom={true}
      minDistance={3.0}
      maxDistance={12.0}
      minPolarAngle={Math.PI * 0.12} // ~21°
      maxPolarAngle={Math.PI * 0.46} // ~83° (Never go underground)
      rotateSpeed={0.6}
      zoomSpeed={0.8}
    />
  );
}

/** -------------------------------------------------------------
 *  7. STYLIZED STORYBOOK HUMAN AVATAR
 * ------------------------------------------------------------- */
function StorybookHuman({ character, targetPos, groupRef }) {
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headGroupRef = useRef();

  const skinTone = character?.skin_tone || '#f2c9a0';
  const hairColor = character?.hair_color || '#7a4a2b';
  const hairStyle = character?.hair_style || 'wanderer_cap';
  const outfitColor = character?.outfit_color || '#c9a7e0';
  const outfitStyle = character?.outfit_style || 'wanderer_coat';
  const accessory = character?.accessory || 'backpack';

  useFrame((state) => {
    if (!groupRef.current || !targetPos) return;

    const dx = targetPos[0] - groupRef.current.position.x;
    const dz = targetPos[1] - groupRef.current.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const clock = state.clock.getElapsedTime();

    if (dist > 0.06) {
      groupRef.current.position.x += dx * 0.085;
      groupRef.current.position.z += dz * 0.085;

      const targetAngle = Math.atan2(dx, dz);
      let diff = targetAngle - groupRef.current.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.18;

      groupRef.current.position.y = Math.abs(Math.sin(clock * 14)) * 0.06;

      const legSwing = Math.sin(clock * 14) * 0.45;
      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;

      const armSwing = Math.sin(clock * 14) * 0.35;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;

      if (headGroupRef.current) headGroupRef.current.rotation.z = Math.sin(clock * 7) * 0.04;
    } else {
      groupRef.current.position.y = Math.sin(clock * 2.2) * 0.02;

      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);

      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(clock * 2) * 0.05;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(clock * 2) * 0.05;

      if (headGroupRef.current) headGroupRef.current.rotation.z = Math.sin(clock * 1.5) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <group ref={headGroupRef} position={[0, 0.95, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color={skinTone} roughness={0.45} />
        </mesh>

        <mesh position={[-0.09, 0.03, 0.22]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#222222" roughness={0.2} />
        </mesh>
        <mesh position={[0.09, 0.03, 0.22]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#222222" roughness={0.2} />
        </mesh>
        
        <mesh position={[-0.08, 0.045, 0.25]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.1, 0.045, 0.25]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        <mesh position={[-0.14, -0.04, 0.2]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#ffb5a7" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.14, -0.04, 0.2]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#ffb5a7" transparent opacity={0.6} />
        </mesh>

        <mesh position={[0, -0.01, 0.25]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
        </mesh>

        {hairStyle === 'wanderer_cap' && (
          <group>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.27, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={hairColor} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.32, -0.02]} rotation={[0.2, 0, 0]}>
              <coneGeometry args={[0.26, 0.42, 16]} />
              <meshStandardMaterial color="#e07a5f" roughness={0.5} />
            </mesh>
          </group>
        )}

        {hairStyle === 'cute_bob' && (
          <group>
            <mesh position={[0, 0.08, -0.02]}>
              <sphereGeometry args={[0.28, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
              <meshStandardMaterial color={hairColor} roughness={0.6} />
            </mesh>
            <mesh position={[-0.22, -0.08, 0.05]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.22, -0.08, 0.05]}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </group>
        )}

        {hairStyle === 'braids' && (
          <group>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.27, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={hairColor} roughness={0.6} />
            </mesh>
            <mesh position={[-0.2, -0.22, 0.1]}>
              <cylinderGeometry args={[0.05, 0.03, 0.35, 8]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.2, -0.22, 0.1]}>
              <cylinderGeometry args={[0.05, 0.03, 0.35, 8]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </group>
        )}

        {hairStyle === 'wavy_locks' && (
          <group>
            <mesh position={[0, 0.08, -0.04]}>
              <sphereGeometry args={[0.29, 24, 24]} />
              <meshStandardMaterial color={hairColor} roughness={0.6} />
            </mesh>
          </group>
        )}

        {accessory === 'round_glasses' && (
          <group position={[0, 0.03, 0.24]}>
            <mesh position={[-0.09, 0, 0]}>
              <torusGeometry args={[0.045, 0.008, 8, 16]} />
              <meshStandardMaterial color="#ffb703" metalness={0.8} />
            </mesh>
            <mesh position={[0.09, 0, 0]}>
              <torusGeometry args={[0.045, 0.008, 8, 16]} />
              <meshStandardMaterial color="#ffb703" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.09, 0.008, 0.008]} />
              <meshStandardMaterial color="#ffb703" metalness={0.8} />
            </mesh>
          </group>
        )}

        {accessory === 'flower_crown' && (
          <group position={[0, 0.22, 0]}>
            {[-0.15, 0, 0.15].map((x, i) => (
              <mesh key={i} position={[x, 0, 0.18]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#ffb5a7' : '#ffc6ff'} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* Torso */}
      <group position={[0, 0.48, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.26, 0.38, 8, 16]} />
          <meshStandardMaterial color={outfitColor} roughness={0.5} />
        </mesh>

        {outfitStyle === 'wanderer_coat' && (
          <group>
            <mesh position={[0, -0.18, 0]}>
              <coneGeometry args={[0.34, 0.25, 16, 1, true]} />
              <meshStandardMaterial color={outfitColor} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.08, 0.26]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#ffb703" metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.04, 0.26]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#ffb703" metalness={0.8} />
            </mesh>
          </group>
        )}

        {outfitStyle === 'gardener_overalls' && (
          <group>
            <mesh position={[0, 0.02, 0.26]}>
              <boxGeometry args={[0.18, 0.16, 0.02]} />
              <meshStandardMaterial color="#457b9d" />
            </mesh>
          </group>
        )}

        {accessory === 'backpack' && (
          <group position={[0, 0.02, -0.28]}>
            <mesh castShadow>
              <boxGeometry args={[0.32, 0.36, 0.16]} />
              <meshStandardMaterial color="#7a4b2a" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.12, 0.02]}>
              <boxGeometry args={[0.34, 0.12, 0.18]} />
              <meshStandardMaterial color="#5c381e" />
            </mesh>
          </group>
        )}

        {accessory === 'cozy_scarf' && (
          <group position={[0, 0.22, 0]}>
            <mesh>
              <torusGeometry args={[0.26, 0.06, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#e07a5f" roughness={0.7} />
            </mesh>
          </group>
        )}
      </group>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.32, 0.58, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.32, 10]} />
          <meshStandardMaterial color={outfitColor} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.32, 0.58, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.32, 10]} />
          <meshStandardMaterial color={outfitColor} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      {/* Legs & Shoes */}
      <group ref={leftLegRef} position={[-0.12, 0.22, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.22, 10]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
        <mesh position={[0, -0.22, 0.04]} castShadow>
          <boxGeometry args={[0.11, 0.1, 0.18]} />
          <meshStandardMaterial color="#5c381e" roughness={0.8} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.12, 0.22, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.22, 10]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
        <mesh position={[0, -0.22, 0.04]} castShadow>
          <boxGeometry args={[0.11, 0.1, 0.18]} />
          <meshStandardMaterial color="#5c381e" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  8. EXISTING GARDEN PROPS & ENVIRONMENT
 * ------------------------------------------------------------- */
function StorybookTree({ position, scale = 1, rotation = 0, colorScale = 0 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.7 + position[0]) * 0.025;
      groupRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.5 + position[2]) * 0.015;
    }
  });

  const leafColors = [
    { c1: '#84b574', c2: '#97c987', c3: '#afde9f' },
    { c1: '#739e65', c2: '#83b273', c3: '#9ec48f' },
    { c1: '#9eb87d', c2: '#b3cd93', c3: '#cce6ad' },
  ];
  const theme = leafColors[colorScale % leafColors.length];

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.28, 1.4, 16]} />
        <meshStandardMaterial color="#6b4c35" roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshStandardMaterial color={theme.c1} roughness={0.5} />
      </mesh>

      <mesh position={[-0.4, 2.1, 0.2]} castShadow>
        <sphereGeometry args={[0.65, 20, 20]} />
        <meshStandardMaterial color={theme.c2} roughness={0.5} />
      </mesh>

      <mesh position={[0.35, 2.2, -0.2]} castShadow>
        <sphereGeometry args={[0.6, 20, 20]} />
        <meshStandardMaterial color={theme.c3} roughness={0.5} />
      </mesh>

      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color={theme.c2} roughness={0.4} />
      </mesh>
    </group>
  );
}

function CozyCottage({ position = [-2.6, 0.1, -2.4], rotation = 0.45 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.8, 1.6]} />
        <meshStandardMaterial color="#faf0ca" roughness={0.7} />
      </mesh>

      <mesh position={[0, 1.75, 0.81]}>
        <boxGeometry args={[1.82, 0.1, 0.05]} />
        <meshStandardMaterial color="#6b4c35" />
      </mesh>

      <group position={[0, 2.1, 0]}>
        <mesh rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[1.65, 1.3, 4]} rotation={[0, Math.PI / 4, 0]} />
          <meshStandardMaterial color="#c96850" roughness={0.6} />
        </mesh>
      </group>

      <group position={[0.2, 0.65, 0.81]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.9, 0.06]} />
          <meshStandardMaterial color="#7a4a2b" roughness={0.8} />
        </mesh>
        <mesh position={[0.18, 0, 0.05]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#f4a261" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      <group position={[-0.45, 1.0, 0.81]}>
        <mesh>
          <boxGeometry args={[0.45, 0.45, 0.06]} />
          <meshStandardMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.47, 0.05, 0.02]} />
          <meshStandardMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.05, 0.47, 0.02]} />
          <meshStandardMaterial color="#6b4c35" />
        </mesh>
      </group>

      <group position={[-0.6, 2.0, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 1.2, 0.35]} />
          <meshStandardMaterial color="#a89f91" roughness={0.9} />
        </mesh>
        <Sparkles position={[0, 0.8, 0]} count={12} scale={0.6} size={4} speed={0.5} color="#ffffff" />
      </group>
    </group>
  );
}

function FairytalePond({ position = [-1.6, 0.02, 1.9] }) {
  const waterRef = useRef();

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = 0.02 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.008;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.65, 32]} />
        <meshStandardMaterial color="#d8c5b0" roughness={0.9} />
      </mesh>

      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.38, 32]} />
        <meshStandardMaterial
          color="#64dfdf"
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.88}
        />
      </mesh>

      {[
        { pos: [-0.5, 0.03, 0.4], rot: 0.2, color: '#f4acb7' },
        { pos: [0.4, 0.03, -0.5], rot: 1.8, color: '#ffcad4' },
        { pos: [0.6, 0.03, 0.3], rot: 3.1, color: '#ffb5a7' },
      ].map((pad, idx) => (
        <group key={idx} position={pad.pos} rotation={[0, pad.rot, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.22, 16, 0, Math.PI * 1.85]} />
            <meshStandardMaterial color="#52b788" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={pad.color} />
          </mesh>
        </group>
      ))}

      <group position={[0.9, 0.22, 0.1]} rotation={[0, -0.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 0.08, 0.55]} />
          <meshStandardMaterial color="#8c5a3c" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 0.24]}>
          <boxGeometry args={[1.1, 0.06, 0.06]} />
          <meshStandardMaterial color="#6b442b" />
        </mesh>
        <mesh position={[0, 0.25, -0.24]}>
          <boxGeometry args={[1.1, 0.06, 0.06]} />
          <meshStandardMaterial color="#6b442b" />
        </mesh>
      </group>
    </group>
  );
}

function MushroomGroup({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.04, 0.07, 0.36, 12]} />
          <meshStandardMaterial color="#fdf0d5" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#e63946" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.54, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, 0.46, 0.08]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[0.2, 0, 0.12]} scale={0.6}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#fdf0d5" />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#f4a261" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function SoftFlowerCluster({ position, color = '#ffb5a7' }) {
  return (
    <group position={position}>
      {[-0.12, 0, 0.14].map((offset, idx) => (
        <group key={idx} position={[offset, 0, (idx % 2) * 0.1]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 0.4, 6]} />
            <meshStandardMaterial color="#70e000" />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#ffb703" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GardenFenceGate({ position = [2.5, 0, 1.4], rotation = -0.6 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group position={[-0.8, 0, 0]}>
        {[-0.3, 0, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.35, 0]} castShadow>
            <boxGeometry args={[0.08, 0.7, 0.04]} />
            <meshStandardMaterial color="#ddb892" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.7, 0.06, 0.05]} />
          <meshStandardMaterial color="#b08968" />
        </mesh>
      </group>

      <group position={[0, 0, 0]}>
        <mesh position={[-0.35, 0.6, 0]} castShadow>
          <boxGeometry args={[0.12, 1.2, 0.12]} />
          <meshStandardMaterial color="#7f5539" />
        </mesh>
        <mesh position={[0.35, 0.6, 0]} castShadow>
          <boxGeometry args={[0.12, 1.2, 0.12]} />
          <meshStandardMaterial color="#7f5539" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <torusGeometry args={[0.35, 0.05, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#7f5539" />
        </mesh>
      </group>
    </group>
  );
}

function StorybookMailbox({ position = [1.8, 0, -1.2] }) {
  const [flagUp, setFlagUp] = useState(true);

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setFlagUp(!flagUp);
      }}
    >
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.0, 12]} />
        <meshStandardMaterial color="#6b4c35" roughness={0.8} />
      </mesh>

      <mesh position={[0, 1.08, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.38, 6, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e07a5f" roughness={0.4} />
      </mesh>

      <mesh position={[0.2, 1.08, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#ffb703" metalness={0.8} />
      </mesh>

      <mesh 
        position={[0.05, 1.15, 0.24]}
        rotation={[0, 0, flagUp ? 0 : -Math.PI / 2.2]}
      >
        <boxGeometry args={[0.04, 0.24, 0.12]} />
        <meshStandardMaterial color="#ffb703" />
      </mesh>
    </group>
  );
}

function NaturalDioramaTerrain({ onGroundClick }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(14, 14, 48, 48);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const distFromCenter = Math.sqrt(x * x + y * y);

      let height = Math.sin(x * 0.4) * Math.cos(y * 0.4) * 0.35 + Math.sin(x * 0.8 + y * 0.6) * 0.15;

      if (distFromCenter > 4.5) {
        const falloff = Math.min(1, (distFromCenter - 4.5) / 2.0);
        height -= falloff * falloff * 1.6;
      }

      pos.setZ(i, height);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          const pointX = e.point.x;
          const pointZ = e.point.z;
          const sanitized = sanitizePlayableTarget(pointX, pointZ);
          onGroundClick(sanitized);
        }}
      >
        <meshStandardMaterial color="#8ecae6" roughness={0.7} />
      </mesh>

      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#a7c957" roughness={0.75} />
      </mesh>

      {[
        [-0.3, 0.03, 0.4],
        [0.2, 0.03, -0.2],
        [0.7, 0.03, -0.7],
        [1.2, 0.03, -1.0],
        [1.7, 0.03, -1.2],
      ].map((stone, i) => (
        <mesh key={i} position={stone} rotation={[-Math.PI / 2, 0, i * 0.5]}>
          <circleGeometry args={[0.3, 16]} />
          <meshStandardMaterial color="#e9d8a6" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  MAIN GARDEN SCENE ASSEMBLY WITH 360° ORBIT CAMERA & CONTROLS
 * ------------------------------------------------------------- */
export default function GardenScene({ character, resetCameraSignal }) {
  const [targetPos, setTargetPos] = useState([0, 0]);
  const playerGroupRef = useRef();

  return (
    <Canvas shadows camera={{ position: [0, 4.5, 7.0], fov: 42 }}>
      {/* Soft Pastel Sky Atmosphere & Haze Fog */}
      <color attach="background" args={['#e6f2ee']} />
      <fogExp2 attach="fog" color="#dbebe6" density={0.011} />
      
      {/* Sunlight */}
      <Sky sunPosition={[8, 5, 4]} turbidity={0.8} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <ambientLight intensity={0.8} color="#fff7ed" />
      <directionalLight
        position={[6, 8, 4]}
        intensity={1.35}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />

      {/* 360° Camera Orbit & WASD Movement Engine */}
      <CharacterCameraController
        playerGroupRef={playerGroupRef}
        targetPos={targetPos}
        setTargetPos={setTargetPos}
        resetSignal={resetCameraSignal}
      />

      {/* 360° Extended Meadow Ground */}
      <ExtendedMeadowTerrain />

      {/* 360° Panorama Rolling Hills & Sky Scenery */}
      <FluffyClouds />
      <DistantBirds />
      <StorybookPanoramaHills />
      <BackgroundForest />

      {/* Playable Garden & Environment Props */}
      <NaturalDioramaTerrain onGroundClick={setTargetPos} />
      <CozyCottage position={[-2.6, 0.1, -2.4]} rotation={0.45} />
      <FairytalePond position={[-1.6, 0.02, 1.9]} />
      <GardenFenceGate position={[2.5, 0, 1.4]} rotation={-0.6} />
      <StorybookMailbox position={[1.8, 0.05, -1.2]} />

      {/* Player Character */}
      <StorybookHuman character={character} targetPos={targetPos} groupRef={playerGroupRef} />

      {/* Storybook Garden Trees */}
      <StorybookTree position={[-3.8, 0.2, -1.2]} scale={1.25} colorScale={0} />
      <StorybookTree position={[-2.4, 0.2, -3.8]} scale={1.1} colorScale={1} />
      <StorybookTree position={[3.2, 0.1, -3.2]} scale={1.35} colorScale={2} />
      <StorybookTree position={[3.8, 0.1, -1.5]} scale={1.05} colorScale={0} />
      <StorybookTree position={[4.2, 0.05, 1.2]} scale={1.1} colorScale={1} />

      {/* Mushrooms & Flowers */}
      <MushroomGroup position={[-1.2, 0.08, -1.6]} scale={1.1} />
      <MushroomGroup position={[2.8, 0.05, -2.2]} scale={0.95} />
      
      <SoftFlowerCluster position={[-0.8, 0.04, 0.8]} color="#ffb5a7" />
      <SoftFlowerCluster position={[1.2, 0.04, 2.1]} color="#c77dff" />
      <SoftFlowerCluster position={[2.2, 0.04, -0.2]} color="#ffc6ff" />
      <SoftFlowerCluster position={[-2.8, 0.04, 0.2]} color="#f8ad9d" />

      {/* Sparkles */}
      <Sparkles count={75} scale={14} size={3.5} speed={0.4} color="#ffe5ec" />

      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={14} blur={2.5} />
    </Canvas>
  );
}
