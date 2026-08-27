import React from 'react';
import { Sparkles, Outlines } from '@react-three/drei';

function ToonOutline({ thickness = 0.025, color = '#2b2013' }) {
  return <Outlines thickness={thickness} color={color} screenspace={false} />;
}

/** -------------------------------------------------------------
 *  VIBRANT FARM GAME GARDENS (SUNFLOWERS, CORN, TOMATOES, BRICK BEDS)
 * ------------------------------------------------------------- */
const VILLAGE_COTTAGES = [
  // Hamlet 1: North-West Woodland Hamlet
  { id: 1, name: "Oliver's Gardener Cottage", gardenType: 'tomato', pos: [-24.0, 0.2, -26.0], rot: 0.45, wallColor: '#94c480', roofColor: '#c96850' },
  { id: 2, name: "Sophie's Artist Studio", gardenType: 'flower', pos: [-32.0, 0.25, -20.0], rot: 0.95, wallColor: '#c9a7e0', roofColor: '#2a9d8f' },
  { id: 3, name: "Clara's Weaver House", gardenType: 'corn', pos: [-28.0, 0.22, -34.0], rot: 1.45, wallColor: '#fae1c5', roofColor: '#e9c46a' },

  // Hamlet 2: North-East Blossom Knoll
  { id: 4, name: "Mia's Blossom Boutique", gardenType: 'sunflower', pos: [22.0, 0.18, -28.0], rot: -0.45, wallColor: '#e9c46a', roofColor: '#2a9d8f' },
  { id: 5, name: "Noah's Herbalist Haven", gardenType: 'berry', pos: [30.0, 0.22, -18.0], rot: -0.95, wallColor: '#f4a261', roofColor: '#e76f51' },
  { id: 6, name: "Ivy's Botanist Lodge", gardenType: 'apple', pos: [34.0, 0.26, -26.0], rot: -1.35, wallColor: '#c7f9cc', roofColor: '#2d6a4f' },

  // Hamlet 3: South-West Craftsman Creek
  { id: 7, name: "Leo's Snail Mail Post Office", gardenType: 'flower', pos: [-26.0, 0.15, 12.0], rot: 2.15, wallColor: '#f1faee', roofColor: '#e63946' },
  { id: 8, name: "Milo's Timber Workshop", gardenType: 'corn', pos: [-34.0, 0.2, 22.0], rot: 2.55, wallColor: '#d4a373', roofColor: '#7a4a2b' },
  { id: 9, name: "Jasper's Potter House", gardenType: 'tomato', pos: [-22.0, 0.12, 28.0], rot: 2.85, wallColor: '#e07a5f', roofColor: '#6b4c35' },

  // Hamlet 4: South-East Quiet Meadow
  { id: 10, name: "Luna's Storybook Library", gardenType: 'sunflower', pos: [24.0, 0.14, 14.0], rot: -2.1, wallColor: '#a8dadc', roofColor: '#1d3557' },
  { id: 11, name: "Felix's Astronomer Tower", gardenType: 'berry', pos: [32.0, 0.18, 24.0], rot: -2.5, wallColor: '#a8dadc', roofColor: '#1d3557' },
  { id: 12, name: "Daisy's Honey Cottage", gardenType: 'sunflower', pos: [28.0, 0.16, 32.0], rot: -2.85, wallColor: '#ffe0bd', roofColor: '#ffb703' },
];

function UniqueFarmGarden({ type }) {
  return (
    <group position={[0, 0, 1.4]}>
      {/* Brick Soil Plot Border */}
      <mesh position={[0, 0.08, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.16, 1.0]} />
        <meshToonMaterial color="#6b4326" />
        <ToonOutline thickness={0.02} />
      </mesh>

      {/* 🌻 Giant Sunflowers Garden */}
      {type === 'sunflower' && (
        <group position={[0, 0.16, 0.6]}>
          {[-0.35, 0.35].map((x, idx) => (
            <group key={idx} position={[x, 0, 0]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.04, 0.7, 8]} />
                <meshToonMaterial color="#6bab4f" />
                <ToonOutline thickness={0.015} />
              </mesh>
              <group position={[0, 0.7, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.22, 16, 16]} />
                  <meshToonMaterial color="#ffd23f" />
                  <ToonOutline thickness={0.02} />
                </mesh>
                <mesh position={[0, 0, 0.08]}>
                  <sphereGeometry args={[0.1, 12, 12]} />
                  <meshToonMaterial color="#4a2c11" />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      )}

      {/* 🍅 Tomato Crop Plot */}
      {type === 'tomato' && (
        <group position={[0, 0.16, 0.6]}>
          {[-0.4, 0, 0.4].map((x, idx) => (
            <group key={idx} position={[x, 0, 0]}>
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.02, 0.03, 0.5, 6]} />
                <meshToonMaterial color="#70e000" />
              </mesh>
              <mesh position={[0, 0.35, 0.05]} castShadow>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshToonMaterial color="#e63946" />
                <ToonOutline thickness={0.015} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 🌽 Corn Stalk Field */}
      {type === 'corn' && (
        <group position={[0, 0.16, 0.6]}>
          {[-0.35, 0.35].map((x, idx) => (
            <group key={idx} position={[x, 0, 0]}>
              <mesh position={[0, 0.45, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.06, 0.9, 8]} />
                <meshToonMaterial color="#38b000" />
                <ToonOutline thickness={0.02} />
              </mesh>
              <mesh position={[0.06, 0.45, 0]} rotation={[0, 0, -0.3]} castShadow>
                <capsuleGeometry args={[0.06, 0.22, 6, 12]} />
                <meshToonMaterial color="#ffb703" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 🫐 Blueberry Bushes */}
      {type === 'berry' && (
        <group position={[0, 0.16, 0.6]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.3, 14, 14]} />
            <meshToonMaterial color="#2d6a4f" />
            <ToonOutline thickness={0.02} />
          </mesh>
          <mesh position={[0.1, 0.3, 0.2]} castShadow>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshToonMaterial color="#4361ee" />
          </mesh>
          <mesh position={[-0.1, 0.22, 0.2]} castShadow>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshToonMaterial color="#4361ee" />
          </mesh>
        </group>
      )}

      {/* 🚿 Watering Can Accessory */}
      <group position={[0.7, 0.12, 0.4]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.24, 10]} />
          <meshToonMaterial color="#457b9d" />
          <ToonOutline thickness={0.015} />
        </mesh>
      </group>
    </group>
  );
}

export default function VillageHouses() {
  return (
    <group>
      {VILLAGE_COTTAGES.map((c) => (
        <group key={c.id} position={c.pos} rotation={[0, c.rot, 0]}>
          {/* Main House Body */}
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.85, 1.8, 1.65]} />
            <meshToonMaterial color={c.wallColor} />
            <ToonOutline thickness={0.03} />
          </mesh>

          {/* Roof */}
          <group position={[0, 2.1, 0]}>
            <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[1.7, 1.35, 4]} />
              <meshToonMaterial color={c.roofColor} />
              <ToonOutline thickness={0.03} />
            </mesh>
            <mesh position={[0, -0.65, 0]}>
              <boxGeometry args={[1.92, 0.08, 1.72]} />
              <meshToonMaterial color="#6b4c35" />
            </mesh>
          </group>

          {/* Door */}
          <group position={[0.2, 0.65, 0.84]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.92, 0.05]} />
              <meshToonMaterial color="#7a4a2b" />
              <ToonOutline thickness={0.02} />
            </mesh>
          </group>

          {/* Windows */}
          <mesh position={[-0.45, 1.0, 0.84]}>
            <boxGeometry args={[0.45, 0.45, 0.05]} />
            <meshToonMaterial color="#ffdda1" emissive="#ffb703" emissiveIntensity={0.6} />
          </mesh>

          {/* Unique Farm Garden */}
          <UniqueFarmGarden type={c.gardenType} />

          {/* Chimney */}
          <group position={[-0.65, 2.0, -0.3]}>
            <mesh castShadow>
              <boxGeometry args={[0.36, 1.25, 0.36]} />
              <meshToonMaterial color="#a89f91" />
              <ToonOutline thickness={0.025} />
            </mesh>
            <Sparkles position={[0, 0.85, 0]} count={12} scale={0.5} size={3} speed={0.4} color="#ffffff" />
          </group>
        </group>
      ))}
    </group>
  );
}
