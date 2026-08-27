import React from 'react';
import { Sparkles } from '@react-three/drei';

/** -------------------------------------------------------------
 *  12 UNIQUE VILLAGER COTTAGES ACROSS 6 ROOF COLORS (RED, BLUE, PURPLE, YELLOW, BROWN, GREEN)
 * ------------------------------------------------------------- */
const VILLAGE_COTTAGES = [
  // 🔴 TYPE 1: RED/ORANGE ROOF COTTAGES
  { id: 1, name: "Oliver's Gardener Cottage", gardenType: 'crops', pos: [-24.0, 0.2, -26.0], rot: 0.45, wallColor: '#f4f1de', roofColor: '#e63946', trimColor: '#6b4c35' },
  { id: 7, name: "Leo's Snail Mail Post Office", gardenType: 'flowers', pos: [-26.0, 0.15, 12.0], rot: 2.15, wallColor: '#f4f1de', roofColor: '#d62828', trimColor: '#8c5a3c' },

  // 🔵 TYPE 2: BRIGHT BLUE ROOF COTTAGES
  { id: 4, name: "Mia's Blossom Boutique", gardenType: 'flowers', pos: [22.0, 0.18, -28.0], rot: -0.45, wallColor: '#f4f1de', roofColor: '#2a9d8f', trimColor: '#7a4a2b' },
  { id: 11, name: "Felix's Astronomer Tower", gardenType: 'berry', pos: [32.0, 0.18, 24.0], rot: -2.5, wallColor: '#fdf0d5', roofColor: '#457b9d', trimColor: '#5c381e' },

  // 🟣 TYPE 3: PURPLE ROOF COTTAGES
  { id: 2, name: "Sophie's Artist Studio", gardenType: 'flowers', pos: [-32.0, 0.25, -20.0], rot: 0.95, wallColor: '#fdf0d5', roofColor: '#9c89b8', trimColor: '#5c381e' },
  { id: 10, name: "Luna's Storybook Library", gardenType: 'sunflower', pos: [24.0, 0.14, 14.0], rot: -2.1, wallColor: '#f4f1de', roofColor: '#7b2cbf', trimColor: '#7a4a2b' },

  // 🟡 TYPE 4: GOLDEN YELLOW ROOF COTTAGES
  { id: 3, name: "Clara's Weaver House", gardenType: 'corn', pos: [-28.0, 0.22, -34.0], rot: 1.45, wallColor: '#fae1c5', roofColor: '#e9c46a', trimColor: '#8c5a3c' },
  { id: 12, name: "Daisy's Honey Cottage", gardenType: 'sunflower', pos: [28.0, 0.16, 32.0], rot: -2.85, wallColor: '#ffe0bd', roofColor: '#ffb703', trimColor: '#8c5a3c' },

  // 🟤 TYPE 5: WARM BROWN ROOF COTTAGES
  { id: 5, name: "Noah's Herbalist Haven", gardenType: 'berry', pos: [30.0, 0.22, -18.0], rot: -0.95, wallColor: '#fdf0d5', roofColor: '#f4a261', trimColor: '#5c381e' },
  { id: 9, name: "Jasper's Potter House", gardenType: 'crops', pos: [-22.0, 0.12, 28.0], rot: 2.85, wallColor: '#fae1c5', roofColor: '#e07a5f', trimColor: '#3d2616' },

  // 🟢 TYPE 6: SAGE GREEN ROOF COTTAGES
  { id: 6, name: "Ivy's Botanist Lodge", gardenType: 'crops', pos: [34.0, 0.26, -26.0], rot: -1.35, wallColor: '#e8e8e4', roofColor: '#52b788', trimColor: '#2d6a4f' },
  { id: 8, name: "Milo's Timber Workshop", gardenType: 'corn', pos: [-34.0, 0.2, 22.0], rot: 2.55, wallColor: '#fdf0d5', roofColor: '#40916c', trimColor: '#1b4332' },
];

/** -------------------------------------------------------------
 *  LARGE FENCED FLOWER & CROP GARDENS WITH WOODEN POST-AND-RAIL FENCES
 * ------------------------------------------------------------- */
function LargeFencedCottageGarden({ gardenType }) {
  return (
    <group position={[0, 0, 1.8]}>
      {/* Soil Bed Base */}
      <mesh position={[0, 0.08, 0.9]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.16, 1.6]} />
        <meshToonMaterial color="#6b4326" />
      </mesh>

      {/* Chunky Wooden Post-and-Rail Fence */}
      <group position={[0, 0, 0]}>
        {/* Posts */}
        {[-1.25, 1.25].map((x, i) =>
          [0.1, 1.7].map((z, j) => (
            <mesh key={`post-${i}-${j}`} position={[x, 0.35, z]} castShadow>
              <boxGeometry args={[0.1, 0.7, 0.1]} />
              <meshToonMaterial color="#8c5a3c" />
            </mesh>
          ))
        )}
        {/* Horizontal Rails */}
        <mesh position={[-1.25, 0.42, 0.9]} castShadow>
          <boxGeometry args={[0.06, 0.1, 1.6]} />
          <meshToonMaterial color="#8c5a3c" />
        </mesh>
        <mesh position={[1.25, 0.42, 0.9]} castShadow>
          <boxGeometry args={[0.06, 0.1, 1.6]} />
          <meshToonMaterial color="#8c5a3c" />
        </mesh>
        <mesh position={[0, 0.42, 1.7]} castShadow>
          <boxGeometry args={[2.5, 0.1, 0.06]} />
          <meshToonMaterial color="#8c5a3c" />
        </mesh>
      </group>

      {/* Wooden Crop Signboard */}
      <group position={[0.7, 0.5, 1.72]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.25, 0.04]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.04, 0.3, 0.04]} />
          <meshToonMaterial color="#4a2c11" />
        </mesh>
      </group>

      {/* 🌹🌻🌼🌷 LARGE FLOWER GARDEN PLOT */}
      {(gardenType === 'flowers' || gardenType === 'sunflower') && (
        <group position={[0, 0.16, 0.9]}>
          {/* Row 1: Giant Sunflowers */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((x, idx) => (
            <group key={`sun-${idx}`} position={[x, 0, -0.4]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.04, 0.7, 8]} />
                <meshToonMaterial color="#6bab4f" />
              </mesh>
              <group position={[0, 0.7, 0]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.2, 14, 14]} />
                  <meshToonMaterial color="#ffd23f" />
                </mesh>
                <mesh position={[0, 0, 0.07]}>
                  <sphereGeometry args={[0.09, 10, 10]} />
                  <meshToonMaterial color="#4a2c11" />
                </mesh>
              </group>
            </group>
          ))}

          {/* Row 2: Red Roses & Pink Blossoms */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((x, idx) => (
            <group key={`rose-${idx}`} position={[x, 0, 0]}>
              <mesh position={[0, 0.22, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.035, 0.44, 6]} />
                <meshToonMaterial color="#6bab4f" />
              </mesh>
              <mesh position={[0, 0.44, 0]} castShadow>
                <sphereGeometry args={[0.15, 12, 12]} />
                <meshToonMaterial color={idx % 2 === 0 ? '#e63946' : '#ff4d6d'} />
              </mesh>
            </group>
          ))}

          {/* Row 3: White Daisies & Purple Tulips */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((x, idx) => (
            <group key={`tulip-${idx}`} position={[x, 0, 0.4]}>
              <mesh position={[0, 0.2, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.035, 0.4, 6]} />
                <meshToonMaterial color="#6bab4f" />
              </mesh>
              <mesh position={[0, 0.4, 0]} castShadow>
                <sphereGeometry args={[0.14, 12, 12]} />
                <meshToonMaterial color={idx % 2 === 0 ? '#ffffff' : '#7209b7'} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 🥕🍅🥬🎃 LARGE FARM CROP PLOT */}
      {(gardenType === 'crops' || gardenType === 'tomato' || gardenType === 'corn' || gardenType === 'berry') && (
        <group position={[0, 0.16, 0.9]}>
          {/* Row 1: Tomatoes */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((x, idx) => (
            <group key={`tom-${idx}`} position={[x, 0, -0.4]}>
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.02, 0.03, 0.5, 6]} />
                <meshToonMaterial color="#70e000" />
              </mesh>
              <mesh position={[0, 0.35, 0.05]} castShadow>
                <sphereGeometry args={[0.13, 12, 12]} />
                <meshToonMaterial color="#e63946" />
              </mesh>
            </group>
          ))}

          {/* Row 2: Carrots & Cabbages */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((x, idx) => (
            <group key={`cab-${idx}`} position={[x, 0, 0]}>
              <mesh position={[0, 0.12, 0]} castShadow>
                <sphereGeometry args={[0.15, 12, 12]} />
                <meshToonMaterial color={idx % 2 === 0 ? '#38b000' : '#ffb703'} />
              </mesh>
            </group>
          ))}

          {/* Row 3: Pumpkins */}
          {[-0.6, 0, 0.6].map((x, idx) => (
            <group key={`pump-${idx}`} position={[x, 0, 0.4]}>
              <mesh position={[0, 0.16, 0]} castShadow>
                <sphereGeometry args={[0.22, 14, 14]} />
                <meshToonMaterial color="#fb8500" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 🚿 Watering Can Accessory */}
      <group position={[1.0, 0.12, 0.5]} rotation={[0, 0.5, 0]}>
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
          {/* Main Cottage Wall Body */}
          <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 1.35, 1.5]} />
            <meshToonMaterial color={c.wallColor} />
          </mesh>

          {/* Warm Wood Corner Posts */}
          {[-0.9, 0.9].map((x, i) =>
            [-0.75, 0.75].map((z, j) => (
              <mesh key={`${i}-${j}`} position={[x, 0.68, z]} castShadow>
                <boxGeometry args={[0.1, 1.35, 0.1]} />
                <meshToonMaterial color={c.trimColor} />
              </mesh>
            ))
          )}

          {/* 4-Sided Pyramid Roof with White Trim (6 Roof Colors) */}
          <group position={[0, 1.35, 0]}>
            <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[1.45, 0.85, 4]} />
              <meshToonMaterial color={c.roofColor} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[2.08, 0.08, 1.74]} />
              <meshToonMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <boxGeometry args={[2.02, 0.06, 1.68]} />
              <meshToonMaterial color={c.trimColor} />
            </mesh>
          </group>

          {/* Stone Chimney & Smoke Sparkles */}
          <group position={[-0.55, 1.7, -0.25]}>
            <mesh castShadow>
              <boxGeometry args={[0.32, 1.1, 0.32]} />
              <meshToonMaterial color="#a89f91" />
            </mesh>
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[0.38, 0.08, 0.38]} />
              <meshToonMaterial color="#8a7e70" />
            </mesh>
            <Sparkles position={[0, 0.75, 0]} count={10} scale={0.4} size={3} speed={0.4} color="#ffffff" />
          </group>

          {/* Front Porch Steps & Wooden Pillars */}
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

          {/* Glowing Windows with Yellow Sun-Shade Awnings & Flower Boxes */}
          <group position={[-0.45, 0.78, 0.76]}>
            <mesh position={[0, 0.26, 0.08]} rotation={[0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.52, 0.04, 0.24]} />
              <meshToonMaterial color="#ffb703" />
            </mesh>
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

          {/* LARGE FENCED FLOWER & CROP GARDEN */}
          <LargeFencedCottageGarden gardenType={c.gardenType} />
        </group>
      ))}
    </group>
  );
}
