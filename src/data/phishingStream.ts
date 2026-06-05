export type PhishingType = "email" | "spear" | "quishing";

export interface Hotspot {
  id: string;
  label: string;     // short label shown in the inspector list
  reveal: string;    // what the player learns when they click it
  risk: boolean;     // true = it's a red flag
}

export interface Choice {
  id: string;
  label: string;
  outcome: "secure" | "risky" | "neutral";
  consequence: string; // what happens if picked
}

export interface CasePanel {
  title: string;
  caption: string;
}

export interface PhishingQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PhishingStage {
  id: string;
  type: PhishingType;
  title: string;
  subtitle: string;
  brief: string;
  surface: {
    kind: "inbox" | "message" | "browser";
    /** Visible mock content rendered by PhishingSim */
    sender?: string;
    senderAddress?: string;
    subject?: string;
    body: string;
    linkText?: string;
    linkHref?: string;        // what it claims to be
    linkRealHref?: string;    // what it actually is
    urlBar?: string;          // for browser surfaces
    urlReal?: string;
  };
  hotspots: Hotspot[];
  choices: Choice[];
  caseStudy: { title: string; panels: CasePanel[] };
  quiz: PhishingQuiz;
}

export const PHISHING_STAGES: PhishingStage[] = [
  {
    id: "email-bank-alert",
    type: "email",
    title: "The Bank Alert",
    subtitle: "Email phishing",
    brief:
      "An urgent email lands in your inbox claiming your bank account is locked. Inspect it before you act.",
    surface: {
      kind: "inbox",
      sender: "SecureBank Support",
      senderAddress: "support@secure-bank-alerts.co",
      subject: "URGENT: Your account will be suspended in 24 hours",
      body:
        "Dear Customer,\n\nWe detected unusual activity on your account. To prevent suspension, verify your identity within 24 hours by clicking the link below.\n\nFailure to act will result in permanent loss of access.",
      linkText: "Verify my account at securebank.com",
      linkHref: "https://securebank.com/verify",
      linkRealHref: "http://secure-bank-alerts.co/login.php?id=98123",
    },
    hotspots: [
      {
        id: "sender",
        label: "Sender address",
        reveal:
          "The real address is support@secure-bank-alerts.co — not the bank's true domain (securebank.com). Lookalike domains are a classic spoof.",
        risk: true,
      },
      {
        id: "link",
        label: "The 'Verify' link",
        reveal:
          "The link text says securebank.com but it actually points to secure-bank-alerts.co/login.php. Always hover before you click.",
        risk: true,
      },
      {
        id: "urgency",
        label: "Tone & urgency",
        reveal:
          "'24 hours or suspension' is manufactured pressure designed to bypass your judgement.",
        risk: true,
      },
      {
        id: "greeting",
        label: "Generic greeting",
        reveal:
          "'Dear Customer' — a real bank addresses you by name and references real account info.",
        risk: true,
      },
    ],
    choices: [
      {
        id: "click",
        label: "Click the link and sign in",
        outcome: "risky",
        consequence:
          "Your credentials would be sent to the attacker's server. Within minutes they can drain the account and pivot to your email.",
      },
      {
        id: "delete",
        label: "Delete the email",
        outcome: "neutral",
        consequence:
          "Safer than clicking, but the campaign keeps targeting others. Reporting is better.",
      },
      {
        id: "report",
        label: "Report as phishing, then visit the bank app directly",
        outcome: "secure",
        consequence:
          "Reporting feeds threat intel, and going to the bank's official app confirms there's no real issue.",
      },
    ],
    caseStudy: {
      title: "How a bank phish actually plays out",
      panels: [
        { title: "Bait", caption: "Attacker buys a lookalike domain (secure-bank-alerts.co) and sends thousands of urgent emails." },
        { title: "Hook", caption: "Victim clicks 'Verify' and lands on a perfect clone of the bank's login page." },
        { title: "Damage", caption: "Credentials and 2FA codes are relayed in real time; attacker logs in and changes recovery info." },
        { title: "Defense", caption: "Hover links, check the real domain, and always open your bank from the official app — never from a link." },
      ],
    },
    quiz: {
      question: "What's the single best habit to defeat email phishing like this?",
      options: [
        "Reply asking the sender to confirm it's real",
        "Open the bank directly via its official app or typed URL",
        "Click the link but don't enter your password",
      ],
      correctIndex: 1,
      explanation: "Out-of-band verification — going to the source yourself — removes the attacker from the loop entirely.",
    },
  },

  {
    id: "spear-ceo-wire",
    type: "spear",
    title: "CEO Wire Transfer",
    subtitle: "Spear phishing & whaling",
    brief:
      "You're a finance intern. A message arrives that looks like it's from the CEO, citing a real project. Don't get hooked.",
    surface: {
      kind: "message",
      sender: "Priya Shah (CEO)",
      senderAddress: "priya.shah@yourcompany-hq.com",
      subject: "Quick favor — Project Aurora vendor",
      body:
        "Hi — I'm in back-to-back board meetings and the Aurora vendor needs payment today or we miss the deadline. Wire €38,400 to the account in the attached PDF and reply 'done'. Don't loop in finance, I'll clear it after the meeting.\n\nSent from my iPhone",
    },
    hotspots: [
      {
        id: "sender",
        label: "Sender domain",
        reveal:
          "The real CEO is priya.shah@yourcompany.com. This message is from yourcompany-hq.com — an attacker-owned lookalike.",
        risk: true,
      },
      {
        id: "context",
        label: "Project reference",
        reveal:
          "'Aurora' is mentioned on the company blog. Attackers harvest public info (OSINT) to make spear-phish feel legitimate.",
        risk: true,
      },
      {
        id: "channel",
        label: "'Don't loop in finance'",
        reveal:
          "Isolating you from normal approvals is a giant red flag — real executives follow the process, not bypass it.",
        risk: true,
      },
      {
        id: "pressure",
        label: "Deadline pressure",
        reveal:
          "'Today or we miss the deadline' pushes you to skip verification. This is the core trick of whaling attacks.",
        risk: true,
      },
    ],
    choices: [
      {
        id: "reply",
        label: "Reply 'done' and process the wire",
        outcome: "risky",
        consequence:
          "€38,400 lands in the attacker's account within minutes and is bounced through three banks before lunch — usually unrecoverable.",
      },
      {
        id: "verify",
        label: "Call the CEO on her known number to verify",
        outcome: "secure",
        consequence:
          "Out-of-band verification confirms the request is fake. You alert security and the campaign is stopped.",
      },
      {
        id: "ignore",
        label: "Ignore it — it'll sort itself out",
        outcome: "neutral",
        consequence:
          "You stay safe, but security never learns about the attack and a colleague may fall for the next one.",
      },
    ],
    caseStudy: {
      title: "Anatomy of a whaling attack",
      panels: [
        { title: "Recon", caption: "Attacker scrapes LinkedIn, blog posts, and Slack screenshots to learn names, projects, and tone of voice." },
        { title: "Bait", caption: "A lookalike domain is registered and a tailored message is sent at 4:55pm on a Friday." },
        { title: "Hook", caption: "Urgency + authority pressures the intern to skip the normal approval process." },
        { title: "Defense", caption: "Always verify high-value requests on a second channel — phone, in person, or a different app." },
      ],
    },
    quiz: {
      question: "A 'CEO' messages you with an urgent off-process request. The right move is:",
      options: [
        "Reply for confirmation in the same thread",
        "Verify out-of-band before doing anything",
        "Do it quickly to avoid annoying leadership",
      ],
      correctIndex: 1,
      explanation: "If the channel is compromised, the attacker just confirms themselves. Always switch channels to verify.",
    },
  },

  {
    id: "quishing-cafe-wifi",
    type: "quishing",
    title: "Café Wi-Fi Poster",
    subtitle: "Clone sites & QR phishing",
    brief:
      "You scan a QR code on a 'Free Wi-Fi' poster. A login page opens. Should you sign in?",
    surface: {
      kind: "browser",
      urlBar: "https://accounts.googⅼe-wifi.com/signin",
      urlReal:
        "Punycode: xn--googe-wifi-q5b.com (lowercase L replaced with a Unicode lookalike). Not a Google domain.",
      subject: "Sign in to continue to Free Café Wi-Fi",
      body:
        "Use your Google account to connect.\n\n[ email field ]\n[ password field ]\n[  Sign in  ]\n\nBy continuing you agree to the terms.",
    },
    hotspots: [
      {
        id: "url",
        label: "URL bar",
        reveal:
          "The 'l' in google is actually a Unicode lookalike character. The real domain is xn--googe-wifi-q5b.com — a homograph attack.",
        risk: true,
      },
      {
        id: "qr",
        label: "QR origin",
        reveal:
          "QR codes hide the URL until you scan. Attackers stick fake QR posters over real ones in cafés, airports, parking meters.",
        risk: true,
      },
      {
        id: "wifi",
        label: "Wi-Fi sign-in needing Google login",
        reveal:
          "Legitimate captive portals never ask for your Google or bank password — only your name, room number, or a voucher.",
        risk: true,
      },
      {
        id: "padlock",
        label: "Padlock & HTTPS",
        reveal:
          "HTTPS only means the connection is encrypted — not that the site is trustworthy. Attackers get free certs in minutes.",
        risk: true,
      },
    ],
    choices: [
      {
        id: "signin",
        label: "Sign in with my Google account",
        outcome: "risky",
        consequence:
          "Your Google credentials and 2FA token are harvested. Within an hour the attacker reads your email, resets other accounts, and locks you out.",
      },
      {
        id: "close",
        label: "Close the tab and connect another way",
        outcome: "secure",
        consequence:
          "You ask staff for the real Wi-Fi name or use your mobile hotspot. No credentials leak.",
      },
      {
        id: "password-only",
        label: "Use a unique throwaway password",
        outcome: "risky",
        consequence:
          "Still risky: the page may also push a malicious profile or session cookie to your device, and the attacker now has your email address.",
      },
    ],
    caseStudy: {
      title: "How quishing (QR phishing) works",
      panels: [
        { title: "Setup", caption: "Attacker prints a sticker with a QR pointing to a cloned login page and slaps it over the real poster." },
        { title: "Bait", caption: "Customers scan, see a familiar-looking sign-in screen, and trust the QR because it was 'in the café'." },
        { title: "Hook", caption: "Credentials and session cookies are relayed live to a real Google login (adversary-in-the-middle)." },
        { title: "Defense", caption: "Treat any QR like an unknown link — preview the URL, never sign in to big accounts via captive portals, and prefer your hotspot." },
      ],
    },
    quiz: {
      question: "A café QR code opens a Google login page. What should you do?",
      options: [
        "Sign in — the padlock means it's safe",
        "Close it and ask staff for the real Wi-Fi details",
        "Use a different password just for Wi-Fi",
      ],
      correctIndex: 1,
      explanation: "The padlock only proves encryption, not identity. Treat QR-driven login pages as untrusted by default.",
    },
  },
];
