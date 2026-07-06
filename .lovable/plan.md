# Cipher City → Premium Cyber Defense Experience

Transform the Data Defense Simulator into a story-driven, reward-loop game where every 15–20s the player gets threat → decision → animated consequence → knowledge drop → progression. Keep XP, reputation, knowledge, customization, sound, Red Flag lifeline, and Cipher City integration — enhance them, never replace.

## 1. New data layer

Create bite-sized content banks (no walls of text; each item ≤ ~60 words):

- `src/data/knowledge/funFacts.ts` — 30+ fun cyber facts
- `src/data/knowledge/comicCases.ts` — 15+ 3-panel funny case studies (panels + moral)
- `src/data/knowledge/mythVsReality.ts` — 20+ myth/reality pairs
- `src/data/knowledge/cyberTips.ts` — 25+ short Cipher Bot tips
- `src/data/knowledge/caseFiles.ts` — 12+ real-world case files (Bangladesh Bank, Colonial Pipeline, Twitter 2020, WannaCry, Target, SolarWinds…) with attack / damage / why / prevention
- `src/data/knowledge/newsTicker.ts` — rotating live-alert headlines (extends current ticker)
- `src/data/operations.ts` — 6 Operations (Home Shield → Banking Crisis → School Security → Hospital Lockdown → National Grid → Dark Web), each with theme color, background, music cue, threat wave IDs
- `src/data/achievements/defender.ts` — Spam Slayer, Eagle Eye, Cyber Scholar, QR Master, Bank Guardian, etc. with triggers

All categorized by topic: `phishing | malware | passwords | banking | social | ai` for the Knowledge Vault.

## 2. Consequence cinematics (replace ✅/❌ screen)

Rewrite `src/components/quests/ConsequenceOverlay.tsx` as a 2–3s cinematic (Framer Motion):

- **Correct**: expanding green shield ring, hacker sprite dissolving into pixels, "THREAT NEUTRALIZED" stamp slam, XP particles flying to HUD, defender smile pose, city-glow brighten pulse.
- **Wrong**: RGB glitch bars, hacker laugh sprite, meter counters ticking down live, floating data packets ("SSN", "OTP", "₹") leaking outward, device-spark sparks.

No "Next" button gate — auto-advances into the Knowledge Card.

## 3. Knowledge Card system

New `src/components/quests/knowledge/KnowledgeCard.tsx` — one shared shell, four variants:

- `FunFactCard` — animated speech bubble, 3–4s auto-dismiss
- `ComicCaseCard` — 3 panels slide-in with speech bubbles + moral panel
- `MythRealityCard` — flip-card animation between MYTH and REALITY
- `CyberTipCard` — Cipher Bot floats in and speaks

`useKnowledgeQueue` hook picks a non-repeating random category+item per threat, tracks seen IDs in localStorage, awards **+Knowledge XP** with particle animation into the meter, and unlocks the item in the Vault.

## 4. Cipher Bot companion

New `src/components/quests/CipherBot.tsx`:

- Floating SVG robot bottom-right of the battle stage
- Reacts after each action with witty one-liners from a pool ("Nice catch." / "Curiosity is good. Clicking random links isn't.")
- Idle bob animation; speech bubble pops with typewriter effect
- Also delivers CyberTipCards

## 5. Case File cutscene

New `src/components/quests/CaseFileCard.tsx` — unlocks after each wave clears:

- Terminal-style "CASE FILE #NN" header
- Sections: Attack / Damage / Why / Prevention (icon per row, staggered fade)
- Max 25s, skippable, adds to Vault

## 6. Operations & evolving world

- Rename levels to **Operations** in `PhishingQuest.tsx` intro and HUD
- `src/components/quests/OperationIntro.tsx` — cinematic title card per operation (name, theme, backdrop)
- `src/components/quests/CityBackdrop.tsx` — SVG city that morphs by operation stage: broken neon → clean skyline → celebrating drones. Driven by a `cityHealth` value derived from meters + completed operations.
- Refactor `PhishingStreamGame.tsx` to consume operation → waves instead of hardcoded WAVES

## 7. Achievement popups

New `src/components/quests/AchievementToast.tsx`:

- Top-center slide-down with glow, icon, name, tagline
- Triggered by `useAchievements` hook watching stat deltas (blocked count, red flags used, facts read, QR calls, bank meter preserved)
- Persists unlock state in localStorage + Cipher City progress

## 8. Knowledge Vault

New `src/pages/KnowledgeVault.tsx` (also reachable from Cipher City menu) or `src/components/CipherCity/KnowledgeVault.tsx`:

- Grid of 6 category tiles with % complete radial rings
- Tap category → list of unlocked Facts / Cases / Tips / Myths / Case Files
- Overall completion badge ("Knowledge Vault 82%")
- Re-open any card to replay animation

## 9. HUD polish

Enhance `DefenderHUD.tsx`:

- Live news ticker sources from `newsTicker.ts` (rotating headlines)
- Knowledge XP meter added next to the 4 damage meters
- Operation name + progress dots for current wave
- Meter change animations (count-up/down, flash on hit)

## 10. Mission Report

New `src/components/quests/MissionReport.tsx` replaces plain score screen:

- Animated dashboard rows counting up: Threats Neutralized · Identity Saved · Money Protected · Knowledge Learned · Facts Unlocked · Case Files · Achievements · City Security ↑
- CTA to next Operation or return to Cipher City

## 11. Motion & polish

- Add `framer-motion` usage across new overlays (fade + scale + slide + glow presets in a shared `src/components/quests/motion.ts`)
- Additional Tailwind keyframes: `glitch`, `pixel-dissolve`, `shield-expand`, `packet-leak`, `stamp-slam`, `card-flip`, `bot-bob`
- Ensure 60fps on mobile-first layouts; guard heavy effects behind `prefers-reduced-motion`

## 12. Wiring

- `PhishingStreamGame.tsx`: after each action → play `ConsequenceOverlay` → then `KnowledgeCard` (random category) → check achievements → next threat. After last threat of a wave → `CaseFileCard`. After last wave of an operation → `MissionReport` → next `OperationIntro`.
- `PhishingQuest.tsx` intro reframed around Operations and Knowledge Vault entry point.
- Cipher City menu gains "Knowledge Vault" tile.

## Out of scope

- New backend tables (all progression stored in existing localStorage + game_saves)
- Multiplayer / voice-acted audio
- Auth changes
- Rewriting Cipher City missions

## Technical details

- **Stack**: React + Framer Motion + Tailwind semantic tokens (no hardcoded colors)
- **State**: local `useReducer` in `PhishingStreamGame` for phase machine (`playing → consequence → knowledge → achievement → next | wave-clear → caseFile → next-wave | ops-clear → report`)
- **Persistence**: extend existing `useGameSave` payload with `knowledgeVault: { seenIds: string[] }`, `achievements: string[]`, `operationsCleared: number`, `cityHealth: number`
- **Randomization**: weighted picker avoiding last 5 seen IDs per category
- **Perf**: lazy-load Vault page; memoize card components; cap simultaneous particles

## Files

**New (~15)**: data banks (7), Cipher Bot, KnowledgeCard + 4 variants, CaseFileCard, OperationIntro, CityBackdrop, AchievementToast, MissionReport, KnowledgeVault, motion presets, achievements hook, knowledge queue hook.

**Edited (~5)**: `ConsequenceOverlay.tsx`, `PhishingStreamGame.tsx`, `PhishingQuest.tsx`, `DefenderHUD.tsx`, `tailwind.config.ts`, `useGameSave.ts`, Cipher City menu.
