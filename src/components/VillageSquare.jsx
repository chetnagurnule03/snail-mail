import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

/** -------------------------------------------------------------
 *  SPACIOUS MARKET PLAZA (CENTER AT Z = -22m)
 * ------------------------------------------------------------- */
export default function VillageSquare({ position = [0, 0, -22] }) {
  const fountainWaterRef = useRef();

  useFrame((state) => {
    if (fountainWaterRef.current) {
      fountainWaterRef.current.position.y = 0.42 + Math.sin(state.clock.getElapsedTime() * 2) * 0.012;
      fountainWaterRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Spacious Cobblestone Plaza Base */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[8.5, 32]} />
        <meshStandardMaterial color="#cbb994" roughness={0.8} />
      </mesh>

      {/* ⛲ Central Stone Water Fountain */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.5, 0.5, 24]} />
          <meshStandardMaterial color="#a89f91" roughness={0.7} />
        </mesh>
        <mesh ref={fountainWaterRef} position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 24]} />
          <meshStandardMaterial color="#457b9d" roughness={0.1} metalness={0.2} transparent opacity={0.9} />
        </mesh>
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

      {/* 🥐 Theo's Bakery (North-West) */}
      <group position={[-5.8, 0.1, -4.5]} rotation={[0, 0.45, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 2.0, 1.7]} />
          <meshStandardMaterial color="#f4a261" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.1, 4]} />
          <meshStandardMaterial color="#c96850" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.25, 0.9]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1.7, 0.08, 0.5]} />
          <meshStandardMaterial color="#e76f51" />
        </mesh>
      </group>

      {/* ☕ Nora's Cozy Café (West) */}
      <group position={[-6.5, 0.15, 2.2]} rotation={[0, 1.15, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 2.0, 1.7]} />
          <meshStandardMaterial color="#fae1c5" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.1, 4]} />
          <meshStandardMaterial color="#7a4a2b" roughness={0.6} />
        </mesh>
      </group>

      {/* 🛍️ Emma's General Store (East) */}
      <group position={[5.8, 0.08, -4.5]} rotation={[0, -0.45, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 2.0, 1.7]} />
          <meshStandardMaterial color="#e07a5f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.1, 4]} />
          <meshStandardMaterial color="#f4a261" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
