import { cn } from "@/lib/utils";

export type AttackerKind = "phisher" | "suit" | "qr" | "voice" | "clone" | "angler";

interface Props {
  kind: AttackerKind;
  defeated?: boolean;
  className?: string;
}

const META: Record<AttackerKind, { emoji: string; label: string; color: string }> = {
  phisher: { emoji: "👻", label: "Phisher Ghost", color: "hsl(280 80% 65%)" },
  suit: { emoji: "🕴️", label: "Suit Impostor", color: "hsl(0 0% 50%)" },
  qr: { emoji: "🔳", label: "QR Trickster", color: "hsl(180 80% 55%)" },
  voice: { emoji: "📞", label: "Voice Bot", color: "hsl(30 90% 60%)" },
  clone: { emoji: "👥", label: "The Clone", color: "hsl(320 80% 65%)" },
  angler: { emoji: "🐟", label: "Angler", color: "hsl(340 90% 60%)" },
};

export default function AttackerAvatar({ kind, defeated, className }: Props) {
  const m = META[kind];
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-1 select-none transition-all duration-500",
        defeated && "opacity-0 scale-50 blur-sm",
        className,
      )}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-4xl border-2 animate-pulse"
        style={{
          borderColor: m.color,
          background: `radial-gradient(circle, ${m.color}22, transparent)`,
          boxShadow: `0 0 20px ${m.color}66`,
        }}
      >
        {m.emoji}
      </div>
      <div
        className="text-[10px] font-black tracking-wider uppercase"
        style={{ color: m.color }}
      >
        {m.label}
      </div>
    </div>
  );
}
