import React from 'react';
import { Sparkles } from '@react-three/drei';

/** -------------------------------------------------------------
 *  SPACIOUS COUNTRYSIDE HAMLETS (20m - 35m House Spacing)
 * ------------------------------------------------------------- */
const VILLAGE_COTTAGES = [
  // Hamlet 1: North-West Woodland Hamlet (Radius ~28m)
  { id: 1, name: "Oliver's Gardener Cottage", pos: [-24.0, 0.2, -26.0], rot: 0.45, wallColor: '#94c480', roofColor: '#c96850' },
  { id: 2, name: "Sophie's Artist Studio", pos: [-32.0, 0.25, -20.0], rot: 0.95, wallColor: '#c9a7e0', roofColor: '#2a9d8f' },
  { id: 3, name: "Clara's Weaver House", pos: [-28.0, 0.22, -34.0], rot: 1.45, wallColor: '#fae1c5', roofColor: '#e9c46a' },

  // Hamlet 2: North-East Blossom Knoll (Radius ~30m)
  { id: 4, name: "Mia's Blossom Boutique", pos: [22.0, 0.18, -28.0], rot: -0.45, wallColor: '#e9c46a', roofColor: '#2a9d8f' },
  { id: 5, name: "Noah's Herbalist Haven", pos: [30.0, 0.22, -18.0], rot: -0.95, wallColor: '#f4a261', roofColor: '#e76f51' },
  { id: 6, name: "Ivy's Botanist Lodge", pos: [34.0, 0.26, -26.0], rot: -1.35, wallColor: '#c7f9cc', roofColor: '#2d6a4f' },

  // Hamlet 3: South-West Craftsman Creek (Radius ~28m)
  { id: 7, name: "Leo's Snail Mail Post Office", pos: [-26.0, 0.15, 12.0], rot: 2.15, wallColor: '#f1faee', roofColor: '#e63946' },
  { id: 8, name: "Milo's Timber Workshop", pos: [-34.0, 0.2, 22.0], rot: 2.55, wallColor: '#d4a373', roofColor: '#7a4a2b' },
  { id: 9, name: "Jasper's Potter House", pos: [-22.0, 0.12, 28.0], rot: 2.85, wallColor: '#e07a5f', roofColor: '#6b4c35' },

  // Hamlet 4: South-East Quiet Meadow (Radius ~32m)
  { id: 10, name: "Luna's Storybook Library", pos: [24.0, 0.14, 14.0], rot: -2.1, wallColor: '#a8dadc', roofColor: '#1d3557' },
  { id: 11, name: "Felix's Astronomer Tower", pos: [32.0, 0.18, 24.0], rot: -2.5, wallColor: '#a8dadc', roofColor: '#1d3557' },
  { id: 12, name: "Daisy's Honey Cottage", pos: [28.0, 0.16, 32.0], rot: -2.85, wallColor: '#ffe0bd', roofColor: '#ffb703' },
];

export default function VillageHouses() {
  return (
    <group>
      {VILLAGE_COTTAGES.map((c) => (
        <group key={c.id} position={c.pos} rotation={[0, c.rot, 0]}>
          {/* Main House Body */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.85, 1.8, 1.65]} />
            <meshStandardMaterial color={c.wallColor} roughness={0.7} />
          </mesh>

          {/* Roof */}
          <group position={[0, 2.1, 0]}>
            <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[1.7, 1.35, 4]} />
              <meshStandardMaterial color={c.roofColor} roughness={0.55} />
            </mesh>
            <mesh position={[0, -0.65, 0]}>
              <boxGeometry args={[1.92, 0.08, 1.72]} />
              <meshStandardMaterial color="#6b4c35" roughness={0.8} />
            </mesh>
          </group>

          {/* Door */}
          <group position={[0.2, 0.65, 0.84]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.92, 0.05]} />
              <meshStandardMaterial color="#7a4a2b" roughness={0.8} />
            </mesh>
            <mesh position={[0.17, 0, 0.04]}>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshStandardMaterial color="#ffb703" metalness={0.8} />
            </mesh>
          </group>

          {/* Windows (Front & Back) */}
          <mesh position={[-0.45, 1.0, 0.84]}>
            <boxGeometry args={[0.45, 0.45, 0.05]} />
            <meshStandardMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 1.0, -0.84]}>
            <boxGeometry args={[0.48, 0.48, 0.05]} />
            <meshStandardMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.6} />
          </mesh>

          {/* Chimney */}
          <group position={[-0.65, 2.0, -0.3]}>
            <mesh castShadow>
              <boxGeometry args={[0.36, 1.25, 0.36]} />
              <meshStandardMaterial color="#a89f91" roughness={0.9} />
            </mesh>
            <Sparkles position={[0, 0.85, 0]} count={12} scale={0.5} size={3} speed={0.4} color="#ffffff" />
          </group>

          {/* Mailbox */}
          <group position={[1.2, 0, 0.95]}>
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
