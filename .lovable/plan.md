# Make the 16 new cases playable

Right now the 16 additions (10 real cyber-crime incidents and 6 certification-style questions) sit in the scenario library but nothing in the running app opens them. This plan puts them in front of the player in two ways.

## 1. A "Case Files" mode

- New button next to the mission grid: **Case Files**.
- Opens one mixed, scrollable list of all cases — real incidents and certification questions together, each with a small label chip ("Real Incident" / "Certification") and its topic (passwords, network, privacy, malware, social, scam).
- Tapping a card opens the case: the situation, the choices, then the outcome with the explanation, the concept it teaches, and the practical tip.
- Cleared cases get a checkmark and are remembered between visits, with a simple "X of N reviewed" counter at the top.

## 2. Cases attached to missions

- After a mission's scenario review, a matching real-incident case is offered: "This actually happened" with a Study the case button and a Skip option.
- Matching is by topic, and each mission always gets the same case so the experience is repeatable.
- Certification questions are not forced into missions; they stay in Case Files.

## Notes

- No changes to mission difficulty, scoring rules, or the boss fights.
- Styling follows the existing dark cyber look used by the evidence board and review screens.

## Technical detail

- Add `src/data/caseFiles.ts` deriving from the existing `gameScenarios` entries (IDs 31–46), tagging each `kind: "incident" | "certification"` and exposing `caseForCategory(category, levelId)` for deterministic mission matching.
- New `src/components/hack/CaseFilesPanel.tsx` (list + detail) reusing the card/badge patterns from `EvidenceBoard.tsx` and `ScenarioReview.tsx`.
- Wire a `casefiles` view and an "This actually happened" step into `HackGame.tsx` after `ScenarioReview`.
- Progress stored in `localStorage` under `ddh.caseFiles.v1`; cleared by the existing progress reset.
