import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles, Outlines } from '@react-three/drei';
import * as THREE from 'three';
import VillageSquare from './VillageSquare';
import VillageHouses from './VillageHouses';
import Villagers, { VILLAGERS_DATA } from './Villagers';

/** -------------------------------------------------------------
 *  TOON OUTLINE FOR HERO MODELS (HUMAN, HORSE, PET)
 * ------------------------------------------------------------- */
function ToonOutline({ thickness = 0.03, color = '#2b2013' }) {
  return <Outlines thickness={thickness} color={color} screenspace={false} />;
}

/** -------------------------------------------------------------
 *  COLLISION & OBSTACLE SANITIZER (UNRESTRICTED OPEN-WORLD)
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
 *  ANIMATED 3D SNAIL MESSENGER CRAWLING ALONG VILLAGE PATHS 🐌💌
 * ------------------------------------------------------------- */
function AnimatedSnailMessenger({ delivery, onReachDestination }) {
  const snailRef = useRef();

  useFrame((state, delta) => {
    if (!snailRef.current || !delivery) return;

    const clock = state.clock.getElapsedTime();
    const startX = delivery.startX ?? -2.8;
    const startZ = delivery.startZ ?? 4.5;
    const targetX = delivery.targetX ?? -24.0;
    const targetZ = delivery.targetZ ?? -26.0;

    delivery.progress = (delivery.progress || 0) + delta * 0.12;

    if (delivery.progress >= 1.0) {
      if (onReachDestination) onReachDestination(delivery.id);
      return;
    }

    const currentX = THREE.MathUtils.lerp(startX, targetX, delivery.progress);
    const currentZ = THREE.MathUtils.lerp(startZ, targetZ, delivery.progress);

    snailRef.current.position.x = currentX;
    snailRef.current.position.z = currentZ;
    snailRef.current.position.y = 0.06 + Math.abs(Math.sin(clock * 6)) * 0.03;

    const angle = Math.atan2(targetX - startX, targetZ - startZ);
    snailRef.current.rotation.y = angle;
  });

  return (
    <group ref={snailRef} position={[-2.8, 0.06, 4.5]} scale={0.65}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.42, 6, 12]} rotation={[Math.PI / 2, 0, 0]} />
        <meshToonMaterial color="#ffb703" />
        <ToonOutline thickness={0.02} />
      </mesh>

      <group position={[0, 0.28, 0.22]}>
        <mesh position={[-0.06, 0.12, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.18, 6]} />
          <meshToonMaterial color="#ffb703" />
        </mesh>
        <mesh position={[-0.06, 0.22, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshToonMaterial color="#222222" />
        </mesh>

        <mesh position={[0.06, 0.12, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.18, 6]} />
          <meshToonMaterial color="#ffb703" />
        </mesh>
        <mesh position={[0.06, 0.22, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshToonMaterial color="#222222" />
        </mesh>
      </group>

      <group position={[0, 0.32, -0.08]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.22, 0.12, 12, 24]} />
          <meshToonMaterial color="#e07a5f" />
          <ToonOutline thickness={0.02} />
        </mesh>
      </group>

      <group position={[0, 0.54, -0.08]} rotation={[-0.2, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.04, 0.24]} />
          <meshToonMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} />
          <meshToonMaterial color="#e63946" />
        </mesh>
      </group>

      <Sparkles position={[0, 0.6, 0]} count={6} scale={0.5} size={2.5} speed={0.5} color="#ffd23f" />
    </group>
  );
}

/** -------------------------------------------------------------
 *  1. STEPPED LOW-POLY TERRACED TERRAIN & CLIFFS
 * ------------------------------------------------------------- */
function SteppedLowPolyTerrain({ onGroundClick }) {
  return (
    <group>
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
        <planeGeometry args={[600, 600]} />
        <meshToonMaterial color="#94c77d" />
      </mesh>

      <group position={[0, 0, -45.0]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[140, 0.8, 25]} />
          <meshToonMaterial color="#8ab874" />
        </mesh>
        <mesh position={[0, 1.4, -12]} castShadow receiveShadow>
          <boxGeometry args={[160, 1.2, 28]} />
          <meshToonMaterial color="#7ca965" />
        </mesh>
        {[-35, -15, 15, 35].map((x, idx) => (
          <mesh key={idx} position={[x, 0.8, -2.0]} castShadow>
            <boxGeometry args={[4.5, 1.6, 4.5]} />
            <meshToonMaterial color="#a89f91" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  2. DUAL WATERFALLS & WINDING RIVER VALLEY (STRAY MESH REMOVED) 🌊
 * ------------------------------------------------------------- */
function DualWaterfallRiverValley() {
  return (
    <group position={[0, 0, 0]}>
      {/* Blue River Streams */}
      <mesh position={[-2.0, 0.005, -10.0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[3.8, 65.0]} />
        <meshToonMaterial color="#3a86c8" transparent opacity={0.88} />
      </mesh>
      <mesh position={[24.0, 0.005, -28.0]} rotation={[-Math.PI / 2, 0, -0.5]}>
        <planeGeometry args={[3.4, 45.0]} />
        <meshToonMaterial color="#3a86c8" transparent opacity={0.88} />
      </mesh>

      {/* Lily Pads & Riverbank Rocks */}
      {[-8, -2, 6, 18, 28].map((z, idx) => (
        <group key={idx} position={[-2.0 + idx * 0.8, 0.01, -10.0 + idx * 4]}>
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 0.02, 10]} />
            <meshToonMaterial color="#38b000" />
          </mesh>
          <mesh position={[0.45, 0.05, 0.2]} castShadow>
            <dodecahedronGeometry args={[0.18]} />
            <meshToonMaterial color="#8a7e70" />
          </mesh>
        </group>
      ))}

      {/* Curved Wooden Arch Bridges */}
      <group position={[-2.0, 0.35, -10.0]} rotation={[0, 0.4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.45, 4.4]} />
          <meshToonMaterial color="#8a7e70" />
        </mesh>
        <mesh position={[-1.1, 0.55, 0]} castShadow>
          <boxGeometry args={[0.12, 0.6, 4.4]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[1.1, 0.55, 0]} castShadow>
          <boxGeometry args={[0.12, 0.6, 4.4]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
      </group>
      <group position={[20.0, 0.35, -28.0]} rotation={[0, -0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.45, 4.4]} />
          <meshToonMaterial color="#8a7e70" />
        </mesh>
        <mesh position={[-1.1, 0.55, 0]} castShadow>
          <boxGeometry args={[0.12, 0.6, 4.4]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[1.1, 0.55, 0]} castShadow>
          <boxGeometry args={[0.12, 0.6, 4.4]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
      </group>

      {/* Cascading Cliff Waterfalls (Clean Sparkles Only - NO FLOATING BOX MESHES) */}
      <group position={[-18.0, 2.5, -42.0]}>
        <Sparkles count={45} scale={4.5} size={5} speed={1.2} color="#ffffff" />
      </group>
      <group position={[22.0, 2.8, -44.0]}>
        <Sparkles count={50} scale={4.5} size={5} speed={1.2} color="#ffffff" />
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  3. CONNECTED VILLAGE PATH NETWORK & STREET LANTERNS
 * ------------------------------------------------------------- */
function VillageWindingPaths() {
  return (
    <group position={[0, 0.015, 0]}>
      <mesh position={[-7.0, 0, -17.0]} rotation={[-Math.PI / 2, 0, -0.6]}>
        <planeGeometry args={[1.8, 26.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
      <mesh position={[-26.0, 0, -35.0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[1.6, 42.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
      <mesh position={[24.0, 0, -34.0]} rotation={[-Math.PI / 2, 0, -0.3]}>
        <planeGeometry args={[1.6, 44.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>

      {/* Street Lamps Along Dirt Paths */}
      {[
        [-12.0, 0.1, -15.0],
        [-18.0, 0.1, -25.0],
        [14.0, 0.1, -18.0],
        [20.0, 0.1, -30.0],
        [-8.0, 0.1, -5.0],
        [8.0, 0.1, -5.0],
      ].map((p, idx) => (
        <group key={idx} position={p}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 1.5, 8]} />
            <meshToonMaterial color="#3d2616" />
          </mesh>
          <mesh position={[0, 1.55, 0]} castShadow>
            <boxGeometry args={[0.18, 0.24, 0.18]} />
            <meshToonMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  4. DENSE VILLAGE SCATTER & PROPS (FILLING EMPTY GREEN SPACES) 🌳🍄🪵
 * ------------------------------------------------------------- */
function VillageScatterProps() {
  return (
    <group>
      {/* Extra Tree Groves */}
      {[
        [-30, 0, -10], [-35, 0, -2], [-10, 0, -35], [10, 0, -38],
        [35, 0, -10], [42, 0, -4], [-40, 0, 10], [38, 0, 10],
      ].map((p, idx) => (
        <group key={`tree-${idx}`} position={p}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.28, 1.8, 10]} />
            <meshToonMaterial color="#6b4c35" />
          </mesh>
          <mesh position={[0, 2.1, 0]} castShadow>
            <sphereGeometry args={[1.2, 18, 18]} />
            <meshToonMaterial color={idx % 2 === 0 ? '#38b000' : '#2d6a4f'} />
          </mesh>
        </group>
      ))}

      {/* Red Mushrooms & Wild Bushes */}
      {[
        [-6, 0, -8], [6, 0, -8], [-20, 0, -18], [22, 0, -16],
        [-15, 0, 5], [15, 0, 5], [-5, 0, 12], [5, 0, 12],
      ].map((p, idx) => (
        <group key={`bush-${idx}`} position={p}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.35, 12, 12]} />
            <meshToonMaterial color="#70e000" />
          </mesh>
          <group position={[0.4, 0.1, 0.2]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.02, 0.03, 0.16, 6]} />
              <meshToonMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <coneGeometry args={[0.08, 0.12, 8]} />
              <meshToonMaterial color="#e63946" />
            </mesh>
          </group>
        </group>
      ))}

      {/* Hay Bales & Firewood Logs */}
      {[
        [-18.5, 0, -7.5],
        [18.5, 0, -7.5],
        [-22.0, 0, 5.0],
      ].map((p, idx) => (
        <group key={`prop-${idx}`} position={p}>
          <mesh position={[0, 0.25, 0]} rotation={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.55, 12]} />
            <meshToonMaterial color="#ffb703" />
          </mesh>
          <mesh position={[0.5, 0.12, 0.3]} rotation={[Math.PI / 2, 0, 0.3]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
            <meshToonMaterial color="#5c381e" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GiantSunflowerField() {
  return (
    <group position={[45, 0, -35]}>
      {[-8, 0, 8].map((x, i) =>
        [-6, 2, 10].map((z, j) => (
          <group key={`${i}-${j}`} position={[x, 0, z]}>
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 1.2, 8]} />
              <meshToonMaterial color="#6bab4f" />
            </mesh>
            <group position={[0, 1.2, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.42, 16, 16]} />
                <meshToonMaterial color="#ffd23f" />
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
            </mesh>
            <mesh position={[0, 2.1, 0]} castShadow>
              <sphereGeometry args={[1.1, 20, 20]} />
              <meshToonMaterial color="#38b000" />
            </mesh>
            <mesh position={[0.4, 2.2, 0.8]} castShadow>
              <sphereGeometry args={[0.14, 10, 10]} />
              <meshToonMaterial color="#e63946" />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

function ChunkyCow({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={0.9}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.75, 0.65, 1.15]} />
        <meshToonMaterial color="#ffffff" />
        <ToonOutline thickness={0.03} />
      </mesh>
      <mesh position={[0.38, 0.62, 0.2]} castShadow>
        <boxGeometry args={[0.02, 0.35, 0.45]} />
        <meshToonMaterial color="#6b4c35" />
      </mesh>
      <group position={[0, 0.72, 0.62]}>
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.42, 0.44]} />
          <meshToonMaterial color="#ffffff" />
        </mesh>
      </group>
      {[
        [-0.26, 0.22, 0.38],
        [0.26, 0.22, 0.38],
        [-0.26, 0.22, -0.38],
        [0.26, 0.22, -0.38],
      ].map((p, idx) => (
        <group key={idx} position={p}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.44, 0.16]} />
            <meshToonMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FluffySheep({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={0.85}>
      <group position={[0, 0.5, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshToonMaterial color="#fdf0d5" />
          <ToonOutline thickness={0.03} />
        </mesh>
      </group>
      <group position={[0, 0.58, 0.52]}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.32, 0.36]} />
          <meshToonMaterial color="#4a4e69" />
        </mesh>
      </group>
      {[
        [-0.2, 0.18, 0.28],
        [0.2, 0.18, 0.28],
        [-0.2, 0.18, -0.28],
        [0.2, 0.18, -0.28],
      ].map((p, idx) => (
        <mesh key={idx} position={p} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.36, 8]} />
          <meshToonMaterial color="#4a4e69" />
        </mesh>
      ))}
    </group>
  );
}

function ChunkyChicken({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={0.5}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.48, 0.1]}>
        <boxGeometry args={[0.06, 0.12, 0.1]} />
        <meshToonMaterial color="#e63946" />
      </mesh>
      <mesh position={[0, 0.32, 0.26]}>
        <coneGeometry args={[0.06, 0.12, 6]} rotation={[Math.PI / 2, 0, 0]} />
        <meshToonMaterial color="#ffb703" />
      </mesh>
    </group>
  );
}

function ChunkyDuck({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={0.45}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.28, 0.12]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshToonMaterial color="#2a9d8f" />
      </mesh>
      <mesh position={[0, 0.26, 0.25]}>
        <boxGeometry args={[0.12, 0.04, 0.14]} />
        <meshToonMaterial color="#ffb703" />
      </mesh>
    </group>
  );
}

function ChunkyFox({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={0.75}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.34, 0.32, 0.65]} />
        <meshToonMaterial color="#f4a261" />
        <ToonOutline thickness={0.025} />
      </mesh>
      <group position={[0, 0.48, 0.38]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.3, 0.34]} />
          <meshToonMaterial color="#f4a261" />
        </mesh>
      </group>
    </group>
  );
}

function ChunkyRabbit({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={0.45}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.08, 0.42, 0.02]} rotation={[0, 0, -0.1]}>
        <capsuleGeometry args={[0.04, 0.22, 4, 8]} />
        <meshToonMaterial color="#ffffff" />
      </mesh>
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

function DistantBirds() {
  const birdsGroupRef = useRef();

  useFrame((state) => {
    if (birdsGroupRef.current) {
      const t = state.clock.getElapsedTime() * 0.4;
      birdsGroupRef.current.position.x = Math.sin(t * 0.5) * 18;
      birdsGroupRef.current.position.y = 10.5 + Math.cos(t * 0.3) * 0.5;
      birdsGroupRef.current.rotation.y = Math.cos(t * 0.5) * 0.3;
    }
  });

  return (
    <group ref={birdsGroupRef} position={[0, 10.5, -28]}>
      {[-1.8, 0, 1.8].map((offset, idx) => (
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
      </mesh>
    </group>
  );
}

function DualPetCompanions({ petType = 'bunny', targetGroupRef }) {
  const pet1Ref = useRef();
  const pet2Ref = useRef();

  useFrame((state) => {
    if (!targetGroupRef.current) return;

    const clock = state.clock.getElapsedTime();
    const px = targetGroupRef.current.position.x;
    const pz = targetGroupRef.current.position.z;

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
      }
    }

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
      }
    }
  });

  return (
    <group>
      <group ref={pet1Ref} position={[-14.65, 0, -11.35]} scale={0.55}>
        <group position={[0, 0.18, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshToonMaterial color="#ffffff" />
            <ToonOutline thickness={0.02} />
          </mesh>
        </group>
      </group>

      <group ref={pet2Ref} position={[-13.35, 0, -11.35]} scale={0.55}>
        <group position={[0, 0.18, 0]}>
          <mesh position={[0, 0.08, 0.12]} castShadow>
            <sphereGeometry args={[0.13, 14, 14]} />
            <meshToonMaterial color="#f4a261" />
            <ToonOutline thickness={0.02} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

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
      <group position={[0, 0.88, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshToonMaterial color={character?.skin_tone || '#f2c9a0'} />
          <ToonOutline thickness={0.03} />
        </mesh>
        <mesh position={[0, 0.12, -0.02]}>
          <sphereGeometry args={[0.36, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshToonMaterial color={character?.hair_color || '#7a4a2b'} />
        </mesh>
        <mesh position={[0, 0.18, 0.12]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.35, 0.04, 12, 24]} />
          <meshToonMaterial color="#e63946" />
        </mesh>
      </group>

      <group position={[0, 0.44, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.44, 0.36]} />
          <meshToonMaterial color={character?.outfit_color || '#c9a7e0'} />
          <ToonOutline thickness={0.03} />
        </mesh>
      </group>

      <group position={[-0.14, 0.12, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.24, 10]} />
          <meshToonMaterial color="#457b9d" />
        </mesh>
      </group>
      <group position={[0.14, 0.12, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.24, 10]} />
          <meshToonMaterial color="#457b9d" />
        </mesh>
      </group>
    </group>
  );
}

function CozyCottage({ position = [-14.0, 0.1, -12.0], rotation = 0.45 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.35, 1.5]} />
        <meshToonMaterial color="#f4f1de" />
      </mesh>
      <group position={[0, 1.35, 0]}>
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.45, 0.85, 4]} />
          <meshToonMaterial color="#e63946" />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[2.08, 0.08, 1.74]} />
          <meshToonMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  MAIN SCENE WITH DENSE SCATTER & ZERO STRAY MESHES
 * ------------------------------------------------------------- */
export default function GardenScene({ character, resetCameraSignal, isMounted, toggleMount, setNearVillager, onOpenDialogue, activeSnailDeliveries, onRemoveSnailDelivery }) {
  const [targetPos, setTargetPos] = useState([-14.0, -12.0]);
  const playerGroupRef = useRef();
  const horsePosRef = useRef([-15.2, -9.5]);

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
        resetSignal={resetCameraSignal}
        isMounted={isMounted}
        toggleMount={toggleMount}
        setNearVillager={setNearVillager}
        onOpenDialogue={onOpenDialogue}
      />

      <SteppedLowPolyTerrain onGroundClick={setTargetPos} />
      <DualWaterfallRiverValley />
      <FluffyClouds />
      <DistantBirds />
      <DistantCountrysideHills />
      <VillageWindingPaths />
      <VillageScatterProps />
      
      {/* Cartoon Farm Biomes */}
      <GiantSunflowerField />
      <AppleOrchardField />

      {/* 🐴🐄🐑🐔🦆🦊🐰 Farm Animals Grazing in Pastures */}
      <group>
        <ChunkyCow position={[-38.0, 0, -15.0]} rotation={0.6} />
        <ChunkyCow position={[-42.0, 0, -22.0]} rotation={-0.8} />
        <FluffySheep position={[36.0, 0, -20.0]} rotation={-0.4} />
        <FluffySheep position={[40.0, 0, -14.0]} rotation={0.8} />
        <ChunkyChicken position={[-16.0, 0, 14.0]} rotation={0.3} />
        <ChunkyChicken position={[-14.5, 0, 16.0]} rotation={-0.5} />
        <ChunkyDuck position={[-2.0, 0.05, -8.0]} rotation={0.8} />
        <ChunkyDuck position={[-1.2, 0.05, -12.0]} rotation={-0.4} />
        <ChunkyFox position={[-18.0, 0, 18.0]} rotation={1.2} />
        <ChunkyRabbit position={[16.0, 0, 18.0]} rotation={-0.8} />
        <ChunkyRabbit position={[18.0, 0, 15.0]} rotation={0.4} />
      </group>

      {/* 🐌💌 ANIMATED 3D SNAIL MESSENGERS CRAWLING ALONG VILLAGE PATHS */}
      {activeSnailDeliveries && activeSnailDeliveries.map((delivery) => (
        <AnimatedSnailMessenger
          key={delivery.id}
          delivery={delivery}
          onReachDestination={onRemoveSnailDelivery}
        />
      ))}

      <VillageSquare position={[0, 0, -22.0]} />
      <VillageHouses />
      <Villagers />

      <CozyCottage position={[-16.6, 0.1, -14.4]} rotation={0.45} />
      <HomeHorseStable position={[-17.5, 0, -11.2]} />

      <StorybookHuman character={character} targetPos={targetPos} groupRef={playerGroupRef} isMounted={isMounted} />
      <StorybookHorse isMounted={isMounted} playerGroupRef={playerGroupRef} horsePosRef={horsePosRef} />
      
      {/* Dual Pet Companions */}
      <DualPetCompanions petType={character?.pet1_type || 'bunny'} targetGroupRef={playerGroupRef} />

      <Sparkles count={120} scale={60} size={3.5} speed={0.4} color="#ffe5ec" />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={60} blur={2.5} />
    </Canvas>
  );
}
