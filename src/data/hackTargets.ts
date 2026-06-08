export type MiniGameId = "password" | "trace" | "firewall";
export type HackCategory = "passwords" | "phishing" | "privacy";

export interface HackLevel {
  id: number;
  tier: 1 | 2 | 3;
  name: string;
  target: string;
  objective: string;
  miniGame: MiniGameId;
  category: HackCategory;
  xpReward: number;
  briefing: string;
  successStory: string;
}

export interface CategoryMeta {
  id: HackCategory | "all";
  label: string;
}

export const hackCategories: CategoryMeta[] = [
  { id: "all", label: "All targets" },
  { id: "passwords", label: "Passwords" },
  { id: "phishing", label: "Phishing" },
  { id: "privacy", label: "Privacy" },
];

export interface HackTier {
  tier: 1 | 2 | 3;
  name: string;
  subtitle: string;
  color: string; // tailwind text color hint
}

export const hackTiers: HackTier[] = [
  { tier: 1, name: "Script Kiddie", subtitle: "Coffee shop targets", color: "#22d3ee" },
  { tier: 2, name: "Hacker", subtitle: "Corporate networks", color: "#a78bfa" },
  { tier: 3, name: "Elite", subtitle: "Critical infrastructure", color: "#f472b6" },
];

export const hackLevels: HackLevel[] = [
  {
    id: 1, tier: 1, name: "Open WiFi Heist",
    target: "Downtown Café WiFi",
    objective: "Crack the weakest user password on the network.",
    miniGame: "password", category: "passwords", xpReward: 100,
    briefing: "An unprotected café network is broadcasting. Identify the most vulnerable credentials before the admin notices.",
    successStory: "You're in. The café's router logs show no defenses — a lesson in why public WiFi needs a VPN.",
  },
  {
    id: 2, tier: 1, name: "Trace the Intruder",
    target: "Small-business server",
    objective: "Reconstruct the attacker's kill chain from log fragments.",
    miniGame: "trace", category: "phishing", xpReward: 120,
    briefing: "Logs are scrolling past. Identify how the attacker got in, what they did, and how they tried to leave with the data.",
    successStory: "Kill chain reconstructed. Real SOC analysts pivot through logs exactly like this.",
  },
  {
    id: 3, tier: 1, name: "Home Router Bypass",
    target: "Default-credential router",
    objective: "Route a signal through the firewall maze.",
    miniGame: "firewall", category: "privacy", xpReward: 140,
    briefing: "The target router still uses factory defaults. Navigate the rules and slip past the IDS.",
    successStory: "Access granted. Default credentials remain the #1 home network vulnerability.",
  },
  {
    id: 4, tier: 2, name: "Corp VPN Crack",
    target: "Acme Corp VPN",
    objective: "Identify weak corporate passwords.",
    miniGame: "password", category: "passwords", xpReward: 200,
    briefing: "Acme's employees reuse passwords. Find the weakest before the audit closes the gap.",
    successStory: "VPN tunnel established. Password policies without entropy rules are theatre.",
  },
  {
    id: 5, tier: 2, name: "Corporate Breach Trace",
    target: "Acme corporate network",
    objective: "Follow the attacker from phish to exfil, then contain them.",
    miniGame: "trace", category: "phishing", xpReward: 220,
    briefing: "Phished credentials, lateral movement, and live data theft. Read the evidence and stop them before more PII leaves.",
    successStory: "Containment executed cleanly. Speed + clarity is what separates a contained incident from a breach headline.",
  },
  {
    id: 6, tier: 2, name: "WAF Maze",
    target: "Web Application Firewall",
    objective: "Pivot through layered firewall rules.",
    miniGame: "firewall", category: "privacy", xpReward: 240,
    briefing: "Multiple layers of WAF stand between you and the admin panel. Find the path.",
    successStory: "Pivoted to the admin panel. Defense in depth slowed but didn't stop a focused attacker.",
  },
  {
    id: 7, tier: 3, name: "Power Grid Lockpick",
    target: "SCADA control plane",
    objective: "Crack a hardened operator credential.",
    miniGame: "password", category: "passwords", xpReward: 350,
    briefing: "Critical infrastructure with strict policies. Only the worst outliers will fall.",
    successStory: "Operator account compromised. Critical infra deserves hardware-backed MFA.",
  },
  {
    id: 8, tier: 3, name: "ICS Intrusion Trace",
    target: "Industrial control plant",
    objective: "Trace a macro-borne attacker across IT into OT — and stop them.",
    miniGame: "trace", category: "phishing", xpReward: 380,
    briefing: "A document macro spawned PowerShell on an operator workstation. Follow persistence into the plant network before kinetic impact.",
    successStory: "Attacker evicted, IT/OT segmented, plant safe. This is how real ICS incidents are actually contained.",
  },
  {
    id: 9, tier: 3, name: "Black Vault",
    target: "Air-gapped vault network",
    objective: "Navigate a labyrinth of IDS rules.",
    miniGame: "firewall", category: "privacy", xpReward: 500,
    briefing: "The final challenge — a true defense-in-depth target. One wrong route triggers everything.",
    successStory: "Vault breached. You've internalised how layered, monitored defenses actually work.",
  },
];

export const levelsByTier = (tier: 1 | 2 | 3) => hackLevels.filter((l) => l.tier === tier);
