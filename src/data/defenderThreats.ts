// Data Defense Simulator — threat definitions
// Each threat is a live incoming attack the player must react to.
// Consequences change the player's meters and produce a teaching moment.

export type SceneType = "email" | "sms" | "call" | "qr" | "dm" | "push";
export type MeterKey = "bank" | "identity" | "contacts" | "device";

export interface ThreatAction {
  id: string;
  label: string;
  hint?: string; // shown on hover on desktop
  // If this action is the correct/safe one for this threat
  safe: boolean;
  // Delta to each meter when chosen (only applied on unsafe unless "reward" defined)
  damage?: Partial<Record<MeterKey, number>>;
  // Reward-side messaging on safe pick
  rewardMessage?: string;
  // Failure explanation on unsafe pick
  failMessage?: string;
}

export interface Threat {
  id: string;
  scene: SceneType;
  attacker: "phisher" | "suit" | "qr" | "voice" | "clone" | "angler";
  category: string; // shown in HUD
  // Header shown on the scene (sender / caller / QR source)
  from: string;
  // Subject / preview / caller ID
  subject?: string;
  // Full body / transcript / DM text
  body: string;
  // Highlighted red flags (substrings inside body/subject/from). Revealed by lifeline.
  redFlags: string[];
  actions: ThreatAction[];
  // Reaction window in ms
  reactMs: number;
  // Explanation shown in the consequence overlay
  teach: string;
  // If true, this is a LEGIT decoy — safe action is "Open" / "Answer"
  decoy?: boolean;
}

// Progressive waves of 5 threats each. Later waves shrink reactMs and add decoys.
export const WAVES: Threat[][] = [
  // ------- WAVE 1: intro to the six vectors -------
  [
    {
      id: "w1-1",
      scene: "email",
      attacker: "phisher",
      category: "Email phishing",
      from: "security@paypa1-support.com",
      subject: "Unusual sign-in — verify within 24h",
      body: "We detected a login from Nigeria. Click here to secure your account: http://paypa1-verify.co/login",
      redFlags: ["paypa1", "paypa1-verify.co", "24h", "Nigeria"],
      reactMs: 6000,
      actions: [
        { id: "click", label: "Open link", safe: false, damage: { identity: 25, bank: 400 }, failMessage: "Credentials harvested. Attacker drained $400 and locked you out." },
        { id: "report", label: "Report as phishing", safe: true, rewardMessage: "Domain look-alike caught. PayPal has one 'l'." },
        { id: "ignore", label: "Delete", safe: true, rewardMessage: "Deleted. Safe — but reporting protects others." },
      ],
      teach: "Look at the DOMAIN, not the display name. 'paypa1' with a '1' instead of 'l' is a classic homoglyph.",
    },
    {
      id: "w1-2",
      scene: "sms",
      attacker: "voice",
      category: "Smishing",
      from: "+1 (415) 555-0132",
      body: "SBI-ALERT: Your KYC expires TODAY. Update now → sbi-kyc-renew.link/verify",
      redFlags: ["TODAY", "sbi-kyc-renew.link", "+1 (415)"],
      reactMs: 5500,
      actions: [
        { id: "tap", label: "Tap link", safe: false, damage: { bank: 800, identity: 20 }, failMessage: "Fake KYC page captured your Aadhaar + OTP. ₹80,000 gone." },
        { id: "call-bank", label: "Call bank directly", safe: true, rewardMessage: "Verified via the number on your card. No KYC issue existed." },
        { id: "block", label: "Block + report", safe: true, rewardMessage: "Reported to 1930. Number blacklisted." },
      ],
      teach: "Banks NEVER send KYC links via SMS. Urgency + shortened link = smishing.",
    },
    {
      id: "w1-3",
      scene: "call",
      attacker: "voice",
      category: "Vishing",
      from: "Unknown • +91 90000 00000",
      subject: "Microsoft Support",
      body: "Sir, your Windows license is compromised. Please open TeamViewer so I can install the security patch.",
      redFlags: ["TeamViewer", "Windows license", "Unknown"],
      reactMs: 5000,
      actions: [
        { id: "install", label: "Install TeamViewer", safe: false, damage: { device: 60, bank: 1200, contacts: 40 }, failMessage: "Remote access granted. Attacker took your device and emptied your account." },
        { id: "hangup", label: "Hang up", safe: true, rewardMessage: "Correct. Microsoft never cold-calls users." },
      ],
      teach: "No legitimate tech company will ask you to install remote-access software. Hang up.",
    },
    {
      id: "w1-4",
      scene: "qr",
      attacker: "qr",
      category: "Quishing",
      from: "Parking meter",
      body: "Scan to pay ₹40 for 1 hour. QR code stickered over the original.",
      redFlags: ["stickered over", "unknown domain"],
      reactMs: 5000,
      actions: [
        { id: "scan", label: "Scan & pay", safe: false, damage: { bank: 2500, device: 15 }, failMessage: "The QR opened a fake UPI page. ₹2,500 debited." },
        { id: "app", label: "Pay via city's official app", safe: true, rewardMessage: "Perfect — the official app has no QR-scan step." },
        { id: "check", label: "Peel sticker + report", safe: true, rewardMessage: "Real QR underneath. Fraud sticker removed." },
      ],
      teach: "Public QR codes are physically overlaid by attackers. Prefer official apps.",
    },
    {
      id: "w1-5",
      scene: "dm",
      attacker: "clone",
      category: "Social clone",
      from: "@yourfriend_official (new account)",
      body: "Bro emergency, stuck at airport, send ₹5000 to this UPI, I'll return by evening 🙏",
      redFlags: ["new account", "emergency", "UPI", "return by evening"],
      reactMs: 5000,
      actions: [
        { id: "send", label: "Send ₹5,000", safe: false, damage: { bank: 5000, contacts: 30 }, failMessage: "Money gone. Attacker is now DMing your other friends too." },
        { id: "call-friend", label: "Call friend on old number", safe: true, rewardMessage: "Friend is at home. Cloned account reported." },
      ],
      teach: "Emergency + money request from a 'new' profile = clone account. Verify on a channel the attacker doesn't control.",
    },
  ],

  // ------- WAVE 2: legit decoys mixed in, shorter window -------
  [
    {
      id: "w2-1",
      scene: "push",
      attacker: "clone",
      category: "Push fatigue",
      from: "Auth app",
      subject: "Approve sign-in?",
      body: "Sign-in request from Moscow, RU • Chrome on Windows",
      redFlags: ["Moscow", "you did not initiate"],
      reactMs: 4000,
      actions: [
        { id: "approve", label: "Approve", safe: false, damage: { identity: 40, bank: 600 }, failMessage: "You just approved an attacker's login. Account taken over." },
        { id: "deny", label: "Deny + rotate password", safe: true, rewardMessage: "MFA fatigue attack blocked." },
      ],
      teach: "If you didn't just try to log in, DENY. Attackers spam prompts hoping you tap approve.",
    },
    {
      id: "w2-2",
      scene: "email",
      attacker: "suit",
      category: "Whaling (CEO fraud)",
      from: "ceo@company-invoice.co",
      subject: "URGENT — wire transfer needed before board call",
      body: "I'm in a meeting. Please wire $18,400 to vendor ASAP. I'll approve later. Don't loop finance.",
      redFlags: ["URGENT", "Don't loop finance", "company-invoice.co", "wire"],
      reactMs: 4500,
      actions: [
        { id: "wire", label: "Wire immediately", safe: false, damage: { bank: 18400, identity: 20 }, failMessage: "$18,400 wired to attacker's account." },
        { id: "confirm", label: "Confirm on Slack/phone", safe: true, rewardMessage: "CEO confirmed he never sent this. Reported." },
      ],
      teach: "Whaling = pretending to be the boss. 'Don't loop finance' + urgency is the tell. Always confirm on a separate channel.",
    },
    {
      id: "w2-3",
      scene: "sms",
      attacker: "voice",
      category: "Legit alert (decoy)",
      from: "VM-HDFCBK",
      body: "INR 2,499.00 debited from A/c XX4471 on 03-Jul-26 at AMAZON. Not you? Call 18002586161.",
      redFlags: [],
      reactMs: 4500,
      decoy: true,
      actions: [
        { id: "verify-app", label: "Open bank app to verify", safe: true, rewardMessage: "Legit alert — matched your Amazon order. Well spotted." },
        { id: "delete", label: "Delete", safe: true, rewardMessage: "Safe to ignore if you made the purchase." },
        { id: "call-scam", label: "Panic + tap random link", safe: false, damage: { identity: 10 }, failMessage: "This SMS was real. Over-reacting is also a risk — you almost fell for a follow-up scam." },
      ],
      teach: "Not everything is phishing. Legit bank alerts use official sender IDs (VM-HDFCBK) and no clickable links.",
    },
    {
      id: "w2-4",
      scene: "dm",
      attacker: "angler",
      category: "Angler phishing",
      from: "@YourBank_Help_Official (unverified)",
      body: "Hi! Saw your complaint tweet. DM us your account no + card CVV so we can refund faster 💙",
      redFlags: ["unverified", "CVV", "DM us your"],
      reactMs: 4000,
      actions: [
        { id: "reply", label: "Share card details", safe: false, damage: { bank: 3200, identity: 45 }, failMessage: "Card cloned. ₹3,200 gone in 3 international transactions." },
        { id: "report-block", label: "Report + block", safe: true, rewardMessage: "Fake support handle taken down." },
      ],
      teach: "Real support NEVER asks for CVV/OTP over DM. Attackers watch complaint tweets and pounce.",
    },
    {
      id: "w2-5",
      scene: "qr",
      attacker: "qr",
      category: "Quishing (donation)",
      from: "Charity flyer in metro",
      body: "Scan to donate ₹100 to flood relief. QR code with no visible organization logo.",
      redFlags: ["no logo", "unverified charity", "cash-only QR"],
      reactMs: 4000,
      actions: [
        { id: "scan", label: "Scan & donate", safe: false, damage: { bank: 100, identity: 10 }, failMessage: "The 'charity' was an attacker's personal UPI. Also captured your UPI ID." },
        { id: "official", label: "Donate on charity's website", safe: true, rewardMessage: "Verified charity's official site. Real donation." },
      ],
      teach: "Even 'small' quishing scams harvest your UPI handle for future attacks.",
    },
  ],

  // ------- WAVE 3: BOSS — fast + brutal -------
  [
    {
      id: "w3-1",
      scene: "call",
      attacker: "voice",
      category: "Deepfake voice",
      from: "Mom • +91 98xxx xx210",
      body: "Beta, I'm in the hospital. Send ₹15,000 to this UPI right now, I'll explain later. Please hurry.",
      redFlags: ["urgency", "unusual UPI", "won't wait for callback"],
      reactMs: 3500,
      actions: [
        { id: "send", label: "Send money now", safe: false, damage: { bank: 15000, contacts: 25 }, failMessage: "That was an AI voice clone. ₹15,000 sent to attacker." },
        { id: "callback", label: "Hang up + call Mom back", safe: true, rewardMessage: "Mom picked up at home. Deepfake foiled." },
        { id: "codeword", label: "Ask a family codeword", safe: true, rewardMessage: "AI couldn't answer. Attack revealed." },
      ],
      teach: "AI voice clones need 3 seconds of audio. Always call back on a known number or use a family codeword.",
    },
    {
      id: "w3-2",
      scene: "email",
      attacker: "clone",
      category: "Clone phishing",
      from: "notifications@github.com",
      subject: "[Re-sent] Security alert on your repo",
      body: "This is a re-sent copy of yesterday's alert with the corrected link: http://github-security.help/reset",
      redFlags: ["Re-sent", "corrected link", "github-security.help"],
      reactMs: 3500,
      actions: [
        { id: "click", label: "Reset password", safe: false, damage: { identity: 50, device: 20 }, failMessage: "GitHub creds stolen. Attacker pushed malware into your repos." },
        { id: "goto", label: "Open github.com manually", safe: true, rewardMessage: "No such alert exists. Clone email deleted." },
      ],
      teach: "Clone phishing copies a REAL email you got, then swaps the link. Always type the URL yourself.",
    },
    {
      id: "w3-3",
      scene: "push",
      attacker: "clone",
      category: "Fake OS update",
      from: "System",
      subject: "Critical Chrome update — restart to install",
      body: "New critical security patch available. Click to install (Chrome_Update_v127.exe).",
      redFlags: [".exe", "click to install", "not from Chrome"],
      reactMs: 3000,
      actions: [
        { id: "install", label: "Install now", safe: false, damage: { device: 80, contacts: 50, identity: 30 }, failMessage: "Ransomware installed. Every file encrypted. Contacts exfiltrated." },
        { id: "skip", label: "Ignore + update via Chrome menu", safe: true, rewardMessage: "Chrome auto-updates in the background. Fake installer avoided." },
      ],
      teach: "Real browsers update silently. Any '.exe' installer prompt is malware.",
    },
    {
      id: "w3-4",
      scene: "sms",
      attacker: "voice",
      category: "Delivery scam",
      from: "DHL-INFO",
      body: "Your parcel is on hold. Pay ₹25 customs fee: dhl-customs.pay-in.co/track",
      redFlags: ["₹25", "dhl-customs.pay-in.co", "customs fee via link"],
      reactMs: 3000,
      actions: [
        { id: "pay", label: "Pay ₹25", safe: false, damage: { bank: 25, identity: 35 }, failMessage: "The '₹25' page saved your card. ₹18,000 debited overnight." },
        { id: "trackapp", label: "Track in DHL app", safe: true, rewardMessage: "No parcel exists. Scam SMS reported." },
      ],
      teach: "Tiny 'fees' are bait to capture your card. Always track in the courier's official app.",
    },
    {
      id: "w3-5",
      scene: "dm",
      attacker: "angler",
      category: "Job scam",
      from: "HR @ FAANG Careers",
      body: "You've been shortlisted! Pay ₹1,999 refundable 'onboarding kit fee' + share Aadhaar to lock the offer.",
      redFlags: ["pay to be hired", "Aadhaar in DM", "refundable"],
      reactMs: 3000,
      actions: [
        { id: "pay", label: "Pay + send Aadhaar", safe: false, damage: { bank: 1999, identity: 60 }, failMessage: "Identity stolen. Loans being opened in your name." },
        { id: "reject", label: "Reject + report", safe: true, rewardMessage: "Real employers NEVER charge candidates. Correctly rejected." },
      ],
      teach: "If a 'job' asks you to PAY or share Aadhaar upfront, it's a scam. Always.",
    },
  ],
];

export const METER_LABELS: Record<MeterKey, string> = {
  bank: "Bank",
  identity: "Identity",
  contacts: "Contacts",
  device: "Device",
};

export const METER_STARTS: Record<MeterKey, number> = {
  bank: 50000,
  identity: 100,
  contacts: 300,
  device: 100,
};

export const NEWS_TICKER = [
  "⚠️ 3,400 Mumbai accounts drained via fake bank SMS in 24h",
  "🚨 AI voice-clone kidnapping scam up 400% globally this quarter",
  "📢 CERT-In: 62% of Indians received a phishing attempt this month",
  "💀 QR sticker scam on parking meters spreading across metros",
  "🔥 Deepfake CEO wire-fraud losses topped $2.7B worldwide in 2025",
  "⚡ MFA fatigue attacks bypassed 2FA in 15% of breaches last year",
];
