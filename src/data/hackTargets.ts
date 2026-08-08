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
    id: 10, tier: 1, name: "SIM Swap Setup",
    target: "Telecom self-service portal",
    objective: "Find the recovery credential a SIM-swap crew would break first.",
    miniGame: "password", category: "passwords", xpReward: 150,
    briefing: "A crew is collecting recovery PINs to port a victim's number and intercept every OTP. Spot the weakest secret in the set.",
    successStory: "Number ported in minutes. This is why carrier PINs must be unique and SMS is the worst second factor.",
  },
  {
    id: 11, tier: 1, name: "Quishing Drop",
    target: "Parking-meter QR sticker",
    objective: "Trace where the fake QR payment actually sent the card data.",
    miniGame: "trace", category: "phishing", xpReward: 160,
    briefing: "Stickers over real QR codes redirect drivers to a cloned payment page. Follow the redirect chain to the collection server.",
    successStory: "Skimming domain identified. A QR code hides its destination — always read the URL before you pay.",
  },
  {
    id: 12, tier: 1, name: "Smart Home Snoop",
    target: "Consumer IoT camera cloud",
    objective: "Slip past a cheap IoT device's flat network rules.",
    miniGame: "firewall", category: "privacy", xpReward: 170,
    briefing: "A budget camera sits on the same network as the family laptops with UPnP wide open. Find the path in.",
    successStory: "Live feed accessed. IoT devices belong on a guest VLAN, never beside your personal data.",
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
    id: 13, tier: 2, name: "Credential Stuffing Run",
    target: "Retail loyalty platform",
    objective: "Pick the reused credential that unlocks multiple services.",
    miniGame: "password", category: "passwords", xpReward: 250,
    briefing: "A dump from an old forum breach is being replayed against a shopping site. One password is reused everywhere.",
    successStory: "Accounts drained of loyalty points and saved cards. Reuse turns an old leak into today's fraud.",
  },
  {
    id: 14, tier: 2, name: "Deepfake CEO Wire",
    target: "Finance department",
    objective: "Trace a voice-cloned payment request back to its origin.",
    miniGame: "trace", category: "phishing", xpReward: 270,
    briefing: "A 40-second voice note from the 'CEO' demanded an urgent transfer. Follow the mail headers and call metadata to the fraud infrastructure.",
    successStory: "Wire recalled in time. Verify money requests on a channel you initiated — never the one that contacted you.",
  },
  {
    id: 15, tier: 2, name: "Leaky Cloud Bucket",
    target: "Misconfigured object storage",
    objective: "Reach customer records exposed by broken access rules.",
    miniGame: "firewall", category: "privacy", xpReward: 290,
    briefing: "A storage bucket holding ID scans was left public 'temporarily' during a migration. Navigate the permission maze.",
    successStory: "Ten thousand ID documents downloaded. One misconfigured checkbox is a full-scale privacy breach.",
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
  {
    id: 16, tier: 3, name: "Insider Data Misuse",
    target: "Hospital records system",
    objective: "Crack a privileged staff account with audit trails watching.",
    miniGame: "password", category: "passwords", xpReward: 400,
    briefing: "Shared clinical logins are still in use across shifts. Find the outlier no policy caught.",
    successStory: "Patient records exported. Shared accounts destroy accountability — every human needs their own identity.",
  },
  {
    id: 17, tier: 3, name: "Ransomware Detonation",
    target: "Regional logistics network",
    objective: "Trace the intrusion from initial access to encryption trigger.",
    miniGame: "trace", category: "phishing", xpReward: 430,
    briefing: "Backups were deleted 12 hours before encryption started. Reconstruct the dwell time and find the kill switch moment.",
    successStory: "Detonation traced and restore path preserved. Offline, tested backups are the only real ransom insurance.",
  },
  {
    id: 18, tier: 3, name: "Supply Chain Implant",
    target: "Software update pipeline",
    objective: "Route a poisoned build past every signing gate.",
    miniGame: "firewall", category: "privacy", xpReward: 550,
    briefing: "A trusted vendor's build server is the softest wall protecting thousands of downstream customers. Find the unmonitored path.",
    successStory: "Signed malicious update shipped. Trust in your supply chain must be verified, not assumed.",
  },
];

export const levelsByTier = (tier: 1 | 2 | 3) => hackLevels.filter((l) => l.tier === tier);
