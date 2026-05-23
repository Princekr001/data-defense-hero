export type LessonCategory =
  | "phishing"
  | "password"
  | "social"
  | "network"
  | "malware"
  | "privacy"
  | "scam"
  | "gaming";

export interface LessonQuiz {
  question: string;
  options: string[];
  /** Index of the SECURE / correct option. */
  correctIndex: number;
  /** Shown after answering — reinforces the secure choice. */
  explanation: string;
}

/** A specific risk paired with a concrete fix you can apply today. */
export interface RiskSolution {
  risk: string;
  solution: string;
}

/** A numbered step-by-step plan to resolve issues in this topic. */
export interface SolutionStep {
  title: string;
  detail: string;
}

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
  /** Each risk mapped to a concrete solution. */
  riskSolutions: RiskSolution[];
  /** Ordered action plan to fix issues now. */
  stepByStep: SolutionStep[];
  /** Short reinforcement quiz shown after the lesson. */
  quiz: LessonQuiz;
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
    riskSolutions: [
      {
        risk: "Stolen passwords used to drain bank or email accounts",
        solution:
          "Change the password from a clean device, enable app-based MFA, and call your bank to freeze cards if you typed anything on a fake page.",
      },
      {
        risk: "Account takeover that locks you out and impersonates you",
        solution:
          "Use the provider's official 'account recovery' flow, revoke all active sessions in Security settings, and warn contacts about messages sent from your account.",
      },
      {
        risk: "Malware silently installed from a fake 'invoice' or 'CV'",
        solution:
          "Disconnect from the internet, run a full scan with a reputable AV (Defender/Malwarebytes), then change passwords from a different, trusted device.",
      },
      {
        risk: "Identity theft using leaked personal data",
        solution:
          "File a report with your local cybercrime unit, place a fraud alert on your credit file, and monitor breach exposure on haveibeenpwned.com.",
      },
    ],
    stepByStep: [
      { title: "Stop & verify", detail: "Don't click. Open the app or type the official URL yourself to confirm if the message is real." },
      { title: "Inspect the sender", detail: "Hover the address and the link. Look for typos, weird subdomains, and unexpected country codes." },
      { title: "Report it", detail: "Use your mail client's 'Report phishing', forward bank SMS to your country's anti-phishing number, then delete." },
      { title: "Harden your accounts", detail: "Turn on MFA (authenticator app, not SMS) on email, bank, and social — even if you weren't tricked this time." },
    ],
    quiz: {
      question: "You get an SMS: 'Your bank account is locked — click here to verify.' What's the SECURE move?",
      options: [
        "Tap the link and log in to unlock it quickly",
        "Reply with your account number to confirm it's you",
        "Ignore the link and open your bank's official app yourself",
      ],
      correctIndex: 2,
      explanation:
        "Always reach the bank through its real app or website. Links and replies in unexpected messages are the #1 phishing trap.",
    },
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
    riskSolutions: [
      {
        risk: "Credential stuffing: one leak unlocks dozens of your other sites",
        solution:
          "Use a password manager (Bitwarden, 1Password, Apple/Google Passwords) to generate a unique password per site — no reuse, ever.",
      },
      {
        risk: "Brute-force cracking of weak passwords",
        solution:
          "Switch every important account to a 16+ character random password. Passphrases of 4–5 unrelated words also resist brute force.",
      },
      {
        risk: "Account hijack used to scam your friends and family",
        solution:
          "Enable MFA via an authenticator app, sign out of all sessions, and rotate the password. Notify contacts that any odd message wasn't from you.",
      },
      {
        risk: "Lost access to email = lost access to everything",
        solution:
          "Protect your email with MFA + recovery codes printed and stored offline. Treat it as your most critical account.",
      },
    ],
    stepByStep: [
      { title: "Audit", detail: "Check haveibeenpwned.com with your emails and your password manager's breach report." },
      { title: "Install a manager", detail: "Set up a free password manager and import your saved browser passwords." },
      { title: "Rotate critical first", detail: "Replace passwords on email, bank, and primary social with unique generated ones." },
      { title: "Turn on MFA everywhere", detail: "Prefer an authenticator app (Aegis, Authy, Google Authenticator) over SMS codes." },
      { title: "Save recovery codes", detail: "Download backup codes and store them in your password manager or a secure offline note." },
    ],
    quiz: {
      question: "Which password is the SECURE choice for your main email?",
      options: [
        "Fluffy2019! (your pet + birth year)",
        "A 16-char random string stored in a password manager",
        "The same strong password you already use on 3 other sites",
      ],
      correctIndex: 1,
      explanation:
        "Long, unique, randomly generated passwords beat clever ones. Reusing — even a strong password — turns one leak into many breaches.",
    },
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
    riskSolutions: [
      {
        risk: "Impersonation using your photos & info",
        solution:
          "Report fake profiles to the platform, watermark or downscale public photos, and let close contacts know which account is the real one.",
      },
      {
        risk: "Pretexting calls fishing for OTPs",
        solution:
          "Hang up, call the company back on the number printed on your card or their official site, and never read codes aloud.",
      },
      {
        risk: "Doxxing — personal info exposed publicly",
        solution:
          "Request takedowns from data-broker sites, scrub your name from public posts, and lock social accounts to friends-only.",
      },
      {
        risk: "Fake 'IT support' walking off with your data",
        solution:
          "Require ticket numbers and a callback to a known internal extension before granting access — physically or remotely.",
      },
    ],
    stepByStep: [
      { title: "Pause", detail: "Any request that pressures you for speed, secrecy, or money is a red flag — slow down." },
      { title: "Verify", detail: "Confirm through a second channel (call back a known number, message via another app) before acting." },
      { title: "Refuse codes", detail: "Treat OTPs, MFA codes, and recovery codes as cash — never share them with anyone, ever." },
      { title: "Tighten posts", detail: "Audit your public profiles monthly — remove workplace, address, routine, and travel posts." },
      { title: "Report", detail: "Report the attempt to the impersonated company and to the platform so others get warned." },
    ],
    quiz: {
      question:
        "A caller says they're 'IT support' and needs your 6-digit login code right now. SECURE response?",
      options: [
        "Read it out — they sound official and it's urgent",
        "Refuse, hang up, and call IT back on a number you trust",
        "Send it by email so there's a written record",
      ],
      correctIndex: 1,
      explanation:
        "Real IT or support will NEVER ask for your one-time code. Verify through a known channel before sharing anything.",
    },
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
    riskSolutions: [
      {
        risk: "Session hijacking on public Wi-Fi",
        solution:
          "Use a trusted VPN (Mullvad, Proton, your work VPN) or your phone's hotspot. Sign out + back in to invalidate captured cookies.",
      },
      {
        risk: "Man-in-the-middle attacks",
        solution:
          "Refuse to bypass browser HTTPS warnings — they exist for this exact attack. Stick to HTTPS-only mode in your browser.",
      },
      {
        risk: "Evil-twin / fake hotspots",
        solution:
          "Confirm the official Wi-Fi name with the staff, disable auto-connect, and 'forget' open networks after use.",
      },
      {
        risk: "Default router credentials",
        solution:
          "Log into 192.168.0.1, change admin & Wi-Fi passwords, enable WPA3 (or WPA2-AES), and update router firmware.",
      },
    ],
    stepByStep: [
      { title: "Lock the router", detail: "Change default admin login, set a strong Wi-Fi password, enable WPA2/WPA3 encryption." },
      { title: "Update firmware", detail: "Check your router's admin page monthly for firmware patches — many vulnerabilities are router-side." },
      { title: "Use a VPN outside home", detail: "Install a reputable VPN app and toggle it on whenever you join Wi-Fi you don't own." },
      { title: "Segment IoT", detail: "Put smart TVs, cameras, and speakers on a separate Guest SSID so they can't reach your phone or PC." },
      { title: "Disable auto-connect", detail: "Forget public SSIDs after use so your phone doesn't reconnect to a spoofed twin later." },
    ],
    quiz: {
      question: "You're at a café and need to log in to your bank. SECURE choice?",
      options: [
        "Connect to 'Free_Cafe_WiFi' — it has the strongest signal",
        "Use your phone's 4G/5G hotspot, or a trusted VPN over the café Wi-Fi",
        "Use the café Wi-Fi but only on HTTP sites to stay quiet",
      ],
      correctIndex: 1,
      explanation:
        "Public Wi-Fi can be spoofed or sniffed. Mobile data or a VPN keeps your bank session out of strangers' hands.",
    },
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
    riskSolutions: [
      {
        risk: "Ransomware encrypting your files",
        solution:
          "Don't pay. Disconnect the device, restore from an offline backup, and report the strain on nomoreransom.org — many have free decryptors.",
      },
      {
        risk: "Keyloggers stealing passwords",
        solution:
          "Boot from a clean device, change every important password, then wipe and reinstall the infected OS rather than just 'cleaning' it.",
      },
      {
        risk: "Cryptominers eating CPU & battery",
        solution:
          "Open Task Manager / Activity Monitor, end suspicious processes, uninstall the source app/extension, and run a full AV scan.",
      },
      {
        risk: "Botnets using your device to attack others",
        solution:
          "Update the OS, run Malwarebytes + Defender full scans, and check your router for unknown connected devices.",
      },
    ],
    stepByStep: [
      { title: "Disconnect", detail: "Pull Wi-Fi/ethernet immediately to stop data exfiltration or spread to other devices." },
      { title: "Scan", detail: "Run a full scan with two tools (e.g. Microsoft Defender + Malwarebytes) — they catch different families." },
      { title: "Rotate credentials", detail: "From a clean device, change passwords for email, banking, and any auto-logged-in app." },
      { title: "Restore from backup", detail: "Wipe and reinstall the OS, then restore files from an offline backup made before infection." },
      { title: "Patch & prevent", detail: "Turn on auto-updates for OS, browser, and apps; only install from official stores going forward." },
    ],
    quiz: {
      question: "A pop-up says 'Your Chrome is outdated — click to update'. SECURE action?",
      options: [
        "Click — it looks like the real Chrome design",
        "Close the tab and update via Chrome's own Settings → About Chrome",
        "Download the file but scan it first before running",
      ],
      correctIndex: 1,
      explanation:
        "Browsers update themselves. Any pop-up offering an 'update' is almost always malware bait — go through the app itself.",
    },
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
    riskSolutions: [
      {
        risk: "Location leaks revealing your routine",
        solution:
          "Turn off Location History in Google/Apple settings, deny 'Always' location to apps, and post travel photos only after you're home.",
      },
      {
        risk: "Photo metadata (EXIF) leaking GPS & time",
        solution:
          "Enable your phone's 'remove location when sharing' option, or use an EXIF-strip app before posting.",
      },
      {
        risk: "Tracking pixels & cookies selling your behaviour",
        solution:
          "Use Firefox or Brave with strict tracking protection, install uBlock Origin, and reject non-essential cookies on every site.",
      },
      {
        risk: "Old posts haunting you later",
        solution:
          "Run a yearly archive cleanup, use Twitter/X tools like Redact to bulk-delete old posts, and set social posts to auto-expire when available.",
      },
    ],
    stepByStep: [
      { title: "Privacy audit", detail: "Go through Settings → Privacy on each major account (Google, Apple, Meta) and tighten every default." },
      { title: "Revoke app permissions", detail: "Remove camera, mic, contacts, and location access from any app that doesn't need them." },
      { title: "Remove from brokers", detail: "Submit removal requests on Spokeo, BeenVerified, WhitePages, or use a service like DeleteMe." },
      { title: "Switch defaults", detail: "Use Firefox/Brave, DuckDuckGo, Signal, and a privacy-respecting email like ProtonMail or Tuta." },
      { title: "Post with delay", detail: "Adopt a personal rule: nothing posted in real time. Share travel, events, and locations only after the fact." },
    ],
    quiz: {
      question: "You're on holiday and want to post photos. SECURE choice?",
      options: [
        "Live-post each location with geo-tags so friends can follow along",
        "Wait until you're home, and post without precise location data",
        "Make it a public story — more likes feels safer because of crowds",
      ],
      correctIndex: 1,
      explanation:
        "Real-time location + an empty house is a burglar's dream. Delay posts and strip geo-metadata to keep your routine private.",
    },
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
    riskSolutions: [
      {
        risk: "Direct loss via fake transfers / gift cards / crypto",
        solution:
          "Contact your bank within minutes to attempt a recall, file a police report, and report to your country's anti-fraud body (FTC, Action Fraud, etc.).",
      },
      {
        risk: "Romance scams draining savings",
        solution:
          "Stop all contact and payments, screenshot everything for evidence, and reach out to a trusted friend or a romance-scam support group.",
      },
      {
        risk: "Job scams stealing IDs & bank details",
        solution:
          "Place a fraud alert on your credit file, freeze new credit, and report the fake recruiter to LinkedIn/Indeed plus the impersonated company.",
      },
      {
        risk: "Fake charities exploiting disasters",
        solution:
          "Donate only via established charities verified on GuideStar/Charity Navigator, and never through links in unsolicited messages.",
      },
    ],
    stepByStep: [
      { title: "Slow down", detail: "Sleep on any decision involving money or personal data. Real opportunities survive 24 hours of waiting." },
      { title: "Verify independently", detail: "Search the company name + 'scam', check official websites, and call the real organisation directly." },
      { title: "Cut off payment", detail: "If you already sent money, contact your bank, card issuer, or crypto exchange immediately to attempt recovery." },
      { title: "Document everything", detail: "Screenshot chats, save numbers, keep transaction IDs — you'll need them for reports." },
      { title: "Report", detail: "File with local police, your national fraud reporting site, and the platform where the scam happened." },
    ],
    quiz: {
      question:
        "A 'crypto coach' DMs you guaranteeing 10% daily returns if you send USDT now. SECURE move?",
      options: [
        "Send a small amount to test — you can always pull out",
        "Refuse, block, and report — guaranteed returns don't exist",
        "Ask for proof and then invest a bigger amount if they reply",
      ],
      correctIndex: 1,
      explanation:
        "No legitimate investment promises guaranteed daily returns. Pressure + crypto + DMs = scam. Block and report.",
    },
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
    riskSolutions: [
      {
        risk: "Account theft of skins & saved payment methods",
        solution:
          "Use the platform's account-recovery flow, remove saved cards, revoke API/web sessions, and reset password + 2FA from a clean device.",
      },
      {
        risk: "Swatting & doxxing from voice-chat leaks",
        solution:
          "Mute personal info on stream, use push-to-talk in public lobbies, and contact local police's non-emergency line if you're being threatened.",
      },
      {
        risk: "Cheats bundled with stealer malware",
        solution:
          "Uninstall the cheat, run a full AV scan, change every password saved in your browser, and sign out of all sessions.",
      },
      {
        risk: "Predators contacting minors",
        solution:
          "Block & report the user in-platform, save evidence (screenshots, usernames), and contact platforms' Trust & Safety + local authorities for serious cases.",
      },
    ],
    stepByStep: [
      { title: "Lock accounts", detail: "Turn on 2FA (Steam Guard, Epic, Riot, Battle.net, PSN, Xbox) — preferably authenticator app, not SMS." },
      { title: "Separate identity", detail: "Use a dedicated gaming email + unique password, and a username that isn't tied to your real name." },
      { title: "Trust only official launchers", detail: "Buy skins, keys, and DLC only on the official store. No 'free generator' is ever legitimate." },
      { title: "Vet mods", detail: "Download from Nexus, Steam Workshop, or vetted communities; check reviews and recent comments before installing." },
      { title: "Voice-chat hygiene", detail: "Never share location, school, age, or face in lobbies; use push-to-talk and mute strangers by default." },
    ],
    quiz: {
      question:
        "A random Discord DM offers 'free skins' if you log in via their link. SECURE response?",
      options: [
        "Log in quickly — the offer might expire",
        "Ignore the DM, never use third-party login pages, and keep 2FA on",
        "Use a throwaway account password just in case",
      ],
      correctIndex: 1,
      explanation:
        "Free-skin sites are phishing clones built to steal accounts. Only log in on official launchers, and keep 2FA on every game account.",
    },
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
