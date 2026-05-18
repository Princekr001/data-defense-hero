## Goal

Add a topic-category filter to the 3D Hack Grid so students can practice one cybersecurity area at a time.

## Categories (derived from existing level content)

Each hack level already maps cleanly to one of three core domains based on its mini-game and target. I'll add an explicit `category` field so it's data-driven, not inferred at render time.

| Category | Tag | Levels |
|---|---|---|
| Passwords & Credentials | `passwords` | L1 Open WiFi Heist, L4 Corp VPN Crack, L7 Power Grid Lockpick |
| Phishing & Network Traffic | `phishing` | L2 Phishing Stream, L5 Datacenter Sniff, L8 Satellite Uplink |
| Privacy & Network Defense | `privacy` | L3 Home Router Bypass, L6 WAF Maze, L9 Black Vault |

Plus an "All targets" option (default).

## UX

- A pill-style filter bar pinned **bottom-center** of the Hack Grid screen (above the existing hint text), styled to match the existing black/cyan HUD (backdrop-blur, white/10 border).
- 4 chips: `All · Passwords · Phishing · Privacy`. Active chip uses the cyber accent color; counts shown in small text (`Passwords · 3`).
- On mobile (`< sm`), the bar wraps and uses smaller padding.

## 3D behavior

- Filtering does not remove nodes from the scene — that would jar the layout. Instead:
  - Matching nodes render at full emissive intensity.
  - Non-matching nodes fade to ~15% opacity, desaturate, and become non-interactive (pointer events off).
- The current unlock/complete logic stays unchanged — players still progress through the full sequence; the filter is a visual practice aid.

## File changes

**Edited**
- `src/data/hackTargets.ts` — add `category: "passwords" | "phishing" | "privacy"` to each level; export a `hackCategories` array with label + count helpers.
- `src/components/hack/LevelNode.tsx` — accept a `dimmed` prop; when true, reduce opacity, drop emissive intensity, and ignore pointer events.
- `src/components/hack/HackGrid3D.tsx` — accept `activeCategory` prop and pass `dimmed` to each `LevelNode` when `activeCategory !== "all" && level.category !== activeCategory`.
- `src/components/HackGame.tsx` — add `activeCategory` state, render the filter bar (only when `view === "grid"`), pass into `HackGrid3D`.

**No changes** to mini-games, progression, or the mission scene.

## Out of scope

- No re-introduction of the old `EnhancedInteractiveCyberGame` Quiz Mode.
- No new mini-games or categories beyond what the existing levels already cover.
- No persistence of the selected filter (resets to "All" on reload — it's a practice toggle).

## Verification

- Toggle each filter chip; confirm only matching nodes glow and are clickable.
- "All" restores the default visual.
- Resize to mobile width; filter bar wraps and stays tappable.
