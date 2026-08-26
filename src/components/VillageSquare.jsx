import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

/** -------------------------------------------------------------
 *  MARKET CORNER (ASYMMETRICAL VILLAGE SQUARE)
 * ------------------------------------------------------------- */
export default function VillageSquare({ position = [-1.5, 0, -5.5] }) {
  const fountainWaterRef = useRef();

  useFrame((state) => {
    if (fountainWaterRef.current) {
      fountainWaterRef.current.position.y = 0.42 + Math.sin(state.clock.getElapsedTime() * 2) * 0.012;
      fountainWaterRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Irregular Plaza Cobblestone Base */}
      <mesh position={[-0.4, 0.01, 0.2]} rotation={[-Math.PI / 2, 0, 0.3]} receiveShadow>
        <planeGeometry args={[7.2, 6.5]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>

      {/* ⛲ Off-Center Stone Water Fountain */}
      <group position={[-0.8, 0, -0.5]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.3, 0.5, 20]} />
          <meshStandardMaterial color="#a89f91" roughness={0.7} />
        </mesh>
        <mesh ref={fountainWaterRef} position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.0, 20]} />
          <meshStandardMaterial color="#457b9d" roughness={0.1} metalness={0.2} transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.32, 0.9, 14]} />
          <meshStandardMaterial color="#8a7e70" />
        </mesh>
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.18, 0.3, 14]} />
          <meshStandardMaterial color="#8a7e70" />
        </mesh>
        <Sparkles position={[0, 1.25, 0]} count={16} scale={1.1} size={3} speed={0.6} color="#e0f4f7" />
      </group>

      {/* 🥐 Theo's Bakery (North-West) */}
      <group position={[-3.6, 0.1, -2.8]} rotation={[0, 0.45, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.0, 1.6]} />
          <meshStandardMaterial color="#f4a261" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.6, 1.1, 4]} />
          <meshStandardMaterial color="#c96850" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.25, 0.85]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1.6, 0.08, 0.5]} />
          <meshStandardMaterial color="#e76f51" />
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

      {/* ☕ Nora's Cozy Café (West) */}
      <group position={[-4.2, 0.15, 1.4]} rotation={[0, 1.15, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.85, 2.0, 1.65]} />
          <meshStandardMaterial color="#fae1c5" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.65, 1.1, 4]} />
          <meshStandardMaterial color="#7a4a2b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.35, 1.2]} castShadow>
          <cylinderGeometry args={[0.35, 0.05, 0.7, 12]} />
          <meshStandardMaterial color="#6b4c35" />
        </mesh>
      </group>

      {/* 🛍️ Emma's General Store (East) */}
      <group position={[2.8, 0.08, -3.5]} rotation={[0, -0.6, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 2.0, 1.6]} />
          <meshStandardMaterial color="#e07a5f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.6, 1.1, 4]} />
          <meshStandardMaterial color="#f4a261" roughness={0.6} />
        </mesh>
      </group>

      {/* Market Stall Crates & Benches (Uneven Distribution) */}
      <group position={[1.2, 0.2, 0.8]} rotation={[0, -0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.4, 0.5]} />
          <meshStandardMaterial color="#8c5a3c" />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#e63946" />
        </mesh>
      </group>

      <group position={[-2.4, 0, 1.8]} rotation={[0, 0.8, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.9, 0.08, 0.35]} />
          <meshStandardMaterial color="#7a4a2b" />
        </mesh>
      </group>
    </group>
  );
}
