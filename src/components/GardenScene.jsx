import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles, Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { generateVillage } from '../village/generateVillage.js';
import Villagers, { VILLAGERS_DATA } from './Villagers';

/** -------------------------------------------------------------
 *  TOON OUTLINE FOR HERO MODELS
 * ------------------------------------------------------------- */
function ToonOutline({ thickness = 0.03, color = '#2b2013' }) {
  return <Outlines thickness={thickness} color={color} screenspace={false} />;
}

/** -------------------------------------------------------------
 *  STRICT BOUNDARY SANITIZER USING VILLAGE CONFIG BOUNDS
 * ------------------------------------------------------------- */
function sanitizePlayableTarget(x, z, bounds) {
  const xMin = bounds?.xMin ?? -38.5;
  const xMax = bounds?.xMax ?? 38.5;
  const zMin = bounds?.zMin ?? -38.5;
  const zMax = bounds?.zMax ?? 38.5;

  const targetX = THREE.MathUtils.clamp(x, xMin, xMax);
  const targetZ = THREE.MathUtils.clamp(z, zMin, zMax);
  return [targetX, targetZ];
}

/** -------------------------------------------------------------
 *  THIN LOW-POLY WOODEN FENCE OUTLINE COMPONENT 🪵
 * ------------------------------------------------------------- */
function FenceOutline({ center = [0, 0], width = 6, depth = 6 }) {
  const safeW = (typeof width === 'number' && !isNaN(width)) ? width : 6;
  const safeD = (typeof depth === 'number' && !isNaN(depth)) ? depth : 6;
  const cx = center[0] || 0;
  const cz = center[1] || 0;
  const hw = safeW / 2;
  const hd = safeD / 2;

  const fenceColor = '#7a4a2b';
  const postRadius = 0.09;
  const postHeight = 0.65;
  const railSize = 0.07;
  const railY = 0.4;

  return (
    <group>
      {/* 4 Corner Posts */}
      {[
        [cx - hw, cz - hd],
        [cx + hw, cz - hd],
        [cx - hw, cz + hd],
        [cx + hw, cz + hd],
      ].map((pos, idx) => (
        <mesh key={idx} position={[pos[0], postHeight / 2, pos[1]]} castShadow>
          <boxGeometry args={[postRadius * 2, postHeight, postRadius * 2]} />
          <meshToonMaterial color={fenceColor} />
          <ToonOutline thickness={0.02} color="#2b1a0e" />
        </mesh>
      ))}

      {/* Horizontal Rail Bars */}
      <mesh position={[cx, railY, cz - hd]} castShadow>
        <boxGeometry args={[safeW, railSize, railSize]} />
        <meshToonMaterial color={fenceColor} />
      </mesh>
      <mesh position={[cx, railY, cz + hd]} castShadow>
        <boxGeometry args={[safeW, railSize, railSize]} />
        <meshToonMaterial color={fenceColor} />
      </mesh>

      {/* Vertical Rail Bars */}
      <mesh position={[cx - hw, railY, cz]} castShadow>
        <boxGeometry args={[railSize, railSize, safeD]} />
        <meshToonMaterial color={fenceColor} />
      </mesh>
      <mesh position={[cx + hw, railY, cz]} castShadow>
        <boxGeometry args={[railSize, railSize, safeD]} />
        <meshToonMaterial color={fenceColor} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  PROPORTIONAL PETAL FLOWER COMPONENT 🌸🌼
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
    <group position={[position[0], 0, position[1]]} scale={0.75}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.0, 8]} />
        <meshToonMaterial color="#38b000" />
      </mesh>
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
 *  2X SCALED DETAILED LOW-POLY COTTAGE 🏡📮
 *  Prominent 3D structure with stone foundation, roof overhang,
 *  framed door, 3 glass windows, and brick chimney
 * ------------------------------------------------------------- */
function LowPolyCottage({ position, rotationY = 0, roofColor = '#e8604a', wallColor = '#fbead0', mailboxOffset = [2.2, 2.2] }) {
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      {/* Stone Foundation Base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.7, 0.4, 3.8]} />
        <meshToonMaterial color="#6c757d" />
        <ToonOutline thickness={0.03} />
      </mesh>

      {/* Main Cottage Walls */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 2.4, 3.5]} />
        <meshToonMaterial color={wallColor} />
        <ToonOutline thickness={0.035} />
      </mesh>

      {/* Gabled Roof with Overhang */}
      <group position={[0, 2.8, 0]}>
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[3.8, 2.2, 4]} />
          <meshToonMaterial color={roofColor} />
          <ToonOutline thickness={0.035} />
        </mesh>
      </group>

      {/* Brick Chimney */}
      <mesh position={[1.3, 3.4, -0.6]} castShadow>
        <boxGeometry args={[0.6, 1.8, 0.6]} />
        <meshToonMaterial color="#a53860" />
        <ToonOutline thickness={0.03} />
      </mesh>

      {/* Framed Wooden Door */}
      <group position={[0, 1.0, 1.76]}>
        <mesh castShadow>
          <boxGeometry args={[0.95, 1.65, 0.08]} />
          <meshToonMaterial color="#4a2c11" />
        </mesh>
        <mesh position={[0, 0, 0.04]} castShadow>
          <boxGeometry args={[0.8, 1.5, 0.08]} />
          <meshToonMaterial color="#7a4a2b" />
        </mesh>
        <mesh position={[0.3, 0, 0.09]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshToonMaterial color="#ffb703" />
        </mesh>
      </group>

      {/* 3 Glass Windows with Frames */}
      <group position={[-1.3, 1.8, 1.76]}>
        <mesh castShadow>
          <boxGeometry args={[0.75, 0.75, 0.08]} />
          <meshToonMaterial color="#4a2c11" />
        </mesh>
        <mesh position={[0, 0, 0.04]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.08]} />
          <meshToonMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.8} />
        </mesh>
      </group>

      <group position={[1.3, 1.8, 1.76]}>
        <mesh castShadow>
          <boxGeometry args={[0.75, 0.75, 0.08]} />
          <meshToonMaterial color="#4a2c11" />
        </mesh>
        <mesh position={[0, 0, 0.04]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.08]} />
          <meshToonMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Side Window */}
      <group position={[2.21, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.75, 0.75, 0.08]} />
          <meshToonMaterial color="#4a2c11" />
        </mesh>
        <mesh position={[0, 0, 0.04]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.08]} />
          <meshToonMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Mailbox 📮 */}
      <group position={[mailboxOffset[0], 0, mailboxOffset[1]]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.9, 8]} />
          <meshToonMaterial color="#5c381e" />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.36, 0.38, 0.52]} />
          <meshToonMaterial color="#e07a5f" />
          <ToonOutline thickness={0.025} />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  MARKET STALL, BENCH & FOUNTAIN 🏪⛲
 * ------------------------------------------------------------- */
function MarketStall({ position, rotationY = 0, awningColor = '#e8604a', goods = 'flowers' }) {
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.8, 1.1]} />
        <meshToonMaterial color="#8c5a3c" />
        <ToonOutline thickness={0.03} />
      </mesh>
      {[-0.9, 0.9].map((x, i) =>
        [-0.45, 0.45].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 1.3, z]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
            <meshToonMaterial color="#5c381e" />
          </mesh>
        ))
      )}
      <group position={[0, 2.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.16, 1.3]} />
          <meshToonMaterial color={awningColor} />
          <ToonOutline thickness={0.03} />
        </mesh>
      </group>

      <group position={[0, 0.95, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.2, 0.4]} />
          <meshToonMaterial color="#a8763e" />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.16, 8, 8]} />
          <meshToonMaterial color={goods === 'fruit' ? '#e63946' : goods === 'vegetables' ? '#38b000' : '#ffb703'} />
        </mesh>
      </group>
    </group>
  );
}

function WoodenBench({ position, rotationY = 0 }) {
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.6, 0.1, 0.55]} />
        <meshToonMaterial color="#6b4c35" />
        <ToonOutline thickness={0.025} />
      </mesh>
      <mesh position={[-0.7, 0.18, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.5]} />
        <meshToonMaterial color="#4a2c11" />
      </mesh>
      <mesh position={[0.7, 0.18, 0]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.5]} />
        <meshToonMaterial color="#4a2c11" />
      </mesh>
    </group>
  );
}

function VillageFountain({ position, radius = 1.5 }) {
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.95, 0.8, 16]} />
        <meshToonMaterial color="#8a7e70" />
        <ToonOutline thickness={0.035} />
      </mesh>
      <mesh position={[0, 0.81, 0]}>
        <cylinderGeometry args={[radius * 0.85, radius * 0.85, 0.04, 16]} />
        <meshToonMaterial color="#2a9d8f" transparent opacity={0.88} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 1.0, 8]} />
        <meshToonMaterial color="#8a7e70" />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  CROPS & FARMS 🌽🥕🎃
 * ------------------------------------------------------------- */
function CropItem({ position, type }) {
  let color = '#38b000';
  let isCone = false;
  let isTall = false;

  if (type === 'carrot') { color = '#fb8500'; isCone = true; }
  else if (type === 'tomato') { color = '#e63946'; }
  else if (type === 'pumpkin') { color = '#e76f51'; }
  else if (type === 'corn') { color = '#ffb703'; isTall = true; }
  else if (type === 'lettuce') { color = '#52b788'; }

  return (
    <group position={[position[0], 0, position[1]]} scale={1.2}>
      {isCone ? (
        <mesh position={[0, 0.2, 0]} castShadow>
          <coneGeometry args={[0.18, 0.55, 6]} />
          <meshToonMaterial color={color} />
        </mesh>
      ) : isTall ? (
        <group position={[0, 0.55, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.05, 1.1, 6]} />
            <meshToonMaterial color="#e9c46a" />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshToonMaterial color={color} />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, 0.25, 0]} castShadow>
          <sphereGeometry args={[0.3, 10, 10]} />
          <meshToonMaterial color={color} />
        </mesh>
      )}
    </group>
  );
}

/** -------------------------------------------------------------
 *  FRUIT TREE COMPONENT 🍎
 * ------------------------------------------------------------- */
function FruitTree({ position, fruitType = 'apple', fruitOffsets = [] }) {
  const fruitColor = fruitType === 'apple' ? '#e63946' : '#fb8500';
  const foliageCenter = [0, 2.2, 0];
  const foliageRadius = 0.55;

  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 1.8, 8]} />
        <meshToonMaterial color="#5c381e" />
      </mesh>
      <mesh position={foliageCenter} castShadow>
        <sphereGeometry args={[foliageRadius, 14, 14]} />
        <meshToonMaterial color="#38b000" />
        <ToonOutline thickness={0.03} color="#1b4332" />
      </mesh>

      {fruitOffsets.map((offset, fIdx) => (
        <mesh
          key={fIdx}
          position={[
            foliageCenter[0] + offset[0],
            foliageCenter[1] + offset[1],
            foliageCenter[2] + offset[2],
          ]}
          castShadow
        >
          <sphereGeometry args={[0.11, 8, 8]} />
          <meshToonMaterial color={fruitColor} />
        </mesh>
      ))}
    </group>
  );
}

/** -------------------------------------------------------------
 *  2.5X SCALED 3D ANIMAL COMPONENT 🐮🐑🐔
 *  Reads clearly from high overhead camera views
 * ------------------------------------------------------------- */
function Animal({ position, type }) {
  let bodyColor = '#ffffff';
  let bodyRadius = 0.9;
  let height = 0.9;

  if (type === 'cow') { bodyColor = '#f4f1de'; bodyRadius = 1.25; height = 1.1; }
  else if (type === 'sheep') { bodyColor = '#ffffff'; bodyRadius = 0.95; height = 0.9; }
  else if (type === 'chicken') { bodyColor = '#f4a261'; bodyRadius = 0.55; height = 0.55; }
  else if (type === 'rabbit') { bodyColor = '#e0a96d'; bodyRadius = 0.5; height = 0.5; }
  else if (type === 'duck') { bodyColor = '#ffb703'; bodyRadius = 0.55; height = 0.55; }
  else if (type === 'horse') { bodyColor = '#c68a4c'; bodyRadius = 1.3; height = 1.35; }

  return (
    <group position={[position[0], 0, position[1]]}>
      {type === 'horse' ? (
        <group position={[0, 0.9, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.95, 1.6]} />
            <meshToonMaterial color={bodyColor} />
            <ToonOutline thickness={0.035} />
          </mesh>
          <mesh position={[0, 0.65, 0.7]} rotation={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.8, 0.5]} />
            <meshToonMaterial color={bodyColor} />
          </mesh>
        </group>
      ) : (
        <group position={[0, height, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[bodyRadius, 12, 12]} />
            <meshToonMaterial color={bodyColor} />
            <ToonOutline thickness={0.035} />
          </mesh>
          {type === 'cow' && (
            <mesh position={[0, bodyRadius * 0.4, bodyRadius * 0.7]} castShadow>
              <sphereGeometry args={[bodyRadius * 0.45, 10, 10]} />
              <meshToonMaterial color="#e76f51" />
            </mesh>
          )}
          {type === 'chicken' && (
            <mesh position={[0, bodyRadius * 0.8, 0]} castShadow>
              <coneGeometry args={[0.15, 0.35, 6]} />
              <meshToonMaterial color="#e63946" />
            </mesh>
          )}
          {type === 'rabbit' && (
            <mesh position={[0, bodyRadius * 0.9, 0]} castShadow>
              <boxGeometry args={[0.15, 0.65, 0.12]} />
              <meshToonMaterial color="#e0a96d" />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}

function ForestTree({ position, scale = 1, rotationY = 0, kind = 'round' }) {
  return (
    <group position={[position[0], 0, position[1]]} scale={scale * 1.25} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 2.2, 8]} />
        <meshToonMaterial color="#5c381e" />
      </mesh>

      {kind === 'pine' ? (
        <mesh position={[0, 2.4, 0]} castShadow>
          <coneGeometry args={[1.25, 2.8, 8]} />
          <meshToonMaterial color="#1b4332" />
          <ToonOutline thickness={0.03} color="#0b1b14" />
        </mesh>
      ) : (
        <mesh position={[0, 2.5, 0]} castShadow>
          <sphereGeometry args={[1.4, 14, 14]} />
          <meshToonMaterial color="#2d6a4f" />
          <ToonOutline thickness={0.035} color="#10251b" />
        </mesh>
      )}
    </group>
  );
}

/** -------------------------------------------------------------
 *  2.2X SCALED VILLAGER NPC COMPONENT 👤
 * ------------------------------------------------------------- */
function VillagerNPC({ position, outfitColor = '#c9a7e0', hairColor = '#3a2e22', skinTone = '#f2c9a0' }) {
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.55, 14, 14]} />
        <meshToonMaterial color={skinTone} />
        <ToonOutline thickness={0.03} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.58, 12, 12]} />
        <meshToonMaterial color={hairColor} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.52, 1.0, 10]} />
        <meshToonMaterial color={outfitColor} />
        <ToonOutline thickness={0.03} />
      </mesh>
    </group>
  );
}

/** -------------------------------------------------------------
 *  FILLER PROPS (ROCKS, BUSHES, STEPPING STONES) 🪨🌿🐾
 * ------------------------------------------------------------- */
function FillerRock({ position, scale = 1 }) {
  return (
    <mesh position={[position[0], scale * 0.25, position[1]]} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.55, 1]} />
      <meshToonMaterial color="#8d99ae" />
      <ToonOutline thickness={0.02} color="#3d405b" />
    </mesh>
  );
}

function FillerBush({ position, scale = 1 }) {
  return (
    <mesh position={[position[0], scale * 0.45, position[1]]} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[0.65, 10, 10]} />
      <meshToonMaterial color="#40916c" />
      <ToonOutline thickness={0.025} color="#1b4332" />
    </mesh>
  );
}

function SteppingStone({ position, scale = 1 }) {
  return (
    <mesh position={[position[0], 0.01, position[1]]} scale={scale} receiveShadow>
      <cylinderGeometry args={[0.45, 0.45, 0.03, 8]} />
      <meshToonMaterial color="#b0bb9e" />
    </mesh>
  );
}

function RiverWaterFeature({ segments, lilyPads }) {
  return (
    <group>
      {segments.map((seg) => {
        const midX = (seg.from[0] + seg.to[0]) / 2;
        const midZ = (seg.from[1] + seg.to[1]) / 2;
        const dx = seg.to[0] - seg.from[0];
        const dz = seg.to[1] - seg.from[1];
        const length = Math.hypot(dx, dz);
        const angle = Math.atan2(dx, dz);

        return (
          <group key={seg.id} position={[midX, 0.005, midZ]} rotation={[0, angle, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[seg.width, length + 0.5]} />
              <meshToonMaterial color="#3a86c8" transparent opacity={0.88} />
            </mesh>
            {seg.hasBridge && (
              <group position={[0, 0.45, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[seg.width + 1.4, 0.35, 3.8]} />
                  <meshToonMaterial color="#8a7e70" />
                  <ToonOutline thickness={0.035} color="#2b1a0e" />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {lilyPads.map((pad) => (
        <mesh key={pad.id} position={[pad.position[0], 0.02, pad.position[1]]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.02, 10]} />
          <meshToonMaterial color="#52b788" />
        </mesh>
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
    batRef.current.position.y = 8.5 + Math.sin(clock * 4.0) * 0.5;
    batRef.current.rotation.y = clock * 0.8 + Math.PI / 2;
  });

  return (
    <group ref={batRef} position={[0, 8.5, -15.0]} scale={1.1}>
      <mesh castShadow>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshToonMaterial color="#3d2b52" />
        <ToonOutline thickness={0.025} color="#12091f" />
      </mesh>
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[1.0, 0.05, 0.5]} />
        <meshToonMaterial color="#7209b7" />
      </mesh>
      <mesh position={[0.55, 0, 0]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[1.0, 0.05, 0.5]} />
        <meshToonMaterial color="#7209b7" />
      </mesh>
    </group>
  );
}

function OrangeCatPet({ targetGroupRef, activePet, bounds }) {
  const catRef = useRef();

  useFrame((state) => {
    if (!catRef.current || activePet !== 'cat' || !targetGroupRef.current) return;

    const clock = state.clock.getElapsedTime();
    const px = targetGroupRef.current.position.x;
    const pz = targetGroupRef.current.position.z;

    const rawTargetX = px - 0.75;
    const rawTargetZ = pz + 0.75;

    const [targetX, targetZ] = sanitizePlayableTarget(rawTargetX, rawTargetZ, bounds);

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
    <group ref={catRef} position={[0, 0, 0]} scale={0.9}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.42, 0.35, 0.8]} />
        <meshToonMaterial color="#f4a261" />
        <ToonOutline thickness={0.025} />
      </mesh>
      <group position={[0, 0.6, 0.45]}>
        <mesh castShadow>
          <boxGeometry args={[0.48, 0.4, 0.45]} />
          <meshToonMaterial color="#f4a261" />
          <ToonOutline thickness={0.025} />
        </mesh>
      </group>
    </group>
  );
}

function StorybookHorse({ isMounted, playerGroupRef, activePet }) {
  const horseRef = useRef();

  useFrame(() => {
    if (!horseRef.current) return;
    if (isMounted && playerGroupRef.current) {
      horseRef.current.position.x = playerGroupRef.current.position.x;
      horseRef.current.position.z = playerGroupRef.current.position.z;
      horseRef.current.rotation.y = playerGroupRef.current.rotation.y;
    }
  });

  if (activePet !== 'horse' && !isMounted) return null;

  return (
    <group ref={horseRef} position={[0, 0, 0]} scale={1.35}>
      <group position={[0, 0.85, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.85, 1.45]} />
          <meshToonMaterial color="#c68a4c" />
          <ToonOutline thickness={0.03} />
        </mesh>
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  AXIS-ALIGNED FLAT RECTANGLE TERRAIN (X: -40 to 40, Z: -40 to 40)
 * ------------------------------------------------------------- */
function SteppedLowPolyTerrain({ onGroundClick, bounds }) {
  return (
    <mesh
      position={[0, -0.06, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        const pointX = e.point.x;
        const pointZ = e.point.z;
        const sanitized = sanitizePlayableTarget(pointX, pointZ, bounds);
        onGroundClick(sanitized);
      }}
    >
      <planeGeometry args={[80, 80]} />
      <meshToonMaterial color="#94c77d" />
    </mesh>
  );
}

function CharacterCameraController({ playerGroupRef, targetPos, setTargetPos, isMounted, toggleMount, setNearVillager, onOpenDialogue, bounds }) {
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
        if (!isMounted && onOpenDialogue && VILLAGERS_DATA) {
          const px = playerGroupRef.current?.position.x || 0;
          const pz = playerGroupRef.current?.position.z || 0;
          for (const v of VILLAGERS_DATA) {
            const dx = px - v.pos[0];
            const dz = pz - v.pos[2];
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 3.0) {
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
    if (VILLAGERS_DATA) {
      for (const v of VILLAGERS_DATA) {
        const dx = px - v.pos[0];
        const dz = pz - v.pos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 3.0) {
          foundVillager = v;
          break;
        }
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

        const [sanX, sanZ] = sanitizePlayableTarget(nextX, nextZ, bounds);
        setTargetPos([sanX, sanZ]);
      }
    }

    if (orbitRef.current) {
      orbitRef.current.target.x = THREE.MathUtils.lerp(orbitRef.current.target.x, px, 0.1);
      orbitRef.current.target.y = THREE.MathUtils.lerp(orbitRef.current.target.y, playerGroupRef.current.position.y + (isMounted ? 1.4 : 1.0), 0.1);
      orbitRef.current.target.z = THREE.MathUtils.lerp(orbitRef.current.target.z, pz, 0.1);
      orbitRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={orbitRef}
      enablePan={false}
      enableZoom={true}
      minDistance={5.0}
      maxDistance={120.0}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.46}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
    />
  );
}

function StorybookHuman({ character, targetPos, groupRef, isMounted, bounds }) {
  useFrame((state) => {
    if (!groupRef.current || !targetPos) return;

    const [clampedX, clampedZ] = sanitizePlayableTarget(targetPos[0], targetPos[1], bounds);

    const dx = clampedX - groupRef.current.position.x;
    const dz = clampedZ - groupRef.current.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const clock = state.clock.getElapsedTime();

    if (isMounted) {
      groupRef.current.position.y = 1.1;
    } else {
      if (dist > 0.06) {
        groupRef.current.position.x += dx * 0.085;
        groupRef.current.position.z += dz * 0.085;
        const targetAngle = Math.atan2(dx, dz);
        groupRef.current.rotation.y = targetAngle;
        groupRef.current.position.y = Math.abs(Math.sin(clock * 14)) * 0.06;
      }
    }

    const [finalX, finalZ] = sanitizePlayableTarget(groupRef.current.position.x, groupRef.current.position.z, bounds);
    groupRef.current.position.x = finalX;
    groupRef.current.position.z = finalZ;
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
 *  MAIN GARDEN SCENE (DETERMINISTIC VILLAGE DATA INTEGRATION)
 * ------------------------------------------------------------- */
export default function GardenScene({ character, resetCameraSignal, isMounted, toggleMount, setNearVillager, onOpenDialogue, activePet = 'none', isNight = false }) {
  const village = useMemo(() => generateVillage(), []);
  const [targetPos, setTargetPos] = useState([0.0, 0.0]);
  const playerGroupRef = useRef();

  return (
    <Canvas shadows camera={{ position: [0.0, 48.0, 58.0], fov: 48 }}>
      <color attach="background" args={[isNight ? '#1a0b2e' : '#bfe8f7']} />
      <fog attach="fog" args={[isNight ? '#1a0b2e' : '#bfe8f7', 45, 160]} />

      <ambientLight intensity={isNight ? 0.35 : 0.85} color={isNight ? '#8338ec' : '#ffffff'} />
      <hemisphereLight skyColor={isNight ? '#3a0ca3' : '#bfe8f7'} groundColor="#94c77d" intensity={isNight ? 0.4 : 0.8} />
      <directionalLight position={[12, 28, 20]} intensity={isNight ? 0.45 : 1.6} color={isNight ? '#4cc9f0' : '#ffffff'} castShadow shadow-mapSize={[2048, 2048]} />

      <CharacterCameraController
        playerGroupRef={playerGroupRef}
        targetPos={targetPos}
        setTargetPos={setTargetPos}
        isMounted={isMounted}
        toggleMount={toggleMount}
        setNearVillager={setNearVillager}
        onOpenDialogue={onOpenDialogue}
        bounds={village.bounds}
      />

      {/* Axis-Aligned Rectangle Terrain */}
      <SteppedLowPolyTerrain onGroundClick={setTargetPos} bounds={village.bounds} />

      {/* Filler Stepping Stones */}
      {village.steppingStones?.map((st) => (
        <SteppingStone key={st.id} position={st.position} scale={st.scale} />
      ))}

      {/* Filler Rocks */}
      {village.fillerRocks?.map((rock) => (
        <FillerRock key={rock.id} position={rock.position} scale={rock.scale} />
      ))}

      {/* Filler Bushes */}
      {village.fillerBushes?.map((bush) => (
        <FillerBush key={bush.id} position={bush.position} scale={bush.scale} />
      ))}

      {/* River & Bridges */}
      <RiverWaterFeature segments={village.river.segments} lilyPads={village.river.lilyPads} />

      {/* 2x Detailed Cottages & House Gardens */}
      {village.houses.map((h) => (
        <LowPolyCottage
          key={h.id}
          position={h.position}
          rotationY={h.rotationY}
          roofColor={h.roofColor}
          wallColor={h.wallColor}
          mailboxOffset={h.mailboxOffset}
        />
      ))}
      {village.houseGardenFlowers.map((f) => (
        <AnatomicalPetalFlower key={f.id} position={f.position} color={f.color} />
      ))}

      {/* Market Square */}
      <VillageFountain position={village.market.fountainCenter} radius={village.market.fountainRadius} />
      {village.market.stalls.map((s) => (
        <MarketStall key={s.id} position={s.position} rotationY={s.rotationY} awningColor={s.awningColor} goods={s.goods} />
      ))}
      {village.market.benches.map((b) => (
        <WoodenBench key={b.id} position={b.position} rotationY={b.rotationY} />
      ))}

      {/* Flower Gardens */}
      {village.flowerGardens.map((g) => (
        <group key={g.id}>
          <FenceOutline center={g.fence.center} width={g.fence.width} depth={g.fence.depth} />
          {g.flowers.map((f) => (
            <AnatomicalPetalFlower key={f.id} position={f.position} color={f.color} />
          ))}
        </group>
      ))}

      {/* Vegetable Farms */}
      {village.vegetableFarms.map((farm) => (
        <group key={farm.id}>
          <mesh position={[farm.fence.center[0], 0.01, farm.fence.center[1]]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[farm.fence.width, farm.fence.depth]} />
            <meshToonMaterial color="#5c381e" />
          </mesh>
          <FenceOutline center={farm.fence.center} width={farm.fence.width} depth={farm.fence.depth} />
          {farm.crops.map((crop) => (
            <CropItem key={crop.id} position={crop.position} type={crop.type} />
          ))}
        </group>
      ))}

      {/* Loose Flower Clusters */}
      {village.looseFlowerClusters?.map((cluster) =>
        cluster.flowers.map((f) => (
          <AnatomicalPetalFlower key={f.id} position={f.position} color={f.color} />
        ))
      )}

      {/* Orchard Trees */}
      {village.orchardTrees.map((tree) => (
        <FruitTree
          key={tree.id}
          position={tree.position}
          fruitType={tree.fruitType}
          fruitOffsets={tree.fruitOffsets}
        />
      ))}

      {/* 2.5x Scaled Animal Pens */}
      {village.animalPens.map((pen) => (
        <group key={pen.id}>
          <FenceOutline center={pen.fence.center} width={pen.fence.width} depth={pen.fence.depth} />
          {pen.animals.map((animal) => (
            <Animal key={animal.id} position={animal.position} type={animal.type} />
          ))}
        </group>
      ))}

      {/* Forest Boundary Trees */}
      {village.forestTrees.map((tree) => (
        <ForestTree key={tree.id} position={tree.position} scale={tree.scale} rotationY={tree.rotationY} kind={tree.kind} />
      ))}

      {/* 2.2x Scaled Villager NPCs */}
      {village.villagers.map((v) => (
        <VillagerNPC key={v.id} position={v.position} outfitColor={v.outfitColor} hairColor={v.hairColor} skinTone={v.skinTone} />
      ))}

      {/* 🦇 ANIMATED 3D BAT MESSENGER */}
      <AnimatedBatMessenger />

      {/* 🦇🖤 CHIBI DARK KNIGHT MAIN PLAYER */}
      <StorybookHuman character={character} targetPos={targetPos} groupRef={playerGroupRef} isMounted={isMounted} bounds={village.bounds} />

      {/* 🐴 HORSE PET COMPANION */}
      <StorybookHorse isMounted={isMounted} playerGroupRef={playerGroupRef} activePet={activePet} />

      {/* 🐱 3D ORANGE CAT PET */}
      <OrangeCatPet targetGroupRef={playerGroupRef} activePet={activePet} bounds={village.bounds} />

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
