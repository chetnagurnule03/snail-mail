import React from 'react';
import { Sparkles } from '@react-three/drei';

/** -------------------------------------------------------------
 *  CENTRAL MARKET PLAZA & VILLAGE SQUARE (MATCHES REFERENCE SHEET)
 * ------------------------------------------------------------- */
export default function VillageSquare({ position = [0, 0, -22.0] }) {
  return (
    <group position={position}>
      {/* 🏛️ Central Cobblestone Plaza Base */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7.5, 32]} />
        <meshToonMaterial color="#d4c7b0" />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[7.2, 7.6, 32]} />
        <meshToonMaterial color="#8a7e70" />
      </mesh>

      {/* ⛲ 1. Central Stone Water Fountain */}
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.4, 0.5, 16]} />
          <meshToonMaterial color="#a89f91" />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[2.0, 2.0, 0.42, 16]} />
          <meshToonMaterial color="#48cae4" transparent opacity={0.88} />
        </mesh>
        {/* Tier 2 Basin */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[1.0, 1.1, 0.35, 12]} />
          <meshToonMaterial color="#a89f91" />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.3, 12]} />
          <meshToonMaterial color="#48cae4" transparent opacity={0.88} />
        </mesh>
        {/* Top Spout & Water Sparkles */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshToonMaterial color="#a89f91" />
        </mesh>
        <Sparkles position={[0, 1.45, 0]} count={15} scale={1.2} size={3} speed={0.6} color="#ffffff" />
      </group>

      {/* 🪵 2. Red & White Striped Market Stall */}
      <group position={[-5.2, 0.1, -1.8]} rotation={[0, 0.5, 0]}>
        {/* Counter Base */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.9, 0.8]} />
          <meshToonMaterial color="#8c5a3c" />
        </mesh>
        {/* Striped Canopy (Red & White) */}
        <group position={[0, 1.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.8, 0.22, 1.0]} />
            <meshToonMaterial color="#e63946" />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[1.82, 0.04, 1.02]} />
            <meshToonMaterial color="#ffffff" />
          </mesh>
        </group>
        {/* Canopy Posts */}
        <mesh position={[-0.8, 0.95, 0.38]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[0.8, 0.95, 0.38]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
        {/* Fruit Baskets & Crates */}
        <mesh position={[-0.4, 0.95, 0.1]} castShadow>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshToonMaterial color="#ffb703" />
        </mesh>
        <mesh position={[0.4, 0.95, 0.1]} castShadow>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshToonMaterial color="#e63946" />
        </mesh>
      </group>

      {/* 🪣 3. Stone Water Well */}
      <group position={[5.2, 0.1, -2.2]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.85, 0.8, 12]} />
          <meshToonMaterial color="#8a7e70" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.72, 12]} />
          <meshToonMaterial color="#3a86c8" />
        </mesh>
        {/* Wooden Roof Frame */}
        <mesh position={[-0.7, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[0.7, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[0, 1.55, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[1.0, 0.6, 4]} />
          <meshToonMaterial color="#c96850" />
        </mesh>
      </group>

      {/* 📮 4. Post Office Mailbox */}
      <group position={[-2.8, 0.1, 4.5]} rotation={[0, 0.2, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.26, 0.32, 0.22]} />
          <meshToonMaterial color="#e63946" />
        </mesh>
      </group>

      {/* 🏮 5. Street Lanterns & Plaza Benches */}
      {[
        [-4.5, 0.1, 3.5, 0.4],
        [4.5, 0.1, 3.5, -0.4],
        [-4.5, 0.1, -4.5, 0.8],
        [4.5, 0.1, -4.5, -0.8],
      ].map((p, idx) => (
        <group key={idx} position={[p[0], p[1], p[2]]} rotation={[0, p[3], 0]}>
          {/* Street Lamp Post */}
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

      {/* Wooden Benches */}
      <group position={[-3.2, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.4]} />
          <meshToonMaterial color="#7a4a2b" />
        </mesh>
        <mesh position={[0, 0.45, -0.18]} castShadow>
          <boxGeometry args={[1.2, 0.35, 0.06]} />
          <meshToonMaterial color="#7a4a2b" />
        </mesh>
      </group>
      <group position={[3.2, 0.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.4]} />
          <meshToonMaterial color="#7a4a2b" />
        </mesh>
        <mesh position={[0, 0.45, -0.18]} castShadow>
          <boxGeometry args={[1.2, 0.35, 0.06]} />
          <meshToonMaterial color="#7a4a2b" />
        </mesh>
      </group>
    </group>
  );
}
