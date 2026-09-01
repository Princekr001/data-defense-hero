import type { HackCategory } from "@/data/hackTargets";

export type EvidenceKind = "email" | "log" | "url" | "screenshot" | "sms";

export interface EvidenceEmail {
  kind: "email";
  from: string;
  fromRaw: string;
  to: string;
  subject: string;
  received: string;
  headers: string[];
  body: string[];
  attachment?: string;
}

export interface EvidenceLog {
  kind: "log";
  source: string;
  lines: string[];
}

export interface EvidenceUrl {
  kind: "url";
  displayed: string;
  actual: string;
  tls: "valid" | "invalid" | "none";
  note: string;
}

export interface EvidenceScreenshot {
  kind: "screenshot";
  app: string;
  caption: string;
  rows: { label: string; value: string; flag?: boolean }[];
}

export interface EvidenceSms {
  kind: "sms";
  sender: string;
  messages: { from: "them" | "you"; text: string; time: string }[];
}

export type Evidence =
  | EvidenceEmail
  | EvidenceLog
  | EvidenceUrl
  | EvidenceScreenshot
  | EvidenceSms;

export interface EvidenceOption {
  id: string;
  label: string;
  correct: boolean;
  /** Shown after the pick — what actually happens if you do this. */
  outcome: string;
}

export interface EvidenceCase {
  id: string;
  title: string;
  situation: string;
  evidence: Evidence[];
  question: string;
  options: EvidenceOption[];
  /** The one-line rule to remember. */
  takeaway: string;
}

const phishingCase: EvidenceCase = {
  id: "ph-payroll",
  title: "Payroll re-verification",
  situation:
    "09:14 — an email lands in the finance shared inbox. Payday is tomorrow and three people have already replied 'is this real?'",
  evidence: [
    {
      kind: "email",
      from: "HR Payroll Services",
      fromRaw: "payroll@hr-portaI-secure.com",
      to: "finance@northgate-ltd.com",
      subject: "ACTION REQUIRED: re-verify bank details before 17:00 today",
      received: "Today 09:14 (3 min ago)",
      headers: [
        "Return-Path: <bounce@mail-relay-72.ru>",
        "Received: from mail-relay-72.ru (185.62.190.14)",
        "SPF: FAIL (sender IP not permitted by northgate-ltd.com)",
        "DKIM: none    DMARC: fail (p=quarantine)",
        "Reply-To: payroll.desk@gmail.com",
      ],
      body: [
        "Dear Employee,",
        "Our payroll migration is complete. Salaries will NOT be released unless your bank details are re-verified today.",
        "Click below and sign in with your work account to confirm your account number.",
        "[ Verify my bank details ]",
        "Failure to comply will delay your salary by 30 days.",
      ],
      attachment: "Payroll_Verification.html (41 KB)",
    },
    {
      kind: "url",
      displayed: "https://northgate-ltd.com/payroll/verify",
      actual: "http://hr-portaI-secure.com.acct-check.top/login?u=finance@northgate-ltd.com",
      tls: "none",
      note: "Hovering the button reveals the real destination. The capital i in 'portaI' is not an L.",
    },
  ],
  question: "Based on this evidence, what do you do next?",
  options: [
    {
      id: "a",
      label: "Open the attachment in a sandbox to see what the form asks for",
      correct: false,
      outcome:
        "The HTML attachment renders a local credential form and posts straight to the attacker. Curiosity is not a control — you have already handed over the session if you type anything.",
    },
    {
      id: "b",
      label: "Reply asking payroll to confirm the request is genuine",
      correct: false,
      outcome:
        "Reply-To points at a Gmail address the attacker owns. You just confirmed the mailbox is live and staffed — expect a tailored follow-up within the hour.",
    },
    {
      id: "c",
      label:
        "Don't click. Report it to security, then verify by calling payroll on the number from the intranet directory",
      correct: true,
      outcome:
        "Correct. SPF fail + lookalike domain + payday urgency is a bank-diversion fraud pattern. Out-of-band verification on a known-good number kills it, and reporting lets security purge it from every inbox.",
    },
    {
      id: "d",
      label: "Forward it to the whole team warning them not to click",
      correct: false,
      outcome:
        "Well-meant, but you just spread a live payload to 40 more people and one of them will click. Report up, not out.",
    },
  ],
  takeaway:
    "Authentication headers (SPF/DKIM/DMARC) plus a hover-check on the link beat gut feeling every time. Verify money requests on a channel the email didn't give you.",
};

const passwordCase: EvidenceCase = {
  id: "pw-credential-stuffing",
  title: "3 a.m. login spike",
  situation:
    "Your alerting fires overnight: one account is being hammered, and one login succeeded. You have 10 minutes before the shift handover.",
  evidence: [
    {
      kind: "log",
      source: "auth.log — identity provider",
      lines: [
        "03:02:11 FAIL  user=j.rao  ip=45.61.188.9   ua=python-requests/2.31  reason=bad_password",
        "03:02:12 FAIL  user=j.rao  ip=45.61.188.9   ua=python-requests/2.31  reason=bad_password",
        "03:02:14 FAIL  user=j.rao  ip=45.61.188.9   ua=python-requests/2.31  reason=bad_password",
        "…  1,847 failures in 96 seconds across 212 accounts (same IP block) …",
        "03:03:48 OK    user=j.rao  ip=45.61.188.9   ua=python-requests/2.31  mfa=not_enrolled",
        "03:04:02 OK    user=j.rao  ip=45.61.188.9   action=create_app_password name='mail-sync'",
        "03:04:37 OK    user=j.rao  ip=45.61.188.9   action=add_mailbox_rule rule='move *invoice* -> RSS Feeds'",
        "03:11:20 OK    user=j.rao  ip=45.61.188.9   action=oauth_grant app='DocuViewer Pro' scope=mail.read",
      ],
    },
    {
      kind: "screenshot",
      app: "Identity console — account j.rao",
      caption: "Account state at 03:15",
      rows: [
        { label: "MFA", value: "Not enrolled", flag: true },
        { label: "Password last changed", value: "2 years 4 months ago", flag: true },
        { label: "Password reuse (breach corpus)", value: "Match — seen in 2 public dumps", flag: true },
        { label: "App passwords", value: "1 active — 'mail-sync' (created 03:04)", flag: true },
        { label: "Mailbox rules", value: "1 new — invoices to hidden folder", flag: true },
      ],
    },
  ],
  question: "Based on this evidence, what is your first move?",
  options: [
    {
      id: "a",
      label: "Force a password reset on j.rao and move on",
      correct: false,
      outcome:
        "Partial. The app password and the OAuth grant survive a password reset — the attacker keeps reading mail even after the new password is set.",
    },
    {
      id: "b",
      label: "Block the IP at the firewall",
      correct: false,
      outcome:
        "Cosmetic. Credential-stuffing kits rotate IPs by the thousand, and the intruder already holds persistent tokens that don't depend on that address.",
    },
    {
      id: "c",
      label:
        "Revoke all sessions, app passwords and OAuth grants, reset the password, enrol MFA, then delete the mailbox rule",
      correct: true,
      outcome:
        "Correct. Kill persistence first, then credentials, then re-establish trust with MFA. The hidden invoice rule is the setup for payment fraud — removing it stops the next stage.",
    },
    {
      id: "d",
      label: "Wait for business hours so you don't disrupt the user",
      correct: false,
      outcome:
        "Eight unattended hours is enough to redirect an invoice and drain a payment run. Containment beats convenience.",
    },
  ],
  takeaway:
    "Reused passwords + no MFA = a working login for anyone with the dump. After a takeover, always revoke tokens and app passwords — a password reset alone leaves the door open.",
};

const privacyCase: EvidenceCase = {
  id: "pr-app-permissions",
  title: "The free torch app",
  situation:
    "A colleague's phone has been getting eerily specific ads and their battery dies by lunchtime. You look at what they installed last week.",
  evidence: [
    {
      kind: "screenshot",
      app: "App info — 'SuperTorch Ultra HD'",
      caption: "Installed 6 days ago · 4.6★ · 10M+ downloads",
      rows: [
        { label: "Camera", value: "Allowed (needed for flash)" },
        { label: "Location", value: "Allowed all the time", flag: true },
        { label: "Contacts", value: "Allowed — 412 contacts read", flag: true },
        { label: "Microphone", value: "Allowed — used 31 times in background", flag: true },
        { label: "Files & media", value: "Allowed — full library", flag: true },
        { label: "Data sent (7 days)", value: "312 MB to ad-sdk.analytics-hub.cn", flag: true },
      ],
    },
    {
      kind: "sms",
      sender: "+91 90xxx 41882 (unknown)",
      messages: [
        { from: "them", text: "Hi Priya! Saw you were near Indiranagar Metro at 8:40pm 😊", time: "21:02" },
        { from: "them", text: "Your friend Arjun gave me your number, right?", time: "21:03" },
        { from: "them", text: "Just click this to see who's been viewing your profile: bit.ly/pv-check", time: "21:05" },
      ],
    },
  ],
  question: "Given this evidence, what should your colleague do next?",
  options: [
    {
      id: "a",
      label: "Reply to the number and ask how they got the details",
      correct: false,
      outcome:
        "Never engage. A reply proves the number is active and moves them to a manually-worked target list for social engineering.",
    },
    {
      id: "b",
      label: "Turn location off for the app but keep using it",
      correct: false,
      outcome:
        "Too late and too narrow. Contacts and the media library are already exfiltrated, and the microphone access remains.",
    },
    {
      id: "c",
      label:
        "Uninstall the app, revoke its permissions, review the account's connected apps, warn the contacts it harvested, and block the number",
      correct: true,
      outcome:
        "Correct. Remove the collector, cut the data flow, then handle the downstream harm — the harvested contacts are the next victims of the same trick.",
    },
    {
      id: "d",
      label: "Install an antivirus app to clean it up",
      correct: false,
      outcome:
        "This isn't malware in the classic sense — the app asked, and permission was granted. No scanner un-sends 312 MB of your data.",
    },
  ],
  takeaway:
    "A torch needs the flash, nothing else. Permissions are the real attack surface on a phone: grant the minimum, review them monthly, and treat oversharing apps as a breach, not an annoyance.",
};

const invoiceCase: EvidenceCase = {
  id: "ph-invoice-swap",
  title: "The changed bank account",
  situation:
    "A supplier you've paid for four years emails an updated invoice — same logo, same signature block, new account number. ₹8,40,000 is due today.",
  evidence: [
    {
      kind: "email",
      from: "Meera Nair · Vertex Supplies",
      fromRaw: "meera.nair@vertex-supplles.com",
      to: "accounts@northgate-ltd.com",
      subject: "RE: RE: Invoice VX-20418 — updated remittance details",
      received: "Today 11:52",
      headers: [
        "In-Reply-To: <VX-20418@vertex-supplies.com>  (thread hijack — original thread is genuine)",
        "SPF: pass (for vertex-supplles.com — the lookalike domain, registered 9 days ago)",
        "X-Originating-IP: 102.89.33.6 (Lagos, NG) — supplier normally sends from Pune, IN",
      ],
      body: [
        "Hi team, apologies for the confusion —",
        "our bank has migrated us to a new account. Please use the details on the attached invoice for today's payment.",
        "Old account is closed, payments there will bounce. Kindly confirm once processed.",
      ],
      attachment: "Invoice_VX-20418_REVISED.pdf (illegible scan, no digital signature)",
    },
    {
      kind: "screenshot",
      app: "Attached invoice — diff vs. VX-20418 original",
      caption: "Fields that changed since the original invoice",
      rows: [
        { label: "Amount", value: "₹8,40,000 (unchanged)" },
        { label: "IFSC / account", value: "Changed — new bank, different state", flag: true },
        { label: "Account holder name", value: "VERTEX SUPPLY SOLUTIONS (not Vertex Supplies Pvt Ltd)", flag: true },
        { label: "GSTIN", value: "Unchanged — copied from the real invoice" },
        { label: "PDF author metadata", value: "'user' — original PDFs say 'M Nair'", flag: true },
      ],
    },
  ],
  question: "The payment run closes in 40 minutes. What do you do?",
  options: [
    {
      id: "a",
      label: "Pay it — the thread and the GSTIN match the real supplier",
      correct: false,
      outcome:
        "Money gone. Thread hijacking copies everything legitimate; the account holder name mismatch was the tell you skipped.",
    },
    {
      id: "b",
      label: "Reply on the thread asking Meera to confirm the new account",
      correct: false,
      outcome:
        "The attacker controls the lookalike domain and answers as Meera within minutes, complete with a forged bank letter. Confirmation on the same channel confirms nothing.",
    },
    {
      id: "c",
      label:
        "Hold the payment, call Meera on the number already on file, and confirm the change through your vendor-master process",
      correct: true,
      outcome:
        "Correct. Bank-detail changes get an out-of-band callback to a stored number and a second approver — always, even under deadline. A genuine supplier will never object to that.",
    },
    {
      id: "d",
      label: "Send ₹1 as a test transfer first, then the rest",
      correct: false,
      outcome:
        "A test transfer only proves the account exists — mule accounts accept it happily, and you've now validated their account for them.",
    },
  ],
  takeaway:
    "Any change to payment details is a security event, not an admin update. Callback on a stored number, check the account-holder name, and require dual approval.",
};

const byCategory: Record<HackCategory, EvidenceCase[]> = {
  phishing: [phishingCase, invoiceCase],
  passwords: [passwordCase],
  privacy: [privacyCase],
};

/** Pick a deterministic evidence case for a level. */
export function evidenceForLevel(levelId: number, category: HackCategory): EvidenceCase {
  const pool = byCategory[category] ?? [phishingCase];
  return pool[levelId % pool.length];
}
