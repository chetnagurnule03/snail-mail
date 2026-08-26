import React from 'react';
import { Sparkles } from '@react-three/drei';

/** -------------------------------------------------------------
 *  ORGANIC RESIDENTIAL NEIGHBORHOODS (12 Unique Storybook Cottages)
 * ------------------------------------------------------------- */
const VILLAGE_COTTAGES = [
  // Neighborhood 1: Garden Neighborhood (North-East)
  { id: 1, name: "Mia's Blossom Boutique", pos: [5.2, 0.12, -7.5], rot: -0.35, wallColor: '#e9c46a', roofColor: '#2a9d8f' },
  { id: 2, name: "Oliver's Gardener Cottage", pos: [8.6, 0.22, -9.2], rot: -0.85, wallColor: '#94c480', roofColor: '#c96850' },
  { id: 3, name: "Noah's Herbalist Haven", pos: [10.8, 0.18, -4.8], rot: -1.45, wallColor: '#f4a261', roofColor: '#e76f51' },

  // Neighborhood 2: Cozy Residential Corner (North-West)
  { id: 4, name: "Sophie's Artist Studio", pos: [-6.8, 0.15, -8.8], rot: 0.42, wallColor: '#c9a7e0', roofColor: '#2a9d8f' },
  { id: 5, name: "Clara's Weaver House", pos: [-10.4, 0.25, -6.2], rot: 1.15, wallColor: '#fae1c5', roofColor: '#e9c46a' },
  { id: 6, name: "Ivy's Botanist Lodge", pos: [-11.8, 0.32, -1.8], rot: 1.75, wallColor: '#c7f9cc', roofColor: '#2d6a4f' },

  // Neighborhood 3: Craftsman & Post Corner (South-West)
  { id: 7, name: "Leo's Snail Mail Post Office", pos: [-6.2, 0.08, 3.8], rot: 2.15, wallColor: '#f1faee', roofColor: '#e63946' },
  { id: 8, name: "Milo's Timber Workshop", pos: [-9.5, 0.18, 6.5], rot: 2.55, wallColor: '#d4a373', roofColor: '#7a4a2b' },
  { id: 9, name: "Jasper's Potter House", pos: [-5.8, 0.12, 10.2], rot: 2.85, wallColor: '#e07a5f', roofColor: '#6b4c35' },

  // Neighborhood 4: Quiet Library Corner (South-East)
  { id: 10, name: "Luna's Storybook Library", pos: [4.8, 0.1, 4.2], rot: -2.1, wallColor: '#a8dadc', roofColor: '#1d3557' },
  { id: 11, name: "Felix's Astronomer Tower", pos: [8.5, 0.28, 7.8], rot: -2.5, wallColor: '#a8dadc', roofColor: '#1d3557' },
  { id: 12, name: "Daisy's Honey Cottage", pos: [6.2, 0.14, 11.2], rot: -2.85, wallColor: '#ffe0bd', roofColor: '#ffb703' },
];

export default function VillageHouses() {
  return (
    <group>
      {VILLAGE_COTTAGES.map((c) => (
        <group key={c.id} position={c.pos} rotation={[0, c.rot, 0]}>
          {/* Main House Body */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.75, 1.8, 1.55]} />
            <meshStandardMaterial color={c.wallColor} roughness={0.7} />
          </mesh>

          {/* Roof */}
          <group position={[0, 2.1, 0]}>
            <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[1.6, 1.3, 4]} />
              <meshStandardMaterial color={c.roofColor} roughness={0.55} />
            </mesh>
            <mesh position={[0, -0.65, 0]}>
              <boxGeometry args={[1.82, 0.08, 1.62]} />
              <meshStandardMaterial color="#6b4c35" roughness={0.8} />
            </mesh>
          </group>

          {/* Door */}
          <group position={[0.2, 0.65, 0.79]}>
            <mesh castShadow>
              <boxGeometry args={[0.48, 0.9, 0.05]} />
              <meshStandardMaterial color="#7a4a2b" roughness={0.8} />
            </mesh>
            <mesh position={[0.16, 0, 0.04]}>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshStandardMaterial color="#ffb703" metalness={0.8} />
            </mesh>
          </group>

          {/* Windows (Front & Back) */}
          <mesh position={[-0.4, 1.0, 0.79]}>
            <boxGeometry args={[0.42, 0.42, 0.05]} />
            <meshStandardMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 1.0, -0.79]}>
            <boxGeometry args={[0.45, 0.45, 0.05]} />
            <meshStandardMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.6} />
          </mesh>

          {/* Chimney */}
          <group position={[-0.6, 2.0, -0.3]}>
            <mesh castShadow>
              <boxGeometry args={[0.34, 1.2, 0.34]} />
              <meshStandardMaterial color="#a89f91" roughness={0.9} />
            </mesh>
            <Sparkles position={[0, 0.8, 0]} count={10} scale={0.5} size={3} speed={0.4} color="#ffffff" />
          </group>

          {/* Mailbox */}
          <group position={[1.1, 0, 0.9]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.9, 10]} />
              <meshStandardMaterial color="#6b4c35" />
            </mesh>
            <mesh position={[0, 0.95, 0]} castShadow>
              <capsuleGeometry args={[0.18, 0.32, 6, 12]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#e07a5f" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
