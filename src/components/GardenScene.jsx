import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sky, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

/** -------------------------------------------------------------
 *  1. STYLIZED 3D STORYBOOK HUMAN AVATAR
 *  Features: Head, eyes, blush cheeks, customizable hairstyles, 
 *  outfits, limbs, boots, accessories, and walking/idle physics
 * ------------------------------------------------------------- */
function StorybookHuman({ character, targetPos }) {
  const groupRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headGroupRef = useRef();

  const [isMoving, setIsMoving] = useState(false);

  // Extract props with fallbacks
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
      setIsMoving(true);
      groupRef.current.position.x += dx * 0.075;
      groupRef.current.position.z += dz * 0.075;

      // Smooth rotation towards target direction
      const targetAngle = Math.atan2(dx, dz);
      let diff = targetAngle - groupRef.current.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.15;

      // Walking Bobbing Motion
      groupRef.current.position.y = Math.abs(Math.sin(clock * 14)) * 0.06;

      // Leg & Arm Swinging Animation
      const legSwing = Math.sin(clock * 14) * 0.45;
      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;

      const armSwing = Math.sin(clock * 14) * 0.35;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;

      if (headGroupRef.current) headGroupRef.current.rotation.z = Math.sin(clock * 7) * 0.04;
    } else {
      setIsMoving(false);
      // Gentle Idle Breathing & Arm Sway
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
      
      {/* --- HEAD & FACE GROUP --- */}
      <group ref={headGroupRef} position={[0, 0.95, 0]}>
        
        {/* Soft Head Mesh */}
        <mesh castShadow>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color={skinTone} roughness={0.45} />
        </mesh>

        {/* Eyes (Left & Right) */}
        <mesh position={[-0.09, 0.03, 0.22]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#222222" roughness={0.2} />
        </mesh>
        <mesh position={[0.09, 0.03, 0.22]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#222222" roughness={0.2} />
        </mesh>
        
        {/* Eye Catchlight Reflection Dots */}
        <mesh position={[-0.08, 0.045, 0.25]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.1, 0.045, 0.25]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Cute Blushing Cheeks */}
        <mesh position={[-0.14, -0.04, 0.2]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#ffb5a7" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.14, -0.04, 0.2]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#ffb5a7" transparent opacity={0.6} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.01, 0.25]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
        </mesh>

        {/* HAIRSTYLES */}
        {hairStyle === 'wanderer_cap' && (
          <group>
            {/* Hair Cap Base */}
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.27, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={hairColor} roughness={0.6} />
            </mesh>
            {/* Wanderer Pointy Cap */}
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
            {/* Side Bob Flairs */}
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
            {/* Left Braid */}
            <mesh position={[-0.2, -0.22, 0.1]}>
              <cylinderGeometry args={[0.05, 0.03, 0.35, 8]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            {/* Right Braid */}
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

        {/* ACCESSORY: Round Glasses */}
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

        {/* ACCESSORY: Flower Crown */}
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

      {/* --- TORSO & OUTFITS --- */}
      <group position={[0, 0.48, 0]}>
        
        {/* Main Body Torso */}
        <mesh castShadow>
          <capsuleGeometry args={[0.26, 0.38, 8, 16]} />
          <meshStandardMaterial color={outfitColor} roughness={0.5} />
        </mesh>

        {/* Outfit Style Variations */}
        {outfitStyle === 'wanderer_coat' && (
          <group>
            {/* Coat Flared Hem */}
            <mesh position={[0, -0.18, 0]}>
              <coneGeometry args={[0.34, 0.25, 16, 1, true]} />
              <meshStandardMaterial color={outfitColor} side={THREE.DoubleSide} />
            </mesh>
            {/* Buttons */}
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
            {/* Overall Pocket */}
            <mesh position={[0, 0.02, 0.26]}>
              <boxGeometry args={[0.18, 0.16, 0.02]} />
              <meshStandardMaterial color="#457b9d" />
            </mesh>
          </group>
        )}

        {/* ACCESSORY: Rucksack / Backpack */}
        {accessory === 'backpack' && (
          <group position={[0, 0.02, -0.28]}>
            <mesh castShadow>
              <boxGeometry args={[0.32, 0.36, 0.16]} />
              <meshStandardMaterial color="#7a4b2a" roughness={0.8} />
            </mesh>
            {/* Flap */}
            <mesh position={[0, 0.12, 0.02]}>
              <boxGeometry args={[0.34, 0.12, 0.18]} />
              <meshStandardMaterial color="#5c381e" />
            </mesh>
          </group>
        )}

        {/* ACCESSORY: Cozy Scarf */}
        {accessory === 'cozy_scarf' && (
          <group position={[0, 0.22, 0]}>
            <mesh>
              <torusGeometry args={[0.26, 0.06, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#e07a5f" roughness={0.7} />
            </mesh>
          </group>
        )}

      </group>

      {/* --- ARMS (Left & Right) --- */}
      <group ref={leftArmRef} position={[-0.32, 0.58, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.32, 10]} />
          <meshStandardMaterial color={outfitColor} />
        </mesh>
        {/* Hand */}
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
        {/* Hand */}
        <mesh position={[0, -0.34, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      {/* --- LEGS & SHOES (Left & Right) --- */}
      <group ref={leftLegRef} position={[-0.12, 0.22, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.22, 10]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
        {/* Cute Leather Boot */}
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
        {/* Cute Leather Boot */}
        <mesh position={[0, -0.22, 0.04]} castShadow>
          <boxGeometry args={[0.11, 0.1, 0.18]} />
          <meshStandardMaterial color="#5c381e" roughness={0.8} />
        </mesh>
      </group>

    </group>
  );
}

/** -------------------------------------------------------------
 *  2. STYLIZED STORYBOOK TREES
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

/** -------------------------------------------------------------
 *  3. COZY STORYBOOK COTTAGE
 * ------------------------------------------------------------- */
function CozyCottage({ position = [-2.8, 0, -2.2], rotation = 0.4 }) {
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

/** -------------------------------------------------------------
 *  4. FAIRYTALE POND & BRIDGE
 * ------------------------------------------------------------- */
function FairytalePond({ position = [-1.5, 0.02, 1.8] }) {
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

/** -------------------------------------------------------------
 *  5. MUSHROOMS & FLOWERS
 * ------------------------------------------------------------- */
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

/** -------------------------------------------------------------
 *  6. FENCE & GATE
 * ------------------------------------------------------------- */
function GardenFenceGate({ position = [2.2, 0, 1.2], rotation = -0.5 }) {
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

/** -------------------------------------------------------------
 *  7. STORYBOOK MAILBOX
 * ------------------------------------------------------------- */
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

/** -------------------------------------------------------------
 *  8. NATURAL IRREGULAR TERRAIN
 * ------------------------------------------------------------- */
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
          onGroundClick([e.point.x, e.point.z]);
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
 *  9. MAIN GARDEN SCENE ASSEMBLY
 * ------------------------------------------------------------- */
export default function GardenScene({ character }) {
  const [targetPos, setTargetPos] = useState(null);

  return (
    <Canvas shadows camera={{ position: [5.2, 4.5, 6.2], fov: 38 }}>
      <color attach="background" args={['#faede1']} />
      
      <Sky sunPosition={[6, 4, 3]} turbidity={1.2} rayleigh={0.4} />
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

      <Sparkles count={55} scale={8} size={3} speed={0.35} color="#ffe5ec" />

      <NaturalDioramaTerrain onGroundClick={setTargetPos} />
      <CozyCottage position={[-2.6, 0.1, -2.4]} rotation={0.45} />
      <FairytalePond position={[-1.6, 0.02, 1.9]} />
      <GardenFenceGate position={[2.5, 0, 1.4]} rotation={-0.6} />
      <StorybookMailbox position={[1.8, 0.05, -1.2]} />

      {/* Upgraded Stylized Storybook Human Character */}
      <StorybookHuman character={character} targetPos={targetPos} />

      <StorybookTree position={[-3.8, 0.2, -1.2]} scale={1.25} colorScale={0} />
      <StorybookTree position={[-2.4, 0.2, -3.8]} scale={1.1} colorScale={1} />
      <StorybookTree position={[3.2, 0.1, -3.2]} scale={1.35} colorScale={2} />
      <StorybookTree position={[3.8, 0.1, -1.5]} scale={1.05} colorScale={0} />
      <StorybookTree position={[4.2, 0.05, 1.2]} scale={1.2} colorScale={1} />

      <MushroomGroup position={[-1.2, 0.08, -1.6]} scale={1.1} />
      <MushroomGroup position={[2.8, 0.05, -2.2]} scale={0.95} />
      
      <SoftFlowerCluster position={[-0.8, 0.04, 0.8]} color="#ffb5a7" />
      <SoftFlowerCluster position={[1.2, 0.04, 2.1]} color="#c77dff" />
      <SoftFlowerCluster position={[2.2, 0.04, -0.2]} color="#ffc6ff" />
      <SoftFlowerCluster position={[-2.8, 0.04, 0.2]} color="#f8ad9d" />

      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={14} blur={2.5} />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={11}
        maxPolarAngle={Math.PI / 2.15}
      />
    </Canvas>
  );
}
