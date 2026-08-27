import React from 'react';
import { Sparkles } from '@react-three/drei';

/** -------------------------------------------------------------
 *  12 UNIQUE VILLAGER COTTAGES WITH 5 ROOF COLOR THEMES (MATCHES REFERENCE SHEET)
 * ------------------------------------------------------------- */
const VILLAGE_COTTAGES = [
  // 🔴 TYPE 1: RED/ORANGE ROOF COTTAGES
  { id: 1, name: "Oliver's Gardener Cottage", gardenType: 'tomato', pos: [-24.0, 0.2, -26.0], rot: 0.45, wallColor: '#f4f1de', roofColor: '#e63946', trimColor: '#6b4c35' },
  { id: 7, name: "Leo's Snail Mail Post Office", gardenType: 'flower', pos: [-26.0, 0.15, 12.0], rot: 2.15, wallColor: '#f4f1de', roofColor: '#d62828', trimColor: '#8c5a3c' },

  // 🔵 TYPE 2: BRIGHT BLUE ROOF COTTAGES
  { id: 4, name: "Mia's Blossom Boutique", gardenType: 'sunflower', pos: [22.0, 0.18, -28.0], rot: -0.45, wallColor: '#f4f1de', roofColor: '#2a9d8f', trimColor: '#7a4a2b' },
  { id: 11, name: "Felix's Astronomer Tower", gardenType: 'berry', pos: [32.0, 0.18, 24.0], rot: -2.5, wallColor: '#fdf0d5', roofColor: '#457b9d', trimColor: '#5c381e' },

  // 🟣 TYPE 3: PURPLE ROOF COTTAGES
  { id: 2, name: "Sophie's Artist Studio", gardenType: 'flower', pos: [-32.0, 0.25, -20.0], rot: 0.95, wallColor: '#fdf0d5', roofColor: '#9c89b8', trimColor: '#5c381e' },
  { id: 10, name: "Luna's Storybook Library", gardenType: 'sunflower', pos: [24.0, 0.14, 14.0], rot: -2.1, wallColor: '#f4f1de', roofColor: '#7b2cbf', trimColor: '#7a4a2b' },

  // 🟡 TYPE 4: GOLDEN YELLOW/ORANGE ROOF COTTAGES
  { id: 3, name: "Clara's Weaver House", gardenType: 'corn', pos: [-28.0, 0.22, -34.0], rot: 1.45, wallColor: '#fae1c5', roofColor: '#e9c46a', trimColor: '#8c5a3c' },
  { id: 12, name: "Daisy's Honey Cottage", gardenType: 'sunflower', pos: [28.0, 0.16, 32.0], rot: -2.85, wallColor: '#ffe0bd', roofColor: '#ffb703', trimColor: '#8c5a3c' },

  // 🟤 TYPE 5: WARM BROWN ROOF COTTAGES
  { id: 5, name: "Noah's Herbalist Haven", gardenType: 'berry', pos: [30.0, 0.22, -18.0], rot: -0.95, wallColor: '#fdf0d5', roofColor: '#f4a261', trimColor: '#5c381e' },
  { id: 6, name: "Ivy's Botanist Lodge", gardenType: 'apple', pos: [34.0, 0.26, -26.0], rot: -1.35, wallColor: '#e8e8e4', roofColor: '#6b4c35', trimColor: '#3d2616' },
  { id: 8, name: "Milo's Timber Workshop", gardenType: 'corn', pos: [-34.0, 0.2, 22.0], rot: 2.55, wallColor: '#fdf0d5', roofColor: '#7a4a2b', trimColor: '#4a2c11' },
  { id: 9, name: "Jasper's Potter House", gardenType: 'tomato', pos: [-22.0, 0.12, 28.0], rot: 2.85, wallColor: '#fae1c5', roofColor: '#e07a5f', trimColor: '#3d2616' },
];

function UniqueFarmGarden({ type }) {
  return (
    <group position={[0, 0, 1.4]}>
      {/* Brick Soil Bed Border */}
      <mesh position={[0, 0.08, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.16, 1.0]} />
        <meshToonMaterial color="#6b4326" />
      </mesh>

      {/* Wooden Fence Rails */}
      <mesh position={[-0.75, 0.25, 0.6]} castShadow>
        <boxGeometry args={[0.06, 0.5, 1.0]} />
        <meshToonMaterial color="#8c5a3c" />
      </mesh>
      <mesh position={[0.75, 0.25, 0.6]} castShadow>
        <boxGeometry args={[0.06, 0.5, 1.0]} />
        <meshToonMaterial color="#8c5a3c" />
      </mesh>

      {/* 🌻 Giant Sunflowers Garden */}
      {type === 'sunflower' && (
        <group position={[0, 0.16, 0.6]}>
          {[-0.35, 0.35].map((x, idx) => (
            <group key={idx} position={[x, 0, 0]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.04, 0.7, 8]} />
                <meshToonMaterial color="#6bab4f" />
              </mesh>
              <group position={[0, 0.7, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.22, 16, 16]} />
                  <meshToonMaterial color="#ffd23f" />
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
          {/* [45% Height Weight] Main Cottage Wall Body (Cream/Off-White Low-Poly Cuboid) */}
          <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 1.35, 1.5]} />
            <meshToonMaterial color={c.wallColor} />
          </mesh>

          {/* Warm Pastel Wood Corner Posts */}
          {[-0.9, 0.9].map((x, i) =>
            [-0.75, 0.75].map((z, j) => (
              <mesh key={`${i}-${j}`} position={[x, 0.68, z]} castShadow>
                <boxGeometry args={[0.1, 1.35, 0.1]} />
                <meshToonMaterial color={c.trimColor} />
              </mesh>
            ))
          )}

          {/* [30% Height Weight] 4-Sided Pyramid Roof with 1.15x Overhang & Thick White Trim */}
          <group position={[0, 1.35, 0]}>
            <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[1.45, 0.85, 4]} />
              <meshToonMaterial color={c.roofColor} />
            </mesh>
            {/* Thick White/Cream Eaves Trim Edge */}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[2.08, 0.08, 1.74]} />
              <meshToonMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <boxGeometry args={[2.02, 0.06, 1.68]} />
              <meshToonMaterial color={c.trimColor} />
            </mesh>
          </group>

          {/* [15% Height Weight] Stone Chimney & Smoke Sparkles */}
          <group position={[-0.55, 1.7, -0.25]}>
            <mesh castShadow>
              <boxGeometry args={[0.32, 1.1, 0.32]} />
              <meshToonMaterial color="#a89f91" />
            </mesh>
            {/* Chimney Top Lip */}
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[0.38, 0.08, 0.38]} />
              <meshToonMaterial color="#8a7e70" />
            </mesh>
            <Sparkles position={[0, 0.75, 0]} count={10} scale={0.4} size={3} speed={0.4} color="#ffffff" />
          </group>

          {/* [10% Details] Front Porch Steps & Wooden Pillars */}
          <group position={[0.2, 0, 0.75]}>
            <mesh position={[0, 0.08, 0.2]} castShadow receiveShadow>
              <boxGeometry args={[0.75, 0.16, 0.4]} />
              <meshToonMaterial color="#8c5a3c" />
            </mesh>
            <mesh position={[-0.32, 0.52, 0.3]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.88, 8]} />
              <meshToonMaterial color={c.trimColor} />
            </mesh>
            <mesh position={[0.32, 0.52, 0.3]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.88, 8]} />
              <meshToonMaterial color={c.trimColor} />
            </mesh>
          </group>

          {/* Dark Brown Wooden Door & Knob */}
          <group position={[0.2, 0.54, 0.76]}>
            <mesh castShadow>
              <boxGeometry args={[0.48, 0.82, 0.04]} />
              <meshToonMaterial color="#4a2c11" />
            </mesh>
            <mesh position={[0.18, 0, 0.03]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshToonMaterial color="#ffb703" />
            </mesh>
          </group>

          {/* Glowing Windows with Wooden Frames & Flower Boxes */}
          <group position={[-0.45, 0.78, 0.76]}>
            <mesh castShadow>
              <boxGeometry args={[0.42, 0.42, 0.04]} />
              <meshToonMaterial color="#ffe3a8" emissive="#ffb703" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-0.24, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.03]} />
              <meshToonMaterial color={c.trimColor} />
            </mesh>
            <mesh position={[0.24, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.03]} />
              <meshToonMaterial color={c.trimColor} />
            </mesh>
            {/* Window Flower Box */}
            <mesh position={[0, -0.25, 0.06]} castShadow>
              <boxGeometry args={[0.48, 0.12, 0.14]} />
              <meshToonMaterial color="#6b4c35" />
            </mesh>
          </group>

          {/* Hanging Porch Lantern */}
          <group position={[0.62, 0.85, 0.78]}>
            <mesh castShadow>
              <boxGeometry args={[0.1, 0.16, 0.1]} />
              <meshToonMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.8} />
            </mesh>
          </group>

          {/* Individual Farm Garden Plot */}
          <UniqueFarmGarden type={c.gardenType} />
        </group>
      ))}
    </group>
  );
}
