import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import VillageSquare from './VillageSquare';
import VillageHouses from './VillageHouses';
import Villagers from './Villagers';

/** -------------------------------------------------------------
 *  COLLISION & BOUNDARY HELPER (ORGANIC VILLAGE EXTENDED BOUNDS)
 * ------------------------------------------------------------- */
const OBSTACLES = [
  { name: 'Cottage', x: -2.6, z: -2.4, radius: 1.6 },
  { name: 'Pond', x: -1.6, z: 1.9, radius: 1.4 },
  { name: 'Fountain', x: -2.3, z: -6.0, radius: 1.4 },
  { name: 'Tree1', x: -3.8, z: -1.2, radius: 0.7 },
  { name: 'Tree2', x: -2.4, z: -3.8, radius: 0.7 },
  { name: 'Tree3', x: 3.2, z: -3.2, radius: 0.7 },
];

function sanitizePlayableTarget(x, z) {
  let targetX = x;
  let targetZ = z;

  const distFromCenter = Math.sqrt(targetX * targetX + targetZ * targetZ);
  const maxRadius = 14.5;
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
      <planeGeometry args={[140, 140]} />
      <meshStandardMaterial color="#94c77d" roughness={0.8} />
    </mesh>
  );
}

/** -------------------------------------------------------------
 *  2. ORGANIC WINDING & BRANCHING PATH NETWORK
 * ------------------------------------------------------------- */
function VillageWindingPaths() {
  return (
    <group position={[0, 0.015, 0]}>
      {/* Curved Path from Player Cottage to Market Corner */}
      <mesh position={[-1.8, 0, -4.0]} rotation={[-Math.PI / 2, 0, -0.32]}>
        <planeGeometry args={[1.3, 4.8]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
      {/* Branching Path East to Garden Neighborhood */}
      <mesh position={[2.8, 0, -5.2]} rotation={[-Math.PI / 2, 0, 0.85]}>
        <planeGeometry args={[1.2, 7.5]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
      {/* Branching Path West to Cozy Residential Corner */}
      <mesh position={[-5.8, 0, -5.8]} rotation={[-Math.PI / 2, 0, -0.75]}>
        <planeGeometry args={[1.2, 7.0]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
      {/* South-West Path to Craftsman & Post Corner */}
      <mesh position={[-4.5, 0, 1.8]} rotation={[-Math.PI / 2, 0, 0.45]}>
        <planeGeometry args={[1.3, 8.2]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
      {/* South-East Path to Quiet Library Corner */}
      <mesh position={[3.5, 0, 2.5]} rotation={[-Math.PI / 2, 0, -0.5]}>
        <planeGeometry args={[1.3, 8.5]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  3. NATURAL 360° OPEN COUNTRYSIDE HILLS (FAR NORTH)
 * ------------------------------------------------------------- */
function DistantCountrysideHills() {
  return (
    <group position={[0, -1.8, 0]}>
      <mesh position={[-28, 1.2, -35]} scale={[24, 4.5, 24]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#8ab874" roughness={0.85} />
      </mesh>
      <mesh position={[28, 1.0, -38]} scale={[26, 4.8, 26]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#9ec891" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.8, -42]} scale={[30, 5.2, 30]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#7cb268" roughness={0.85} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  4. SOFT FLUFFY SKY CLOUDS & BIRDS
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
 *  5. HOME HORSE STABLE AREA
 * ------------------------------------------------------------- */
function HomeHorseStable({ position = [-3.5, 0, 0.8] }) {
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
 *  6. PET 1: POLISHED SMALL COMPANION PET (Bunny 🐰)
 * ------------------------------------------------------------- */
function SmallCompanionPet({ petType = 'bunny', targetGroupRef }) {
  const petRef = useRef();

  useFrame((state) => {
    if (!petRef.current || !targetGroupRef.current) return;

    const tx = targetGroupRef.current.position.x - 0.7;
    const tz = targetGroupRef.current.position.z + 0.7;
    const clock = state.clock.getElapsedTime();

    const dx = tx - petRef.current.position.x;
    const dz = tz - petRef.current.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 0.1) {
      petRef.current.position.x += dx * 0.08;
      petRef.current.position.z += dz * 0.08;
      petRef.current.rotation.y = Math.atan2(dx, dz);
      petRef.current.position.y = Math.abs(Math.sin(clock * 16)) * 0.12;
    } else {
      petRef.current.position.y = Math.sin(clock * 3) * 0.02;
    }
  });

  return (
    <group ref={petRef} position={[-0.7, 0, 0.7]} scale={0.75}>
      {petType === 'bunny' && (
        <group position={[0, 0.22, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.2, 18, 18]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.15, 0.14]} castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.14, 0.27]}>
            <sphereGeometry args={[0.025, 10, 10]} />
            <meshStandardMaterial color="#ffb5a7" />
          </mesh>
          <group position={[-0.07, 0.32, 0.08]} rotation={[0.2, 0, -0.15]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.035, 0.24, 6, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <capsuleGeometry args={[0.02, 0.18, 6, 12]} />
              <meshStandardMaterial color="#ffc6ff" />
            </mesh>
          </group>
          <group position={[0.07, 0.32, 0.08]} rotation={[0.2, 0, 0.15]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.035, 0.24, 6, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <capsuleGeometry args={[0.02, 0.18, 6, 12]} />
              <meshStandardMaterial color="#ffc6ff" />
            </mesh>
          </group>
          <mesh position={[-0.06, 0.18, 0.24]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0.06, 0.18, 0.24]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0, 0.06, -0.2]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {petType !== 'bunny' && (
        <group position={[0, 0.2, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={petType === 'fox' ? '#e07a5f' : petType === 'frog' ? '#70e000' : '#f4a261'} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.14, 0.12]}>
            <sphereGeometry args={[0.12, 14, 14]} />
            <meshStandardMaterial color={petType === 'fox' ? '#e07a5f' : petType === 'frog' ? '#70e000' : '#f4a261'} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/** -------------------------------------------------------------
 *  7. PET 2: POLISHED STYLIZED STORYBOOK HORSE 🐴
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
    <group ref={horseRef} position={[-2.8, 0, 0.8]} scale={1.1}>
      <mesh position={[0, 0.58, 0]} castShadow>
        <capsuleGeometry args={[0.29, 0.78, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#c68a4c" roughness={0.55} />
      </mesh>

      <group position={[0, 0.75, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.44, 0.15, 0.46]} />
          <meshStandardMaterial color="#6a3b1d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.42, 0.04, 0.42]} />
          <meshStandardMaterial color="#d4a373" />
        </mesh>
        <mesh position={[0, -0.22, 0.24]}>
          <boxGeometry args={[0.04, 0.32, 0.04]} />
          <meshStandardMaterial color="#ffb703" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.22, -0.24]}>
          <boxGeometry args={[0.04, 0.32, 0.04]} />
          <meshStandardMaterial color="#ffb703" metalness={0.8} />
        </mesh>
      </group>

      <group ref={headNeckGroupRef} position={[0, 0.78, 0.4]}>
        <mesh position={[0, 0.26, 0.12]} rotation={[0.38, 0, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.23, 0.58, 12]} />
          <meshStandardMaterial color="#c68a4c" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.54, 0.28]} rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.25, 0.25, 0.44]} />
          <meshStandardMaterial color="#c68a4c" roughness={0.55} />
        </mesh>
        <group position={[0, 0.48, 0.48]}>
          <mesh>
            <boxGeometry args={[0.23, 0.21, 0.19]} />
            <meshStandardMaterial color="#fdf0d5" />
          </mesh>
          <mesh position={[-0.06, -0.02, 0.1]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#4a2c11" />
          </mesh>
          <mesh position={[0.06, -0.02, 0.1]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#4a2c11" />
          </mesh>
        </group>
        <mesh position={[0, 0.44, 0.02]} rotation={[0.38, 0, 0]}>
          <boxGeometry args={[0.09, 0.62, 0.16]} />
          <meshStandardMaterial color="#4a2c11" roughness={0.8} />
        </mesh>
        <mesh position={[-0.09, 0.68, 0.2]} rotation={[0.1, 0, -0.2]}>
          <coneGeometry args={[0.045, 0.16, 8]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0.09, 0.68, 0.2]} rotation={[0.1, 0, 0.2]}>
          <coneGeometry args={[0.045, 0.16, 8]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[-0.14, 0.56, 0.33]}>
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0.14, 0.56, 0.33]}>
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>

      <mesh position={[0, 0.58, -0.44]} rotation={[-0.4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.09, 0.48, 8]} />
        <meshStandardMaterial color="#4a2c11" />
      </mesh>

      <group ref={leftFrontLegRef} position={[-0.17, 0.28, 0.26]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.32, 10]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.085, 0.08, 0.11]} />
          <meshStandardMaterial color="#2b180a" />
        </mesh>
      </group>

      <group ref={rightFrontLegRef} position={[0.17, 0.28, 0.26]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.32, 10]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.085, 0.08, 0.11]} />
          <meshStandardMaterial color="#2b180a" />
        </mesh>
      </group>

      <group ref={leftBackLegRef} position={[-0.17, 0.28, -0.26]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.32, 10]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.085, 0.08, 0.11]} />
          <meshStandardMaterial color="#2b180a" />
        </mesh>
      </group>

      <group ref={rightBackLegRef} position={[0.17, 0.28, -0.26]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.32, 10]} />
          <meshStandardMaterial color="#c68a4c" />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.085, 0.08, 0.11]} />
          <meshStandardMaterial color="#2b180a" />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  8. CAMERA-RELATIVE WASD & ORBIT CONTROL ENGINE (UNTOUCHED)
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
        const speedMultiplier = isMounted ? 4.8 : 3.5;
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
      orbitRef.current.target.y = THREE.MathUtils.lerp(orbitRef.current.target.y, py + (isMounted ? 1.2 : 0.8), 0.1);
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
      maxDistance={14.0}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.46}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
    />
  );
}

/** -------------------------------------------------------------
 *  9. HIGH-QUALITY STYLIZED STORYBOOK PLAYER AVATAR
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
      groupRef.current.position.y = 0.68;

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

      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.45;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.45;

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
    <group ref={groupRef} position={[0, 0, 0]}>
      <group ref={headGroupRef} position={[0, 0.96, 0]}>
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
          <capsuleGeometry args={[0.26, 0.38, 8, 16]} />
          <meshStandardMaterial color={outfitColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.18, 0.2]}>
          <torusGeometry args={[0.14, 0.03, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      <group ref={leftArmRef} position={[-0.32, 0.58, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.052, 0.05, 0.32, 10]} />
          <meshStandardMaterial color={outfitColor} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.046, 10, 10]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.32, 0.58, 0]}>
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
 *  10. COZY STORYBOOK COTTAGE & DIORAMA TERRAIN
 * ------------------------------------------------------------- */
function CozyCottage({ position = [-2.6, 0.1, -2.4], rotation = 0.45 }) {
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
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#a7c957" roughness={0.75} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  MAIN SCENE WITH ORGANIC ASYMMETRICAL STORYBOOK VILLAGE WORLD
 * ------------------------------------------------------------- */
export default function GardenScene({ character, resetCameraSignal, isMounted, toggleMount }) {
  const [targetPos, setTargetPos] = useState([0, 0]);
  const playerGroupRef = useRef();
  const horsePosRef = useRef([-2.8, 0.8]);

  return (
    <Canvas shadows camera={{ position: [0, 4.5, 7.0], fov: 42 }}>
      <color attach="background" args={['#e6f2ee']} />
      <fogExp2 attach="fog" color="#dbebe6" density={0.007} />
      
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

      {/* 1. MARKET CORNER (ASYMMETRICAL VILLAGE SQUARE) */}
      <VillageSquare position={[-1.5, 0, -5.5]} />

      {/* 2. 5 ORGANIC NEIGHBORHOOD COTTAGES */}
      <VillageHouses />

      {/* 3. 12 ANIMATED VILLAGER NPCS & PETS */}
      <Villagers />

      {/* Player's Home Cottage & Yard */}
      <NaturalDioramaTerrain onGroundClick={setTargetPos} />
      <CozyCottage position={[-2.6, 0.1, -2.4]} rotation={0.45} />
      <HomeHorseStable position={[-3.5, 0, 0.8]} />

      {/* Player Character & Companions */}
      <StorybookHuman character={character} targetPos={targetPos} groupRef={playerGroupRef} isMounted={isMounted} />
      <StorybookHorse isMounted={isMounted} playerGroupRef={playerGroupRef} horsePosRef={horsePosRef} />
      <SmallCompanionPet petType={character?.pet1_type || 'bunny'} targetGroupRef={playerGroupRef} />

      <Sparkles count={80} scale={18} size={3.5} speed={0.4} color="#ffe5ec" />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={18} blur={2.5} />
    </Canvas>
  );
}
