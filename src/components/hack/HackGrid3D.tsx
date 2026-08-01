import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import type { Group } from "three";
import LevelNode from "./LevelNode";
import { hackTiers, levelsByTier } from "@/data/hackTargets";
import type { HackCategory, HackLevel } from "@/data/hackTargets";

interface Props {
  isUnlocked: (id: number) => boolean;
  isComplete: (id: number) => boolean;
  onSelect: (level: HackLevel) => void;
  onDimmedClick?: (level: HackLevel) => void;
  activeCategory: HackCategory | "all";
}

/** One tier = one orbital ring, tilted and slowly spinning around the core. */
function TierOrbit({
  tierIndex,
  radius,
  yOffset,
  spin,
  isUnlocked,
  isComplete,
  onSelect,
  onDimmedClick,
  activeCategory,
}: any) {
  const tier = hackTiers[tierIndex];
  const levels = levelsByTier(tier.tier);
  const group = useRef<Group>(null);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * spin;
  });

  return (
    <group position={[0, yOffset, 0]} rotation={[-0.12, 0, 0.04]}>
      {/* orbit track */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.035, radius + 0.035, 128]} />
        <meshBasicMaterial color={tier.color} transparent opacity={0.5} />
      </mesh>
      {/* faint disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[radius - 1.1, radius + 0.4, 64]} />
        <meshBasicMaterial color={tier.color} transparent opacity={0.045} />
      </mesh>

      {/* tier label pinned to the ring edge */}
      <Html position={[-radius - 0.9, 0.55, 0]} center style={{ pointerEvents: "none" }}>
        <div className="text-center whitespace-nowrap">
          <div
            className="font-display text-white font-bold text-[13px] tracking-[0.25em] uppercase"
            style={{ textShadow: `0 0 12px ${tier.color}` }}
          >
            {tier.name}
          </div>
          <div className="font-body text-[10px] text-white/50 tracking-wide">{tier.subtitle}</div>
        </div>
      </Html>

      <group ref={group}>
        {levels.map((lvl, i) => {
          const a = (i / levels.length) * Math.PI * 2;
          return (
            <LevelNode
              key={lvl.id}
              level={lvl}
              position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
              color={tier.color}
              unlocked={isUnlocked(lvl.id)}
              completed={isComplete(lvl.id)}
              dimmed={activeCategory !== "all" && lvl.category !== activeCategory}
              onSelect={() => onSelect(lvl)}
              onDimmedClick={() => onDimmedClick?.(lvl)}
            />
          );
        })}
      </group>
    </group>
  );
}

function Core() {
  const ref = useRef<Group>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y -= dt * 0.25;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
  });
  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#e2e8f0"
          emissive="#22d3ee"
          emissiveIntensity={0.9}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.18} />
      </mesh>
      <pointLight intensity={2.2} distance={9} color="#22d3ee" />
    </group>
  );
}

export default function HackGrid3D({ isUnlocked, isComplete, onSelect, onDimmedClick, activeCategory }: Props) {
  const orbits = [
    { radius: 3.1, y: -2.1, spin: 0.11 },
    { radius: 4.4, y: 0, spin: -0.08 },
    { radius: 5.7, y: 2.1, spin: 0.06 },
  ];

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 5.5, 11], fov: 52 }}
      className="!w-full !h-full"
    >
      <color attach="background" args={["#05060d"]} />
      <fog attach="fog" args={["#05060d", 14, 28]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 9, 5]} intensity={0.7} />
      <pointLight position={[-6, 4, 4]} intensity={0.45} color="#a78bfa" />
      <pointLight position={[6, -4, 3]} intensity={0.45} color="#f472b6" />
      <Suspense fallback={null}>
        <Stars radius={60} depth={60} count={2200} factor={3} fade speed={0.4} />
        <Core />
        {hackTiers.map((t, idx) => (
          <TierOrbit
            key={t.tier}
            tierIndex={idx}
            radius={orbits[idx].radius}
            yOffset={orbits[idx].y}
            spin={orbits[idx].spin}
            isUnlocked={isUnlocked}
            isComplete={isComplete}
            onSelect={onSelect}
            onDimmedClick={onDimmedClick}
            activeCategory={activeCategory}
          />
        ))}
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom
        autoRotate
        autoRotateSpeed={0.25}
        minDistance={8}
        maxDistance={18}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}
