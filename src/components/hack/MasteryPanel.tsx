import type { CategoryMastery } from "@/hooks/useHackProgress";
import type { HackCategory } from "@/data/hackTargets";
import { hackCategories } from "@/data/hackTargets";
import { Brain } from "lucide-react";

interface Props {
  mastery: CategoryMastery[];
  weakest: CategoryMastery | null;
  activeCategory: HackCategory | "all";
  onFocusCategory: (c: HackCategory) => void;
}

const ACCENT: Record<string, string> = {
  passwords: "#22d3ee",
  phishing: "#a78bfa",
  privacy: "#f472b6",
};

const labelOf = (c: HackCategory) =>
  hackCategories.find((x) => x.id === c)?.label ?? c;

export default function MasteryPanel({ mastery, weakest, activeCategory, onFocusCategory }: Props) {
  return (
    <section
      aria-label="Mastery by attack type"
      className="pointer-events-auto w-[min(92vw,300px)] rounded-xl border border-white/10 bg-black/55 backdrop-blur-md p-3 space-y-3"
    >
      <header className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" aria-hidden />
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80 font-display">
          Mastery
        </h2>
      </header>

      <ul className="space-y-2.5">
        {mastery.map((m) => {
          const accent = ACCENT[m.category] ?? "#22d3ee";
          const isActive = activeCategory === m.category;
          return (
            <li key={m.category}>
              <button
                onClick={() => onFocusCategory(m.category)}
                aria-label={`${labelOf(m.category)}: ${m.mastery}% mastery, ${m.label}. Focus this attack type.`}
                className={`w-full text-left rounded-lg px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-medium text-white/90">{labelOf(m.category)}</span>
                  <span className="text-[11px] font-mono tabular-nums" style={{ color: accent }}>
                    {m.mastery}%
                  </span>
                </div>
                <div
                  className="mt-1 h-1.5 w-full rounded-full bg-white/10 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={m.mastery}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${m.mastery}%`, background: accent, boxShadow: `0 0 10px ${accent}` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-white/50">
                  <span>{m.label}</span>
                  <span className="font-mono">
                    {m.cleared}/{m.total} cleared
                    {m.wins + m.losses > 0 ? ` · ${m.accuracy}% acc` : ""}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {weakest && weakest.mastery < 90 && (
        <p className="text-[10px] leading-relaxed text-white/60 border-t border-white/10 pt-2">
          Weakest area: <span className="text-white/90 font-medium">{labelOf(weakest.category)}</span> — practice these targets to close the gap.
        </p>
      )}
    </section>
  );
}
