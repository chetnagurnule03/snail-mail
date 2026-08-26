import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

/** -------------------------------------------------------------
 *  VILLAGE SQUARE: Fountain, 6 Shops, Benches & Street Lanterns
 * ------------------------------------------------------------- */
export default function VillageSquare({ position = [0, 0, -6] }) {
  const fountainWaterRef = useRef();

  useFrame((state) => {
    if (fountainWaterRef.current) {
      fountainWaterRef.current.position.y = 0.42 + Math.sin(state.clock.getElapsedTime() * 2) * 0.012;
      fountainWaterRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Cobblestone Village Plaza Circle */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.2, 32]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.0, 5.3, 32]} />
        <meshStandardMaterial color="#8c7a5c" roughness={0.9} />
      </mesh>

      {/* ⛲ Central Stone Water Fountain */}
      <group position={[0, 0, 0]}>
        {/* Basin */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.5, 24]} />
          <meshStandardMaterial color="#a89f91" roughness={0.7} />
        </mesh>
        {/* Fountain Water */}
        <mesh ref={fountainWaterRef} position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.1, 24]} />
          <meshStandardMaterial color="#457b9d" roughness={0.1} metalness={0.2} transparent opacity={0.9} />
        </mesh>
        {/* Center Pillar & Bowl */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.35, 0.9, 16]} />
          <meshStandardMaterial color="#8a7e70" />
        </mesh>
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.2, 0.3, 16]} />
          <meshStandardMaterial color="#8a7e70" />
        </mesh>
        <Sparkles position={[0, 1.25, 0]} count={20} scale={1.2} size={3} speed={0.6} color="#e0f4f7" />
      </group>

      {/* 🥐 Shop 1: Theo's Bakery (North West) */}
      <group position={[-3.8, 0, -3.2]} rotation={[0, 0.4, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.0, 1.6]} />
          <meshStandardMaterial color="#f4a261" roughness={0.7} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.6, 1.1, 4]} />
          <meshStandardMaterial color="#c96850" roughness={0.6} />
        </mesh>
        {/* Bakery Awning */}
        <mesh position={[0, 1.25, 0.85]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1.6, 0.08, 0.5]} />
          <meshStandardMaterial color="#e76f51" />
        </mesh>
        {/* Door & Window */}
        <mesh position={[-0.3, 0.6, 0.82]}>
          <boxGeometry args={[0.45, 0.9, 0.04]} />
          <meshStandardMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[0.35, 0.8, 0.82]}>
          <boxGeometry args={[0.5, 0.5, 0.04]} />
          <meshStandardMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* 🌷 Shop 2: Mia's Blossom Boutique (North East) */}
      <group position={[3.8, 0, -3.2]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.0, 1.6]} />
          <meshStandardMaterial color="#e9c46a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.6, 1.1, 4]} />
          <meshStandardMaterial color="#2a9d8f" roughness={0.6} />
        </mesh>
        {/* Floral Arch */}
        <mesh position={[0, 1.1, 0.85]}>
          <torusGeometry args={[0.5, 0.06, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#ffb5a7" />
        </mesh>
        <mesh position={[-0.3, 0.6, 0.82]}>
          <boxGeometry args={[0.45, 0.9, 0.04]} />
          <meshStandardMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[0.35, 0.8, 0.82]}>
          <boxGeometry args={[0.5, 0.5, 0.04]} />
          <meshStandardMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* ☕ Shop 3: Nora's Cozy Café (West) */}
      <group position={[-4.5, 0, 0.5]} rotation={[0, 1.2, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.0, 1.6]} />
          <meshStandardMaterial color="#fae1c5" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.6, 1.1, 4]} />
          <meshStandardMaterial color="#7a4a2b" roughness={0.6} />
        </mesh>
        {/* Bistro Table */}
        <mesh position={[0, 0.35, 1.2]} castShadow>
          <cylinderGeometry args={[0.35, 0.05, 0.7, 12]} />
          <meshStandardMaterial color="#6b4c35" />
        </mesh>
      </group>

      {/* 📚 Shop 4: Luna's Storybook Library (East) */}
      <group position={[4.5, 0, 0.5]} rotation={[0, -1.2, 0]}>
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 2.2, 1.7]} />
          <meshStandardMaterial color="#a8dadc" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.2, 4]} />
          <meshStandardMaterial color="#1d3557" roughness={0.6} />
        </mesh>
      </group>

      {/* 🛍️ Shop 5: Emma's General Store (South West) */}
      <group position={[-3.6, 0, 3.8]} rotation={[0, 2.4, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.0, 1.6]} />
          <meshStandardMaterial color="#e07a5f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.6, 1.1, 4]} />
          <meshStandardMaterial color="#f4a261" roughness={0.6} />
        </mesh>
      </group>

      {/* 📮 Shop 6: Leo's Snail Mail Post Office (South East) */}
      <group position={[3.6, 0, 3.8]} rotation={[0, -2.4, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.0, 1.6]} />
          <meshStandardMaterial color="#f1faee" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.6, 1.1, 4]} />
          <meshStandardMaterial color="#e63946" roughness={0.6} />
        </mesh>
        {/* Post Box */}
        <mesh position={[0.7, 0.45, 0.9]} castShadow>
          <boxGeometry args={[0.25, 0.55, 0.25]} />
          <meshStandardMaterial color="#e63946" />
        </mesh>
      </group>

      {/* Wooden Benches around Square */}
      {[-2.2, 2.2].map((x, idx) => (
        <group key={idx} position={[x, 0, 2.0]} rotation={[0, idx === 0 ? 0.3 : -0.3, 0]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[0.9, 0.08, 0.35]} />
            <meshStandardMaterial color="#7a4a2b" />
          </mesh>
          <mesh position={[-0.35, 0.12, 0]} castShadow>
            <boxGeometry args={[0.08, 0.24, 0.3]} />
            <meshStandardMaterial color="#4a2c11" />
          </mesh>
          <mesh position={[0.35, 0.12, 0]} castShadow>
            <boxGeometry args={[0.08, 0.24, 0.3]} />
            <meshStandardMaterial color="#4a2c11" />
          </mesh>
        </group>
      ))}

      {/* Street Lanterns */}
      {[-3.0, 3.0].map((x, idx) => (
        <group key={idx} position={[x, 0, -1.8]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 1.5, 10]} />
            <meshStandardMaterial color="#2b180a" />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
