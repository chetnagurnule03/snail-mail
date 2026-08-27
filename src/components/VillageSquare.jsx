import React from 'react';
import { Outlines } from '@react-three/drei';

function ToonOutline({ thickness = 0.03, color = '#2b2013' }) {
  return <Outlines thickness={thickness} color={color} screenspace={false} />;
}

/** -------------------------------------------------------------
 *  MARKET STALL WITH COLORFUL STRIPED FABRIC AWNING
 * ------------------------------------------------------------- */
function ColorfulMarketStall({ position, rotation = 0, color1 = '#e63946', color2 = '#ffffff', produceType = 'apples' }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Wooden Table Counter */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.7, 0.9]} />
        <meshToonMaterial color="#8c5a3c" />
        <ToonOutline thickness={0.025} />
      </mesh>

      {/* Wooden Roof Poles */}
      {[-0.72, 0.72].map((x, i) =>
        [-0.38, 0.38].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 1.15, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.4, 8]} />
            <meshToonMaterial color="#5c381e" />
          </mesh>
        ))
      )}

      {/* Striped Fabric Awning Roof */}
      <group position={[0, 1.85, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.75, 0.14, 1.1]} />
          <meshToonMaterial color={color1} />
          <ToonOutline thickness={0.025} />
        </mesh>

        {/* Stripes */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, idx) => (
          <mesh key={idx} position={[x, 0.01, 0]}>
            <boxGeometry args={[0.22, 0.15, 1.12]} />
            <meshToonMaterial color={color2} />
          </mesh>
        ))}
      </group>

      {/* Produce Displays on Counter */}
      <group position={[0, 0.85, 0]}>
        {produceType === 'apples' && (
          <>
            <mesh position={[-0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.38, 0.16, 0.32]} />
              <meshToonMaterial color="#a8763e" />
            </mesh>
            <mesh position={[-0.4, 0.12, 0]} castShadow>
              <sphereGeometry args={[0.1, 10, 10]} />
              <meshToonMaterial color="#e63946" />
            </mesh>
            <mesh position={[0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.38, 0.16, 0.32]} />
              <meshToonMaterial color="#a8763e" />
            </mesh>
            <mesh position={[0.4, 0.12, 0]} castShadow>
              <sphereGeometry args={[0.1, 10, 10]} />
              <meshToonMaterial color="#ffb703" />
            </mesh>
          </>
        )}

        {produceType === 'carrots' && (
          <group position={[0, 0, 0]}>
            {[-0.4, 0, 0.4].map((x, idx) => (
              <mesh key={idx} position={[x, 0.08, 0]} rotation={[0, 0, 0.4]} castShadow>
                <coneGeometry args={[0.07, 0.28, 8]} />
                <meshToonMaterial color="#fb8500" />
              </mesh>
            ))}
          </group>
        )}

        {produceType === 'flowers' && (
          <group position={[0, 0, 0]}>
            {[[-0.4, 0.1, 0], [0, 0.1, 0], [0.4, 0.1, 0]].map((p, idx) => (
              <group key={idx} position={p}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.09, 0.07, 0.18, 8]} />
                  <meshToonMaterial color="#ffffff" />
                </mesh>
                <mesh position={[0, 0.14, 0]}>
                  <sphereGeometry args={[0.12, 10, 10]} />
                  <meshToonMaterial color={idx === 0 ? '#ff4d6d' : idx === 1 ? '#ffb703' : '#7209b7'} />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {produceType === 'bread' && (
          <group position={[0, 0.05, 0]}>
            {[[-0.3, 0.06, 0], [0.1, 0.06, 0], [0.4, 0.06, 0]].map((p, idx) => (
              <mesh key={idx} position={p} castShadow>
                <capsuleGeometry args={[0.07, 0.22, 6, 12]} rotation={[Math.PI / 2, 0, 0]} />
                <meshToonMaterial color="#b07d4b" />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
}

/** -------------------------------------------------------------
 *  CENTRAL VILLAGE SQUARE WITH 7 MARKET STALLS & FOUNTAIN
 * ------------------------------------------------------------- */
export default function VillageSquare({ position = [0, 0, -22.0] }) {
  return (
    <group position={position}>
      {/* Central Cobblestone Plaza Floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 22]} />
        <meshToonMaterial color="#d4c5a9" />
      </mesh>

      {/* Central Stone Fountain */}
      <group position={[0, 0.02, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 2.1, 0.7, 16]} />
          <meshToonMaterial color="#9a8c98" />
          <ToonOutline thickness={0.025} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.05, 16]} />
          <meshToonMaterial color="#48cae4" transparent opacity={0.88} />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.45, 0.8, 12]} />
          <meshToonMaterial color="#9a8c98" />
        </mesh>
      </group>

      {/* Stone Well */}
      <group position={[-9.5, 0.02, 6.0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.75, 0.85, 0.9, 12]} />
          <meshToonMaterial color="#8a7e70" />
          <ToonOutline thickness={0.025} />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <coneGeometry args={[0.95, 0.5, 4]} rotation={[0, Math.PI / 4, 0]} />
          <meshToonMaterial color="#8c5a3c" />
        </mesh>
      </group>

      {/* 7 MARKET STALLS WITH COLORFUL STRIPED FABRIC AWNINGS */}
      <ColorfulMarketStall position={[-7.5, 0, -5.5]} rotation={0.2} color1="#e63946" color2="#ffffff" produceType="apples" />
      <ColorfulMarketStall position={[-2.5, 0, -6.5]} rotation={0.0} color1="#1d3557" color2="#ffffff" produceType="carrots" />
      <ColorfulMarketStall position={[2.5, 0, -6.5]} rotation={0.0} color1="#ffb703" color2="#ffffff" produceType="flowers" />
      <ColorfulMarketStall position={[7.5, 0, -5.5]} rotation={-0.2} color1="#7209b7" color2="#ffffff" produceType="bread" />

      <ColorfulMarketStall position={[-7.0, 0, 3.5]} rotation={0.4} color1="#fb8500" color2="#ffffff" produceType="carrots" />
      <ColorfulMarketStall position={[0, 0, 4.5]} rotation={0.0} color1="#2a9d8f" color2="#ffffff" produceType="flowers" />
      <ColorfulMarketStall position={[7.0, 0, 3.5]} rotation={-0.4} color1="#e76f51" color2="#ffffff" produceType="apples" />

      {/* Wooden Benches & Crates */}
      {[
        [-5.0, 0, -0.5, 0.3],
        [5.0, 0, -0.5, -0.3],
      ].map((p, idx) => (
        <group key={idx} position={[p[0], 0, p[1]]} rotation={[0, p[2], 0]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[1.3, 0.08, 0.45]} />
            <meshToonMaterial color="#6b4c35" />
          </mesh>
          <mesh position={[-0.55, 0.14, 0]} castShadow>
            <boxGeometry args={[0.08, 0.28, 0.4]} />
            <meshToonMaterial color="#4a2c11" />
          </mesh>
          <mesh position={[0.55, 0.14, 0]} castShadow>
            <boxGeometry args={[0.08, 0.28, 0.4]} />
            <meshToonMaterial color="#4a2c11" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
