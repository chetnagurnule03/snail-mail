import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

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
      {/* Cobblestone Plaza Base */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[9.5, 32]} />
        <meshToonMaterial color="#cbb994" />
      </mesh>

      {/* ⛲ Central Stone Water Fountain */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.5, 0.5, 24]} />
          <meshToonMaterial color="#a89f91" />
        </mesh>
        <mesh ref={fountainWaterRef} position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 24]} />
          <meshToonMaterial color="#457b9d" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.35, 0.9, 16]} />
          <meshToonMaterial color="#8a7e70" />
        </mesh>
        <Sparkles position={[0, 1.25, 0]} count={20} scale={1.2} size={3} speed={0.6} color="#e0f4f7" />
      </group>

      {/* ⛲ Stone Water Well */}
      <group position={[4.2, 0, 2.5]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.75, 0.7, 16]} />
          <meshToonMaterial color="#8a7e70" />
        </mesh>
        <mesh position={[0, 1.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.9, 0.6, 4]} />
          <meshToonMaterial color="#c96850" />
        </mesh>
      </group>

      {/* 🥐 Theo's Bakery & Market Stand */}
      <group position={[-5.8, 0.1, -4.5]} rotation={[0, 0.45, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 2.0, 1.7]} />
          <meshToonMaterial color="#f4a261" />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.1, 4]} />
          <meshToonMaterial color="#c96850" />
        </mesh>

        {/* 🧺 Fruit Baskets (Apples & Bananas) */}
        <group position={[1.2, 0.25, 0.6]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.2, 0.22, 12]} />
            <meshToonMaterial color="#d4a373" />
          </mesh>
          <mesh position={[0, 0.14, 0]} castShadow>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshToonMaterial color="#e63946" />
          </mesh>
        </group>
      </group>

      {/* ☕ Nora's Cozy Café */}
      <group position={[-6.5, 0.15, 2.2]} rotation={[0, 1.15, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 2.0, 1.7]} />
          <meshToonMaterial color="#fae1c5" />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.1, 4]} />
          <meshToonMaterial color="#7a4a2b" />
        </mesh>
      </group>

      {/* 🛍️ Emma's General Store */}
      <group position={[5.8, 0.08, -4.5]} rotation={[0, -0.45, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 2.0, 1.7]} />
          <meshToonMaterial color="#e07a5f" />
        </mesh>
        <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.7, 1.1, 4]} />
          <meshToonMaterial color="#f4a261" />
        </mesh>
      </group>
    </group>
  );
}
