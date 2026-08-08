import { useCallback, useEffect, useState } from "react";
import { hackLevels } from "@/data/hackTargets";

const KEY = "ddh.hackProgress.v1";

interface State {
  completed: number[];
  xp: number;
}

const load = (): State => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completed: [], xp: 0 };
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
      return { completed: [...s.completed, id], xp: s.xp + (lvl?.xpReward ?? 0) };
    });
  }, []);

  const reset = useCallback(() => setState({ completed: [], xp: 0 }), []);

  return { ...state, isUnlocked, isComplete, completeLevel, reset };
}
