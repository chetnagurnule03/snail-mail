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
 *  COLLISION & BOUNDARY HELPER (OPEN-WORLD RADIUS = 150m)
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
  const maxRadius = 150.0;
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
 *  1. CONTINUOUS OPEN-WORLD MEADOW TERRAIN (300x300m)
 * ------------------------------------------------------------- */
function ExtendedMeadowTerrain({ onGroundClick }) {
  return (
    <mesh
      position={[0, -0.06, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        const pointX = e.point.x;
        const pointZ = e.point.z;
        const sanitized = sanitizePlayableTarget(pointX, pointZ);
        onGroundClick(sanitized);
      }}
    >
      <planeGeometry args={[300, 300]} />
      <meshToonMaterial color="#94c77d" />
    </mesh>
  );
}

/** -------------------------------------------------------------
 *  2. CASCADING 3D WATERFALL & RIVER VALLEY 🌊
 * ------------------------------------------------------------- */
function WaterfallRiverValley() {
  return (
    <group position={[-2.0, 0, -10.0]}>
      {/* 🌊 Winding Blue Stream Water */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[3.5, 60.0]} />
        <meshToonMaterial color="#3a86c8" transparent opacity={0.88} />
      </mesh>

      {/* 🌉 Stone Arch Bridge */}
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

      {/* 🌊 Cascading 3D Waterfall Backdrop */}
      <group position={[12.0, 3.2, -28.0]} rotation={[0.2, -0.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.2, 6.5, 0.4]} />
          <meshToonMaterial color="#48cae4" transparent opacity={0.92} />
          <ToonOutline thickness={0.03} />
        </mesh>
        <Sparkles count={35} scale={4} size={4} speed={0.8} color="#ffffff" />
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
        <planeGeometry args={[1.5, 24.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
      <mesh position={[-26.0, 0, -35.0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[1.4, 40.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
      <mesh position={[24.0, 0, -34.0]} rotation={[-Math.PI / 2, 0, -0.3]}>
        <planeGeometry args={[1.4, 42.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  4. GIANT SUNFLOWERS & APPLE ORCHARD BIOMES (REFERENCE INSPIRED)
 * ------------------------------------------------------------- */
function GiantSunflowerField() {
  return (
    <group position={[45, 0, -35]}>
      {[-8, 0, 8].map((x, i) =>
        [-6, 2, 10].map((z, j) => (
          <group key={`${i}-${j}`} position={[x, 0, z]}>
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 1.2, 8]} />
              <meshToonMaterial color="#6bab4f" />
              <ToonOutline thickness={0.02} />
            </mesh>
            <group position={[0, 1.2, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.42, 16, 16]} />
                <meshToonMaterial color="#ffd23f" />
                <ToonOutline thickness={0.03} />
              </mesh>
              <mesh position={[0, 0, 0.15]}>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshToonMaterial color="#4a2c11" />
              </mesh>
            </group>
          </group>
        ))
      )}
    </group>
  );
}

function AppleOrchardField() {
  return (
    <group position={[-45, 0, -35]}>
      {[-8, 0, 8].map((x, i) =>
        [-6, 2, 10].map((z, j) => (
          <group key={`${i}-${j}`} position={[x, 0, z]}>
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.28, 1.8, 10]} />
              <meshToonMaterial color="#6b4c35" />
              <ToonOutline thickness={0.025} />
            </mesh>
            <mesh position={[0, 2.1, 0]} castShadow>
              <sphereGeometry args={[1.1, 20, 20]} />
              <meshToonMaterial color="#38b000" />
              <ToonOutline thickness={0.03} />
            </mesh>
            {/* Red Apples */}
            <mesh position={[0.4, 2.2, 0.8]} castShadow>
              <sphereGeometry args={[0.14, 10, 10]} />
              <meshToonMaterial color="#e63946" />
            </mesh>
            <mesh position={[-0.4, 1.9, 0.8]} castShadow>
              <sphereGeometry args={[0.14, 10, 10]} />
              <meshToonMaterial color="#e63946" />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

function DistantCountrysideHills() {
  return (
    <group position={[0, -1.8, 0]}>
      <mesh position={[-75, 1.2, -90]} scale={[52, 8.5, 52]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshToonMaterial color="#8ab874" />
      </mesh>
      <mesh position={[75, 1.0, -92]} scale={[54, 8.8, 54]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshToonMaterial color="#9ec891" />
      </mesh>
    </group>
  );
}

function FluffyClouds() {
  const cloudsRef = useRef();

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.x = (state.clock.getElapsedTime() * 0.15) % 60 - 30;
    }
  });

  return (
    <group ref={cloudsRef}>
      {[
        { pos: [-40, 12.5, -48], scale: 3.2 },
        { pos: [-10, 13.2, -52], scale: 3.8 },
        { pos: [26, 12.8, -46], scale: 3.0 },
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

function HomeHorseStable({ position = [-15.0, 0, -9.5] }) {
  return (
    <group position={position} rotation={[0, 0.3, 0]}>
      <mesh position={[-0.6, 0.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.7, 1.4]} />
        <meshToonMaterial color="#8c5a3c" />
        <ToonOutline thickness={0.02} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  5. DUAL PET FOLLOW SYSTEM (BUNNY + STORYBOOK CARTOON CAT 🐱)
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

    // Pet 2 (Right Flank - Cute Cartoon Cat 🐱)
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
      {/* Pet 1 (Custom Companion) */}
      <group ref={pet1Ref} position={[-14.65, 0, -11.35]} scale={0.55}>
        <group position={[0, 0.18, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshToonMaterial color="#ffffff" />
            <ToonOutline thickness={0.02} />
          </mesh>
        </group>
      </group>

      {/* Pet 2 (Cute Storybook Cartoon Cat 🐱) */}
      <group ref={pet2Ref} position={[-13.35, 0, -11.35]} scale={0.55}>
        <group position={[0, 0.18, 0]}>
          {/* Head & Pointy Ears */}
          <mesh position={[0, 0.08, 0.12]} castShadow>
            <sphereGeometry args={[0.13, 14, 14]} />
            <meshToonMaterial color="#f4a261" />
            <ToonOutline thickness={0.02} />
          </mesh>
          <mesh position={[-0.07, 0.22, 0.12]} rotation={[0, 0, -0.2]}>
            <coneGeometry args={[0.04, 0.12, 6]} />
            <meshToonMaterial color="#f4a261" />
          </mesh>
          <mesh position={[0.07, 0.22, 0.12]} rotation={[0, 0, 0.2]}>
            <coneGeometry args={[0.04, 0.12, 6]} />
            <meshToonMaterial color="#f4a261" />
          </mesh>
          {/* Body & Tail */}
          <mesh castShadow>
            <capsuleGeometry args={[0.12, 0.2, 6, 12]} rotation={[Math.PI / 2, 0, 0]} />
            <meshToonMaterial color="#f4a261" />
            <ToonOutline thickness={0.02} />
          </mesh>
          <mesh position={[0, 0.12, -0.16]} rotation={[-0.4, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 6]} />
            <meshToonMaterial color="#f4a261" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  6. PINTO STORYBOOK HORSE 🐴
 * ------------------------------------------------------------- */
function StorybookHorse({ isMounted, playerGroupRef, horsePosRef }) {
  const horseRef = useRef();

  useFrame((state) => {
    if (!horseRef.current) return;
    if (isMounted && playerGroupRef.current) {
      horseRef.current.position.x = playerGroupRef.current.position.x;
      horseRef.current.position.z = playerGroupRef.current.position.z;
      horseRef.current.rotation.y = playerGroupRef.current.rotation.y;
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
      </group>
      <group position={[0, 0.78, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.15, 0.48]} />
          <meshToonMaterial color="#6a3b1d" />
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
        const speedMultiplier = isMounted ? 5.8 : 4.2;
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
      maxDistance={18.0}
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

/** -------------------------------------------------------------
 *  MAIN SCENE WITH CARTOON FARM ASSETS & CAT PET
 * ------------------------------------------------------------- */
export default function GardenScene({ character, resetCameraSignal, isMounted, toggleMount, setNearVillager, onOpenDialogue }) {
  const [targetPos, setTargetPos] = useState([-14.0, -12.0]);
  const playerGroupRef = useRef();
  const horsePosRef = useRef([-15.2, -9.5]);

  return (
    <Canvas shadows camera={{ position: [-14.0, 4.5, -5.0], fov: 42 }}>
      <color attach="background" args={['#bfe8f7']} />
      <fog attach="fog" args={['#bfe8f7', 18, 70]} />
      
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

      <ExtendedMeadowTerrain onGroundClick={setTargetPos} />
      <WaterfallRiverValley />
      <FluffyClouds />
      <DistantBirds />
      <DistantCountrysideHills />
      <VillageWindingPaths />
      
      {/* Cartoon Farm Biomes */}
      <GiantSunflowerField />
      <AppleOrchardField />

      <VillageSquare position={[0, 0, -22.0]} />
      <VillageHouses />
      <Villagers />

      <CozyCottage position={[-16.6, 0.1, -14.4]} rotation={0.45} />
      <HomeHorseStable position={[-17.5, 0, -11.2]} />

      <StorybookHuman character={character} targetPos={targetPos} groupRef={playerGroupRef} isMounted={isMounted} />
      <StorybookHorse isMounted={isMounted} playerGroupRef={playerGroupRef} horsePosRef={horsePosRef} />
      
      {/* Dual Pet Companions (Pet 1 + Storybook Cat 🐱) */}
      <DualPetCompanions petType={character?.pet1_type || 'bunny'} targetGroupRef={playerGroupRef} />

      <Sparkles count={120} scale={50} size={3.5} speed={0.4} color="#ffe5ec" />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={50} blur={2.5} />
    </Canvas>
  );
}
