import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import VillageSquare from './VillageSquare';
import VillageHouses from './VillageHouses';
import Villagers from './Villagers';

/** -------------------------------------------------------------
 *  COLLISION & BOUNDARY HELPER (PLAYABLE RADIUS = 45m)
 * ------------------------------------------------------------- */
const OBSTACLES = [
  { name: 'Cottage', x: -14.0, z: -12.0, radius: 1.8 },
  { name: 'Pond', x: -13.0, z: -7.5, radius: 1.5 },
  { name: 'Fountain', x: 0, z: -22.0, radius: 1.6 },
  { name: 'Tree1', x: -15.2, z: -10.8, radius: 0.7 },
  { name: 'Tree2', x: -13.8, z: -14.2, radius: 0.7 },
];

function sanitizePlayableTarget(x, z) {
  let targetX = x;
  let targetZ = z;

  const distFromCenter = Math.sqrt(targetX * targetX + targetZ * targetZ);
  const maxRadius = 45.0; // Spacious countryside map size
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
 *  1. EXPANSIVE 360° MEADOW GROUND PLANE (180x180m)
 * ------------------------------------------------------------- */
function ExtendedMeadowTerrain() {
  return (
    <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[180, 180]} />
      <meshStandardMaterial color="#94c77d" roughness={0.8} />
    </mesh>
  );
}

/** -------------------------------------------------------------
 *  2. LONG WINDING COUNTRYSIDE PATH NETWORK
 * ------------------------------------------------------------- */
function VillageWindingPaths() {
  return (
    <group position={[0, 0.015, 0]}>
      {/* Long Path from Player Home Edge [-14, -12] to Market Plaza [0, -22] */}
      <mesh position={[-7.0, 0, -17.0]} rotation={[-Math.PI / 2, 0, -0.6]}>
        <planeGeometry args={[1.5, 18.0]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
      {/* Path to North-West Woodland Hamlet */}
      <mesh position={[-16.0, 0, -23.0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[1.4, 20.0]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
      {/* Path to North-East Blossom Knoll */}
      <mesh position={[14.0, 0, -24.0]} rotation={[-Math.PI / 2, 0, -0.3]}>
        <planeGeometry args={[1.4, 22.0]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
      {/* Path to South-West Craftsman Creek */}
      <mesh position={[-16.0, 0, 0.0]} rotation={[-Math.PI / 2, 0, -0.9]}>
        <planeGeometry args={[1.4, 24.0]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
      {/* Path to South-East Quiet Meadow */}
      <mesh position={[16.0, 0, 0.0]} rotation={[-Math.PI / 2, 0, 0.8]}>
        <planeGeometry args={[1.4, 25.0]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  3. NATURAL FILLERS BETWEEN HOUSES (Trees, Flowers, Rocks, Mushrooms)
 * ------------------------------------------------------------- */
function CountrysideNaturalFillers() {
  return (
    <group>
      {/* Tree Clusters in Spaces Between Hamlets */}
      <group position={[-18, 0, -18]}>
        <StorybookTree position={[0, 0, 0]} scale={1.4} colorScale={0} />
        <StorybookTree position={[-3, 0, 2]} scale={1.6} colorScale={1} />
        <MushroomGroup position={[-1, 0.08, 3]} scale={1.4} />
      </group>

      <group position={[18, 0, -16]}>
        <StorybookTree position={[0, 0, 0]} scale={1.5} colorScale={2} />
        <StorybookTree position={[3, 0, -2]} scale={1.3} colorScale={0} />
        <SoftFlowerCluster position={[1, 0.04, 2]} color="#ffb5a7" />
      </group>

      <group position={[-18, 0, 8]}>
        <StorybookTree position={[0, 0, 0]} scale={1.4} colorScale={1} />
        <SoftFlowerCluster position={[-2, 0.04, -1]} color="#c77dff" />
        <mesh position={[2, 0.15, 1]} castShadow>
          <dodecahedronGeometry args={[0.35, 1]} />
          <meshStandardMaterial color="#8a8a8a" roughness={0.8} />
        </mesh>
      </group>

      <group position={[18, 0, 8]}>
        <StorybookTree position={[0, 0, 0]} scale={1.5} colorScale={0} />
        <MushroomGroup position={[2, 0.08, -1]} scale={1.3} />
        <SoftFlowerCluster position={[-1, 0.04, 2]} color="#ffb5a7" />
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  4. NATURAL 360° OPEN COUNTRYSIDE HILLS
 * ------------------------------------------------------------- */
function DistantCountrysideHills() {
  return (
    <group position={[0, -1.8, 0]}>
      <mesh position={[-42, 1.2, -50]} scale={[32, 5.5, 32]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#8ab874" roughness={0.85} />
      </mesh>
      <mesh position={[42, 1.0, -52]} scale={[34, 5.8, 34]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#9ec891" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.8, -55]} scale={[38, 6.2, 38]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#7cb268" roughness={0.85} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  5. SOFT SKY CLOUDS & BIRDS
 * ------------------------------------------------------------- */
function FluffyClouds() {
  const cloudsRef = useRef();

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.x = (state.clock.getElapsedTime() * 0.15) % 36 - 18;
    }
  });

  return (
    <group ref={cloudsRef}>
      {[
        { pos: [-24, 9.5, -28], scale: 2.2 },
        { pos: [-4, 10.2, -32], scale: 2.8 },
        { pos: [16, 9.8, -26], scale: 2.0 },
        { pos: [30, 10.5, -34], scale: 2.5 },
      ].map((c, idx) => (
        <group key={idx} position={c.pos} scale={c.scale}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.0, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DistantBirds() {
  const birdsGroupRef = useRef();

  useFrame((state) => {
    if (birdsGroupRef.current) {
      const t = state.clock.getElapsedTime() * 0.4;
      birdsGroupRef.current.position.x = Math.sin(t * 0.5) * 12;
      birdsGroupRef.current.position.y = 8.5 + Math.cos(t * 0.3) * 0.5;
      birdsGroupRef.current.rotation.y = Math.cos(t * 0.5) * 0.3;
    }
  });

  return (
    <group ref={birdsGroupRef} position={[0, 8.5, -18]}>
      {[-1.2, 0, 1.2].map((offset, idx) => (
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
 *  6. HOME HORSE STABLE AREA
 * ------------------------------------------------------------- */
function HomeHorseStable({ position = [-15.0, 0, -9.5] }) {
  return (
    <group position={position} rotation={[0, 0.3, 0]}>
      <mesh position={[-0.6, 0.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.7, 1.4]} />
        <meshStandardMaterial color="#8c5a3c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.35, -0.6]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.08]} />
        <meshStandardMaterial color="#8c5a3c" roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.2, -0.2]} castShadow>
        <boxGeometry args={[0.6, 0.35, 0.4]} />
        <meshStandardMaterial color="#e9c46a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 0.15, 0.3]} castShadow>
        <boxGeometry args={[0.5, 0.28, 0.35]} />
        <meshStandardMaterial color="#5c381e" roughness={0.8} />
      </mesh>
      <mesh position={[-0.2, 0.22, 0.3]}>
        <boxGeometry args={[0.44, 0.08, 0.29]} />
        <meshStandardMaterial color="#457b9d" roughness={0.1} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  7. PET 1: KNEE-HEIGHT CARTOON SMALL COMPANION PET (Bunny 🐰)
 * ------------------------------------------------------------- */
function SmallCompanionPet({ petType = 'bunny', targetGroupRef }) {
  const petRef = useRef();

  useFrame((state) => {
    if (!petRef.current || !targetGroupRef.current) return;

    const tx = targetGroupRef.current.position.x - 0.65;
    const tz = targetGroupRef.current.position.z + 0.65;
    const clock = state.clock.getElapsedTime();

    const dx = tx - petRef.current.position.x;
    const dz = tz - petRef.current.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 0.1) {
      petRef.current.position.x += dx * 0.08;
      petRef.current.position.z += dz * 0.08;
      petRef.current.rotation.y = Math.atan2(dx, dz);
      petRef.current.position.y = Math.abs(Math.sin(clock * 16)) * 0.08;
    } else {
      petRef.current.position.y = Math.sin(clock * 3) * 0.015;
    }
  });

  return (
    <group ref={petRef} position={[-14.65, 0, -11.35]} scale={0.55}>
      {petType === 'bunny' && (
        <group position={[0, 0.18, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.14, 0.12]} castShadow>
            <sphereGeometry args={[0.12, 14, 14]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.13, 0.23]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#ffb5a7" />
          </mesh>
          <group position={[-0.06, 0.28, 0.06]} rotation={[0.2, 0, -0.15]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.03, 0.2, 6, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <capsuleGeometry args={[0.018, 0.15, 6, 12]} />
              <meshStandardMaterial color="#ffc6ff" />
            </mesh>
          </group>
          <group position={[0.06, 0.28, 0.06]} rotation={[0.2, 0, 0.15]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.03, 0.2, 6, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <capsuleGeometry args={[0.018, 0.15, 6, 12]} />
              <meshStandardMaterial color="#ffc6ff" />
            </mesh>
          </group>
          <mesh position={[-0.05, 0.16, 0.2]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0.05, 0.16, 0.2]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0, 0.05, -0.18]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {petType !== 'bunny' && (
        <group position={[0, 0.18, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 14, 14]} />
            <meshStandardMaterial color={petType === 'fox' ? '#e07a5f' : petType === 'frog' ? '#70e000' : '#f4a261'} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.12, 0.11]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={petType === 'fox' ? '#e07a5f' : petType === 'frog' ? '#70e000' : '#f4a261'} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/** -------------------------------------------------------------
 *  8. PET 2: SHOULDER-HEIGHT CARTOON STORYBOOK HORSE 🐴
 * ------------------------------------------------------------- */
function StorybookHorse({ isMounted, playerGroupRef, horsePosRef }) {
  const horseRef = useRef();
  const leftFrontLegRef = useRef();
  const rightFrontLegRef = useRef();
  const leftBackLegRef = useRef();
  const rightBackLegRef = useRef();
  const headNeckGroupRef = useRef();

  useFrame((state) => {
    if (!horseRef.current) return;
    const clock = state.clock.getElapsedTime();

    if (isMounted && playerGroupRef.current) {
      horseRef.current.position.x = playerGroupRef.current.position.x;
      horseRef.current.position.z = playerGroupRef.current.position.z;
      horseRef.current.rotation.y = playerGroupRef.current.rotation.y;

      const isWalking = playerGroupRef.current.position.y > 0.01;

      if (isWalking) {
        const legSwing = Math.sin(clock * 14) * 0.45;
        if (leftFrontLegRef.current) leftFrontLegRef.current.rotation.x = legSwing;
        if (rightFrontLegRef.current) rightFrontLegRef.current.rotation.x = -legSwing;
        if (leftBackLegRef.current) leftBackLegRef.current.rotation.x = -legSwing;
        if (rightBackLegRef.current) rightBackLegRef.current.rotation.x = legSwing;

        if (headNeckGroupRef.current) headNeckGroupRef.current.rotation.x = Math.sin(clock * 14) * 0.08;
      } else {
        if (leftFrontLegRef.current) leftFrontLegRef.current.rotation.x = THREE.MathUtils.lerp(leftFrontLegRef.current.rotation.x, 0, 0.1);
        if (rightFrontLegRef.current) rightFrontLegRef.current.rotation.x = THREE.MathUtils.lerp(rightFrontLegRef.current.rotation.x, 0, 0.1);
        if (leftBackLegRef.current) leftBackLegRef.current.rotation.x = THREE.MathUtils.lerp(leftBackLegRef.current.rotation.x, 0, 0.1);
        if (rightBackLegRef.current) rightBackLegRef.current.rotation.x = THREE.MathUtils.lerp(rightBackLegRef.current.rotation.x, 0, 0.1);

        if (headNeckGroupRef.current) headNeckGroupRef.current.rotation.x = Math.sin(clock * 2) * 0.04;
      }
    } else if (!isMounted) {
      if (headNeckGroupRef.current) headNeckGroupRef.current.rotation.x = Math.sin(clock * 1.8) * 0.05;
    }

    if (horsePosRef && horseRef.current) {
      horsePosRef.current = [horseRef.current.position.x, horseRef.current.position.z];
    }
  });

  return (
    <group ref={horseRef} position={[-15.2, 0, -9.5]} scale={1.05}>
      <mesh position={[0, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.82, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#c68a4c" roughness={0.55} />
      </mesh>

      <group position={[0, 0.78, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.15, 0.48]} />
          <meshStandardMaterial color="#6a3b1d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.44, 0.04, 0.44]} />
          <meshStandardMaterial color="#d4a373" />
        </mesh>
        <mesh position={[0, -0.22, 0.25]}>
          <boxGeometry args={[0.04, 0.32, 0.04]} />
          <meshStandardMaterial color="#ffb703" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.22, -0.25]}>
          <boxGeometry args={[0.04, 0.32, 0.04]} />
          <meshStandardMaterial color="#ffb703" metalness={0.8} />
        </mesh>
      </group>

      <group ref={headNeckGroupRef} position={[0, 0.82, 0.42]}>
        <mesh position={[0, 0.28, 0.14]} rotation={[0.36, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.24, 0.62, 12]} />
          <meshStandardMaterial color="#c68a4c" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.58, 0.3]} rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.26, 0.26, 0.46]} />
          <meshStandardMaterial color="#c68a4c" roughness={0.55} />
        </mesh>
        <group position={[0, 0.52, 0.5]}>
          <mesh>
            <boxGeometry args={[0.24, 0.22, 0.2]} />
            <meshStandardMaterial color="#fdf0d5" />
          </mesh>
          <mesh position={[-0.06, -0.02, 0.11]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#4a2c11" />
          </mesh>
          <mesh position={[0.06, -0.02, 0.11]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#4a2c11" />
          </mesh>
        </group>
        <mesh position={[0, 0.48, 0.02]} rotation={[0.36, 0, 0]}>
          <boxGeometry args={[0.09, 0.65, 0.16]} />
          <meshStandardMaterial color="#4a2c11" roughness={0.8} />
        </mesh>
        <mesh position={[-0.09, 0.72, 0.22]} rotation={[0.1, 0, -0.2]}>
          <coneGeometry args={[0.045, 0.17, 8]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0.09, 0.72, 0.22]} rotation={[0.1, 0, 0.2]}>
          <coneGeometry args={[0.045, 0.17, 8]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[-0.14, 0.6, 0.35]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0.14, 0.6, 0.35]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>

      <mesh position={[0, 0.62, -0.46]} rotation={[-0.4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.09, 0.52, 8]} />
        <meshStandardMaterial color="#4a2c11" />
      </mesh>

      <group ref={leftFrontLegRef} position={[-0.18, 0.3, 0.28]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 10]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.09, 0.08, 0.12]} />
          <meshStandardMaterial color="#2b180a" />
        </mesh>
      </group>

      <group ref={rightFrontLegRef} position={[0.18, 0.3, 0.28]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 10]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.09, 0.08, 0.12]} />
          <meshStandardMaterial color="#2b180a" />
        </mesh>
      </group>

      <group ref={leftBackLegRef} position={[-0.18, 0.3, -0.28]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 10]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.09, 0.08, 0.12]} />
          <meshStandardMaterial color="#2b180a" />
        </mesh>
      </group>

      <group ref={rightBackLegRef} position={[0.18, 0.3, -0.28]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 10]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.09, 0.08, 0.12]} />
          <meshStandardMaterial color="#2b180a" />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  9. CAMERA-RELATIVE WASD & ORBIT CONTROL ENGINE (UNTOUCHED)
 * ------------------------------------------------------------- */
function CharacterCameraController({ playerGroupRef, targetPos, setTargetPos, resetSignal, isMounted, toggleMount }) {
  const { camera } = useThree();
  const orbitRef = useRef();
  const keysPressed = useRef({});

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = true;
      if (k === 'r' && orbitRef.current) {
        orbitRef.current.reset();
      }
      if (k === 'e' && toggleMount) {
        toggleMount();
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
  }, [toggleMount]);

  useFrame((state, delta) => {
    if (!playerGroupRef.current) return;

    const keys = keysPressed.current;
    const isW = keys['w'] || keys['arrowup'];
    const isS = keys['s'] || keys['arrowdown'];
    const isA = keys['a'] || keys['arrowleft'];
    const isD = keys['d'] || keys['arrowright'];

    if (isW || isS || isA || isD) {
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      camDir.y = 0;
      camDir.normalize();

      const camRight = new THREE.Vector3();
      camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

      const moveVec = new THREE.Vector3(0, 0, 0);

      if (isW) moveVec.add(camDir);
      if (isS) moveVec.sub(camDir);
      if (isD) moveVec.sub(camRight);
      if (isA) moveVec.add(camRight);

      if (moveVec.lengthSq() > 0) {
        moveVec.normalize();
        const speedMultiplier = isMounted ? 5.2 : 3.8;
        const moveSpeed = speedMultiplier * delta;

        let nextX = playerGroupRef.current.position.x + moveVec.x * moveSpeed;
        let nextZ = playerGroupRef.current.position.z + moveVec.z * moveSpeed;

        const [sanX, sanZ] = sanitizePlayableTarget(nextX, nextZ);
        setTargetPos([sanX, sanZ]);
      }
    }

    if (orbitRef.current) {
      const px = playerGroupRef.current.position.x;
      const py = playerGroupRef.current.position.y;
      const pz = playerGroupRef.current.position.z;

      orbitRef.current.target.x = THREE.MathUtils.lerp(orbitRef.current.target.x, px, 0.1);
      orbitRef.current.target.y = THREE.MathUtils.lerp(orbitRef.current.target.y, py + (isMounted ? 1.25 : 0.85), 0.1);
      orbitRef.current.target.z = THREE.MathUtils.lerp(orbitRef.current.target.z, pz, 0.1);

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
      maxDistance={15.0}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.46}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
    />
  );
}

/** -------------------------------------------------------------
 *  10. STYLIZED STORYBOOK PLAYER AVATAR
 * ------------------------------------------------------------- */
function StorybookHuman({ character, targetPos, groupRef, isMounted }) {
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headGroupRef = useRef();

  const skinTone = character?.skin_tone || '#f2c9a0';
  const hairColor = character?.hair_color || '#7a4a2b';
  const hairStyle = character?.hair_style || 'wanderer_cap';
  const outfitColor = character?.outfit_color || '#c9a7e0';

  useFrame((state) => {
    if (!groupRef.current || !targetPos) return;

    const dx = targetPos[0] - groupRef.current.position.x;
    const dz = targetPos[1] - groupRef.current.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const clock = state.clock.getElapsedTime();

    if (isMounted) {
      groupRef.current.position.y = 0.72;

      if (dist > 0.06) {
        groupRef.current.position.x += dx * 0.095;
        groupRef.current.position.z += dz * 0.095;

        const targetAngle = Math.atan2(dx, dz);
        let diff = targetAngle - groupRef.current.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        groupRef.current.rotation.y += diff * 0.18;
      }

      if (leftLegRef.current) leftLegRef.current.rotation.z = 0.42;
      if (rightLegRef.current) rightLegRef.current.rotation.z = -0.42;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.32;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0.32;

      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.48;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.48;

      if (headGroupRef.current) headGroupRef.current.rotation.z = Math.sin(clock * 3) * 0.02;
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.z = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.z = 0;

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
      } else {
        groupRef.current.position.y = Math.sin(clock * 2.2) * 0.02;
      }
    }
  });

  return (
    <group ref={groupRef} position={[-14.0, 0, -12.0]}>
      <group ref={headGroupRef} position={[0, 0.94, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color={skinTone} roughness={0.45} />
        </mesh>

        <group position={[0, 0.03, 0.22]}>
          <mesh position={[-0.09, 0, 0]}>
            <sphereGeometry args={[0.036, 12, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.1} />
          </mesh>
          <mesh position={[0.09, 0, 0]}>
            <sphereGeometry args={[0.036, 12, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.1} />
          </mesh>
          <mesh position={[-0.08, 0.015, 0.03]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.1, 0.015, 0.03]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        <mesh position={[-0.14, -0.04, 0.2]}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color="#ffb5a7" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.14, -0.04, 0.2]}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color="#ffb5a7" transparent opacity={0.65} />
        </mesh>

        <mesh position={[0, -0.01, 0.25]}>
          <sphereGeometry args={[0.026, 10, 10]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.06, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.04, 0.006, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#a85d48" />
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
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.22, -0.08, 0.05]}>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </group>
        )}
      </group>

      <group position={[0, 0.48, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.25, 0.38, 8, 16]} />
          <meshStandardMaterial color={outfitColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.18, 0.2]}>
          <torusGeometry args={[0.14, 0.03, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      <group ref={leftArmRef} position={[-0.31, 0.58, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.052, 0.05, 0.32, 10]} />
          <meshStandardMaterial color={outfitColor} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.046, 10, 10]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.31, 0.58, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.052, 0.05, 0.32, 10]} />
          <meshStandardMaterial color={outfitColor} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.046, 10, 10]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      <group ref={leftLegRef} position={[-0.12, 0.22, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.22, 10]} />
          <meshStandardMaterial color="#457b9d" />
        </mesh>
        <mesh position={[0, -0.22, 0.04]} castShadow>
          <boxGeometry args={[0.11, 0.1, 0.18]} />
          <meshStandardMaterial color="#5c381e" roughness={0.8} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.12, 0.22, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.22, 10]} />
          <meshStandardMaterial color="#457b9d" />
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
 *  11. COZY STORYBOOK COTTAGE & PLAYER DIORAMA TERRAIN
 * ------------------------------------------------------------- */
function CozyCottage({ position = [-14.0, 0.1, -12.0], rotation = 0.45 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.85, 1.8, 1.65]} />
        <meshStandardMaterial color="#faf0ca" roughness={0.7} />
      </mesh>

      <group position={[0, 2.1, 0]}>
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.35, 4]} />
          <meshStandardMaterial color="#c96850" roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <boxGeometry args={[1.92, 0.1, 1.72]} />
          <meshStandardMaterial color="#6b4c35" roughness={0.8} />
        </mesh>
      </group>

      <group position={[0.2, 0.65, 0.84]}>
        <mesh castShadow>
          <boxGeometry args={[0.52, 0.92, 0.06]} />
          <meshStandardMaterial color="#7a4a2b" roughness={0.8} />
        </mesh>
        <mesh position={[0.18, 0, 0.05]}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial color="#ffb703" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      <group position={[-0.45, 1.0, 0.84]}>
        <mesh>
          <boxGeometry args={[0.45, 0.45, 0.06]} />
          <meshStandardMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[-0.26, 0, 0.02]}>
          <boxGeometry args={[0.12, 0.47, 0.04]} />
          <meshStandardMaterial color="#8c5a3c" />
        </mesh>
        <mesh position={[0.26, 0, 0.02]}>
          <boxGeometry args={[0.12, 0.47, 0.04]} />
          <meshStandardMaterial color="#8c5a3c" />
        </mesh>
      </group>

      <group position={[0.52, 1.15, 0.86]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.2, 0.12]} />
          <meshStandardMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.8} />
        </mesh>
      </group>

      <group position={[-0.65, 2.0, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 1.25, 0.38]} />
          <meshStandardMaterial color="#a89f91" roughness={0.9} />
        </mesh>
        <Sparkles position={[0, 0.85, 0]} count={14} scale={0.6} size={4} speed={0.5} color="#ffffff" />
      </group>
    </group>
  );
}

function NaturalDioramaTerrain({ position = [-14.0, 0, -12.0], onGroundClick }) {
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
    <group position={position}>
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
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#a7c957" roughness={0.75} />
      </mesh>
    </group>
  );
}

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
    </group>
  );
}

function MushroomGroup({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.04, 0.07, 0.36, 12]} />
        <meshStandardMaterial color="#fdf0d5" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#e63946" roughness={0.4} />
      </mesh>
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
        </group>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  MAIN SCENE WITH SPACIOUS COUNTRYSIDE SCALE (PLAYABLE RADIUS = 45m)
 * ------------------------------------------------------------- */
export default function GardenScene({ character, resetCameraSignal, isMounted, toggleMount }) {
  const [targetPos, setTargetPos] = useState([-14.0, -12.0]);
  const playerGroupRef = useRef();
  const horsePosRef = useRef([-15.2, -9.5]);

  return (
    <Canvas shadows camera={{ position: [-14.0, 4.5, -5.0], fov: 42 }}>
      <color attach="background" args={['#e6f2ee']} />
      <fogExp2 attach="fog" color="#dbebe6" density={0.006} />
      
      <Sky sunPosition={[8, 5, 4]} turbidity={0.8} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <ambientLight intensity={0.85} color="#fff7ed" />
      <directionalLight position={[6, 8, 4]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />

      {/* Camera & WASD Controller (100% Untouched) */}
      <CharacterCameraController
        playerGroupRef={playerGroupRef}
        targetPos={targetPos}
        setTargetPos={setTargetPos}
        resetSignal={resetCameraSignal}
        isMounted={isMounted}
        toggleMount={toggleMount}
      />

      {/* Ground, Sky & Winding Paths */}
      <ExtendedMeadowTerrain />
      <FluffyClouds />
      <DistantBirds />
      <DistantCountrysideHills />
      <VillageWindingPaths />
      <CountrysideNaturalFillers />

      {/* 1. MARKET PLAZA CENTER (AT Z = -22m) */}
      <VillageSquare position={[0, 0, -22.0]} />

      {/* 2. 4 SPACIOUS COUNTRYSIDE HAMLETS (20m-35m SPACING) */}
      <VillageHouses />

      {/* 3. 12 SPACIOUS VILLAGER NPCS & PETS */}
      <Villagers />

      {/* Player's Home Cottage & Yard at Quiet Edge [-14, -12] */}
      <NaturalDioramaTerrain position={[-14.0, 0, -12.0]} onGroundClick={setTargetPos} />
      <CozyCottage position={[-16.6, 0.1, -14.4]} rotation={0.45} />
      <HomeHorseStable position={[-17.5, 0, -11.2]} />

      {/* Player Character & Companions */}
      <StorybookHuman character={character} targetPos={targetPos} groupRef={playerGroupRef} isMounted={isMounted} />
      <StorybookHorse isMounted={isMounted} playerGroupRef={playerGroupRef} horsePosRef={horsePosRef} />
      <SmallCompanionPet petType={character?.pet1_type || 'bunny'} targetGroupRef={playerGroupRef} />

      <Sparkles count={100} scale={28} size={3.5} speed={0.4} color="#ffe5ec" />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={28} blur={2.5} />
    </Canvas>
  );
}
