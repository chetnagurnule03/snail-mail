import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sky, Sparkles } from '@react-three/drei';

/** A single hand-placed flower made of a stem + a ring of "petal" spheres. */
function Flower({ position, color }) {
  const petals = new Array(6).fill(0);
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.5, 6]} />
        <meshStandardMaterial color="#7fa66b" />
      </mesh>
      <group position={[0, 0.5, 0]}>
        {petals.map((_, i) => {
          const angle = (i / petals.length) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.09, 0, Math.sin(angle) * 0.09]}
            >
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          );
        })}
        <mesh>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#f5d76e" />
        </mesh>
      </group>
    </group>
  );
}

/** Simple rounded character stand-in: capsule body + sphere head, colored from saved config. */
function Character({ character, targetPos }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current || !targetPos) return;
    groupRef.current.position.x +=
      (targetPos[0] - groupRef.current.position.x) * 0.08;
    groupRef.current.position.z +=
      (targetPos[1] - groupRef.current.position.z) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.4, 4, 12]} />
        <meshStandardMaterial color={character.outfit_color} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color={character.skin_tone} />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={character.hair_color} />
      </mesh>
    </group>
  );
}

/** A little mailbox that stands in for the sending flow's target. */
function Mailbox() {
  return (
    <group position={[2.2, 0, -1.5]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.12, 1, 0.12]} />
        <meshStandardMaterial color="#8a5a3b" />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.32, 4, 12]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e07a5f" />
      </mesh>
    </group>
  );
}

function Ground({ onGroundClick }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onGroundClick([e.point.x, e.point.z]);
      }}
    >
      <circleGeometry args={[6, 48]} />
      <meshStandardMaterial color="#b7d3a0" />
    </mesh>
  );
}

export default function GardenScene({ character }) {
  const [targetPos, setTargetPos] = useState(null);

  return (
    <Canvas shadows camera={{ position: [4, 3.2, 5], fov: 45 }}>
      <color attach="background" args={['#f7ecd9']} />
      <Sky sunPosition={[3, 2, 1]} turbidity={2} rayleigh={0.6} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Sparkles count={30} scale={5} size={2} speed={0.3} color="#fff6d8" />

      <Ground onGroundClick={setTargetPos} />
      <Character character={character} targetPos={targetPos} />
      <Mailbox />

      <Flower position={[-1.4, 0, 0.6]} color="#e8a0c9" />
      <Flower position={[-0.9, 0, 1.3]} color="#f2c14e" />
      <Flower position={[1.1, 0, 1.6]} color="#c191e8" />
      <Flower position={[1.6, 0, 0.2]} color="#f28fa4" />

      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={10} blur={2} />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={9}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
