
# From Quiz → Data Defense Simulator

The current Phishing Storm reads like a timed multiple-choice quiz (message text + two buttons). We'll rebuild it as a **cinematic defense sim** where the player IS a person whose data, money, contacts and reputation are actively under attack — and every decision plays out visibly on screen.

## The new core loop

Instead of "read message → pick Legit/Phish", the player commands a stylized avatar ("YOU") sitting at a desk. Threats arrive as **live incoming alerts** — a ringing phone, a popping email, a QR code slid across the desk, a bank SMS buzzing. The player has seconds to react with a contextual action (Block, Report, Verify, Ignore, Open).

Each choice triggers a **consequence cutscene** (2-3s animation) that visibly changes the player's state:

- Wrong → attacker avatar laughs, data packets fly out of the player's device, a bank balance ticks down, a "CONTACTS LEAKED" banner sweeps in, screen glitches red.
- Right → shield pulse, attacker avatar disintegrates, "THREAT NEUTRALIZED" stamp, small XP burst.

The consequence is the teaching moment — no separate solution card wall.

## Player identity & stakes (persistent HUD)

Four live meters replace the abstract "score":

```text
 [ Bank Balance   $2,480 ] ← ticks down on scams / phishing money loss
 [ Identity       92%    ] ← drops on credential leaks
 [ Contacts       247    ] ← drops on contact-list breaches
 [ Device Health  100%   ] ← drops on malware / quishing installs
```

Lose any meter to zero → game over cutscene ("Your identity was sold on the dark web").

## The character

A stylized SVG avatar rendered in the scene (not a static emoji):
- Neutral pose while idle
- Alert pose when threat incoming (leans forward, sweat drop)
- Shield-up pose on correct block
- Shocked / drained pose on wrong choice
- Face + color customizable at first launch (reuse existing CharacterCustomizer skin tokens)

Antagonist avatars appear per threat type: **Phisher Ghost** (email), **Suit Impostor** (whaling), **QR Trickster** (quishing), **Voice Bot** (vishing), **Clone** (clone phishing), **Angler Fish** (social).

## Threat scene types (each with its own animation)

1. **Email pop-in** — envelope slides onto screen, unfolds, headers/link highlighted.
2. **SMS buzz** — phone shakes on desk, message bubbles typewriter-in.
3. **Voice call** — phone rings with waveform, transcript streams live.
4. **QR flash** — a printed QR card lands on the desk, camera-scan overlay.
5. **DM ping** — social app notification with fake profile card.
6. **Push alert** — OS-style banner drops from top.

Each scene ships with 2-4 contextual action buttons (not just Legit/Phish): e.g. `Answer`, `Decline`, `Report as spam`, `Scan QR`, `Cover it`.

## Live alert system

A ticker at the top streams **real-world-style news alerts** between waves ("⚠️ 3,400 accounts drained via fake bank SMS in Mumbai today") to reinforce seriousness. Between rounds, a "Threat Intel" card shows the actual technique the player just faced, in one line, with the red flags highlighted on the original message.

## Difficulty & pacing (kept hard)

- Waves of 5 threats, escalating: single threat → parallel threats (email + SMS at once) → decoys (legit-looking that ARE legit — punished for over-blocking).
- Reaction window shrinks each wave.
- Boss wave: a live "attack in progress" where 3 threats fire in 6 seconds.

## Files to change

- **New** `src/components/quests/scenes/` — one small component per scene type (EmailScene, SMSScene, CallScene, QRScene, DMScene, PushScene) with framer-motion animations.
- **New** `src/components/quests/DefenderAvatar.tsx` — SVG player with pose states.
- **New** `src/components/quests/AttackerAvatar.tsx` — SVG antagonists per threat type.
- **New** `src/components/quests/ConsequenceOverlay.tsx` — the "packets leaking / shield pulse / balance drop" cutscene.
- **New** `src/components/quests/DefenderHUD.tsx` — bank / identity / contacts / device meters + live news ticker.
- **New** `src/data/defenderThreats.ts` — threat scenarios with scene type, actions, consequences, teach-line, red flags.
- **Rewrite** `src/components/quests/PhishingStreamGame.tsx` — orchestrator (wave manager, meters, game-over) instead of the current text-message stream.
- **Update** `src/components/quests/PhishingQuest.tsx` — intro reframed as "You have 60 seconds. Protect your data." with meter preview.
- **Keep** `src/data/phishingTypes.ts` (referenced for taxonomy) and Red Flags lifeline (adapted to new scenes).

## What stays

- 3 lives → replaced by the 4 meters; lifeline "Show Red Flags" survives.
- Level/rank progression survives, but is now tied to meters saved + threats neutralized.
- Reward calculation (`knowledge` / `reputation`) into Cipher City stays intact.

## Out of scope for this pass

- Sound design overhaul (reuse existing `useGameAudio`).
- Multiplayer / leaderboard changes.
- New backend tables.

## One decision before I build

**Character art direction — pick one:**
- **A. Flat vector cyberpunk** — geometric SVG avatar, neon outlines, matches current dark theme. Fastest, ships crisp animations.
- **B. Pixel-art hacker** — 32×32 pixel character with 4-frame pose sprites, retro arcade feel.
- **C. 3D-ish isometric desk scene** — CSS 3D transformed desk with the avatar as a stylized silhouette, more cinematic but heavier.

I recommend **A** — best fit for the existing cyberpunk system and quickest to animate multiple pose states without new assets.
