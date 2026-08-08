import type { HackLevel } from "./hackTargets";

export interface ScenarioReview {
  /** What the mission was really testing. */
  situation: string;
  secure: {
    label: string;
    why: string[];
  };
  unsafe: {
    label: string;
    why: string[];
  };
  /** One-line takeaway for everyday life. */
  takeaway: string;
}

const BY_MINIGAME: Record<string, ScenarioReview> = {
  password: {
    situation:
      "A credential set was exposed and you had to judge which password an attacker would break first.",
    secure: {
      label: "Long, unique, high-entropy passphrase stored in a manager",
      why: [
        "Length beats complexity: every extra character multiplies the guessing time exponentially.",
        "A unique password per site means one breach can't be replayed against your bank or email (credential stuffing fails).",
        "A password manager removes the need to remember it, so you never fall back to a reused pattern.",
        "With MFA on top, a stolen password alone is not enough to log in.",
      ],
    },
    unsafe: {
      label: "Short, dictionary-based or reused password (e.g. Summer2024!)",
      why: [
        "Cracking rigs test billions of guesses per second — common words and years fall in seconds.",
        "Predictable patterns (Name + year + !) are already in every attacker wordlist.",
        "Reuse turns one leaked site into a master key for your whole digital identity.",
        "No MFA means the moment it's guessed, the account is fully owned.",
      ],
    },
    takeaway: "Unique passphrase + password manager + MFA on every account that matters.",
  },
  trace: {
    situation:
      "Logs showed suspicious activity and you had to separate real attacker signal from normal noise.",
    secure: {
      label: "Verify the evidence, isolate the account, then report",
      why: [
        "Correlating timestamps, IPs and user agents proves intent instead of guessing.",
        "Isolating the compromised session stops lateral movement before data leaves the network.",
        "Reporting early gives responders the window they need — most damage happens in the first hour.",
        "Preserving logs keeps the forensic trail intact for investigation.",
      ],
    },
    unsafe: {
      label: "Ignore the anomaly or delete the alerts as false positives",
      why: [
        "Attackers rely on alert fatigue; a dismissed login from a new country is often the real breach.",
        "Waiting gives time to escalate privileges and set up persistence and backdoors.",
        "Clearing logs destroys the only evidence of what was actually taken.",
        "Unreported incidents grow into regulatory and financial fallout.",
      ],
    },
    takeaway: "Treat odd logins, new devices and unknown locations as real until proven otherwise.",
  },
  firewall: {
    situation:
      "You navigated a monitored network where one wrong move triggers intrusion detection.",
    secure: {
      label: "Segmented network, least privilege and monitored access paths",
      why: [
        "Segmentation contains an intruder to one zone instead of the whole network.",
        "Least privilege means a stolen account can only reach what it truly needs.",
        "Monitoring and IDS make attacker movement noisy and detectable.",
        "Patched, closed ports remove the easy entry points entirely.",
      ],
    },
    unsafe: {
      label: "Flat network, open ports and shared admin access",
      why: [
        "One compromised laptop on a flat network exposes every server on it.",
        "Open, unpatched services are scanned and exploited automatically within minutes.",
        "Shared admin credentials remove accountability — nobody knows who did what.",
        "Without detection, an attacker can dwell for months collecting data.",
      ],
    },
    takeaway: "Assume breach: segment, restrict, patch and watch every path in.",
  },
};

const BY_CATEGORY: Record<string, Partial<ScenarioReview>> = {
  phishing: {
    takeaway: "Never act from a link in a message — go to the app or site yourself and verify.",
  },
  privacy: {
    takeaway: "Share the minimum: every extra detail online is fuel for a targeted attack.",
  },
};

export function reviewForLevel(level: HackLevel): ScenarioReview {
  const base = BY_MINIGAME[level.miniGame] ?? BY_MINIGAME.trace;
  const override = BY_CATEGORY[level.category];
  return override ? { ...base, ...override } : base;
}
