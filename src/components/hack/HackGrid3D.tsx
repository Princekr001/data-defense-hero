import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import LevelNode from "./LevelNode";
import { hackLevels, hackTiers, levelsByTier } from "@/data/hackTargets";
import type { HackCategory, HackLevel } from "@/data/hackTargets";

interface Props {
  isUnlocked: (id: number) => boolean;
  isComplete: (id: number) => boolean;
  onSelect: (level: HackLevel) => void;
  onDimmedClick?: (level: HackLevel) => void;
  activeCategory: HackCategory | "all";
}

function TierRow({ tierIndex, yOffset, isUnlocked, isComplete, onSelect, onDimmedClick, activeCategory }: any) {
  const tier = hackTiers[tierIndex];
  const levels = levelsByTier(tier.tier);
  const spacing = 2.6;
  const startX = -((levels.length - 1) * spacing) / 2;

  return (
    <group position={[0, yOffset, 0]}>
      {/* tier platform */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[levels.length * spacing + 2, 0.08, 2]} />
        <meshStandardMaterial color={tier.color} emissive={tier.color} emissiveIntensity={0.15} transparent opacity={0.25} />
      </mesh>
      {/* tier label */}
      <Html position={[-(levels.length * spacing) / 2 - 1.6, 0, 0]} center style={{ pointerEvents: "none" }}>
        <div className="text-right">
          <div className="text-white font-bold text-sm tracking-widest uppercase">{tier.name}</div>
          <div className="text-[10px] text-white/60">{tier.subtitle}</div>
        </div>
      </Html>
      {levels.map((lvl, i) => (
        <LevelNode
          key={lvl.id}
          level={lvl}
          position={[startX + i * spacing, 0, 0]}
          color={tier.color}
          unlocked={isUnlocked(lvl.id)}
          completed={isComplete(lvl.id)}
          dimmed={activeCategory !== "all" && lvl.category !== activeCategory}
          onSelect={() => onSelect(lvl)}
          onDimmedClick={() => onDimmedClick?.(lvl)}
        />
      ))}
    </group>
  );
}

export default function HackGrid3D({ isUnlocked, isComplete, onSelect, onDimmedClick, activeCategory }: Props) {
  const rows = useMemo(() => [3.2, 0, -3.2], []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.5, 9], fov: 55 }}
      className="!w-full !h-full"
    >
      <color attach="background" args={["#06070f"]} />
      <fog attach="fog" args={["#06070f", 12, 22]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <pointLight position={[-5, 3, 3]} intensity={0.5} color="#22d3ee" />
      <pointLight position={[5, -3, 3]} intensity={0.5} color="#f472b6" />
      <Suspense fallback={null}>
        <Stars radius={50} depth={50} count={1500} factor={3} fade speed={0.5} />
        {hackTiers.map((t, idx) => (
          <TierRow
            key={t.tier}
            tierIndex={idx}
            yOffset={rows[idx]}
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
        minDistance={6}
        maxDistance={14}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
