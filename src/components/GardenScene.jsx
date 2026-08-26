import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sky, Sparkles, Float } from '@react-three/drei';

/** Low-poly Storybook Tree with multi-tiered pastel foliage */
function Tree({ position, scale = 1, rotation = 0 }) {
  const groupRef = useRef();

  // Subtle wind sway animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.8 + position[0]) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0, rotation, 0]}>
      {/* Wooden Trunk */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 7]} />
        <meshStandardMaterial color="#6e4a2d" roughness={0.9} />
      </mesh>
      
      {/* Foliage Tier 1 (Bottom) */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <coneGeometry args={[0.85, 1.1, 7]} />
        <meshStandardMaterial color="#7ba869" roughness={0.6} />
      </mesh>

      {/* Foliage Tier 2 (Middle) */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <coneGeometry args={[0.65, 0.9, 7]} />
        <meshStandardMaterial color="#8cb87a" roughness={0.6} />
      </mesh>

      {/* Foliage Tier 3 (Top Peak) */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[0.45, 0.7, 7]} />
        <meshStandardMaterial color="#a1c990" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Animated Garden Pond with Water Lilies */
function Pond({ position = [-2.2, 0.02, 1.8] }) {
  const waterRef = useRef();

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = 0.02 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.008;
    }
  });

  return (
    <group position={position}>
      {/* Pond Bed Rim */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.35, 32]} />
        <meshStandardMaterial color="#b5a995" roughness={0.8} />
      </mesh>

      {/* Water Surface */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.15, 32]} />
        <meshStandardMaterial
          color="#76c8e3"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Lily Pad 1 */}
      <group position={[-0.4, 0.03, 0.3]} rotation={[0, 0.4, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.22, 16, 0, Math.PI * 1.85]} />
          <meshStandardMaterial color="#5e8b4e" roughness={0.5} />
        </mesh>
        {/* Flower */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#f4acb7" />
        </mesh>
      </group>

      {/* Lily Pad 2 */}
      <group position={[0.3, 0.03, -0.4]} rotation={[0, 2.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.18, 16, 0, Math.PI * 1.85]} />
          <meshStandardMaterial color="#6a9959" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/** Cobblestone Stepping Path */
function Path() {
  const stones = [
    [-0.2, 0, 0.2],
    [0.3, 0, -0.3],
    [0.8, 0, -0.7],
    [1.4, 0, -1.1],
    [2.0, 0, -1.4],
  ];

  return (
    <group>
      {stones.map((pos, idx) => (
        <mesh
          key={idx}
          position={[pos[0], 0.015, pos[2]]}
          rotation={[-Math.PI / 2, 0, idx * 0.7]}
        >
          <circleGeometry args={[0.28 + (idx % 2) * 0.04, 12]} />
          <meshStandardMaterial color="#d4c7b5" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Low-poly Flowers */
function Flower({ position, color }) {
  const petals = new Array(6).fill(0);
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.5, 6]} />
        <meshStandardMaterial color="#7fa66b" />
      </mesh>
      <group position={[0, 0.5, 0]}>
        {petals.map((_, i) => {
          const angle = (i / petals.length) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.09, 0, Math.sin(angle) * 0.09]}
            >
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          );
        })}
        <mesh>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#f5d76e" />
        </mesh>
      </group>
    </group>
  );
}

/** Animated Snail Mascot crawling along path */
function SnailMascot() {
  const snailRef = useRef();

  useFrame((state) => {
    if (snailRef.current) {
      const t = state.clock.getElapsedTime() * 0.3;
      snailRef.current.position.x = 1.0 + Math.sin(t) * 0.5;
      snailRef.current.position.z = 0.5 + Math.cos(t * 0.8) * 0.3;
      snailRef.current.rotation.y = Math.atan2(Math.cos(t) * 0.5, -Math.sin(t * 0.8) * 0.24) + Math.PI / 2;
    }
  });

  return (
    <group ref={snailRef} position={[1.0, 0.08, 0.5]}>
      {/* Snail Body */}
      <mesh position={[0, 0.05, 0]}>
        <capsuleGeometry args={[0.07, 0.22, 4, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#fceade" roughness={0.4} />
      </mesh>

      {/* Snail Shell */}
      <mesh position={[0, 0.16, -0.04]} castShadow>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color="#d4a373" roughness={0.6} />
      </mesh>

      {/* Eye Stalks */}
      <mesh position={[-0.04, 0.22, 0.1]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <meshStandardMaterial color="#fceade" />
      </mesh>
      <mesh position={[0.04, 0.22, 0.1]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <meshStandardMaterial color="#fceade" />
      </mesh>
    </group>
  );
}

/** Interactive Wooden Mailbox with Flag */
function Mailbox() {
  const [flagRaised, setFlagRaised] = useState(true);

  return (
    <group 
      position={[2.2, 0, -1.5]}
      onClick={(e) => {
        e.stopPropagation();
        setFlagRaised(!flagRaised);
      }}
    >
      {/* Wooden Post */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.14, 1, 0.14]} />
        <meshStandardMaterial color="#7a4b2a" roughness={0.8} />
      </mesh>

      {/* Mailbox Body */}
      <mesh position={[0, 1.08, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.38, 4, 12]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e07a5f" roughness={0.4} />
      </mesh>

      {/* Mailbox Door */}
      <mesh position={[0.2, 1.08, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#b8533b" />
      </mesh>

      {/* Mail Flag */}
      <mesh 
        position={[0.05, 1.15, 0.22]} 
        rotation={[0, 0, flagRaised ? 0 : -Math.PI / 2.2]}
      >
        <boxGeometry args={[0.04, 0.22, 0.12]} />
        <meshStandardMaterial color="#d4a373" />
      </mesh>
    </group>
  );
}

/** Stylized Storybook Character Avatar */
function Character({ character, targetPos }) {
  const groupRef = useRef();
  const [isMoving, setIsMoving] = useState(false);

  useFrame((state) => {
    if (!groupRef.current || !targetPos) return;

    const dx = targetPos[0] - groupRef.current.position.x;
    const dz = targetPos[1] - groupRef.current.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 0.05) {
      setIsMoving(true);
      groupRef.current.position.x += dx * 0.08;
      groupRef.current.position.z += dz * 0.08;
      groupRef.current.rotation.y = Math.atan2(dx, dz);
      // Walking bob animation
      groupRef.current.position.y = Math.abs(Math.sin(state.clock.getElapsedTime() * 12)) * 0.06;
    } else {
      setIsMoving(false);
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Body / Outfit */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.4, 4, 12]} />
        <meshStandardMaterial color={character.outfit_color} roughness={0.5} />
      </mesh>

      {/* Head / Skin */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={character.skin_tone} roughness={0.4} />
      </mesh>

      {/* Hair Cap */}
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={character.hair_color} roughness={0.6} />
      </mesh>

      {/* Cute Wanderer Hat Peak */}
      <mesh position={[0, 1.28, 0]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.22, 0.35, 12]} />
        <meshStandardMaterial color="#e07a5f" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Layered Storybook Ground Mound */
function StorybookGround({ onGroundClick }) {
  return (
    <group>
      {/* Main Base Grass Disk */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick([e.point.x, e.point.z]);
        }}
      >
        <circleGeometry args={[6.5, 64]} />
        <meshStandardMaterial color="#b7d3a0" roughness={0.7} />
      </mesh>

      {/* Inner Raised Hill Ring */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6.7, 7.2, 0.3, 64]} />
        <meshStandardMaterial color="#9cb885" roughness={0.8} />
      </mesh>

      {/* Earth Soil Layer */}
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[7.2, 7.5, 0.4, 64]} />
        <meshStandardMaterial color="#7a5a3e" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function GardenScene({ character }) {
  const [targetPos, setTargetPos] = useState(null);

  return (
    <Canvas shadows camera={{ position: [4.5, 3.8, 5.5], fov: 42 }}>
      {/* Warm Soft Pastel Background */}
      <color attach="background" args={['#faede1']} />
      
      {/* Sky & Soft Sunlight */}
      <Sky sunPosition={[4, 3, 2]} turbidity={1.5} rayleigh={0.5} />
      <ambientLight intensity={0.75} color="#fff8ee" />
      <directionalLight
        position={[4, 5, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* Floating Magic Storybook Sparkles */}
      <Sparkles count={40} scale={7} size={2.5} speed={0.4} color="#fff3d1" />

      {/* Ground & Path */}
      <StorybookGround onGroundClick={setTargetPos} />
      <Path />
      <Pond position={[-2.2, 0.02, 1.2]} />

      {/* Character & Entities */}
      <Character character={character} targetPos={targetPos} />
      <Mailbox />
      <SnailMascot />

      {/* Storybook Trees */}
      <Tree position={[-3.2, 0, -2.0]} scale={1.2} rotation={0.3} />
      <Tree position={[-1.8, 0, -3.2]} scale={1.0} rotation={1.1} />
      <Tree position={[2.8, 0, -3.0]} scale={1.3} rotation={0.7} />
      <Tree position={[3.5, 0, 0.8]} scale={1.1} rotation={2.2} />

      {/* Hand-placed Flower Patches */}
      <Flower position={[-1.4, 0, 0.6]} color="#e8a0c9" />
      <Flower position={[-0.9, 0, 1.6]} color="#f2c14e" />
      <Flower position={[1.1, 0, 1.8]} color="#c191e8" />
      <Flower position={[1.6, 0, 0.2]} color="#f28fa4" />
      <Flower position={[-2.8, 0, -0.4]} color="#f4acb7" />
      <Flower position={[0.2, 0, -2.2]} color="#ffb703" />

      {/* Soft Contact Shadows & Orbit Controls */}
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={12} blur={2.2} />
      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2.15}
      />
    </Canvas>
  );
}
