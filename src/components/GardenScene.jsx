import React, { useRef, useState, useEffect, useMemo } from 'react';
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
  { name: 'Fountain', x: 0, z: 0, radius: 2.2 },
];

function sanitizePlayableTarget(x, z) {
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

  targetX = THREE.MathUtils.clamp(targetX, -48.5, 48.5);
  targetZ = THREE.MathUtils.clamp(targetZ, -38.5, 38.5);

  return [targetX, targetZ];
}

/** -------------------------------------------------------------
 *  RADIAL 5-8 PETAL PROPORTIONAL FLOWER GEOMETRY 🌸
 * ------------------------------------------------------------- */
function AnatomicalPetalFlower({ position, color = '#ff4d6d', petalCount = 7 }) {
  const petals = useMemo(() => {
    const arr = [];
    const radius = 0.22;
    for (let i = 0; i < petalCount; i++) {
      const angle = i * ((Math.PI * 2) / petalCount);
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;
      arr.push({ px, pz, angle });
    }
    return arr;
  }, [petalCount]);

  return (
    <group position={position} scale={0.65}>
      {/* Green Stem */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.0, 8]} />
        <meshToonMaterial color="#38b000" />
      </mesh>

      {/* Two Green Leaves */}
      <mesh position={[-0.18, 0.4, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.35, 0.02, 0.15]} />
        <meshToonMaterial color="#2b9348" />
      </mesh>
      <mesh position={[0.18, 0.4, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.35, 0.02, 0.15]} />
        <meshToonMaterial color="#2b9348" />
      </mesh>

      {/* Flower Head Group at Top of Stem (y: 1.0) */}
      <group position={[0, 1.0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshToonMaterial color="#ffb703" />
        </mesh>

        {petals.map((p, idx) => (
          <mesh key={idx} position={[p.px, 0, p.pz]} rotation={[0, -p.angle, 0]} castShadow>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshToonMaterial color={color} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  2. LARGE DENSE FLOWER GARDEN PLOTS (40-100 FLOWERS PER PLOT) 🌸🌼
 * ------------------------------------------------------------- */
function LargeDenseFlowerPlots() {
  const plots = useMemo(() => {
    const list = [];
    const plotCenters = [
      { cx: -20, cz: -18, rows: 7, cols: 7, width: 8, depth: 8 },
      { cx: 20, cz: -18, rows: 7, cols: 7, width: 8, depth: 8 },
      { cx: -20, cz: 18, rows: 7, cols: 7, width: 8, depth: 8 },
      { cx: 20, cz: 18, rows: 7, cols: 7, width: 8, depth: 8 },
    ];
    const colors = ['#ff4d6d', '#e63946', '#ffb703', '#4cc9f0', '#7209b7', '#ffffff'];

    plotCenters.forEach((p, pIdx) => {
      const flowers = [];
      for (let r = 0; r < p.rows; r++) {
        for (let c = 0; c < p.cols; c++) {
          const fx = p.cx - p.width / 2 + (c * (p.width / (p.cols - 1))) + (Math.sin(r * 3 + c) * 0.2);
          const fz = p.cz - p.depth / 2 + (r * (p.depth / (p.rows - 1))) + (Math.cos(r + c * 3) * 0.2);
          const color = colors[(pIdx * 13 + r * 7 + c) % colors.length];
          flowers.push({ x: fx, z: fz, color, petals: 6 + ((r + c) % 3) });
        }
      }
      list.push({ ...p, flowers });
    });

    return list;
  }, []);

  return (
    <group>
      {plots.map((plot, pIdx) => (
        <group key={pIdx}>
          {/* Wooden Fence Perimeter */}
          <mesh position={[plot.cx, 0.25, plot.cz]} receiveShadow>
            <boxGeometry args={[plot.width + 0.6, 0.45, plot.depth + 0.6]} />
            <meshToonMaterial color="#7a4a2b" wireframe />
          </mesh>
          {plot.flowers.map((f, fIdx) => (
            <AnatomicalPetalFlower key={fIdx} position={[f.x, 0, f.z]} color={f.color} petalCount={f.petals} />
          ))}
        </group>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  3. VEGETABLE FARMS WITH CROP ROWS & PROPS 🌽🥕🎃
 * ------------------------------------------------------------- */
function FourMathematicalFarms() {
  return (
    <group>
      {/* 1. Southwest Farm (-32, 0, -26) */}
      <group position={[-32, 0, -26]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshToonMaterial color="#5c381e" />
        </mesh>
        {[-4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5].map((x, i) =>
          [-2.5, 0, 2.5].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.15, z]} castShadow>
              <coneGeometry args={[0.15, 0.45, 6]} />
              <meshToonMaterial color={i % 2 === 0 ? '#e76f51' : '#fb8500'} />
            </mesh>
          ))
        )}
        {/* Watering Can & Tool Props */}
        <mesh position={[5.2, 0.2, 3.2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.35, 8]} />
          <meshToonMaterial color="#457b9d" />
        </mesh>
      </group>

      {/* 2. Southeast Farm (+32, 0, -26) */}
      <group position={[32, 0, -26]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshToonMaterial color="#5c381e" />
        </mesh>
        {[-4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5].map((x, i) =>
          [-2.5, 0, 2.5].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.2, z]} castShadow>
              <sphereGeometry args={[0.22, 10, 10]} />
              <meshToonMaterial color={i % 2 === 0 ? '#e63946' : '#38b000'} />
            </mesh>
          ))
        )}
      </group>

      {/* 3. Northwest Farm (-32, 0, +26) */}
      <group position={[-32, 0, 26]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshToonMaterial color="#5c381e" />
        </mesh>
        {[-4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5].map((x, i) =>
          [-2.5, 0, 2.5].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.22, z]} castShadow>
              <sphereGeometry args={[0.25, 10, 10]} />
              <meshToonMaterial color={i % 2 === 0 ? '#2b9348' : '#ffb703'} />
            </mesh>
          ))
        )}
      </group>

      {/* 4. Northeast Farm (+32, 0, +26) */}
      <group position={[32, 0, 26]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshToonMaterial color="#5c381e" />
        </mesh>
        {[-4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5].map((x, i) =>
          [-2.5, 0, 2.5].map((z, j) => (
            <group key={`${i}-${j}`} position={[x, 0, z]}>
              <mesh position={[0, 0.45, 0]}>
                <cylinderGeometry args={[0.03, 0.04, 0.9, 6]} />
                <meshToonMaterial color="#e9c46a" />
              </mesh>
            </group>
          ))
        )}
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  4. FRUIT TREE ORCHARDS & BASKETS 🍎🍊🍋
 * ------------------------------------------------------------- */
function FruitOrchard() {
  const fruitTrees = useMemo(() => [
    { x: -18, z: 20, fruit: '#e63946' }, // Red Apple
    { x: -12, z: 20, fruit: '#fb8500' }, // Orange
    { x: -6, z: 20, fruit: '#ffb703' },  // Yellow Lemon
    { x: 6, z: 20, fruit: '#7209b7' },   // Purple Plum
    { x: 12, z: 20, fruit: '#e63946' },  // Red Apple
    { x: 18, z: 20, fruit: '#fb8500' },  // Orange
  ], []);

  return (
    <group>
      {fruitTrees.map((t, idx) => (
        <group key={idx} position={[t.x, 0, t.z]} scale={0.9}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.28, 2.0, 8]} />
            <meshToonMaterial color="#5c381e" />
          </mesh>

          <mesh position={[0, 2.3, 0]} castShadow>
            <sphereGeometry args={[1.2, 14, 14]} />
            <meshToonMaterial color="#38b000" />
            <ToonOutline thickness={0.03} color="#1b4332" />
          </mesh>

          {[
            [-0.5, 2.1, 0.5],
            [0.5, 2.2, 0.4],
            [0.0, 2.4, 0.7],
            [-0.5, 2.3, -0.5],
            [0.5, 2.0, -0.6],
          ].map((fp, fIdx) => (
            <mesh key={fIdx} position={fp} castShadow>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshToonMaterial color={t.fruit} />
            </mesh>
          ))}

          {/* Fruit Basket Under Tree */}
          <group position={[0.7, 0.12, 0.7]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.26, 0.2, 0.25, 8]} />
              <meshToonMaterial color="#8a7e70" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshToonMaterial color={t.fruit} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  8. CURVING RIVER STREAM & 2 WOODEN BRIDGES 🌊🌉
 * ------------------------------------------------------------- */
function CurvingStreamWithBridges() {
  return (
    <group position={[0, 0, 0]}>
      {/* Curving Blue Water Stream */}
      <mesh position={[-2.0, 0.005, 0.0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[3.8, 75.0]} />
        <meshToonMaterial color="#3a86c8" transparent opacity={0.88} />
      </mesh>

      {/* Wooden Arch Bridge 1 (North) */}
      <group position={[-6.0, 0.35, -14.0]} rotation={[0, 0.4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.35, 5.2]} />
          <meshToonMaterial color="#8a7e70" />
          <ToonOutline thickness={0.03} color="#2b1a0e" />
        </mesh>
      </group>

      {/* Wooden Arch Bridge 2 (South) */}
      <group position={[2.0, 0.35, 14.0]} rotation={[0, 0.4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.35, 5.2]} />
          <meshToonMaterial color="#8a7e70" />
          <ToonOutline thickness={0.03} color="#2b1a0e" />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  9. FENCED ANIMAL PASTURES (COWS, SHEEP, CHICKENS, HORSES) 🐮🐑
 * ------------------------------------------------------------- */
function FencedAnimalPastures() {
  return (
    <group>
      {/* Animal Pen 1: Cows & Sheep (-20, 0, -32) */}
      <group position={[-20, 0, -32]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[10, 0.5, 8]} />
          <meshToonMaterial color="#7a4a2b" wireframe />
        </mesh>

        {/* Spotty Cow 1 */}
        <group position={[-2.5, 0.55, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.85, 0.75, 1.3]} />
            <meshToonMaterial color="#f4f1de" />
          </mesh>
          <mesh position={[0.2, 0.2, 0.2]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshToonMaterial color="#2b2d42" />
          </mesh>
        </group>

        {/* Fluffy Sheep 1 */}
        <group position={[2.2, 0.45, 1.2]}>
          <mesh castShadow>
            <sphereGeometry args={[0.52, 12, 12]} />
            <meshToonMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.1, 0.45]}>
            <sphereGeometry args={[0.25, 10, 10]} />
            <meshToonMaterial color="#2b2d42" />
          </mesh>
        </group>
      </group>

      {/* Animal Pen 2: Chickens & Ducks (20, 0, -32) */}
      <group position={[20, 0, -32]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[10, 0.5, 8]} />
          <meshToonMaterial color="#7a4a2b" wireframe />
        </mesh>

        {/* Chickens */}
        {[-2, 0, 2].map((x, i) => (
          <mesh key={i} position={[x, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshToonMaterial color="#f4a261" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SmallBushesAndEnvironmentalDetails() {
  const bushes = useMemo(() => [
    { x: -10, z: -12, scale: 0.8 },
    { x: -18, z: -4, scale: 1.1 },
    { x: 12, z: -14, scale: 0.7 },
    { x: 18, z: -4, scale: 0.9 },
    { x: -6, z: 12, scale: 1.0 },
    { x: 14, z: 14, scale: 0.85 },
  ], []);

  return (
    <group>
      {bushes.map((b, idx) => (
        <mesh key={idx} position={[b.x, 0.35 * b.scale, b.z]} scale={b.scale} castShadow>
          <sphereGeometry args={[0.6, 12, 12]} />
          <meshToonMaterial color="#52b788" />
          <ToonOutline thickness={0.025} color="#1b4332" />
        </mesh>
      ))}
    </group>
  );
}

function VillageWindingPaths() {
  return (
    <group position={[0, 0.015, 0]}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.0, 75.0]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>
    </group>
  );
}

function DenseMultiColorForestBoundary() {
  const FOREST_TREES = useMemo(() => {
    const trees = [];
    for (let angle = 0; angle < Math.PI * 2; angle += 0.08) {
      const rx = 49 + Math.sin(angle * 5) * 3;
      const rz = 39 + Math.cos(angle * 5) * 3;
      const x = Math.cos(angle) * rx;
      const z = Math.sin(angle) * rz;
      const isPine = Math.floor((x + z) % 2) === 0;
      const scale = 0.85 + (Math.abs(Math.sin(x * z)) * 0.25);
      trees.push({ x, z, isPine, scale });
    }
    return trees;
  }, []);

  return (
    <group>
      {FOREST_TREES.map((t, idx) => (
        <group key={idx} position={[t.x, 0, t.z]} scale={t.scale}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.28, 1.8, 8]} />
            <meshToonMaterial color="#5c381e" />
          </mesh>

          {t.isPine ? (
            <mesh position={[0, 2.0, 0]} castShadow>
              <coneGeometry args={[1.0, 2.3, 8]} />
              <meshToonMaterial color="#1b4332" />
            </mesh>
          ) : (
            <mesh position={[0, 2.1, 0]} castShadow>
              <sphereGeometry args={[1.15, 14, 14]} />
              <meshToonMaterial color="#2d6a4f" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function AnimatedBatMessenger() {
  const batRef = useRef();

  useFrame((state) => {
    if (!batRef.current) return;
    const clock = state.clock.getElapsedTime();
    batRef.current.position.x = Math.sin(clock * 0.8) * 18.0;
    batRef.current.position.z = Math.cos(clock * 0.8) * 14.0 - 15.0;
    batRef.current.position.y = 6.5 + Math.sin(clock * 4.0) * 0.5;
    batRef.current.rotation.y = clock * 0.8 + Math.PI / 2;
  });

  return (
    <group ref={batRef} position={[0, 6.5, -15.0]} scale={0.85}>
      <mesh castShadow>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshToonMaterial color="#3d2b52" />
        <ToonOutline thickness={0.025} color="#12091f" />
      </mesh>
      <mesh position={[-0.45, 0, 0]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.4]} />
        <meshToonMaterial color="#7209b7" />
      </mesh>
      <mesh position={[0.45, 0, 0]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.4]} />
        <meshToonMaterial color="#7209b7" />
      </mesh>
      <mesh position={[0, -0.22, 0.1]}>
        <boxGeometry args={[0.32, 0.2, 0.04]} />
        <meshToonMaterial color="#f4f1de" />
      </mesh>
    </group>
  );
}

function OrangeCatPet({ targetGroupRef, activePet }) {
  const catRef = useRef();

  useFrame((state) => {
    if (!catRef.current || activePet !== 'cat' || !targetGroupRef.current) return;

    const clock = state.clock.getElapsedTime();
    const px = targetGroupRef.current.position.x;
    const pz = targetGroupRef.current.position.z;

    const rawTargetX = px - 0.75;
    const rawTargetZ = pz + 0.75;

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
    <group ref={catRef} position={[0, 0, 0]} scale={0.7}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.34, 0.28, 0.65]} />
        <meshToonMaterial color="#f4a261" />
        <ToonOutline thickness={0.025} />
      </mesh>

      {[-0.15, 0, 0.15].map((z, i) => (
        <mesh key={i} position={[0, 0.43, z]}>
          <boxGeometry args={[0.35, 0.02, 0.08]} />
          <meshToonMaterial color="#e76f51" />
        </mesh>
      ))}

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
    <group ref={horseRef} position={[0, 0, 0]} scale={1.15}>
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

    const clampedX = THREE.MathUtils.clamp(targetPos[0], -48.5, 48.5);
    const clampedZ = THREE.MathUtils.clamp(targetPos[1], -38.5, 38.5);

    const dx = clampedX - groupRef.current.position.x;
    const dz = clampedZ - groupRef.current.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const clock = state.clock.getElapsedTime();

    if (isMounted) {
      groupRef.current.position.y = 0.95;
    } else {
      if (dist > 0.06) {
        groupRef.current.position.x += dx * 0.085;
        groupRef.current.position.z += dz * 0.085;
        const targetAngle = Math.atan2(dx, dz);
        groupRef.current.rotation.y = targetAngle;
        groupRef.current.position.y = Math.abs(Math.sin(clock * 14)) * 0.06;
      }
    }

    groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -48.5, 48.5);
    groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -38.5, 38.5);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group position={[0, 0.96, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshToonMaterial color="#2b2d42" />
          <ToonOutline thickness={0.025} color="#141521" />
        </mesh>

        <mesh position={[-0.18, 0.38, -0.05]} rotation={[-0.1, 0, -0.15]}>
          <coneGeometry args={[0.09, 0.32, 4]} />
          <meshToonMaterial color="#2b2d42" />
          <ToonOutline thickness={0.025} color="#141521" />
        </mesh>
        <mesh position={[0.18, 0.38, -0.05]} rotation={[-0.1, 0, 0.15]}>
          <coneGeometry args={[0.09, 0.32, 4]} />
          <meshToonMaterial color="#2b2d42" />
          <ToonOutline thickness={0.025} color="#141521" />
        </mesh>

        <mesh position={[0, -0.1, 0.22]}>
          <boxGeometry args={[0.32, 0.2, 0.12]} />
          <meshToonMaterial color="#fae1c5" />
        </mesh>

        <mesh position={[-0.12, 0.06, 0.34]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.14, 0.035, 0.04]} />
          <meshToonMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.12, 0.06, 0.34]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.14, 0.035, 0.04]} />
          <meshToonMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
      </group>

      <group position={[0, 0.46, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.38, 0.32]} />
          <meshToonMaterial color="#3d405b" />
          <ToonOutline thickness={0.025} color="#141521" />
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
            <meshToonMaterial color="#2b2d42" />
          </mesh>
        </group>
      </group>

      <group position={[-0.28, 0.44, 0]} rotation={[0, 0, 0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.28, 10]} />
          <meshToonMaterial color="#2b2d42" />
        </mesh>
      </group>
      <group position={[0.28, 0.44, 0]} rotation={[0, 0, -0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.28, 10]} />
          <meshToonMaterial color="#2b2d42" />
        </mesh>
      </group>

      <group position={[-0.14, 0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.24, 0.2]} />
          <meshToonMaterial color="#1d1e2c" />
        </mesh>
      </group>
      <group position={[0.14, 0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.24, 0.2]} />
          <meshToonMaterial color="#1d1e2c" />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  MAIN GARDEN SCENE (DYNAMIC DAY / NIGHT CYCLE SUPPORT)
 * ------------------------------------------------------------- */
export default function GardenScene({ character, resetCameraSignal, isMounted, toggleMount, setNearVillager, onOpenDialogue, activePet = 'none', isNight = false }) {
  const [targetPos, setTargetPos] = useState([0.0, 0.0]);
  const playerGroupRef = useRef();

  return (
    <Canvas shadows camera={{ position: [0.0, 4.5, 8.0], fov: 42 }}>
      <color attach="background" args={[isNight ? '#1a0b2e' : '#bfe8f7']} />
      <fog attach="fog" args={[isNight ? '#1a0b2e' : '#bfe8f7', 35, 140]} />

      <ambientLight intensity={isNight ? 0.35 : 0.85} color={isNight ? '#8338ec' : '#ffffff'} />
      <hemisphereLight skyColor={isNight ? '#3a0ca3' : '#bfe8f7'} groundColor="#94c77d" intensity={isNight ? 0.4 : 0.8} />
      <directionalLight position={[12, 18, 10]} intensity={isNight ? 0.45 : 1.6} color={isNight ? '#4cc9f0' : '#ffffff'} castShadow shadow-mapSize={[2048, 2048]} />

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
      
      {/* 8. CURVING STREAM WITH 2 WOODEN BRIDGES */}
      <CurvingStreamWithBridges />

      <VillageWindingPaths />

      {/* 🌿 SMALL ENVIRONMENTAL BUSHES & DETAILS */}
      <SmallBushesAndEnvironmentalDetails />

      {/* 🍎🍊 4. FRUIT TREE ORCHARDS */}
      <FruitOrchard />

      {/* 🌸 2. LARGE DENSE FLOWER GARDEN PLOTS (40-100 FLOWERS PER PLOT) */}
      <LargeDenseFlowerPlots />

      {/* 🌾 3. VEGETABLE FARMS WITH CROP ROWS */}
      <FourMathematicalFarms />

      {/* 🐮🐑 9. FENCED ANIMAL PASTURES */}
      <FencedAnimalPastures />

      {/* 🌲 11. SOFT TOON FOREST BOUNDARY */}
      <DenseMultiColorForestBoundary />

      {/* 🦇 ANIMATED 3D BAT MESSENGER OVERHEAD */}
      <AnimatedBatMessenger />

      {/* 6. CENTRAL MARKET SQUARE & FOUNTAIN */}
      <VillageSquare position={[0, 0, 0]} />

      {/* 5. 14 COZY HOUSES WITH MAILBOXES & GARDENS */}
      <VillageHouses />
      
      {/* 10. VILLAGERS DISTRIBUTED THROUGHOUT SCENE */}
      <Villagers />

      {/* 🦇🖤 CHIBI DARK KNIGHT MAIN PLAYER */}
      <StorybookHuman character={character} targetPos={targetPos} groupRef={playerGroupRef} isMounted={isMounted} />

      {/* 🐴 HORSE PET COMPANION & MOUNT */}
      <StorybookHorse isMounted={isMounted} playerGroupRef={playerGroupRef} activePet={activePet} />

      {/* 🐱 3D ORANGE CAT PET COMPANION */}
      <OrangeCatPet targetGroupRef={playerGroupRef} activePet={activePet} />

      {isNight ? (
        <>
          <Sparkles count={200} scale={70} size={4} speed={0.2} color="#ffffff" />
          <Sparkles count={80} scale={40} size={4.5} speed={0.6} color="#ffee93" />
        </>
      ) : (
        <Sparkles count={120} scale={60} size={3.5} speed={0.4} color="#ffe5ec" />
      )}

      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={60} blur={2.5} />
    </Canvas>
  );
}
