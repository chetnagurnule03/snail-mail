import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sky, Sparkles, Outlines } from '@react-three/drei';
import * as THREE from 'three';
import VillageSquare from './VillageSquare';
import VillageHouses from './VillageHouses';
import Villagers, { VILLAGERS_DATA } from './Villagers';

/** -------------------------------------------------------------
 *  TOON OUTLINE HELPER FOR CHIBI STORYBOOK AESTHETIC
 * ------------------------------------------------------------- */
function ToonOutline({ thickness = 0.03, color = '#2b2013' }) {
  return <Outlines thickness={thickness} color={color} screenspace={false} />;
}

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
  const maxRadius = 45.0;
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
      <meshToonMaterial color="#94c77d" />
    </mesh>
  );
}

/** -------------------------------------------------------------
 *  2. WINDING STREAM & 3D STONE ARCH BRIDGE 🌊
 * ------------------------------------------------------------- */
function StoneRiverBridge() {
  return (
    <group position={[-2.0, 0, -10.0]}>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[3.2, 34.0]} />
        <meshToonMaterial color="#3a86c8" transparent opacity={0.88} />
      </mesh>

      <group position={[0, 0.35, 0]} rotation={[0, 0.4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.45, 4.2]} />
          <meshToonMaterial color="#8a7e70" />
          <ToonOutline thickness={0.03} />
        </mesh>
        <mesh position={[-1.0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.12, 0.6, 4.2]} />
          <meshToonMaterial color="#6b4c35" />
          <ToonOutline thickness={0.025} />
        </mesh>
        <mesh position={[1.0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.12, 0.6, 4.2]} />
          <meshToonMaterial color="#6b4c35" />
          <ToonOutline thickness={0.025} />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  3. LONG WINDING COUNTRYSIDE PATH NETWORK
 * ------------------------------------------------------------- */
function VillageWindingPaths() {
  return (
    <group position={[0, 0.015, 0]}>
      <mesh position={[-7.0, 0, -17.0]} rotation={[-Math.PI / 2, 0, -0.6]}>
        <planeGeometry args={[1.5, 18.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
      <mesh position={[-16.0, 0, -23.0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[1.4, 20.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
      <mesh position={[14.0, 0, -24.0]} rotation={[-Math.PI / 2, 0, -0.3]}>
        <planeGeometry args={[1.4, 22.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
      <mesh position={[-16.0, 0, 0.0]} rotation={[-Math.PI / 2, 0, -0.9]}>
        <planeGeometry args={[1.4, 24.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
      <mesh position={[16.0, 0, 0.0]} rotation={[-Math.PI / 2, 0, 0.8]}>
        <planeGeometry args={[1.4, 25.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  4. NATURAL FILLERS BETWEEN HOUSES
 * ------------------------------------------------------------- */
function CountrysideNaturalFillers() {
  return (
    <group>
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
    </group>
  );
}

function DistantCountrysideHills() {
  return (
    <group position={[0, -1.8, 0]}>
      <mesh position={[-42, 1.2, -50]} scale={[32, 5.5, 32]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshToonMaterial color="#8ab874" />
      </mesh>
      <mesh position={[42, 1.0, -52]} scale={[34, 5.8, 34]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshToonMaterial color="#9ec891" />
      </mesh>
      <mesh position={[0, 0.8, -55]} scale={[38, 6.2, 38]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshToonMaterial color="#7cb268" />
      </mesh>
    </group>
  );
}

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
      ].map((c, idx) => (
        <group key={idx} position={c.pos} scale={c.scale}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.0, 16, 16]} />
            <meshToonMaterial color="#ffffff" transparent opacity={0.92} />
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
            <meshToonMaterial color="#556b2f" />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.2, 0.02, 0.08]} />
            <meshToonMaterial color="#556b2f" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function HomeHorseStable({ position = [-15.0, 0, -9.5] }) {
  return (
    <group position={position} rotation={[0, 0.3, 0]}>
      <mesh position={[-0.6, 0.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.7, 1.4]} />
        <meshToonMaterial color="#8c5a3c" />
        <ToonOutline thickness={0.02} />
      </mesh>
      <mesh position={[0, 0.35, -0.6]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.08]} />
        <meshToonMaterial color="#8c5a3c" />
        <ToonOutline thickness={0.02} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  5. DUAL PET COMPANION FOLLOW SYSTEM (PET 1 + PET 2) 🐰🐶
 * ------------------------------------------------------------- */
function DualPetCompanions({ petType = 'bunny', targetGroupRef }) {
  const pet1Ref = useRef();
  const pet2Ref = useRef();

  useFrame((state) => {
    if (!targetGroupRef.current) return;

    const clock = state.clock.getElapsedTime();
    const px = targetGroupRef.current.position.x;
    const pz = targetGroupRef.current.position.z;

    // Pet 1 (Left Flank)
    if (pet1Ref.current) {
      const t1x = px - 0.65;
      const t1z = pz + 0.65;
      const d1x = t1x - pet1Ref.current.position.x;
      const d1z = t1z - pet1Ref.current.position.z;
      const dist1 = Math.sqrt(d1x * d1x + d1z * d1z);

      if (dist1 > 0.1) {
        pet1Ref.current.position.x += d1x * 0.08;
        pet1Ref.current.position.z += d1z * 0.08;
        pet1Ref.current.rotation.y = Math.atan2(d1x, d1z);
        pet1Ref.current.position.y = Math.abs(Math.sin(clock * 16)) * 0.08;
      } else {
        pet1Ref.current.position.y = Math.sin(clock * 3) * 0.015;
      }
    }

    // Pet 2 (Right Flank - Playful Companion Pup)
    if (pet2Ref.current) {
      const t2x = px + 0.65;
      const t2z = pz + 0.65;
      const d2x = t2x - pet2Ref.current.position.x;
      const d2z = t2z - pet2Ref.current.position.z;
      const dist2 = Math.sqrt(d2x * d2x + d2z * d2z);

      if (dist2 > 0.1) {
        pet2Ref.current.position.x += d2x * 0.08;
        pet2Ref.current.position.z += d2z * 0.08;
        pet2Ref.current.rotation.y = Math.atan2(d2x, d2z);
        pet2Ref.current.position.y = Math.abs(Math.sin(clock * 14)) * 0.07;
      } else {
        pet2Ref.current.position.y = Math.sin(clock * 2.5) * 0.015;
      }
    }
  });

  return (
    <group>
      {/* Pet 1 (Customized Companion) */}
      <group ref={pet1Ref} position={[-14.65, 0, -11.35]} scale={0.55}>
        <group position={[0, 0.18, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshToonMaterial color="#ffffff" />
            <ToonOutline thickness={0.02} />
          </mesh>
        </group>
      </group>

      {/* Pet 2 (Playful Companion Pup 🐶) */}
      <group ref={pet2Ref} position={[-13.35, 0, -11.35]} scale={0.55}>
        <group position={[0, 0.18, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshToonMaterial color="#f4a261" />
            <ToonOutline thickness={0.02} />
          </mesh>
          <mesh position={[0, 0.12, 0.12]} castShadow>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshToonMaterial color="#f4a261" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  6. PINTO / PAINT STORYBOOK HORSE 🐴 (CHESTNUT + WHITE + BLONDE MANE)
 * ------------------------------------------------------------- */
function StorybookHorse({ isMounted, playerGroupRef, horsePosRef }) {
  const horseRef = useRef();
  const leftFrontLegRef = useRef();
  const rightFrontLegRef = useRef();
  const leftBackLegRef = useRef();
  const rightBackLegRef = useRef();

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
      }
    }

    if (horsePosRef && horseRef.current) {
      horsePosRef.current = [horseRef.current.position.x, horseRef.current.position.z];
    }
  });

  return (
    <group ref={horseRef} position={[-15.2, 0, -9.5]} scale={1.05}>
      <group position={[0, 0.62, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.32, 0.82, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshToonMaterial color="#c68a4c" />
          <ToonOutline thickness={0.03} />
        </mesh>
        <mesh position={[0.08, 0.05, 0.12]} castShadow>
          <sphereGeometry args={[0.24, 12, 12]} />
          <meshToonMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[0, 0.78, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.15, 0.48]} />
          <meshToonMaterial color="#6a3b1d" />
          <ToonOutline thickness={0.02} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.44, 0.04, 0.44]} />
          <meshToonMaterial color="#e9c46a" />
        </mesh>
      </group>

      <group position={[0, 0.82, 0.42]}>
        <mesh position={[0, 0.28, 0.14]} rotation={[0.36, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.24, 0.62, 12]} />
          <meshToonMaterial color="#c68a4c" />
          <ToonOutline thickness={0.025} />
        </mesh>
        <mesh position={[0, 0.58, 0.3]} rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.26, 0.26, 0.46]} />
          <meshToonMaterial color="#c68a4c" />
          <ToonOutline thickness={0.025} />
        </mesh>
        <mesh position={[0, 0.48, 0.02]} rotation={[0.36, 0, 0]}>
          <boxGeometry args={[0.09, 0.65, 0.16]} />
          <meshToonMaterial color="#f4e2bb" />
          <ToonOutline thickness={0.02} />
        </mesh>
      </group>

      <group ref={leftFrontLegRef} position={[-0.18, 0.3, 0.28]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 10]} />
          <meshToonMaterial color="#ffffff" />
          <ToonOutline thickness={0.02} />
        </mesh>
      </group>
      <group ref={rightFrontLegRef} position={[0.18, 0.3, 0.28]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 10]} />
          <meshToonMaterial color="#c68a4c" />
          <ToonOutline thickness={0.02} />
        </mesh>
      </group>
      <group ref={leftBackLegRef} position={[-0.18, 0.3, -0.28]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 10]} />
          <meshToonMaterial color="#c68a4c" />
          <ToonOutline thickness={0.02} />
        </mesh>
      </group>
      <group ref={rightBackLegRef} position={[0.18, 0.3, -0.28]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.34, 10]} />
          <meshToonMaterial color="#ffffff" />
          <ToonOutline thickness={0.02} />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  7. CAMERA-RELATIVE WASD & ORBIT CONTROL ENGINE (UNTOUCHED)
 * ------------------------------------------------------------- */
function CharacterCameraController({ playerGroupRef, targetPos, setTargetPos, resetSignal, isMounted, toggleMount, setNearVillager, onOpenDialogue }) {
  const { camera } = useThree();
  const orbitRef = useRef();
  const keysPressed = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = true;
      if (k === 'r' && orbitRef.current) {
        orbitRef.current.reset();
      }
      if (k === 'e') {
        if (!isMounted && onOpenDialogue) {
          const px = playerGroupRef.current?.position.x || 0;
          const pz = playerGroupRef.current?.position.z || 0;
          for (const v of VILLAGERS_DATA) {
            const dx = px - v.pos[0];
            const dz = pz - v.pos[2];
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 2.5) {
              onOpenDialogue(v);
              return;
            }
          }
        }
        if (toggleMount) toggleMount();
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
  }, [toggleMount, isMounted, onOpenDialogue, playerGroupRef]);

  useFrame((state, delta) => {
    if (!playerGroupRef.current) return;

    const px = playerGroupRef.current.position.x;
    const pz = playerGroupRef.current.position.z;

    let foundVillager = null;
    for (const v of VILLAGERS_DATA) {
      const dx = px - v.pos[0];
      const dz = pz - v.pos[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 2.5) {
        foundVillager = v;
        break;
      }
    }
    if (setNearVillager) setNearVillager(foundVillager);

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
      orbitRef.current.target.x = THREE.MathUtils.lerp(orbitRef.current.target.x, px, 0.1);
      orbitRef.current.target.y = THREE.MathUtils.lerp(orbitRef.current.target.y, playerGroupRef.current.position.y + (isMounted ? 1.25 : 0.85), 0.1);
      orbitRef.current.target.z = THREE.MathUtils.lerp(orbitRef.current.target.z, pz, 0.1);
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

function StorybookHuman({ character, targetPos, groupRef, isMounted }) {
  useFrame((state) => {
    if (!groupRef.current || !targetPos) return;
    const dx = targetPos[0] - groupRef.current.position.x;
    const dz = targetPos[1] - groupRef.current.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const clock = state.clock.getElapsedTime();

    if (isMounted) {
      groupRef.current.position.y = 0.72;
    } else {
      if (dist > 0.06) {
        groupRef.current.position.x += dx * 0.085;
        groupRef.current.position.z += dz * 0.085;
        const targetAngle = Math.atan2(dx, dz);
        groupRef.current.rotation.y = targetAngle;
        groupRef.current.position.y = Math.abs(Math.sin(clock * 14)) * 0.06;
      }
    }
  });

  return (
    <group ref={groupRef} position={[-14.0, 0, -12.0]}>
      <group position={[0, 0.94, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshToonMaterial color={character?.skin_tone || '#f2c9a0'} />
          <ToonOutline thickness={0.03} />
        </mesh>
      </group>
      <mesh position={[0, 0.48, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.38, 8, 16]} />
        <meshToonMaterial color={character?.outfit_color || '#c9a7e0'} />
        <ToonOutline thickness={0.03} />
      </mesh>
    </group>
  );
}

function CozyCottage({ position = [-14.0, 0.1, -12.0], rotation = 0.45 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.85, 1.8, 1.65]} />
        <meshToonMaterial color="#faf0ca" />
        <ToonOutline thickness={0.03} />
      </mesh>
      <group position={[0, 2.1, 0]}>
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.35, 4]} />
          <meshToonMaterial color="#c96850" />
          <ToonOutline thickness={0.03} />
        </mesh>
      </group>
    </group>
  );
}

function NaturalDioramaTerrain({ position = [-14.0, 0, -12.0], onGroundClick }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={(e) => {
        e.stopPropagation();
        onGroundClick(sanitizePlayableTarget(e.point.x, e.point.z));
      }}>
        <circleGeometry args={[7, 32]} />
        <meshToonMaterial color="#a7c957" />
      </mesh>
    </group>
  );
}

function StorybookTree({ position, scale = 1, rotation = 0 }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.28, 1.4, 16]} />
        <meshToonMaterial color="#6b4c35" />
        <ToonOutline thickness={0.025} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshToonMaterial color="#84b574" />
        <ToonOutline thickness={0.03} />
      </mesh>
    </group>
  );
}

function MushroomGroup({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.04, 0.07, 0.36, 12]} />
        <meshToonMaterial color="#fdf0d5" />
        <ToonOutline thickness={0.015} />
      </mesh>
    </group>
  );
}

function SoftFlowerCluster({ position, color = '#ffb5a7' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshToonMaterial color={color} />
        <ToonOutline thickness={0.012} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  MAIN SCENE WITH DUAL PETS & SPEC SHEET UPGRADES
 * ------------------------------------------------------------- */
export default function GardenScene({ character, resetCameraSignal, isMounted, toggleMount, setNearVillager, onOpenDialogue }) {
  const [targetPos, setTargetPos] = useState([-14.0, -12.0]);
  const playerGroupRef = useRef();
  const horsePosRef = useRef([-15.2, -9.5]);

  return (
    <Canvas shadows camera={{ position: [-14.0, 4.5, -5.0], fov: 42 }}>
      <color attach="background" args={['#bfe8f7']} />
      <fog attach="fog" args={['#bfe8f7', 12, 35]} />
      
      <hemisphereLight skyColor="#bfe8f7" groundColor="#94c77d" intensity={0.9} />
      <directionalLight position={[6, 8, 4]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />

      <CharacterCameraController
        playerGroupRef={playerGroupRef}
        targetPos={targetPos}
        setTargetPos={setTargetPos}
        resetSignal={resetCameraSignal}
        isMounted={isMounted}
        toggleMount={toggleMount}
        setNearVillager={setNearVillager}
        onOpenDialogue={onOpenDialogue}
      />

      <ExtendedMeadowTerrain />
      <StoneRiverBridge />
      <FluffyClouds />
      <DistantBirds />
      <DistantCountrysideHills />
      <VillageWindingPaths />
      <CountrysideNaturalFillers />

      <VillageSquare position={[0, 0, -22.0]} />
      <VillageHouses />
      <Villagers />

      <NaturalDioramaTerrain position={[-14.0, 0, -12.0]} onGroundClick={setTargetPos} />
      <CozyCottage position={[-16.6, 0.1, -14.4]} rotation={0.45} />
      <HomeHorseStable position={[-17.5, 0, -11.2]} />

      <StorybookHuman character={character} targetPos={targetPos} groupRef={playerGroupRef} isMounted={isMounted} />
      <StorybookHorse isMounted={isMounted} playerGroupRef={playerGroupRef} horsePosRef={horsePosRef} />
      
      {/* Dual Pet Companions (Pet 1 + Pet 2) */}
      <DualPetCompanions petType={character?.pet1_type || 'bunny'} targetGroupRef={playerGroupRef} />

      <Sparkles count={100} scale={28} size={3.5} speed={0.4} color="#ffe5ec" />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={28} blur={2.5} />
    </Canvas>
  );
}
