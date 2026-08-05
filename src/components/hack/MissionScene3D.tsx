import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh, Points } from "three";

/** Infinite scrolling wireframe cyber-grid — the "floor" of cyberspace. */
function CyberGrid({ color, y, dir = 1 }: { color: string; y: number; dir?: number }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.z = ((state.clock.elapsedTime * 2.2 * dir) % 4) - 2;
  });
  return (
    <group ref={ref} position={[0, y, 0]}>
      <gridHelper args={[80, 80, color, color]} />
    </group>
  );
}

/** Vertical data streams falling through the void. */
function DataRain({ color }: { color: string }) {
  const ref = useRef<Points>(null);
  const { positions, count } = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 24 - 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return { positions, count };
  }, []);

  useFrame((_, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= dt * (2 + (i % 7));
      if (arr[i * 3 + 1] < -6) arr[i * 3 + 1] = 18;
    }
    (pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color={color} transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Data packets streaming along the tunnel axis. */
function PacketStream({ color, radius, speed, count = 26 }: { color: string; radius: number; speed: number; count?: number }) {
  const ref = useRef<Group>(null);
  const seeds = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ a: (i / count) * Math.PI * 2, z: Math.random() * 40 - 20, s: 0.6 + Math.random() })),
    [count],
  );
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      c.position.z += dt * speed * seeds[i].s;
      if (c.position.z > 6) c.position.z = -34;
    });
    ref.current.rotation.z += dt * 0.06;
  });
  return (
    <group ref={ref}>
      {seeds.map((s, i) => (
        <mesh key={i} position={[Math.cos(s.a) * radius, Math.sin(s.a) * radius, s.z]}>
          <boxGeometry args={[0.08, 0.08, 0.9]} />
          <meshBasicMaterial color={color} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** Wireframe rings forming a data tunnel receding into the distance. */
function Tunnel({ accent }: { accent: string }) {
  const ref = useRef<Group>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.children.forEach((c) => {
      c.position.z += dt * 3.2;
      if (c.position.z > 6) c.position.z -= 44;
      const m = (c as Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = THREE.MathUtils.clamp(1 - Math.abs(c.position.z + 14) / 22, 0.05, 0.5);
    });
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 22 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 2 - 2]}>
          <torusGeometry args={[5.2, 0.02, 6, 6]} />
          <meshBasicMaterial color={i % 3 === 0 ? accent : "#22d3ee"} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/** Glowing data core at the centre of the construct. */
function DataCore({ accent }: { accent: string }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.35;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.25;
    const s = 1 + Math.sin(t * 2.4) * 0.05;
    ref.current.scale.setScalar(s);
  });
  return (
    <group ref={ref} position={[0, 0.4, -6]}>
      <mesh>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.85} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.9, 0.015, 8, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, Math.PI / 5]}>
        <torusGeometry args={[2.4, 0.012, 8, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export default function MissionScene3D({ accent }: { accent: string }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.6, 7], fov: 65 }} className="!w-full !h-full">
      <color attach="background" args={["#03040c"]} />
      <fog attach="fog" args={["#03040c", 8, 30]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={1.1} color={accent} />
      <pointLight position={[-5, -2, -4]} intensity={0.6} color="#22d3ee" />
      <Suspense fallback={null}>
        <Tunnel accent={accent} />
        <DataCore accent={accent} />
        <DataRain color="#22d3ee" />
        <PacketStream color={accent} radius={3.4} speed={9} />
        <PacketStream color="#22d3ee" radius={4.6} speed={6} count={18} />
        <CyberGrid color={accent} y={-3.2} />
        <CyberGrid color="#0ea5e9" y={5.2} dir={-1} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.25}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
