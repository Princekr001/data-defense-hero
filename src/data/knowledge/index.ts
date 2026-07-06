// Bite-sized cyber knowledge served after every threat.
// Kept intentionally short — nothing in this file should read like a textbook.

export type VaultCategory = "phishing" | "malware" | "passwords" | "banking" | "social" | "ai";

export interface FunFact {
  id: string;
  category: VaultCategory;
  text: string;
  punchline?: string;
}

export interface ComicCase {
  id: string;
  category: VaultCategory;
  title: string;
  panels: string[]; // 3 panels
  moral: string;
}

export interface MythPair {
  id: string;
  category: VaultCategory;
  myth: string;
  reality: string;
}

export interface CyberTip {
  id: string;
  category: VaultCategory;
  tip: string;
}

export interface CaseFile {
  id: string;
  number: number;
  title: string;
  category: VaultCategory;
  attack: string;
  damage: string;
  why: string;
  prevention: string;
}

export interface Operation {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  hueFrom: string; // tailwind gradient token
  hueTo: string;
  waveRange: [number, number]; // indexes into WAVES
}

export const OPERATIONS: Operation[] = [
  { id: "home", name: "Operation Home Shield", tagline: "Protect your personal inbox and phone.", emoji: "🏠", hueFrom: "from-cyan-500/30", hueTo: "to-primary/20", waveRange: [0, 0] },
  { id: "bank", name: "Operation Banking Crisis", tagline: "Every alert could drain your account.", emoji: "🏦", hueFrom: "from-yellow-500/30", hueTo: "to-orange-500/20", waveRange: [1, 1] },
  { id: "dark", name: "Operation Dark Web", tagline: "Attackers hit fast. Meters won't last.", emoji: "💀", hueFrom: "from-destructive/40", hueTo: "to-purple-600/30", waveRange: [2, 2] },
];

export const FUN_FACTS: FunFact[] = [
  { id: "f1", category: "phishing", text: "The first phishing attack targeted AOL users in 1996.", punchline: "🤯 Imagine getting hacked for free internet CDs." },
  { id: "f2", category: "passwords", text: "'123456' has been the world's #1 password for over a decade.", punchline: "🔐 Even a toaster could guess it." },
  { id: "f3", category: "malware", text: "The ILOVEYOU virus (2000) infected 10 million PCs in 24 hours.", punchline: "💌 Love does hurt." },
  { id: "f4", category: "ai", text: "AI voice-clone scams only need 3 seconds of your voice.", punchline: "🎙️ Watch what you post." },
  { id: "f5", category: "social", text: "60% of scams start on social media, not email.", punchline: "📱 DMs are the new front door." },
  { id: "f6", category: "banking", text: "UPI fraud in India hit ₹1,087 crore in a single year.", punchline: "💸 That's a lot of ₹1 'test' scams." },
  { id: "f7", category: "phishing", text: "Attackers register lookalike domains within 30 mins of brand launches.", punchline: "⚡ Fast fingers, faster scams." },
  { id: "f8", category: "malware", text: "Ransomware gangs run 24/7 'customer support' for their victims.", punchline: "🎧 Evil… with a helpdesk." },
  { id: "f9", category: "passwords", text: "Reusing a password once means all your accounts share one lock.", punchline: "🔑 One key, whole house." },
  { id: "f10", category: "ai", text: "Deepfake CEO scams cost companies $2.7B worldwide in 2025.", punchline: "🎭 The boss might not be the boss." },
  { id: "f11", category: "social", text: "QR sticker overlays on parking meters spread across 42 cities in 2024.", punchline: "🅿️ Peel before you pay." },
  { id: "f12", category: "banking", text: "Banks NEVER ask for your OTP — but 1 in 4 people still share it.", punchline: "🙈 The scam works because we help." },
  { id: "f13", category: "phishing", text: "The average phishing email is opened within 82 seconds of arrival.", punchline: "⏱️ Speed kills — theirs." },
  { id: "f14", category: "malware", text: "USB drops in parking lots have a 45% pickup-and-plug rate.", punchline: "🔌 Curiosity infected the cat." },
  { id: "f15", category: "ai", text: "ChatGPT-style tools can write phishing emails with zero typos.", punchline: "✍️ 'Bad grammar' is no longer a red flag." },
];

export const COMIC_CASES: ComicCase[] = [
  {
    id: "c1",
    category: "phishing",
    title: "The Free Pizza Heist",
    panels: [
      "Hacker: 'I shall steal employee logins... for free pizza.' 🍕",
      "Cloned the pizza site's login. Sent link to 200 employees.",
      "Company had MFA. Hacker got nothing. Also, hungry.",
    ],
    moral: "🍕 2FA protects more than pizza.",
  },
  {
    id: "c2",
    category: "passwords",
    title: "The Password 'Password'",
    panels: [
      "Employee sets password: 'password123'. Feels clever.",
      "Bot cracks it in 0.29 seconds. Company loses 4TB of files.",
      "IT sends memo: please, anything else.",
    ],
    moral: "🔐 Length beats cleverness. Use a passphrase.",
  },
  {
    id: "c3",
    category: "social",
    title: "The Fake CEO Slack",
    panels: [
      "'Hey I'm the CEO, buy me 20 Google Play cards' 💳",
      "Intern buys them. Sends codes. Feels productive.",
      "Real CEO: 'I own an Android.' 😐",
    ],
    moral: "🚩 Gift cards = never a real business request.",
  },
  {
    id: "c4",
    category: "ai",
    title: "The Deepfake Uncle",
    panels: [
      "AI-cloned voice: 'Beta send ₹15,000, emergency!'",
      "Nephew almost sends. Then asks family codeword.",
      "AI: '...' Attack fails.",
    ],
    moral: "🗝️ Family codewords defeat AI voice scams.",
  },
  {
    id: "c5",
    category: "banking",
    title: "The ₹1 Test Transaction",
    panels: [
      "'Sir, refund ₹1 — just to test.'",
      "Victim shares OTP for 'refund'. ₹1 comes in.",
      "Then ₹99,999 goes out. Test complete.",
    ],
    moral: "💸 OTP never receives money. Only sends it.",
  },
  {
    id: "c6",
    category: "malware",
    title: "The Adorable USB",
    panels: [
      "Employee finds cute pink USB in parking lot.",
      "Plugs it in. Runs 'Puppies.exe'. No puppies.",
      "Ransomware. Entire office locked. No puppies at all.",
    ],
    moral: "🐶 Cute ≠ safe. Never plug found USBs.",
  },
];

export const MYTHS: MythPair[] = [
  { id: "m1", category: "malware", myth: "Antivirus stops everything.", reality: "Most attacks start with you clicking first." },
  { id: "m2", category: "phishing", myth: "Only stupid people fall for phishing.", reality: "Google & FB employees were phished for $100M." },
  { id: "m3", category: "passwords", myth: "Symbols like @#$ make passwords strong.", reality: "Length matters more. 'purple horse battery staple' > 'P@ss1!'." },
  { id: "m4", category: "ai", myth: "I'd know if a voice was AI.", reality: "Modern clones fool 68% of people in tests." },
  { id: "m5", category: "banking", myth: "HTTPS means the site is safe.", reality: "HTTPS just means encrypted. Scam sites use HTTPS too." },
  { id: "m6", category: "social", myth: "Private accounts can't be scammed.", reality: "Cloned friend requests are the #1 social attack." },
  { id: "m7", category: "phishing", myth: "Bad grammar reveals every scam.", reality: "AI writes flawless English now." },
  { id: "m8", category: "banking", myth: "My bank will refund any fraud.", reality: "If you shared OTP, most banks refuse. You 'authorized' it." },
];

export const CYBER_TIPS: CyberTip[] = [
  { id: "t1", category: "phishing", tip: "Hover the link. Check the domain. Ignore the display name." },
  { id: "t2", category: "passwords", tip: "One unique password per account. A manager remembers them all." },
  { id: "t3", category: "banking", tip: "Banks never call for OTP, PIN, or CVV. Ever." },
  { id: "t4", category: "ai", tip: "Set a family codeword. AI can't guess it." },
  { id: "t5", category: "malware", tip: "Real updates come from Settings, not popups." },
  { id: "t6", category: "social", tip: "New friend request from a known face? Call the old account first." },
  { id: "t7", category: "phishing", tip: "Urgency is the scammer's favorite tool. Slow down." },
  { id: "t8", category: "banking", tip: "Small 'test' transactions before big ones = 🚩 huge red flag." },
  { id: "t9", category: "malware", tip: "Backup weekly. Ransomware only wins if you can't restore." },
  { id: "t10", category: "ai", tip: "If a video feels 'off' — blinking, lip-sync — it might be a deepfake." },
];

export const CASE_FILES: CaseFile[] = [
  { id: "cf1", number: 12, title: "Bangladesh Bank Heist", category: "banking",
    attack: "SWIFT credentials stolen via spear-phishing. Attackers sent fake transfer orders.",
    damage: "$81 million stolen. $101M attempted. Only $18M recovered.",
    why: "Weak network segregation. No transfer verification step.",
    prevention: "Multi-person approval. Isolate SWIFT terminals. Anomaly detection.",
  },
  { id: "cf2", number: 24, title: "Twitter Bitcoin Scam (2020)", category: "social",
    attack: "Attackers social-engineered Twitter staff, took over Obama, Musk, Apple accounts.",
    damage: "$118K in Bitcoin stolen from fans in under 3 hours.",
    why: "Internal admin tools accessed via phone-based support scam.",
    prevention: "Never trust caller ID. Verify identity out-of-band.",
  },
  { id: "cf3", number: 31, title: "Colonial Pipeline Ransomware", category: "malware",
    attack: "One leaked VPN password → DarkSide ransomware inside the network.",
    damage: "US East Coast fuel shortage for 6 days. $4.4M ransom paid.",
    why: "No MFA on the VPN account. Single password reused.",
    prevention: "MFA everywhere. Rotate leaked credentials.",
  },
  { id: "cf4", number: 47, title: "WannaCry (2017)", category: "malware",
    attack: "Wormable ransomware exploiting unpatched Windows.",
    damage: "230,000+ computers in 150 countries. UK hospitals crippled.",
    why: "Delayed security patches. Legacy systems.",
    prevention: "Patch fast. Segment old machines. Backups.",
  },
  { id: "cf5", number: 52, title: "Fake CEO Wire Fraud", category: "phishing",
    attack: "'CEO' emails finance urgently, asks for wire transfer before board call.",
    damage: "Toyota subsidiary lost $37M in a single wire.",
    why: "No callback verification for high-value transfers.",
    prevention: "Always confirm wires on a second channel — phone, in-person.",
  },
  { id: "cf6", number: 58, title: "SIM Swap Empire", category: "social",
    attack: "Attackers sweet-talk telco reps into porting a target's number.",
    damage: "Millions in crypto stolen. OTPs delivered to attacker's phone.",
    why: "Weak telco identity checks. SMS-based 2FA.",
    prevention: "App-based MFA. PIN with your carrier. Never SMS 2FA for money.",
  },
];

export const ACHIEVEMENTS_DEF = [
  { id: "spam-slayer", name: "Spam Slayer", tagline: "Blocked 5 phishing threats", icon: "🛡️", target: 5, stat: "correct" as const },
  { id: "eagle-eye", name: "Eagle Eye", tagline: "Won a round using Red Flags lifeline", icon: "🎯", target: 1, stat: "lifelineWin" as const },
  { id: "cyber-scholar", name: "Cyber Scholar", tagline: "Read 5 knowledge cards", icon: "🧠", target: 5, stat: "cardsRead" as const },
  { id: "qr-master", name: "QR Master", tagline: "Refused a shady QR code", icon: "📱", target: 1, stat: "qrSafe" as const },
  { id: "bank-guardian", name: "Bank Guardian", tagline: "Cleared a wave without losing money", icon: "🏦", target: 1, stat: "bankIntact" as const },
  { id: "no-flinch", name: "No Flinch", tagline: "3-in-a-row correct without hesitation", icon: "⚡", target: 3, stat: "combo" as const },
];
