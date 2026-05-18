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
}

export default function LevelNode({ level, position, color, unlocked, completed, dimmed = false, onSelect }: Props) {


  const ref = useRef<Mesh>(null);
  const hoverRef = useRef(false);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * (unlocked ? 0.6 : 0.1);
    const target = hoverRef.current && unlocked ? 1.25 : 1;
    ref.current.scale.lerp({ x: target, y: target, z: target } as any, 0.15);
  });

  const baseColor = completed ? "#22c55e" : unlocked ? color : "#475569";

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          hoverRef.current = true;
          document.body.style.cursor = unlocked ? "pointer" : "not-allowed";
        }}
        onPointerOut={() => {
          hoverRef.current = false;
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (unlocked) onSelect();
        }}
      >
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={unlocked ? 0.8 : 0.15}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
      {/* halo ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 0.82, 48]} />
        <meshBasicMaterial color={baseColor} transparent opacity={unlocked ? 0.6 : 0.15} />
      </mesh>
      <Html distanceFactor={8} center position={[0, -1.05, 0]} style={{ pointerEvents: "none" }}>
        <div className="text-center whitespace-nowrap">
          <div className="text-white text-xs font-bold tracking-wide drop-shadow-lg">{level.name}</div>
          <div className="text-[10px] opacity-70 text-white">
            {completed ? "✓ Cleared" : unlocked ? `+${level.xpReward} XP` : "🔒 Locked"}
          </div>
        </div>
      </Html>
    </group>
  );
}
