import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";
import type { HackLevel } from "@/data/hackTargets";

interface Props {
  level: HackLevel;
  position: [number, number, number];
  color: string;
  unlocked: boolean;
  completed: boolean;
  dimmed?: boolean;
  onSelect: () => void;
  onDimmedClick?: () => void;
}

export default function LevelNode({ level, position, color, unlocked, completed, dimmed = false, onSelect, onDimmedClick }: Props) {


  const ref = useRef<Mesh>(null);
  const hoverRef = useRef(false);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * (unlocked && !dimmed ? 0.6 : 0.1);
    const target = hoverRef.current && unlocked && !dimmed ? 1.25 : 1;
    ref.current.scale.lerp({ x: target, y: target, z: target } as any, 0.15);
  });

  const baseColor = completed ? "#22c55e" : unlocked ? color : "#475569";
  const interactive = unlocked && !dimmed;
  const emissive = dimmed ? 0.05 : unlocked ? 0.8 : 0.15;
  const meshOpacity = dimmed ? 0.2 : 1;
  const ringOpacity = dimmed ? 0.08 : unlocked ? 0.6 : 0.15;

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          if (!unlocked) return;
          e.stopPropagation();
          hoverRef.current = interactive;
          document.body.style.cursor = interactive ? "pointer" : "help";
        }}
        onPointerOut={() => {
          hoverRef.current = false;
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (interactive) onSelect();
          else if (dimmed && unlocked) onDimmedClick?.();
        }}
      >
        <cylinderGeometry args={[0.42, 0.42, 0.42, 6]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={emissive}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={meshOpacity}
        />
      </mesh>
      {/* halo ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 0.82, 48]} />
        <meshBasicMaterial color={baseColor} transparent opacity={ringOpacity} />
      </mesh>
      <Html distanceFactor={8} center position={[0, -1.05, 0]} style={{ pointerEvents: "none", opacity: dimmed ? 0.25 : 1, transition: "opacity 250ms" }}>
        <div className="text-center whitespace-nowrap rounded-md bg-black/45 backdrop-blur-sm px-2 py-1 border border-white/10">
          <div className="font-display text-white text-xs font-semibold tracking-[0.12em] uppercase drop-shadow-lg">{level.name}</div>
          <div className="font-mono text-[10px] opacity-70 text-white">
            {completed ? "✓ Cleared" : unlocked ? `+${level.xpReward} XP` : "🔒 Locked"}
          </div>
        </div>
      </Html>
    </group>
  );
}
