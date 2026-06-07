// Phishing Quest dataset — 6 attack types with animated case studies
// Used by PhishingQuest + PhishingStreamGame inside Cipher City.

export type PhishingTypeId =
  | "email"
  | "spear"
  | "clone"
  | "whaling"
  | "quishing"
  | "angler";

export interface PhishingCaseStep {
  /** ~3-5s on screen — keep total per type around 15-25s */
  caption: string;
  /** small icon character driving the scene */
  actor: "victim" | "attacker" | "device" | "alert";
}

export interface PhishingType {
  id: PhishingTypeId;
  name: string;
  tagline: string;
  emoji: string;
  /** What it is, in one tight sentence */
  what: string;
  /** Tell-tale red flags learners should memorize */
  redFlags: string[];
  /** Real-world parallels (no PII / brand specifics required) */
  realCase: string;
  /** Concrete defenses */
  defenses: string[];
  /** Storyboard for the 2D animated case study */
  storyboard: PhishingCaseStep[];
  /** Sample messages used by the Stream mini-game.
   *  `phish: true` means the player must REMOVE it. */
  samples: { text: string; phish: boolean; hint?: string }[];
}

export const phishingTypes: PhishingType[] = [
  {
    id: "email",
    name: "Email Phishing",
    tagline: "Mass-blast lures sent to anyone who'll click",
    emoji: "📧",
    what:
      "Generic emails sent to huge mailing lists impersonating a brand, hoping a small percentage panic-clicks a malicious link.",
    redFlags: [
      "Generic greeting ('Dear Customer')",
      "Urgency or fear ('account closing in 24h')",
      "Mismatched sender domain (support@amaz0n-help.co)",
      "Link text doesn't match the real URL on hover",
    ],
    realCase:
      "A wave of fake 'package delivery failed' emails directs users to a lookalike courier site that captures payment details.",
    defenses: [
      "Hover the link before clicking — read the real domain",
      "Open the brand's site in a new tab instead of using the email link",
      "Report suspicious mail and delete; never reply",
      "Enable email spam + phishing filters",
    ],
    storyboard: [
      { caption: "📬 A bulk email lands in 10,000 inboxes at once.", actor: "device" },
      { caption: "⚠️ 'Your account will be suspended in 24 hours!'", actor: "alert" },
      { caption: "🧑 Victim panics, taps the urgent link.", actor: "victim" },
      { caption: "🕷️ Lookalike login page steals the password.", actor: "attacker" },
      { caption: "🛡️ Defense: verify by visiting the real site directly.", actor: "device" },
    ],
    samples: [
      {
        text: "URGENT: Your bank account will be locked in 2 hours. Verify now: bit.ly/secure-bnk",
        phish: true,
        hint: "Urgency + shortened link + no bank ever asks this by email.",
      },
      {
        text: "Hi! Reminder: your dentist appointment is Tuesday at 3pm. Reply CANCEL to reschedule.",
        phish: false,
      },
      {
        text: "Dear Customer, your parcel could not be delivered. Pay $1.99 customs here: parcel-redelivery.co",
        phish: true,
        hint: "Tiny fee + unfamiliar domain = classic delivery phish.",
      },
    ],
  },
  {
    id: "spear",
    name: "Spear Phishing",
    tagline: "Personalized lures crafted just for you",
    emoji: "🎯",
    what:
      "Attackers research one specific person (name, role, projects, colleagues) and craft a believable message addressed directly to them.",
    redFlags: [
      "Knows your name/role but asks an unusual favor",
      "References a real project but uses a slightly off email",
      "Comes 'from a colleague' but tone is wrong",
      "Pressure to act privately ('don't tell the team')",
    ],
    realCase:
      "A new hire receives an email 'from the manager' asking for a quick favor: buy gift cards and send the codes. Sender domain is one letter off.",
    defenses: [
      "Confirm sensitive requests on a second channel (call, Slack DM)",
      "Verify the full sender address, not just the display name",
      "Treat secrecy + urgency as a red flag, not normal",
      "Use DMARC/SPF protection on company domains",
    ],
    storyboard: [
      { caption: "🔎 Attacker studies the victim's LinkedIn & team page.", actor: "attacker" },
      { caption: "✉️ Crafts an email 'from the boss' using real project names.", actor: "device" },
      { caption: "🧑 Victim thinks 'this looks legit, it knows my work.'", actor: "victim" },
      { caption: "💸 Buys gift cards, sends codes — money gone.", actor: "alert" },
      { caption: "🛡️ Defense: confirm unusual asks via a second channel.", actor: "device" },
    ],
    samples: [
      {
        text: "Hey [Name], slammed in a meeting — grab 5x $200 gift cards for client thank-yous and DM me the codes. Don't loop in finance.",
        phish: true,
        hint: "Secrecy + gift cards + 'in a meeting' is the gift-card scam playbook.",
      },
      {
        text: "Reminder: team standup moved to 10:30 in Room B. — Priya",
        phish: false,
      },
      {
        text: "Quick favor — review attached invoice before I send it to the client tonight. (sender: ceo@yourc0mpany.com)",
        phish: true,
        hint: "Look-alike domain with a zero instead of an 'o'.",
      },
    ],
  },
  {
    id: "clone",
    name: "Clone Phishing",
    tagline: "Real email, copy-pasted — links swapped",
    emoji: "🧬",
    what:
      "Attackers copy a legitimate email you (or your team) already received, then re-send it from a similar address with the attachments or links replaced by malicious ones.",
    redFlags: [
      "'Updated version' of an email you already received",
      "Slightly different sender or reply-to address",
      "Same body text but new link/attachment",
      "Sent at an odd hour vs. the original",
    ],
    realCase:
      "A team receives a duplicate of yesterday's invoice email — same wording, same logo — but the PDF link now drops malware.",
    defenses: [
      "Compare the new email to the original side-by-side",
      "Never re-open attachments from a 'resent' email — request a fresh send",
      "Use email clients that flag duplicate-but-modified senders",
      "Train teams to expect this pattern after any breach",
    ],
    storyboard: [
      { caption: "📨 Attacker steals a real email thread.", actor: "attacker" },
      { caption: "🧬 Clones it word-for-word, swaps the attachment.", actor: "device" },
      { caption: "🔁 Sends 'Updated version — please use this one'.", actor: "alert" },
      { caption: "🧑 Victim trusts the familiar wording, opens it.", actor: "victim" },
      { caption: "🛡️ Defense: verify resends on a second channel first.", actor: "device" },
    ],
    samples: [
      {
        text: "Resending yesterday's invoice with the corrected PDF — please use THIS one and discard the old.",
        phish: true,
        hint: "'Use this one, discard the old' is the clone-phish signature.",
      },
      {
        text: "Following up on our chat — here's the meeting recap doc we both edited.",
        phish: false,
      },
      {
        text: "Updated contract attached. Same terms, just fixed a typo on page 3. Sign and return today.",
        phish: true,
        hint: "Tiny 'fix' + same wording + urgency = swap-the-attachment clone.",
      },
    ],
  },
  {
    id: "whaling",
    name: "Whaling (CEO Fraud)",
    tagline: "Targeting executives — or impersonating them",
    emoji: "🐋",
    what:
      "High-stakes spear phishing aimed at (or pretending to be) the C-suite, usually demanding a wire transfer, sensitive data, or vendor payment change.",
    redFlags: [
      "'From the CEO' but routed via personal email",
      "Wire request that bypasses normal approval",
      "Vendor suddenly asks to change bank details",
      "Pressure to act before a flight / meeting / weekend",
    ],
    realCase:
      "Finance receives a Friday-afternoon email 'from the CEO' approving a $80k wire to a new supplier. The CEO is actually on a plane.",
    defenses: [
      "Mandatory call-back on any wire over a threshold",
      "Dual approval for vendor bank-detail changes",
      "Display banners on emails from outside the org",
      "Train executives — and their assistants",
    ],
    storyboard: [
      { caption: "🕴️ Attacker spoofs the CEO's display name.", actor: "attacker" },
      { caption: "💰 'Quick — wire $80k to this new supplier today.'", actor: "alert" },
      { caption: "🧑 Finance staff fears saying no to the boss.", actor: "victim" },
      { caption: "✈️ Real CEO unreachable on a flight — payment sent.", actor: "device" },
      { caption: "🛡️ Defense: mandatory call-back on every wire change.", actor: "device" },
    ],
    samples: [
      {
        text: "Hi — boarding now. Process the attached wire to our new vendor before EOD. Confirm only by reply, not call. — CEO",
        phish: true,
        hint: "'Don't call me' + wire + urgency = whaling.",
      },
      {
        text: "Team — great quarter. Drinks on me at the all-hands tomorrow. — CEO",
        phish: false,
      },
      {
        text: "Vendor 'Acme' has updated bank details. Please redirect this month's payment to the new account in attachment.",
        phish: true,
        hint: "Bank-detail change with no phone confirmation = vendor fraud.",
      },
    ],
  },
  {
    id: "quishing",
    name: "QR Phishing (Quishing)",
    tagline: "Malicious QR codes that bypass URL filters",
    emoji: "🔲",
    what:
      "Scammers hide a phishing URL inside a QR code — printed on flyers, parking meters, restaurant tables, or pasted over real ones. Phones open the link in a browser, skipping most email defenses.",
    redFlags: [
      "QR sticker pasted on top of an existing one",
      "QR in an email or PDF instead of a normal link",
      "Scan opens a login page that wasn't expected",
      "Shortened or unfamiliar domain after scan",
    ],
    realCase:
      "A driver scans a QR on a parking meter to pay — it leads to a fake payment site that captures the card.",
    defenses: [
      "Preview the URL your camera app shows BEFORE tapping",
      "Type known sites in by hand for payments",
      "Inspect physical QR codes for stickers-over-stickers",
      "Use a phone security app that flags malicious URLs",
    ],
    storyboard: [
      { caption: "🅿️ Attacker sticks a fake QR on a real parking sign.", actor: "attacker" },
      { caption: "📱 Driver scans to 'pay for parking'.", actor: "victim" },
      { caption: "🔲 Phone opens a lookalike payment page.", actor: "device" },
      { caption: "💳 Card details captured in seconds.", actor: "alert" },
      { caption: "🛡️ Defense: preview the URL before tapping it.", actor: "device" },
    ],
    samples: [
      {
        text: "Scan this QR to claim your free coffee — limited to first 50 today! (sticker on cafe door)",
        phish: true,
        hint: "Unexpected QR offering a freebie is a classic quishing bait.",
      },
      {
        text: "Menu QR posted by the restaurant under glass on the table.",
        phish: false,
      },
      {
        text: "Email from 'HR': scan the QR to re-verify your payroll account.",
        phish: true,
        hint: "HR/payroll asks via QR? Never — type the portal URL yourself.",
      },
    ],
  },
  {
    id: "angler",
    name: "Angler / Social Phishing",
    tagline: "Fake support accounts on social media",
    emoji: "🎣",
    what:
      "When you complain to a brand on social media, a fake 'support' account jumps in within minutes offering to help — and sends you to a phishing page or asks for your credentials.",
    redFlags: [
      "Support handle has extra characters (@bank_support_help)",
      "No verification badge on a major brand",
      "Sends a DM with a login link to 'verify'",
      "Asks for full account number, password, or OTP",
    ],
    realCase:
      "A user tweets at their bank. Within 60 seconds, '@bank-care-support' (no checkmark) DMs them a 'priority help link' that leads to a fake login.",
    defenses: [
      "Only trust verified, official handles — check the profile age too",
      "Real support will NEVER ask for your password or OTP",
      "Navigate to support via the brand's own website",
      "Report and block the impostor account",
    ],
    storyboard: [
      { caption: "💬 Victim tweets a complaint at @RealBank.", actor: "victim" },
      { caption: "🎣 Impostor '@RealBank_Help' DMs within 60s.", actor: "attacker" },
      { caption: "🔗 Sends a 'priority' login link.", actor: "device" },
      { caption: "🔓 Login + OTP harvested, account drained.", actor: "alert" },
      { caption: "🛡️ Defense: trust only verified handles, no OTPs in DMs.", actor: "device" },
    ],
    samples: [
      {
        text: "DM from @amaz0n_help_now (no badge): 'Sorry for the trouble! Click here to verify your account and we'll refund instantly.'",
        phish: true,
        hint: "Lookalike handle + 'verify account' link = angler phish.",
      },
      {
        text: "Reply from @Verified_Brand (with badge): 'Sorry! Please DM your order number and we'll look into it.'",
        phish: false,
      },
      {
        text: "DM: 'Hi! I'm from Support. To speed up your refund, share your OTP when you get it.'",
        phish: true,
        hint: "No legitimate support agent EVER asks for an OTP.",
      },
    ],
  },
];

export const phishingTypeById = (id: PhishingTypeId) =>
  phishingTypes.find((t) => t.id === id)!;
