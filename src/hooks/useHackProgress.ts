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
      if (id === 1) return true;
      const level = hackLevels.find((l) => l.id === id);
      if (!level) return false;
      // unlock when previous level in any tier is complete; also gate tier change on previous tier full completion
      const prev = hackLevels.find((l) => l.id === id - 1);
      if (!prev) return true;
      if (prev.tier !== level.tier) {
        // entering a new tier — all previous tier levels must be done
        const prevTierLevels = hackLevels.filter((l) => l.tier === prev.tier);
        return prevTierLevels.every((l) => state.completed.includes(l.id));
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
