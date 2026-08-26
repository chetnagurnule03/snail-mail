import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/** -------------------------------------------------------------
 *  12 UNIQUE 3D STORYBOOK VILLAGER NPCS (NATURAL DISTRIBUTION)
 * ------------------------------------------------------------- */
const VILLAGERS_DATA = [
  { id: 1, name: 'Mia', job: 'Florist', pos: [4.6, 0.12, -6.8], outfitColor: '#ffb5a7', hairColor: '#e6c594', pet: 'bunny' },
  { id: 2, name: 'Theo', job: 'Baker', pos: [-4.2, 0.1, -2.2], outfitColor: '#f4a261', hairColor: '#7a4a2b', pet: 'cat' },
  { id: 3, name: 'Nora', job: 'Café Owner', pos: [-3.5, 0.15, 2.1], outfitColor: '#fae1c5', hairColor: '#3d2616', pet: 'dog' },
  { id: 4, name: 'Luna', job: 'Librarian', pos: [4.2, 0.1, 3.5], outfitColor: '#a8dadc', hairColor: '#b55239', pet: 'cat' },
  { id: 5, name: 'Leo', job: 'Postman', pos: [-5.4, 0.08, 4.5], outfitColor: '#e63946', hairColor: '#7a4a2b', pet: 'dog' },
  { id: 6, name: 'Emma', job: 'Shopkeeper', pos: [2.2, 0.08, -2.8], outfitColor: '#e07a5f', hairColor: '#e6c594', pet: 'bunny' },
  { id: 7, name: 'Oliver', job: 'Gardener', pos: [7.8, 0.22, -8.5], outfitColor: '#84b574', hairColor: '#3d2616', pet: 'dog' },
  { id: 8, name: 'Sophie', job: 'Artist', pos: [-6.0, 0.15, -8.0], outfitColor: '#c9a7e0', hairColor: '#b55239', pet: 'cat' },
  { id: 9, name: 'Milo', job: 'Carpenter', pos: [-8.8, 0.18, 5.8], outfitColor: '#d4a373', hairColor: '#7a4a2b', pet: 'dog' },
  { id: 10, name: 'Noah', job: 'Herbalist', pos: [9.8, 0.18, -4.2], outfitColor: '#2a9d8f', hairColor: '#e6c594', pet: 'bunny' },
  { id: 11, name: 'Clara', job: 'Weaver', pos: [-9.6, 0.25, -5.5], outfitColor: '#e9c46a', hairColor: '#3d2616', pet: 'cat' },
  { id: 12, name: 'Felix', job: 'Astronomer', pos: [7.8, 0.28, 7.2], outfitColor: '#1d3557', hairColor: '#7a4a2b', pet: 'dog' },
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
      <group position={[0, 0.95, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshStandardMaterial color="#f2c9a0" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.08, -0.02]}>
          <sphereGeometry args={[0.26, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={npc.hairColor} roughness={0.6} />
        </mesh>
        <mesh position={[-0.08, 0.02, 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0.08, 0.02, 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[-0.12, -0.04, 0.18]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffb5a7" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.12, -0.04, 0.18]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffb5a7" transparent opacity={0.6} />
        </mesh>
      </group>

      <mesh position={[0, 0.48, 0]} castShadow>
        <capsuleGeometry args={[0.24, 0.36, 8, 16]} />
        <meshStandardMaterial color={npc.outfitColor} roughness={0.5} />
      </mesh>

      <mesh position={[-0.11, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.28, 8]} />
        <meshStandardMaterial color="#457b9d" />
      </mesh>
      <mesh position={[0.11, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.28, 8]} />
        <meshStandardMaterial color="#457b9d" />
      </mesh>

      <group position={[0.5, 0.12, 0.3]} scale={0.6}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color={npc.pet === 'cat' ? '#f4a261' : npc.pet === 'dog' ? '#7a4a2b' : '#ffffff'} />
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
