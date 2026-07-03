import { cn } from "@/lib/utils";

export type DefenderPose = "idle" | "alert" | "shield" | "hurt";

interface Props {
  pose: DefenderPose;
  className?: string;
}

/**
 * Flat vector cyberpunk avatar of the player, sitting at a desk.
 * All state driven by `pose` — no external animation libs.
 */
export default function DefenderAvatar({ pose, className }: Props) {
  const bodyClass =
    pose === "hurt"
      ? "translate-y-1 [filter:drop-shadow(0_0_10px_hsl(var(--destructive)))]"
      : pose === "shield"
        ? "-translate-y-1 [filter:drop-shadow(0_0_14px_hsl(var(--primary)))]"
        : pose === "alert"
          ? "-translate-y-0.5 [filter:drop-shadow(0_0_8px_hsl(var(--primary)/0.6))]"
          : "";

  return (
    <div className={cn("relative w-40 h-40 select-none", className)}>
      {/* shield ring */}
      {pose === "shield" && (
        <div className="absolute inset-0 rounded-full border-2 border-primary/70 animate-ping" />
      )}
      {/* hurt glitch */}
      {pose === "hurt" && (
        <div className="absolute inset-0 bg-destructive/20 mix-blend-screen animate-pulse rounded-full" />
      )}

      <svg
        viewBox="0 0 160 160"
        className={cn("w-full h-full transition-all duration-300", bodyClass)}
      >
        {/* desk */}
        <rect x="10" y="120" width="140" height="8" rx="2" fill="hsl(var(--muted))" />
        {/* monitor */}
        <rect x="45" y="82" width="70" height="40" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <rect x="49" y="86" width="62" height="32" rx="1" fill={pose === "hurt" ? "hsl(var(--destructive)/0.3)" : "hsl(var(--primary)/0.15)"} />
        {/* screen glyph */}
        <text x="80" y="107" textAnchor="middle" fontSize="10" fill="hsl(var(--primary))" fontFamily="monospace">
          {pose === "shield" ? "OK" : pose === "hurt" ? "!!" : "01"}
        </text>

        {/* body */}
        <ellipse cx="80" cy="118" rx="22" ry="8" fill="hsl(var(--primary)/0.4)" />
        <path d="M62 118 Q62 90 80 90 Q98 90 98 118 Z" fill="hsl(var(--primary)/0.85)" />
        {/* hoodie hood */}
        <path d="M60 88 Q80 60 100 88" fill="hsl(var(--primary))" opacity="0.9" />

        {/* head */}
        <circle cx="80" cy="80" r="14" fill="hsl(30 40% 70%)" />
        {/* hair */}
        <path d="M66 75 Q80 60 94 75 Q94 70 80 66 Q66 70 66 75 Z" fill="hsl(220 20% 20%)" />

        {/* eyes */}
        {pose === "hurt" ? (
          <>
            <path d="M72 80 l4 4 M76 80 l-4 4" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M84 80 l4 4 M88 80 l-4 4" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : pose === "alert" ? (
          <>
            <circle cx="74" cy="82" r="2" fill="hsl(var(--foreground))" />
            <circle cx="86" cy="82" r="2" fill="hsl(var(--foreground))" />
            <circle cx="74" cy="82" r="0.8" fill="hsl(var(--primary))" />
            <circle cx="86" cy="82" r="0.8" fill="hsl(var(--primary))" />
          </>
        ) : (
          <>
            <rect x="72" y="80" width="4" height="1.5" fill="hsl(var(--foreground))" />
            <rect x="84" y="80" width="4" height="1.5" fill="hsl(var(--foreground))" />
          </>
        )}

        {/* mouth */}
        {pose === "shield" ? (
          <path d="M74 88 Q80 92 86 88" stroke="hsl(var(--foreground))" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        ) : pose === "hurt" ? (
          <path d="M74 90 Q80 86 86 90" stroke="hsl(var(--foreground))" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        ) : (
          <line x1="76" y1="89" x2="84" y2="89" stroke="hsl(var(--foreground))" strokeWidth="1.2" strokeLinecap="round" />
        )}

        {/* shield-up */}
        {pose === "shield" && (
          <g className="animate-fade-in">
            <path
              d="M80 40 L100 48 L100 62 Q100 78 80 88 Q60 78 60 62 L60 48 Z"
              fill="hsl(var(--primary)/0.2)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            <text x="80" y="66" textAnchor="middle" fontSize="14" fill="hsl(var(--primary))" fontWeight="bold">✓</text>
          </g>
        )}
        {/* sweat drop when alert */}
        {pose === "alert" && (
          <ellipse cx="94" cy="82" rx="1.6" ry="2.4" fill="hsl(200 90% 60%)" className="animate-pulse" />
        )}
      </svg>
    </div>
  );
}
