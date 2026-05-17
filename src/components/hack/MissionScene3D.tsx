import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group, Mesh } from "three";

function ServerRack({ x, color }: { x: number; color: string }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      const m = c as Mesh;
      const mat: any = m.material;
      if (mat?.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 3 + i + x) * 0.4;
      }
    });
  });
  return (
    <group ref={ref} position={[x, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 3, 0.8]} />
        <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.4} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 1.2 - i * 0.32, 0.42]}>
          <boxGeometry args={[1, 0.18, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0a0a14" />
    </mesh>
  );
}

export default function MissionScene3D({ accent }: { accent: string }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.5, 5], fov: 60 }}
      className="!w-full !h-full"
    >
      <color attach="background" args={["#04060d"]} />
      <fog attach="fog" args={["#04060d", 6, 16]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 3, 2]} intensity={0.8} color={accent} />
      <pointLight position={[-4, 1, 2]} intensity={0.4} color="#22d3ee" />
      <Suspense fallback={null}>
        <Floor />
        <ServerRack x={-3} color={accent} />
        <ServerRack x={-1.5} color="#22d3ee" />
        <ServerRack x={1.5} color="#22d3ee" />
        <ServerRack x={3} color={accent} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
