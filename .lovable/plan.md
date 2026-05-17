## Goal

Replace the current Cipher City map and Quiz Mode with a single new experience: a **3D, responsive, tier-based "Hack Targets" game**. Players progress through tiers (Script Kiddie → Hacker → Elite), each tier containing levels rendered as hackable 3D nodes. Selecting a level opens a 3D mission scene with a brand-new hacking mini-game.

## Experience flow

```text
Landing Page
   │  Start Hacking
   ▼
3D Hack Grid (orbitable scene)
   ├─ Tier 1: Script Kiddie  [L1][L2][L3]    ← unlocked
   ├─ Tier 2: Hacker         [L4][L5][L6]    ← locked until Tier 1 done
   └─ Tier 3: Elite          [L7][L8][L9]    ← locked until Tier 2 done
        │ click a node
        ▼
   3D Mission Scene (server room / terminal vibe)
   - Briefing overlay (target, objective)
   - Hacking mini-game (see below)
   - Success → unlock next level, XP, return to grid
   - Fail   → retry / hint
```

## 3D treatment

- **Library:** `@react-three/fiber@^8.18` + `@react-three/drei@^9.122` + `three@^0.160`.
- **Hack Grid scene:** dark cyber environment, glowing tiered platforms floating in space, each level as a neon node (locked = dim/red-locked icon, available = pulsing cyan, complete = green). OrbitControls (constrained), subtle bloom via postprocessing-lite or emissive materials only (keep deps minimal).
- **Mission scene:** stylised low-poly server rack / holographic terminal with animated data streams. Mini-game UI rendered as HTML overlay (`<Html>` from drei or absolute-positioned React) so it stays accessible and responsive.
- **Responsiveness:** Canvas fills viewport; camera FOV + node spacing adapt to viewport width. On mobile, swap OrbitControls for tap-to-focus + swipe-to-rotate; mini-game overlays become full-screen sheets.
- **Performance:** `dpr={[1, 1.75]}`, lazy-load mission scenes, suspend grid while in a mission, single shared lighting rig.

## Tier & level system

- New file `src/data/hackTargets.ts` defining tiers and levels:
  - `id`, `tier`, `name`, `target` (e.g. "Coffee shop WiFi"), `objective`, `miniGame` (id), `xpReward`, `briefing`, `successStory`.
- 3 tiers × 3 levels = 9 levels to start (extensible).
- Progress stored in localStorage (reuse pattern from `useGameSave`): `completedHackLevels: number[]`, `currentTier`.
- Unlock rule: level N unlocked when N-1 complete; tier unlocked when all previous-tier levels complete.

## Hacking mini-games (new)

Three reusable mini-game components in `src/components/hackGames/`, each tied to a real cybersecurity concept:

1. **PasswordCracker** — pick the weakest password from a generated set within a time limit; teaches password entropy.
2. **PacketInspector** — scan a stream of packet cards, flag the malicious ones (phishing URL, malformed header); teaches network awareness.
3. **FirewallBypass** — pattern/sequence puzzle: route a signal through allowed nodes avoiding IDS triggers; teaches defense-in-depth.

Each mini-game:
- Accepts `{ level, onSuccess, onFail }` props.
- Renders inside the 3D mission scene as an HTML overlay.
- Has its own difficulty scaling based on `tier`.

## File changes

**New**
- `src/components/HackGame.tsx` — top-level controller (grid ↔ mission state).
- `src/components/hack/HackGrid3D.tsx` — r3f Canvas with tiered nodes.
- `src/components/hack/MissionScene3D.tsx` — r3f Canvas for active mission.
- `src/components/hack/TierPlatform.tsx`, `LevelNode.tsx` — 3D primitives.
- `src/components/hackGames/PasswordCracker.tsx`
- `src/components/hackGames/PacketInspector.tsx`
- `src/components/hackGames/FirewallBypass.tsx`
- `src/data/hackTargets.ts`
- `src/hooks/useHackProgress.ts`

**Edited**
- `src/pages/Index.tsx` — replace mode switcher; route Start → `HackGame`.
- `src/components/LandingPage.tsx` — CTA copy + feature cards updated to reflect hacking theme.
- `package.json` — add three / r3f / drei at pinned versions.

**Removed (or left orphaned, not imported)**
- Cipher City map (`CipherCity.tsx`, `CipherCity/CityMap.tsx`, related mission UIs) and Quiz Mode entry points are no longer reachable. Files kept on disk to avoid losing content history, but unwired from routing.

## Responsiveness specifics

- Landing page: existing layout already responsive; only copy/CTA updates.
- 3D scenes: container `w-full h-[100dvh]`; HUD uses `clamp()` font sizes and `safe-area-inset` padding.
- Mini-game overlays: `max-w-md` card on desktop, full-screen sheet on `<sm` breakpoint.
- Touch controls: tap node to select, double-tap to enter mission; pinch-zoom disabled inside Canvas to avoid conflict.

## Out of scope

- No backend changes — progress stays in localStorage.
- No audio overhaul (keep existing `useGameAudio` hooks where they already fire).
- No new auth, no Lovable Cloud changes.

## Verification

- Manually click through tier 1 → complete a level → confirm tier 2 unlocks.
- Resize preview to mobile width; verify Canvas + overlays remain usable.
- Check build output for r3f version warnings (must stay on v8 / React 18).
