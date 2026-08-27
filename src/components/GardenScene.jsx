import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles, Outlines } from '@react-three/drei';
import * as THREE from 'three';
import VillageSquare from './VillageSquare';
import VillageHouses from './VillageHouses';
import Villagers, { VILLAGERS_DATA } from './Villagers';

/** -------------------------------------------------------------
 *  TOON OUTLINE FOR HERO MODELS
 * ------------------------------------------------------------- */
function ToonOutline({ thickness = 0.03, color = '#2b2013' }) {
  return <Outlines thickness={thickness} color={color} screenspace={false} />;
}

/** -------------------------------------------------------------
 *  STRICT MATHEMATICAL PLAYABLE BOUNDARY SANITIZER
 *  VILLAGE WIDTH = 100 (X: -50 to +50)
 *  VILLAGE DEPTH = 80  (Z: -40 to +40)
 * ------------------------------------------------------------- */
const OBSTACLES = [
  { name: 'Cottage', x: -14.0, z: -12.0, radius: 1.8 },
  { name: 'Pond', x: -13.0, z: -7.5, radius: 1.5 },
  { name: 'Fountain', x: 0, z: -22.0, radius: 1.6 },
];

function sanitizePlayableTarget(x, z) {
  // STRICT MATHEMATICAL CLAMPING: X: [-48.5, 48.5], Z: [-38.5, 38.5]
  let targetX = THREE.MathUtils.clamp(x, -48.5, 48.5);
  let targetZ = THREE.MathUtils.clamp(z, -38.5, 38.5);

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

  // Re-clamp after obstacle avoidance to ensure boundary is NEVER breached
  targetX = THREE.MathUtils.clamp(targetX, -48.5, 48.5);
  targetZ = THREE.MathUtils.clamp(targetZ, -38.5, 38.5);

  return [targetX, targetZ];
}

/** -------------------------------------------------------------
 *  DETAILED CUTE 3D ORANGE CAT PET 🐱
 * ------------------------------------------------------------- */
function OrangeCatPet({ targetGroupRef, activePet }) {
  const catRef = useRef();

  useFrame((state) => {
    if (!catRef.current || activePet !== 'cat' || !targetGroupRef.current) return;

    const clock = state.clock.getElapsedTime();
    const px = targetGroupRef.current.position.x;
    const pz = targetGroupRef.current.position.z;

    const rawTargetX = px - 0.75;
    const rawTargetZ = pz + 0.75;

    // Strict boundary clamping for Cat
    const targetX = THREE.MathUtils.clamp(rawTargetX, -48.5, 48.5);
    const targetZ = THREE.MathUtils.clamp(rawTargetZ, -38.5, 38.5);

    const dx = targetX - catRef.current.position.x;
    const dz = targetZ - catRef.current.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 0.12) {
      catRef.current.position.x += dx * 0.085;
      catRef.current.position.z += dz * 0.085;
      catRef.current.rotation.y = Math.atan2(dx, dz);
      catRef.current.position.y = Math.abs(Math.sin(clock * 14)) * 0.05;
    } else {
      catRef.current.position.y = 0;
    }
  });

  if (activePet !== 'cat') return null;

  return (
    <group ref={catRef} position={[-14.75, 0, -11.25]} scale={0.7}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.34, 0.28, 0.65]} />
        <meshToonMaterial color="#f4a261" />
        <ToonOutline thickness={0.025} />
      </mesh>

      {/* Tabby Stripes */}
      {[-0.15, 0, 0.15].map((z, i) => (
        <mesh key={i} position={[0, 0.43, z]}>
          <boxGeometry args={[0.35, 0.02, 0.08]} />
          <meshToonMaterial color="#e76f51" />
        </mesh>
      ))}

      {/* Cat Head */}
      <group position={[0, 0.48, 0.38]}>
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.32, 0.36]} />
          <meshToonMaterial color="#f4a261" />
          <ToonOutline thickness={0.025} />
        </mesh>

        <mesh position={[0, -0.06, 0.19]}>
          <boxGeometry args={[0.22, 0.14, 0.04]} />
          <meshToonMaterial color="#ffffff" />
        </mesh>

        <mesh position={[0, -0.02, 0.21]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshToonMaterial color="#ffb5a7" />
        </mesh>

        <mesh position={[-0.1, 0.06, 0.19]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshToonMaterial color="#2a9d8f" />
        </mesh>
        <mesh position={[0.1, 0.06, 0.19]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshToonMaterial color="#2a9d8f" />
        </mesh>

        <mesh position={[-0.14, 0.22, 0]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.08, 0.18, 4]} />
          <meshToonMaterial color="#e76f51" />
        </mesh>
        <mesh position={[0.14, 0.22, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.08, 0.18, 4]} />
          <meshToonMaterial color="#e76f51" />
        </mesh>
      </group>

      {/* 4 Paws */}
      {[
        [-0.12, 0.1, 0.22],
        [0.12, 0.1, 0.22],
        [-0.12, 0.1, -0.22],
        [0.12, 0.1, -0.22],
      ].map((p, idx) => (
        <mesh key={idx} position={p} castShadow>
          <boxGeometry args={[0.1, 0.2, 0.12]} />
          <meshToonMaterial color="#ffffff" />
        </mesh>
      ))}

      <group position={[0, 0.35, -0.34]} rotation={[0.6, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.45, 8]} />
          <meshToonMaterial color="#e76f51" />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  STYLIZED LOW-POLY HORSE COMPANION & MOUNT 🐴
 * ------------------------------------------------------------- */
function StorybookHorse({ isMounted, playerGroupRef, activePet }) {
  const horseRef = useRef();

  useFrame((state) => {
    if (!horseRef.current) return;
    if (isMounted && playerGroupRef.current) {
      horseRef.current.position.x = playerGroupRef.current.position.x;
      horseRef.current.position.z = playerGroupRef.current.position.z;
      horseRef.current.rotation.y = playerGroupRef.current.rotation.y;
    }
  });

  if (activePet !== 'horse' && !isMounted) return null;

  return (
    <group ref={horseRef} position={[-15.2, 0, -9.5]} scale={1.15}>
      <group position={[0, 0.75, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.74, 1.25]} />
          <meshToonMaterial color="#c68a4c" />
          <ToonOutline thickness={0.03} />
        </mesh>
        <mesh position={[0.37, -0.05, 0.15]} castShadow>
          <boxGeometry args={[0.02, 0.45, 0.55]} />
          <meshToonMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[0, 1.15, 0.42]} rotation={[0.36, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.65, 0.44]} />
          <meshToonMaterial color="#c68a4c" />
          <ToonOutline thickness={0.025} />
        </mesh>
      </group>

      <group position={[0, 1.48, 0.72]}>
        <mesh castShadow>
          <boxGeometry args={[0.44, 0.44, 0.58]} />
          <meshToonMaterial color="#c68a4c" />
          <ToonOutline thickness={0.025} />
        </mesh>
      </group>

      {[
        [-0.26, 0.28, 0.42],
        [0.26, 0.28, 0.42],
        [-0.26, 0.28, -0.42],
        [0.26, 0.28, -0.42],
      ].map((p, idx) => (
        <group key={idx} position={p}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.52, 0.18]} />
            <meshToonMaterial color="#c68a4c" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SteppedLowPolyTerrain({ onGroundClick }) {
  return (
    <group>
      {/* 100 x 80 Playable Village Floor (X: [-50, 50], Z: [-40, 40]) */}
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
        <planeGeometry args={[100, 80]} />
        <meshToonMaterial color="#94c77d" />
      </mesh>
    </group>
  );
}

function DualWaterfallRiverValley() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[-2.0, 0.005, -10.0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[3.8, 65.0]} />
        <meshToonMaterial color="#3a86c8" transparent opacity={0.88} />
      </mesh>

      <group position={[-2.0, 0.35, -10.0]} rotation={[0, 0.4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.45, 4.4]} />
          <meshToonMaterial color="#8a7e70" />
        </mesh>
      </group>
    </group>
  );
}

function VillageWindingPaths() {
  return (
    <group position={[0, 0.015, 0]}>
      <mesh position={[-7.0, 0, -17.0]} rotation={[-Math.PI / 2, 0, -0.6]}>
        <planeGeometry args={[1.8, 26.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  100+ DENSE FOREST BOUNDARY ENCLOSING THE 100x80 VILLAGE AREA
 * ------------------------------------------------------------- */
function DenseMultiColorForestBoundary() {
  const FOREST_TREES = [];

  // Outer non-playable forest boundary surrounding X: [-50, 50], Z: [-40, 40]
  for (let angle = 0; angle < Math.PI * 2; angle += 0.06) {
    const rx = 52 + (Math.sin(angle * 6) * 3);
    const rz = 42 + (Math.cos(angle * 6) * 3);
    const x = Math.cos(angle) * rx;
    const z = Math.sin(angle) * rz;
    const type = Math.floor((Math.sin(x + z) + 1) * 2) % 4;
    FOREST_TREES.push({ x, z, type });
  }

  return (
    <group>
      {FOREST_TREES.map((t, idx) => (
        <group key={idx} position={[t.x, 0, t.z]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.32, 2.2, 8]} />
            <meshToonMaterial color="#5c381e" />
          </mesh>

          {t.type === 0 && (
            <mesh position={[0, 2.6, 0]} castShadow>
              <sphereGeometry args={[1.4, 16, 16]} />
              <meshToonMaterial color="#2d6a4f" />
            </mesh>
          )}

          {t.type === 1 && (
            <mesh position={[0, 2.6, 0]} castShadow>
              <sphereGeometry args={[1.35, 16, 16]} />
              <meshToonMaterial color="#ffb5a7" />
            </mesh>
          )}

          {t.type === 2 && (
            <mesh position={[0, 2.6, 0]} castShadow>
              <sphereGeometry args={[1.3, 16, 16]} />
              <meshToonMaterial color="#7209b7" />
            </mesh>
          )}

          {t.type === 3 && (
            <mesh position={[0, 2.5, 0]} castShadow>
              <coneGeometry args={[1.2, 2.8, 8]} />
              <meshToonMaterial color="#1b4332" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  18-20% LARGE FLOWER FARM & VEGETABLE FARMS 🌽🌻
 * ------------------------------------------------------------- */
function LargeCropFarms() {
  return (
    <group>
      {/* 18-20% Large Flower Farm Plot */}
      <group position={[28, 0, 22]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 14]} />
          <meshToonMaterial color="#8a7e70" />
        </mesh>
        {[-6, 0, 6].map((x, i) =>
          [-4, 0, 4].map((z, j) => (
            <group key={`${i}-${j}`} position={[x, 0, z]}>
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.04, 0.06, 1.0, 6]} />
                <meshToonMaterial color="#38b000" />
              </mesh>
              <mesh position={[0, 1.0, 0]}>
                <sphereGeometry args={[0.35, 12, 12]} />
                <meshToonMaterial color={i === 0 ? '#ff4d6d' : i === 1 ? '#ffb703' : '#7209b7'} />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* Vegetable Farm Plot */}
      <group position={[-28, 0, 22]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 14]} />
          <meshToonMaterial color="#8a7e70" />
        </mesh>
        {[-6, 0, 6].map((x, i) =>
          [-4, 0, 4].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.2, z]} castShadow>
              <sphereGeometry args={[0.42, 12, 12]} />
              <meshToonMaterial color="#fb8500" />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}

function CharacterCameraController({ playerGroupRef, targetPos, setTargetPos, isMounted, toggleMount, setNearVillager, onOpenDialogue }) {
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

    // Strict boundary enforcement on player position
    const clampedX = THREE.MathUtils.clamp(targetPos[0], -48.5, 48.5);
    const clampedZ = THREE.MathUtils.clamp(targetPos[1], -38.5, 38.5);

    const dx = clampedX - groupRef.current.position.x;
    const dz = clampedZ - groupRef.current.position.z;
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

    // Re-clamp
    groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -48.5, 48.5);
    groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -38.5, 38.5);
  });

  return (
    <group ref={groupRef} position={[-14.0, 0, -12.0]}>
      {/* 1. OVERSIZED BLACK COWL HEAD (40-45% TOTAL HEIGHT) */}
      <group position={[0, 0.96, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshToonMaterial color="#1c1c1e" />
          <ToonOutline thickness={0.03} color="#0a0a0c" />
        </mesh>

        <mesh position={[-0.18, 0.38, -0.05]} rotation={[-0.1, 0, -0.15]}>
          <coneGeometry args={[0.09, 0.32, 4]} />
          <meshToonMaterial color="#1c1c1e" />
          <ToonOutline thickness={0.025} color="#0a0a0c" />
        </mesh>
        <mesh position={[0.18, 0.38, -0.05]} rotation={[-0.1, 0, 0.15]}>
          <coneGeometry args={[0.09, 0.32, 4]} />
          <meshToonMaterial color="#1c1c1e" />
          <ToonOutline thickness={0.025} color="#0a0a0c" />
        </mesh>

        <mesh position={[0, -0.1, 0.22]}>
          <boxGeometry args={[0.32, 0.2, 0.12]} />
          <meshToonMaterial color="#fae1c5" />
        </mesh>

        <mesh position={[-0.12, 0.06, 0.34]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.14, 0.035, 0.04]} />
          <meshToonMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.12, 0.06, 0.34]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.14, 0.035, 0.04]} />
          <meshToonMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* 2. CHUNKY GREY ARMOR & GOLD UTILITY BELT */}
      <group position={[0, 0.46, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.38, 0.32]} />
          <meshToonMaterial color="#4a4e69" />
          <ToonOutline thickness={0.03} color="#0a0a0c" />
        </mesh>

        <mesh position={[0, -0.14, 0]} castShadow>
          <boxGeometry args={[0.49, 0.1, 0.35]} />
          <meshToonMaterial color="#c68a4c" />
        </mesh>

        {[-0.18, 0, 0.18].map((x, i) => (
          <mesh key={i} position={[x, -0.14, 0.19]} castShadow>
            <boxGeometry args={[0.1, 0.11, 0.06]} />
            <meshToonMaterial color="#e0a96d" />
          </mesh>
        ))}

        <group position={[0, 0.04, -0.18]} rotation={[0.2, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.52, 0.58, 0.04]} />
            <meshToonMaterial color="#1c1c1e" />
          </mesh>
        </group>
      </group>

      {/* 3. ARMS & LEGS */}
      <group position={[-0.28, 0.44, 0]} rotation={[0, 0, 0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.28, 10]} />
          <meshToonMaterial color="#1c1c1e" />
        </mesh>
      </group>
      <group position={[0.28, 0.44, 0]} rotation={[0, 0, -0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.28, 10]} />
          <meshToonMaterial color="#1c1c1e" />
        </mesh>
      </group>

      <group position={[-0.14, 0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.24, 0.2]} />
          <meshToonMaterial color="#111113" />
        </mesh>
      </group>
      <group position={[0.14, 0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.24, 0.2]} />
          <meshToonMaterial color="#111113" />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  MAIN GARDEN SCENE
 * ------------------------------------------------------------- */
export default function GardenScene({ character, resetCameraSignal, isMounted, toggleMount, setNearVillager, onOpenDialogue, activePet = 'none' }) {
  const [targetPos, setTargetPos] = useState([-14.0, -12.0]);
  const playerGroupRef = useRef();

  return (
    <Canvas shadows camera={{ position: [-14.0, 4.5, -5.0], fov: 42 }}>
      <color attach="background" args={['#bfe8f7']} />
      <fog attach="fog" args={['#bfe8f7', 35, 140]} />

      <hemisphereLight skyColor="#bfe8f7" groundColor="#94c77d" intensity={0.9} />
      <directionalLight position={[6, 8, 4]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />

      <CharacterCameraController
        playerGroupRef={playerGroupRef}
        targetPos={targetPos}
        setTargetPos={setTargetPos}
        isMounted={isMounted}
        toggleMount={toggleMount}
        setNearVillager={setNearVillager}
        onOpenDialogue={onOpenDialogue}
      />

      <SteppedLowPolyTerrain onGroundClick={setTargetPos} />
      <DualWaterfallRiverValley />
      <VillageWindingPaths />

      {/* 🌲🌸 DENSE MULTI-COLOR FOREST BOUNDARY ENCLOSING THE 100x80 PLAYABLE VILLAGE */}
      <DenseMultiColorForestBoundary />

      {/* 🌽🌻 18-20% LARGE FLOWER FARM & VEGETABLE FARMS */}
      <LargeCropFarms />

      <VillageSquare position={[0, 0, -22.0]} />
      <VillageHouses />
      <Villagers />

      {/* 🦇🖤 CHIBI DARK KNIGHT MAIN PLAYER */}
      <StorybookHuman character={character} targetPos={targetPos} groupRef={playerGroupRef} isMounted={isMounted} />

      {/* 🐴 HORSE PET COMPANION & MOUNT */}
      <StorybookHorse isMounted={isMounted} playerGroupRef={playerGroupRef} activePet={activePet} />

      {/* 🐱 3D ORANGE CAT PET COMPANION */}
      <OrangeCatPet targetGroupRef={playerGroupRef} activePet={activePet} />

      <Sparkles count={120} scale={60} size={3.5} speed={0.4} color="#ffe5ec" />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={60} blur={2.5} />
    </Canvas>
  );
}
