# Phishing Stream Quest

A new standalone quest where the player works through three interactive phishing case studies. Each one is a click-through simulation (inbox / browser / QR scan) where choices have consequences, paired with a short animated explainer of the concept.

## Entry point
- Add a "Phishing Stream" quest tile on the landing/home view (alongside Cipher City and Quiz Mode).
- Route: `/phishing-stream` (new page `src/pages/PhishingStream.tsx`).
- Progress saved to localStorage (`phishingStream.progress`) and synced to Supabase `game_saves` like other modes (newest-timestamp wins).

## Quest structure
Three stages, unlocked in order. Each stage = Brief → Interactive Sim → Outcome → Animated Case Study → Quick Check.

1. **Email phishing — "The Bank Alert"**
   - Sim: a fake inbox with 4 emails. Player must inspect sender, hover links (tooltip reveals real URL), and choose Report / Open / Delete.
   - Concept: spoofed sender, urgency, lookalike domain.

2. **Spear phishing & whaling — "CEO Wire Transfer"**
   - Sim: player is a finance intern; receives a personalized message referencing real project + Slack handle, asking for urgent wire. Choices: Reply, Verify on second channel, Forward to security.
   - Concept: OSINT-based targeting, authority pressure, out-of-band verification.

3. **Clone & QR (quishing) — "Café Wi-Fi Poster"**
   - Sim: scan a QR → lands on a near-identical login page. Player checks URL bar, certificate, autofill behavior, and decides Sign in / Close / Report.
   - Concept: homograph domains, QR redirection, credential harvesting.

## Interactive simulation mechanics
- Reusable `PhishingSim` component driven by a JSON scenario: clickable hotspots (sender, link, button, URL bar), each with `reveal` text and a `risk` flag.
- Player must collect ≥2 "red flag" hotspots before the action buttons enable, to teach inspection.
- Outcome screen: shows every red flag, what would have happened on the wrong choice (e.g., "credentials sent to attacker.example"), and the secure path.

## Animated case study
- One short SVG/CSS animated timeline per stage (bait → hook → damage → defense), reusing the visual style of `CategoryAnimation.tsx` but with 4 captioned panels that auto-advance (~6s each, ~24s total).
- Built as `PhishingCaseAnimation` with a `type: "email" | "spear" | "quishing"` prop.

## Quick check
- 1 reinforcement MCQ per stage (same pattern as existing `CategoryLessonDialog` quiz) before "Stage complete".

## Scoring & rewards
- +50 XP per stage, +100 bonus for finishing all three without picking a risky action.
- Achievement: "Phish Spotter" on full completion (added to existing achievements list).
- Progress bar at top: Stage 1 / 2 / 3.

## Technical details
- New files:
  - `src/pages/PhishingStream.tsx` — quest shell, stage routing, progress.
  - `src/components/phishing/PhishingSim.tsx` — generic interactive sim renderer.
  - `src/components/phishing/PhishingCaseAnimation.tsx` — 4-panel animated case study.
  - `src/components/phishing/FakeInbox.tsx`, `FakeMessageThread.tsx`, `FakeBrowser.tsx` — sim surfaces.
  - `src/data/phishingStream.ts` — three scenario definitions (hotspots, choices, outcomes, quiz, case-study captions).
- Edited files:
  - `src/App.tsx` — register `/phishing-stream` route.
  - `src/components/LandingPage.tsx` (or current home) — add quest tile + CTA.
  - `src/components/CipherCity/achievements.ts` — add "Phish Spotter".
  - `src/hooks/useGameSave.ts` — include `phishingStream` slice in save payload.
- Styling: existing semantic tokens (cyberpunk neon), `animate-fade-in` / `animate-scale-in` for panel transitions, `ReturnType<typeof setInterval>` for auto-advance timer.
- A11y: hotspots are real `<button>`s with `aria-label`; animation has a Pause button and respects `prefers-reduced-motion`.

## Out of scope
- No backend schema changes beyond the existing `game_saves` JSON payload.
- No new audio assets (reuse `useGameAudio` cues).
