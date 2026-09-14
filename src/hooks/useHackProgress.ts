import { useCallback, useEffect, useMemo, useState } from "react";
import { hackLevels } from "@/data/hackTargets";
import type { HackCategory } from "@/data/hackTargets";

const KEY = "ddh.hackProgress.v1";

interface Attempt {
  wins: number;
  losses: number;
}

/** One point on the progress timeline, logged after every level attempt. */
export interface TimelineEntry {
  /** epoch ms */
  t: number;
  levelId: number;
  levelName: string;
  category: HackCategory;
  won: boolean;
  /** cumulative XP right after this attempt */
  xp: number;
  /** overall mastery (0-100) right after this attempt */
  mastery: number;
}

interface State {
  completed: number[];
  xp: number;
  attempts?: Record<number, Attempt>;
  history?: TimelineEntry[];
}

export interface CategoryMastery {
  category: HackCategory;
  cleared: number;
  total: number;
  wins: number;
  losses: number;
  /** 0-100 blended score: coverage (70%) + accuracy (30%). */
  mastery: number;
  accuracy: number;
  label: "Untested" | "Needs practice" | "Developing" | "Solid" | "Mastered";
}

const load = (): State => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      return { completed: [], xp: 0, attempts: {}, history: [], ...parsed };
    }
  } catch {}
  return { completed: [], xp: 0, attempts: {}, history: [] };
};

/** Overall mastery across every level: 70% coverage + 30% accuracy. */
const overallMastery = (completed: number[], attempts: Record<number, Attempt>) => {
  const cleared = hackLevels.filter((l) => completed.includes(l.id)).length;
  const coverage = hackLevels.length ? (cleared / hackLevels.length) * 100 : 0;
  let wins = 0;
  let losses = 0;
  for (const a of Object.values(attempts)) {
    wins += a.wins;
    losses += a.losses;
  }
  const plays = wins + losses;
  const accuracy = plays ? (wins / plays) * 100 : 0;
  return Math.round(plays ? coverage * 0.7 + accuracy * 0.3 : coverage);
};

const labelFor = (mastery: number, tested: boolean): CategoryMastery["label"] => {
  if (!tested) return "Untested";
  if (mastery >= 90) return "Mastered";
  if (mastery >= 65) return "Solid";
  if (mastery >= 35) return "Developing";
  return "Needs practice";
};

export function useHackProgress() {
  const [state, setState] = useState<State>(() => load());

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const isUnlocked = useCallback(
    (id: number) => {
      const idx = hackLevels.findIndex((l) => l.id === id);
      if (idx <= 0) return idx === 0;
      const level = hackLevels[idx];
      const prev = hackLevels[idx - 1];
      if (prev.tier !== level.tier) {
        // entering a new tier — every level of the previous tier must be done
        return hackLevels
          .filter((l) => l.tier === prev.tier)
          .every((l) => state.completed.includes(l.id));
      }
      return state.completed.includes(prev.id);
    },
    [state.completed],
  );

  const isComplete = useCallback((id: number) => state.completed.includes(id), [state.completed]);

  const completeLevel = useCallback((id: number) => {
    setState((s) => {
      if (s.completed.includes(id)) return s;
      const lvl = hackLevels.find((l) => l.id === id);
      return { ...s, completed: [...s.completed, id], xp: s.xp + (lvl?.xpReward ?? 0) };
    });
  }, []);

  /** Log the outcome of a level attempt so mastery reflects accuracy, not just completion. */
  const recordAttempt = useCallback((id: number, won: boolean) => {
    setState((s) => {
      const attempts = { ...(s.attempts ?? {}) };
      const prev = attempts[id] ?? { wins: 0, losses: 0 };
      attempts[id] = won
        ? { ...prev, wins: prev.wins + 1 }
        : { ...prev, losses: prev.losses + 1 };
      const lvl = hackLevels.find((l) => l.id === id);
      const entry: TimelineEntry = {
        t: Date.now(),
        levelId: id,
        levelName: lvl?.name ?? `Level ${id}`,
        category: (lvl?.category ?? "phishing") as HackCategory,
        won,
        xp: s.xp,
        mastery: overallMastery(s.completed, attempts),
      };
      return { ...s, attempts, history: [...(s.history ?? []), entry].slice(-60) };
    });
  }, []);

  const mastery = useMemo<CategoryMastery[]>(() => {
    const cats = Array.from(new Set(hackLevels.map((l) => l.category)));
    return cats.map((category) => {
      const levels = hackLevels.filter((l) => l.category === category);
      const cleared = levels.filter((l) => state.completed.includes(l.id)).length;
      let wins = 0;
      let losses = 0;
      for (const l of levels) {
        const a = state.attempts?.[l.id];
        if (a) {
          wins += a.wins;
          losses += a.losses;
        }
      }
      const plays = wins + losses;
      const accuracy = plays ? Math.round((wins / plays) * 100) : 0;
      const coverage = levels.length ? (cleared / levels.length) * 100 : 0;
      const score = plays ? coverage * 0.7 + accuracy * 0.3 : coverage;
      return {
        category,
        cleared,
        total: levels.length,
        wins,
        losses,
        accuracy,
        mastery: Math.round(score),
        label: labelFor(score, plays > 0 || cleared > 0),
      };
    });
  }, [state.completed, state.attempts]);

  const weakest = useMemo(
    () => [...mastery].sort((a, b) => a.mastery - b.mastery)[0] ?? null,
    [mastery],
  );

  const reset = useCallback(() => setState({ completed: [], xp: 0, attempts: {}, history: [] }), []);

  const history = useMemo<TimelineEntry[]>(() => state.history ?? [], [state.history]);

  return {
    ...state,
    history,
    isUnlocked,
    isComplete,
    completeLevel,
    recordAttempt,
    mastery,
    weakest,
    reset,
  };
}
