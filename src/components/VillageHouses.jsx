import React from 'react';
import { Sparkles } from '@react-three/drei';

/** -------------------------------------------------------------
 *  RESIDENTIAL VILLAGE HOUSES (12 Unique Storybook Cottages)
 * ------------------------------------------------------------- */
const VILLAGE_COTTAGES = [
  { id: 1, name: "Oliver's Gardener Cottage", pos: [-8.5, 0, -6.5], rot: 0.5, wallColor: '#94c480', roofColor: '#c96850' },
  { id: 2, name: "Sophie's Artist Studio", pos: [8.5, 0, -6.5], rot: -0.5, wallColor: '#c9a7e0', roofColor: '#2a9d8f' },
  { id: 3, name: "Milo's Timber Workshop", pos: [-10.2, 0, -2.2], rot: 1.1, wallColor: '#d4a373', roofColor: '#7a4a2b' },
  { id: 4, name: "Noah's Herbalist Haven", pos: [10.2, 0, -2.2], rot: -1.1, wallColor: '#f4a261', roofColor: '#e76f51' },
  { id: 5, name: "Clara's Weaver House", pos: [-9.8, 0, 3.5], rot: 1.8, wallColor: '#fae1c5', roofColor: '#e9c46a' },
  { id: 6, name: "Felix's Astronomer Tower", pos: [9.8, 0, 3.5], rot: -1.8, wallColor: '#a8dadc', roofColor: '#1d3557' },
  { id: 7, name: "Daisy's Honey Cottage", pos: [-7.5, 0, 8.2], rot: 2.4, wallColor: '#ffe0bd', roofColor: '#ffb703' },
  { id: 8, name: "Jasper's Potter House", pos: [7.5, 0, 8.2], rot: -2.4, wallColor: '#e07a5f', roofColor: '#6b4c35' },
  { id: 9, name: "Violet's Flower Nook", pos: [-5.2, 0, 11.5], rot: 2.9, wallColor: '#b5e2fa', roofColor: '#c77dff' },
  { id: 10, name: "Rowan's Toymaker House", pos: [5.2, 0, 11.5], rot: -2.9, wallColor: '#fbf8cc', roofColor: '#e63946' },
  { id: 11, name: "Ivy's Botanist Lodge", pos: [-11.5, 0, -10.5], rot: 0.2, wallColor: '#c7f9cc', roofColor: '#2d6a4f' },
  { id: 12, name: "Barnaby's Clockmaker Nook", pos: [11.5, 0, -10.5], rot: -0.2, wallColor: '#ffcad4', roofColor: '#b5e2fa' },
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
