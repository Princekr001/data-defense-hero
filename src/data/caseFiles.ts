import { gameScenarios } from "@/data/scenarios";
import type { Scenario } from "@/data/scenarios";

export type CaseKind = "incident" | "certification";

export interface CaseFile extends Scenario {
  kind: CaseKind;
}

/** IDs 31-40 are real-incident cases, 41-46 are certification-style questions. */
const INCIDENT_IDS = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
const CERT_IDS = [41, 42, 43, 44, 45, 46];

const pick = (ids: number[], kind: CaseKind): CaseFile[] =>
  ids
    .map((id) => gameScenarios.find((s) => s.id === id))
    .filter((s): s is Scenario => Boolean(s))
    .map((s) => ({ ...s, kind }));

export const caseFiles: CaseFile[] = [...pick(INCIDENT_IDS, "incident"), ...pick(CERT_IDS, "certification")];

/** Scenario topics that best match each hack-grid category. */
const CATEGORY_MATCH: Record<string, Scenario["category"][]> = {
  phishing: ["phishing", "social", "scam"],
  passwords: ["password", "social"],
  privacy: ["privacy", "network", "malware"],
};

/** Deterministic real-incident case for a mission, so replays show the same case. */
export function caseForCategory(category: string, levelId: number): CaseFile | null {
  const topics = CATEGORY_MATCH[category] ?? [];
  const pool = caseFiles.filter((c) => c.kind === "incident" && topics.includes(c.category));
  const list = pool.length ? pool : caseFiles.filter((c) => c.kind === "incident");
  if (!list.length) return null;
  return list[levelId % list.length];
}

const PROGRESS_KEY = "ddh.caseFiles.v1";

export function loadReviewedCases(): number[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? (JSON.parse(raw) as number[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReviewedCases(ids: number[]) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(ids));
  } catch {}
}

export function clearReviewedCases() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {}
}
