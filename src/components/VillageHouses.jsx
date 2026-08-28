import React from 'react';
import { Outlines } from '@react-three/drei';

function ToonOutline({ thickness = 0.03, color = '#2b2013' }) {
  return <Outlines thickness={thickness} color={color} screenspace={false} />;
}

/** -------------------------------------------------------------
 *  LOW-POLY COTTAGE MODEL WITH FENCED FLOWER GARDEN & MAILBOX
 * ------------------------------------------------------------- */
function LowPolyCottage({ position, rotation = 0, roofColor = '#e63946', wallColor = '#f4f1de' }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Cottage Base & Walls */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.5, 1.8]} />
        <meshToonMaterial color={wallColor} />
        <ToonOutline thickness={0.03} />
      </mesh>

      {/* Four-Sided Hip Roof */}
      <group position={[0, 1.5, 0]}>
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.85, 1.0, 4]} />
          <meshToonMaterial color={roofColor} />
          <ToonOutline thickness={0.03} />
        </mesh>
      </group>

      {/* Wooden Door */}
      <mesh position={[0, 0.45, 0.91]} castShadow>
        <boxGeometry args={[0.45, 0.85, 0.06]} />
        <meshToonMaterial color="#5c381e" />
      </mesh>

      {/* Warm Pale-Yellow Glass Windows */}
      <mesh position={[-0.65, 0.85, 0.91]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.06]} />
        <meshToonMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.65, 0.85, 0.91]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.06]} />
        <meshToonMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.6} />
      </mesh>

      {/* Cute Low-Poly Snail Mailbox 📮🐌 */}
      <group position={[1.3, 0.02, 1.1]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.7, 8]} />
          <meshToonMaterial color="#5c381e" />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.26, 0.28, 0.38]} />
          <meshToonMaterial color="#e07a5f" />
        </mesh>
        <mesh position={[0.14, 0.78, 0]}>
          <boxGeometry args={[0.02, 0.12, 0.04]} />
          <meshToonMaterial color="#e63946" />
        </mesh>
      </group>

      {/* Large Fenced Flower & Crop Garden Plot */}
      <group position={[-1.2, 0, 1.2]}>
        {[-0.8, 0.8].map((x, i) =>
          [0, 0.8].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.2, z]} castShadow>
              <boxGeometry args={[0.08, 0.4, 0.08]} />
              <meshToonMaterial color="#7a4a2b" />
            </mesh>
          ))
        )}

        {/* Multi-Colored Low-Poly Flower Beds */}
        {[-0.5, 0, 0.5].map((x, idx) => (
          <group key={idx} position={[x, 0.02, 0.4]}>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.22, 6]} />
              <meshToonMaterial color="#38b000" />
            </mesh>
            <mesh position={[0, 0.24, 0]}>
              <sphereGeometry args={[0.12, 10, 10]} />
              <meshToonMaterial color={idx === 0 ? '#ff4d6d' : idx === 1 ? '#ffb703' : '#7209b7'} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export default function VillageHouses() {
  const HOUSES_CONFIG = [
    // North Zone (Z = +18 to +35)
    { pos: [0.0, 0, 26.0], rot: Math.PI, roof: '#e63946', wall: '#f4f1de' }, // North Red Roof
    { pos: [-14.0, 0, 28.0], rot: Math.PI + 0.2, roof: '#457b9d', wall: '#f4f1de' }, // North-West Blue Roof
    { pos: [14.0, 0, 28.0], rot: Math.PI - 0.2, roof: '#7209b7', wall: '#f4f1de' }, // North-East Purple Roof

    // South Zone (Z = -35 to -18)
    { pos: [0.0, 0, -28.0], rot: 0.0, roof: '#ffb703', wall: '#f4f1de' }, // South Yellow Roof
    { pos: [-14.0, 0, -28.0], rot: 0.2, roof: '#e76f51', wall: '#f4f1de' }, // South-West Orange Roof
    { pos: [14.0, 0, -28.0], rot: -0.2, roof: '#2a9d8f', wall: '#f4f1de' }, // South-East Teal Roof

    // East Zone (X = +22 to +42)
    { pos: [30.0, 0, -10.0], rot: -Math.PI / 2, roof: '#457b9d', wall: '#f4f1de' }, // East Blue Roof
    { pos: [32.0, 0, 0.0], rot: -Math.PI / 2, roof: '#e63946', wall: '#f4f1de' }, // East Red Roof
    { pos: [30.0, 0, 10.0], rot: -Math.PI / 2, roof: '#7209b7', wall: '#f4f1de' }, // East Purple Roof

    // West Zone (X = -42 to -22)
    { pos: [-30.0, 0, -10.0], rot: Math.PI / 2, roof: '#2a9d8f', wall: '#f4f1de' }, // West Teal Roof
    { pos: [-32.0, 0, 0.0], rot: Math.PI / 2, roof: '#ffb703', wall: '#f4f1de' }, // West Yellow Roof
    { pos: [-30.0, 0, 10.0], rot: Math.PI / 2, roof: '#e76f51', wall: '#f4f1de' }, // West Orange Roof
  ];

  return (
    <group>
      {HOUSES_CONFIG.map((h, idx) => (
        <LowPolyCottage
          key={idx}
          position={h.pos}
          rotation={h.rot}
          roofColor={h.roof}
          wallColor={h.wall}
        />
      ))}
    </group>
  );
}
