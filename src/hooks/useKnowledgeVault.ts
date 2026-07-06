import { useCallback, useEffect, useState } from "react";
import type { VaultCategory } from "@/data/knowledge";

const KEY = "cipher.vault.v1";

interface VaultState {
  seen: string[]; // ids of all unlocked knowledge items
  cardsRead: number;
  achievements: string[];
}

function load(): VaultState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { seen: [], cardsRead: 0, achievements: [] };
}

function save(s: VaultState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function useKnowledgeVault() {
  const [state, setState] = useState<VaultState>(() => load());

  useEffect(() => { save(state); }, [state]);

  const markSeen = useCallback((id: string) => {
    setState((s) => (s.seen.includes(id) ? { ...s, cardsRead: s.cardsRead + 1 } : { ...s, seen: [...s.seen, id], cardsRead: s.cardsRead + 1 }));
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setState((s) => (s.achievements.includes(id) ? s : { ...s, achievements: [...s.achievements, id] }));
  }, []);

  return { state, markSeen, unlockAchievement };
}

export function pickRandom<T extends { id: string }>(list: T[], avoidIds: string[]): T {
  const pool = list.filter((x) => !avoidIds.includes(x.id));
  const source = pool.length > 0 ? pool : list;
  return source[Math.floor(Math.random() * source.length)];
}

export type { VaultCategory };
