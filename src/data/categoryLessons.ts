export type LessonCategory =
  | "phishing"
  | "password"
  | "social"
  | "network"
  | "malware"
  | "privacy"
  | "scam"
  | "gaming";

export interface CategoryLesson {
  id: LessonCategory;
  title: string;
  emoji: string;
  tagline: string;
  /** Why a wrong choice in this topic is dangerous. */
  whyWrong: string;
  /** Concrete risks an attacker can cause. */
  risks: string[];
  /** Real-world examples / threat patterns. */
  realWorld: string[];
  /** How to avoid the risk in real life. */
  howToAvoid: string[];
}

export const categoryLessons: Record<LessonCategory, CategoryLesson> = {
  phishing: {
    id: "phishing",
    title: "Phishing",
    emoji: "🎣",
    tagline: "Fake messages designed to steal what you trust.",
    whyWrong:
      "Clicking a phishing link or replying with credentials hands an attacker the keys to your accounts in seconds — no malware needed.",
    risks: [
      "Stolen passwords used to drain bank or email accounts",
      "Account takeover that locks you out and impersonates you",
      "Malware silently installed from a fake 'invoice' or 'CV'",
      "Identity theft using leaked personal data",
    ],
    realWorld: [
      "Fake bank SMS: 'unusual login — confirm here' linking to a clone site",
      "'Package undeliverable' texts asking for a small fee + card details",
      "Workplace email pretending to be the CEO asking for an urgent transfer",
      "QR codes stuck on parking meters that lead to fake payment pages",
    ],
    howToAvoid: [
      "Never click links in unexpected messages — open the app or site yourself",
      "Check the sender's full address & the URL before typing anything",
      "Treat urgency, fear and threats as red flags, not commands",
      "Enable multi-factor authentication so a stolen password isn't enough",
    ],
  },
  password: {
    id: "password",
    title: "Passwords",
    emoji: "🔑",
    tagline: "One weak password breaks every account that shares it.",
    whyWrong:
      "Short, reused or personal passwords are guessed in minutes by automated tools — attackers don't need to know you.",
    risks: [
      "Credential stuffing: one leak unlocks dozens of your other sites",
      "Brute-force cracking of weak passwords (under 12 chars, no symbols)",
      "Account hijack used to scam your friends and family",
      "Lost access to email = lost access to everything connected to it",
    ],
    realWorld: [
      "Leaked passwords like '123456' and 'qwerty' still top global breach lists",
      "Reusing your gaming password on email led to mass takeovers in 2023–24",
      "Birthdays & pet names are tried first in targeted attacks",
      "SIM-swap attacks defeat SMS codes when no app-based MFA is set",
    ],
    howToAvoid: [
      "Use a password manager and generate 16+ character random passwords",
      "Make every account unique — never reuse, even 'just this once'",
      "Turn on multi-factor authentication, preferably with an authenticator app",
      "Check haveibeenpwned.com and change any leaked password immediately",
    ],
  },
  social: {
    id: "social",
    title: "Social Engineering",
    emoji: "🎭",
    tagline: "The attacker exploits trust, not technology.",
    whyWrong:
      "Saying 'yes' to a friendly request — a caller, a stranger online, a 'colleague' — gives away information that opens doors no firewall can close.",
    risks: [
      "Impersonation: someone uses your photos & info to scam others",
      "Pretexting calls trick you into revealing OTPs or codes",
      "Doxxing — your address, school or workplace exposed publicly",
      "Insider attacks where 'IT support' walks off with your data",
    ],
    realWorld: [
      "Fake recruiter on LinkedIn asking for a CV with personal IDs",
      "'Microsoft support' calling about a virus that doesn't exist",
      "DMs from a 'crush' that quickly ask for money or intimate photos",
      "Tailgating into offices behind someone holding the door",
    ],
    howToAvoid: [
      "Verify identity through a second channel before sharing anything",
      "Never share one-time codes — no real company will ever ask",
      "Limit what you post publicly: workplace, school, daily routine",
      "Pause before reacting: urgency + emotion = manipulation",
    ],
  },
  network: {
    id: "network",
    title: "Network Safety",
    emoji: "📶",
    tagline: "Open Wi-Fi is a microphone in your pocket.",
    whyWrong:
      "On an unsecured network anyone nearby can read traffic, inject fake pages, or pretend to be the access point you trust.",
    risks: [
      "Session hijacking — attacker steals your logged-in cookies",
      "Man-in-the-middle attacks intercept passwords and chats",
      "Evil-twin hotspots impersonate 'Free Airport WiFi'",
      "Default router credentials let neighbours pivot into your home",
    ],
    realWorld: [
      "Cafés where attackers run a Wi-Fi Pineapple to capture logins",
      "Hotels pushing fake login portals that steal email credentials",
      "Home routers still using admin/admin years after install",
      "Smart TVs and cameras leaking video over open ports",
    ],
    howToAvoid: [
      "Use a reputable VPN on any Wi-Fi you don't own",
      "Stick to HTTPS sites & check the padlock before logging in",
      "Change your home router admin password and Wi-Fi password yearly",
      "Turn off auto-connect to known SSIDs — names can be spoofed",
    ],
  },
  malware: {
    id: "malware",
    title: "Malware",
    emoji: "🦠",
    tagline: "One install can quietly run forever.",
    whyWrong:
      "Downloading cracks, sketchy attachments, or 'free' tools gives malware the same rights you have — and it rarely shows itself until it's too late.",
    risks: [
      "Ransomware encrypts your photos and demands payment",
      "Keyloggers record everything you type, including passwords",
      "Cryptominers burn your CPU & battery for someone else's profit",
      "Botnets enrol your device to attack others on your behalf",
    ],
    realWorld: [
      "Pirated games and 'activators' bundled with stealer malware",
      "Fake Chrome update pop-ups on news sites",
      "USB sticks left in parking lots loaded with auto-run payloads",
      "Browser extensions that flip to malicious after an update",
    ],
    howToAvoid: [
      "Install software only from official stores or vendor sites",
      "Keep OS, browser and apps auto-updated — patches kill exploits",
      "Run a reputable anti-malware tool and scan attachments",
      "Back up your data offline — ransomware can't lock what it can't reach",
    ],
  },
  privacy: {
    id: "privacy",
    title: "Privacy",
    emoji: "🛰️",
    tagline: "Data you share today is data attackers use tomorrow.",
    whyWrong:
      "Oversharing on social media or accepting every cookie/permission builds a profile that scammers, stalkers and data brokers exploit.",
    risks: [
      "Location leaks reveal your home, school and routine",
      "Photos with metadata expose where & when they were taken",
      "Tracking pixels & cookies sell your behaviour to anyone",
      "Old posts surface years later in screening or harassment",
    ],
    realWorld: [
      "Geo-tagged Instagram stories used to time burglaries",
      "Public Venmo/Revolut feeds revealing relationships & habits",
      "Apps demanding contacts, mic and camera with no real need",
      "Data-broker sites reselling phone, email & address combos",
    ],
    howToAvoid: [
      "Lock down social accounts to friends-only and audit followers",
      "Strip location from photos before posting; turn off location history",
      "Review app permissions monthly — revoke anything unused",
      "Use a privacy-focused browser & block third-party trackers",
    ],
  },
  scam: {
    id: "scam",
    title: "Scams & Fraud",
    emoji: "💸",
    tagline: "If it feels too good to be true, it's bait.",
    whyWrong:
      "Fake giveaways, investment 'opportunities' and emergency-money requests rely on excitement or panic to bypass your judgement.",
    risks: [
      "Direct loss of money via fake transfers, gift cards or crypto",
      "Romance scams draining savings over weeks of grooming",
      "Job scams stealing IDs & bank details under fake offers",
      "Fake charities exploiting disasters & emotion",
    ],
    realWorld: [
      "'You won a gift card!' pop-ups asking for shipping fees",
      "Crypto influencers promising guaranteed daily returns",
      "WhatsApp 'mum, my phone broke, send money' messages",
      "Marketplace buyers overpaying & asking for a refund",
    ],
    howToAvoid: [
      "Never pay with gift cards or crypto to a stranger, ever",
      "Verify offers on the official company website, not via DMs",
      "Talk to family/friends before sending money under pressure",
      "Report scams — your report protects the next target",
    ],
  },
  gaming: {
    id: "gaming",
    title: "Gaming Safety",
    emoji: "🎮",
    tagline: "Your account, skins & friends are real targets.",
    whyWrong:
      "Free V-Bucks sites, sketchy mods and trusting random voice-chat strangers cost players accounts, money and personal safety every day.",
    risks: [
      "Account theft — skins, ranks and stored payment methods lost",
      "Swatting & doxxing from leaked voice-chat info",
      "Cheats bundled with stealers that grab browser passwords",
      "Predators using games to contact and groom minors",
    ],
    realWorld: [
      "'Free skins generator' phishing sites cloning Steam logins",
      "Discord DMs offering 'beta access' that hijack tokens",
      "Trading scams using fake middleman bots",
      "Stream snipers using your location info against you",
    ],
    howToAvoid: [
      "Enable 2FA (Steam Guard, Epic, Riot, etc.) on every account",
      "Never share account, address, school or face on voice chat",
      "Download mods only from trusted official communities",
      "Use a unique gaming email — never your main one",
    ],
  },
};

/** Map mismatched keys (e.g. hack uses 'passwords') to canonical lesson keys. */
export function resolveLessonKey(input: string): LessonCategory | null {
  const map: Record<string, LessonCategory> = {
    phishing: "phishing",
    passwords: "password",
    password: "password",
    social: "social",
    network: "network",
    malware: "malware",
    privacy: "privacy",
    scam: "scam",
    gaming: "gaming",
  };
  return map[input] ?? null;
}
