import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';

function ToonOutline({ thickness = 0.03, color = '#2b2013' }) {
  return <Outlines thickness={thickness} color={color} screenspace={false} />;
}

/** -------------------------------------------------------------
 *  12 UNIQUE VILLAGER NPCS (CHUNKY CHIBI 3D CARTOON HUMANS)
 * ------------------------------------------------------------- */
export const VILLAGERS_DATA = [
  { id: 1, name: 'Mia', job: 'Florist', pos: [20.5, 0.18, -26.5], outfitColor: '#ffb5a7', hairColor: '#e6c594', pet: 'bunny' },
  { id: 2, name: 'Theo', job: 'Baker', pos: [-5.2, 0.1, -20.5], outfitColor: '#f4a261', hairColor: '#7a4a2b', pet: 'cat' },
  { id: 3, name: 'Nora', job: 'Café Owner', pos: [-5.8, 0.15, -19.5], outfitColor: '#fae1c5', hairColor: '#3d2616', pet: 'dog' },
  { id: 4, name: 'Luna', job: 'Librarian', pos: [22.5, 0.14, 12.5], outfitColor: '#a8dadc', hairColor: '#b55239', pet: 'cat' },
  { id: 5, name: 'Leo', job: 'Postman', pos: [-24.2, 0.15, 10.5], outfitColor: '#e63946', hairColor: '#7a4a2b', pet: 'dog' },
  { id: 6, name: 'Emma', job: 'Shopkeeper', pos: [5.2, 0.08, -20.8], outfitColor: '#e07a5f', hairColor: '#e6c594', pet: 'bunny' },
  { id: 7, name: 'Oliver', job: 'Gardener', pos: [-22.5, 0.2, -24.5], outfitColor: '#84b574', hairColor: '#3d2616', pet: 'dog' },
  { id: 8, name: 'Sophie', job: 'Artist', pos: [-30.5, 0.25, -18.5], outfitColor: '#c9a7e0', hairColor: '#b55239', pet: 'cat' },
  { id: 9, name: 'Milo', job: 'Carpenter', pos: [-32.5, 0.2, 20.5], outfitColor: '#d4a373', hairColor: '#7a4a2b', pet: 'dog' },
  { id: 10, name: 'Noah', job: 'Herbalist', pos: [28.5, 0.22, -16.5], outfitColor: '#2a9d8f', hairColor: '#e6c594', pet: 'bunny' },
  { id: 11, name: 'Clara', job: 'Weaver', pos: [-26.5, 0.22, -32.5], outfitColor: '#e9c46a', hairColor: '#3d2616', pet: 'cat' },
  { id: 12, name: 'Felix', job: 'Astronomer', pos: [30.5, 0.18, 22.5], outfitColor: '#1d3557', hairColor: '#7a4a2b', pet: 'dog' },
];

function VillagerNPC({ npc }) {
  const npcRef = useRef();

  useFrame((state) => {
    if (npcRef.current) {
      const clock = state.clock.getElapsedTime();
      npcRef.current.position.y = npc.pos[1] + Math.sin(clock * 2 + npc.id) * 0.02;
      npcRef.current.rotation.y = Math.sin(clock * 0.5 + npc.id) * 0.18;
    }
  });

  return (
    <group ref={npcRef} position={npc.pos}>
      {/* 35-40% Oversized Chunky Chibi Head */}
      <group position={[0, 0.88, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshToonMaterial color="#f2c9a0" />
          <ToonOutline thickness={0.03} />
        </mesh>

        {/* Hair Cap */}
        <mesh position={[0, 0.1, -0.02]}>
          <sphereGeometry args={[0.36, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshToonMaterial color={npc.hairColor} />
        </mesh>

        {/* Expressive Eyes */}
        <mesh position={[-0.12, 0.02, 0.28]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshToonMaterial color="#222222" />
        </mesh>
        <mesh position={[0.12, 0.02, 0.28]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshToonMaterial color="#222222" />
        </mesh>

        {/* Small Nose */}
        <mesh position={[0, -0.04, 0.32]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshToonMaterial color="#f2c9a0" />
        </mesh>

        {/* Rosy Blush Cheeks */}
        <mesh position={[-0.18, -0.06, 0.26]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshToonMaterial color="#ffb5a7" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.18, -0.06, 0.26]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshToonMaterial color="#ffb5a7" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* Chunky Rounded Torso & Outfit */}
      <group position={[0, 0.44, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.44, 0.36]} />
          <meshToonMaterial color={npc.outfitColor} />
          <ToonOutline thickness={0.03} />
        </mesh>
      </group>

      {/* Short Chunky Arms & Oversized Hands */}
      <group position={[-0.32, 0.42, 0]} rotation={[0, 0, 0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.32, 10]} />
          <meshToonMaterial color={npc.outfitColor} />
        </mesh>
        <mesh position={[0, -0.18, 0]} castShadow>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshToonMaterial color="#f2c9a0" />
        </mesh>
      </group>
      <group position={[0.32, 0.42, 0]} rotation={[0, 0, -0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.32, 10]} />
          <meshToonMaterial color={npc.outfitColor} />
        </mesh>
        <mesh position={[0, -0.18, 0]} castShadow>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshToonMaterial color="#f2c9a0" />
        </mesh>
      </group>

      {/* Short Chunky Legs & Oversized Boots */}
      <group position={[-0.14, 0.12, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.24, 10]} />
          <meshToonMaterial color="#457b9d" />
        </mesh>
        <mesh position={[0, -0.1, 0.05]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.24]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
      </group>
      <group position={[0.14, 0.12, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.24, 10]} />
          <meshToonMaterial color="#457b9d" />
        </mesh>
        <mesh position={[0, -0.1, 0.05]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.24]} />
          <meshToonMaterial color="#6b4c35" />
        </mesh>
      </group>

      {/* Villager Companion Pet */}
      <group position={[0.5, 0.12, 0.3]} scale={0.6}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshToonMaterial color={npc.pet === 'cat' ? '#f4a261' : npc.pet === 'dog' ? '#7a4a2b' : '#ffffff'} />
        </mesh>
      </group>
    </group>
  );
}

export default function Villagers() {
  return (
    <group>
      {VILLAGERS_DATA.map((npc) => (
        <VillagerNPC key={npc.id} npc={npc} />
      ))}
    </group>
  );
}
