export interface BossPhase {
  /** Short label shown as the attack stage */
  stage: string;
  /** The hostile system event the player must read */
  console: string[];
  /** What the player must decide */
  prompt: string;
  options: string[];
  answer: number;
  /** Shown after the phase resolves */
  debrief: string;
}

export interface HackBoss {
  /** level id this boss guards — cleared level -> boss appears */
  levelId: number;
  tier: 1 | 2 | 3;
  handle: string;
  title: string;
  threat: string;
  /** taunts shown while the fight runs */
  taunts: string[];
  defeat: string;
  victory: string;
  phases: BossPhase[];
}

/** Integrity + timing scale by tier — higher tiers are brutal. */
export const bossTuning = {
  1: { integrity: 100, phaseMs: 20000, wrongHit: 45, timeoutHit: 35 },
  2: { integrity: 100, phaseMs: 16000, wrongHit: 52, timeoutHit: 42 },
  3: { integrity: 100, phaseMs: 12000, wrongHit: 60, timeoutHit: 50 },
} as const;

export const hackBosses: HackBoss[] = [
  {
    levelId: 1,
    tier: 1,
    handle: "NULLPOUR",
    title: "The Café Ghost",
    threat: "Rogue access point hijacking every session on the floor",
    taunts: [
      "your packets are mine, kid",
      "keep typing. i'm reading",
      "there is no lock on open air",
    ],
    defeat: "NULLPOUR dissolved back into the noise. Your session is yours again.",
    victory: "Session hijack contained. On open WiFi, encryption is the only wall you own.",
    phases: [
      {
        stage: "EVIL TWIN",
        console: [
          "SSID: CafeCentral_Free   BSSID a4:2b:8c:11:04:9e  signal -41dBm",
          "SSID: CafeCentral Free   BSSID 00:1a:2b:3c:4d:5e  signal -67dBm",
          "captive portal cert: CN=cafecentral.local  self-signed  issued 4 min ago",
        ],
        prompt: "Two networks, same name. Which detail proves the strong one is the attacker?",
        options: [
          "The weaker signal — attackers sit far away",
          "The self-signed portal cert minted minutes ago on the strongest AP",
          "The underscore in the SSID name",
          "The BSSID starting with a4 — that vendor prefix is malicious",
        ],
        answer: 1,
        debrief: "A freshly minted self-signed cert on the loudest AP is the evil twin's tell — not signal or name styling.",
      },
      {
        stage: "SSL STRIP",
        console: [
          "GET http://mail.provider.com/login  302 -> http://mail.provider.com/login?s=1",
          "expected: 301 -> https://mail.provider.com/login",
          "HSTS header: absent",
        ],
        prompt: "The redirect keeps you on http. What is actually happening?",
        options: [
          "Normal load balancing — https resumes after login",
          "A downgrade attack stripping TLS so credentials travel in clear text",
          "The site is offline and serving a cached page",
          "Your DNS resolver is slow",
        ],
        answer: 1,
        debrief: "A 302 that lands back on http with no HSTS is a TLS downgrade — every keystroke after that is readable.",
      },
      {
        stage: "SESSION THEFT",
        console: [
          "cookie sid=8f2c...  flags: (none)   sent over http",
          "attacker replay from 10.0.0.244 at 09:14:02 — 200 OK, no re-auth",
        ],
        prompt: "Your account is open on the attacker's machine. What kills the intrusion right now?",
        options: [
          "Change the password only",
          "Clear browser cache on your laptop",
          "Invalidate all sessions (sign out everywhere), then change the password over a trusted network",
          "Switch to a different café network",
        ],
        answer: 2,
        debrief: "A stolen cookie survives a password change. Kill every session first, then rotate the secret from a network you trust.",
      },
    ],
  },
  {
    levelId: 2,
    tier: 1,
    handle: "HOLLOWMAN",
    title: "The Inbox Parasite",
    threat: "Mailbox rules silently forwarding everything you receive",
    taunts: ["i read your mail before you do", "reply. please reply", "i live in your rules"],
    defeat: "HOLLOWMAN's forwarding rules were ripped out. The mailbox is clean.",
    victory: "Mail persistence removed. Attackers stay in inboxes long after the phish.",
    phases: [
      {
        stage: "HIDDEN RULE",
        console: [
          'rule "..": if subject contains invoice|payment|wire -> forward to jm.archive@proton.me, mark read, move to RSS Feeds',
          "created 11 days ago by OWA session, IP 45.83.x.x (Bucharest)",
        ],
        prompt: "Which detail proves this is attacker persistence and not a user rule?",
        options: [
          "The rule name is two dots and it hides mail in an unused folder",
          "It forwards invoices — finance staff do that legitimately",
          "It was created from Outlook Web Access",
          "It marks mail as read",
        ],
        answer: 0,
        debrief: "Near-invisible rule names plus a dead folder mean the goal is concealment — that's tradecraft, not workflow.",
      },
      {
        stage: "THREAD HIJACK",
        console: [
          "From: Priya Nair <priya.nair@acme-supplies.co>  (real thread, 6 replies deep)",
          "Reply-To: priya.nair@acme.supplies-co.com",
          "body: 'ignore the earlier bank details, use the attached updated one'",
        ],
        prompt: "The reply arrives inside a genuine conversation. What is the strongest tell?",
        options: [
          "The attachment is a PDF",
          "The message quotes six earlier replies",
          "Reply-To points to a lookalike domain that differs from the From domain",
          "The sender uses a personal tone",
        ],
        answer: 2,
        debrief: "Thread hijacking reuses real history; the divergent Reply-To domain is where the answer gets stolen.",
      },
      {
        stage: "PAYMENT DIVERT",
        console: [
          "finance queued: ₹8,40,000 -> IFSC changed 22 min after the hijacked reply",
          "phone confirmation: called the number written in the email signature",
        ],
        prompt: "How should the change have been verified?",
        options: [
          "Call the number in the email signature — it's from the real thread",
          "Reply to the thread asking for confirmation",
          "Call the vendor on the number already stored in the finance system, out of band",
          "Ask a colleague to read the email too",
        ],
        answer: 2,
        debrief: "Never verify using contact details supplied by the message. Out-of-band, pre-existing contacts only.",
      },
    ],
  },
  {
    levelId: 3,
    tier: 1,
    handle: "DOORBELL",
    title: "The Home Squatter",
    threat: "Your router is renting your household out to a botnet",
    taunts: ["nice camera feed", "your bandwidth is my bandwidth", "admin/admin. thank you"],
    defeat: "DOORBELL evicted. The router is locked and the botnet lost a node.",
    victory: "Home network reclaimed. Default credentials and open management ports fund botnets.",
    phases: [
      {
        stage: "FOOTHOLD",
        console: [
          "WAN admin UI: enabled on 0.0.0.0:8080",
          "UPnP: on   firmware: 2019.04 (unpatched CVE-2020-8515)",
          "login: admin / admin  last change: never",
        ],
        prompt: "Which single change removes the most attack surface immediately?",
        options: [
          "Rename the WiFi network",
          "Disable remote WAN administration",
          "Turn off the guest network",
          "Hide the SSID broadcast",
        ],
        answer: 1,
        debrief: "Exposing the admin UI to the internet is the fatal flaw — hidden SSIDs and renames change nothing.",
      },
      {
        stage: "DNS HIJACK",
        console: [
          "router DNS: 193.201.x.x (not ISP, not 1.1.1.1)",
          "bank.example resolves to 185.62.x.x  — cert warning bypassed by 2 devices",
        ],
        prompt: "What is this configuration doing to the household?",
        options: [
          "Speeding up browsing with a fast public resolver",
          "Blocking ads at the network level",
          "Silently redirecting banking traffic to attacker-controlled lookalike servers",
          "Nothing — DNS cannot affect HTTPS sites",
        ],
        answer: 2,
        debrief: "Rogue DNS at the router redirects every device at once, and users are trained to click through cert warnings.",
      },
      {
        stage: "CAMERA FEED",
        console: [
          "device: babycam-01  port 554/tcp exposed via UPnP",
          "3 concurrent RTSP viewers — 2 from AS-hosted ranges",
        ],
        prompt: "Fastest correct response for the exposed camera?",
        options: [
          "Cover the lens and continue",
          "Disable UPnP, remove the port forward, patch firmware, then rotate the camera password",
          "Change only the camera password",
          "Move the camera to another room",
        ],
        answer: 1,
        debrief: "Close the exposure path first (UPnP + forward + firmware), then rotate credentials — order matters.",
      },
    ],
  },
  {
    levelId: 4,
    tier: 2,
    handle: "GRIMWIRE",
    title: "The Access Broker",
    threat: "Selling live VPN sessions into your corporate network",
    taunts: ["your VPN is a marketplace now", "MFA fatigue is a business model", "approve it. just once"],
    defeat: "GRIMWIRE's broker session was burned before the buyer logged in.",
    victory: "Credential brokering stopped. Push-approval MFA is only as strong as the tired human behind it.",
    phases: [
      {
        stage: "MFA FATIGUE",
        console: [
          "push requests: 23 in 6 minutes, 02:41–02:47 IST",
          "approved: 1 (02:47)  device: user's phone  location claim: Mumbai",
          "session origin ASN: hosting provider, Frankfurt",
        ],
        prompt: "What actually failed here?",
        options: [
          "The password was too short",
          "The attacker already had valid credentials and spammed pushes until one was approved",
          "The VPN certificate expired",
          "The user connected from an unsupported browser",
        ],
        answer: 1,
        debrief: "Push spam is a post-credential attack. Number matching or FIDO2 removes the tired-thumb failure mode.",
      },
      {
        stage: "TOKEN REPLAY",
        console: [
          "refresh token issued 02:47, reused 07:12 from a second ASN",
          "no re-authentication prompt — device compliance check: skipped",
          "password reset at 06:55 by helpdesk",
        ],
        prompt: "The password was reset at 06:55, yet access continued at 07:12. Why?",
        options: [
          "The reset did not sync to the VPN",
          "The stolen refresh token stays valid until it is explicitly revoked",
          "The attacker guessed the new password",
          "Helpdesk reset the wrong account",
        ],
        answer: 1,
        debrief: "Token revocation is a separate action from password reset — skip it and the intruder never leaves.",
      },
      {
        stage: "SPRAY",
        console: [
          "auth log: 1 attempt per account across 1,842 accounts, 45-min interval, same password 'Monsoon@2026'",
          "lockout policy: 5 failures / 15 min — never triggered",
        ],
        prompt: "Why did the lockout policy miss this entirely?",
        options: [
          "Lockouts do not apply to VPN logins",
          "Password spraying stays under the per-account threshold by going wide instead of deep",
          "The attacker disabled the policy",
          "The interval was too short to log",
        ],
        answer: 1,
        debrief: "Per-account thresholds are blind to horizontal spray — you need cross-account and impossible-travel detection.",
      },
    ],
  },
  {
    levelId: 5,
    tier: 2,
    handle: "CARRION",
    title: "The Quiet Exfiltrator",
    threat: "Draining the customer database one DNS query at a time",
    taunts: ["nobody watches port 53", "i take small bites", "your DLP is asleep"],
    defeat: "CARRION's tunnel collapsed mid-transfer. The rest of the database stayed home.",
    victory: "Covert channel cut. Exfiltration hides in protocols nobody inspects.",
    phases: [
      {
        stage: "DNS TUNNEL",
        console: [
          "4,120 TXT queries in 9 min -> *.stat-cdn7.net",
          "avg label length 58 chars, base32, entropy 4.9",
          "no A/AAAA lookups for the same domain, ever",
        ],
        prompt: "Which observation most strongly proves exfiltration rather than telemetry?",
        options: [
          "The domain contains 'cdn'",
          "High-entropy base32 labels with TXT-only traffic and no address lookups",
          "The query volume alone",
          "Queries happened during working hours",
        ],
        answer: 1,
        debrief: "Real CDNs resolve addresses. Long high-entropy TXT-only labels are payload, not lookup.",
      },
      {
        stage: "LATERAL MOVE",
        console: [
          "svc_backup logged into 14 hosts in 3 minutes via SMB",
          "svc_backup normal pattern: 2 hosts, nightly 01:00",
          "parent process: powershell.exe -enc <base64>",
        ],
        prompt: "What is the correct read of this activity?",
        options: [
          "A scheduled backup running early",
          "A misconfigured monitoring agent",
          "A service account stolen and used for rapid lateral movement",
          "Normal patch deployment",
        ],
        answer: 2,
        debrief: "Service accounts have fixed, boring patterns. Sudden fan-out from an encoded shell is a takeover.",
      },
      {
        stage: "CONTAIN",
        console: [
          "options queued: A) shut down all servers  B) block the domain at DNS + isolate the 14 hosts + revoke svc_backup",
          "C) reimage everything now  D) email staff a warning",
        ],
        prompt: "Choose containment that stops the bleed without destroying evidence.",
        options: [
          "Shut every server down immediately",
          "Sinkhole the domain, isolate affected hosts, revoke and rotate the service account",
          "Reimage all 14 hosts right now",
          "Send a company-wide warning email and keep monitoring",
        ],
        answer: 1,
        debrief: "Isolate and revoke — mass shutdown or instant reimaging destroys the forensics you need next.",
      },
    ],
  },
  {
    levelId: 6,
    tier: 2,
    handle: "PALEHOUND",
    title: "The Edge Crawler",
    threat: "Living inside your web tier, rewriting responses in flight",
    taunts: ["your WAF logs look lovely", "i am inside the response", "block me. i'll come back as JSON"],
    defeat: "PALEHOUND's webshell was cut out and the edge rebuilt from a known-good image.",
    victory: "Web tier reclaimed. Filters that only match known-bad strings will always be walked around.",
    phases: [
      {
        stage: "WAF BYPASS",
        console: [
          "blocked: /api?q=UNION+SELECT",
          "allowed: /api?q=UNI%2523ON%2520SEL%2545CT   -> 200, 1.4MB response",
          "WAF mode: signature match, single URL decode",
        ],
        prompt: "Why did the second request succeed?",
        options: [
          "The payload was shorter",
          "Double encoding defeated a WAF that decodes only once before matching",
          "The WAF was offline for that request",
          "The API endpoint was different",
        ],
        answer: 1,
        debrief: "Signature WAFs match what they decoded, not what the app will decode. Normalize fully or validate at the app.",
      },
      {
        stage: "WEBSHELL",
        console: [
          "/uploads/thumbs/ico_23.php.jpg  written 04:12 by www-data",
          "later: GET /uploads/thumbs/ico_23.php.jpg?c=whoami  -> 200, content-type text/html",
        ],
        prompt: "What made this upload dangerous?",
        options: [
          "The file is larger than usual",
          "The uploads path executed a file whose real handler was PHP despite the .jpg suffix",
          "It was uploaded outside working hours",
          "Thumbnails should never be cached",
        ],
        answer: 1,
        debrief: "Upload directories must never execute. Extension checks are cosmetic when the handler is chosen by the server config.",
      },
      {
        stage: "RESPONSE TAMPER",
        console: [
          "checkout.js served with modified hash (SRI mismatch ignored by 1 template)",
          "injected block posts card fields to https://metrics-collect.io/px",
        ],
        prompt: "What class of attack is running against customers?",
        options: [
          "Cross-site request forgery",
          "Client-side skimming (Magecart-style) exfiltrating card data from the live page",
          "Denial of service",
          "DNS poisoning",
        ],
        answer: 1,
        debrief: "Skimmers steal in the browser, so server-side card storage rules never see it. SRI and CSP are the controls.",
      },
    ],
  },
  {
    levelId: 7,
    tier: 3,
    handle: "IRONHALO",
    title: "The Grid Warden",
    threat: "Holding operator credentials on a live power distribution network",
    taunts: ["i control what the operators see", "lights are a permission now", "safety systems are just software"],
    defeat: "IRONHALO forced off the control plane before a single breaker moved.",
    victory: "Grid protected. In OT, the impact of a stolen login is measured in physical harm.",
    phases: [
      {
        stage: "HMI SPOOF",
        console: [
          "HMI shows: breaker 7 CLOSED, load nominal",
          "protection relay telemetry: breaker 7 OPEN 00:41 — feeder de-energised",
          "historian writes paused 00:39",
        ],
        prompt: "The operator display disagrees with the relay. What is happening?",
        options: [
          "A relay sensor has failed",
          "The attacker is falsifying the operator view while manipulating real equipment",
          "The historian is simply lagging",
          "Time sync drift between systems",
        ],
        answer: 1,
        debrief: "Blinding the operator is standard grid tradecraft — always trust protection-layer telemetry over the HMI.",
      },
      {
        stage: "PROTOCOL ABUSE",
        console: [
          "Modbus/TCP 502: function 0x05 write-single-coil bursts from engineering workstation",
          "no authentication in protocol; source host last patched 2021",
          "engineer on leave since Monday",
        ],
        prompt: "Which control would have blocked this specific abuse?",
        options: [
          "Stronger passwords on the workstation",
          "Antivirus on the HMI",
          "Segmentation with a unidirectional gateway and strict allow-lists between IT and the control network",
          "Rotating the Modbus password",
        ],
        answer: 2,
        debrief: "Modbus has no authentication to strengthen — the only real control is architectural isolation.",
      },
      {
        stage: "SAFETY OVERRIDE",
        console: [
          "SIS logic download attempt from same host, 00:52 — key switch position: PROGRAM",
          "if accepted: overpressure trip disabled",
        ],
        prompt: "Priority action in the next sixty seconds?",
        options: [
          "Collect memory forensics from the workstation first",
          "Turn the safety system key switch to RUN and physically isolate the engineering host from the control network",
          "Open a support ticket with the SIS vendor",
          "Reboot the HMI to clear the spoofed display",
        ],
        answer: 1,
        debrief: "Safety-instrumented systems come before forensics. Restore the trip function, then investigate.",
      },
    ],
  },
  {
    levelId: 8,
    tier: 3,
    handle: "SEVENTHVEIL",
    title: "The Supply Chain",
    threat: "Signed, trusted, and already deployed across every plant",
    taunts: ["your vendor let me in", "i am signed. i am trusted", "check your hashes. too late"],
    defeat: "SEVENTHVEIL's trojanised update was quarantined before the second wave rolled out.",
    victory: "Supply chain compromise caught. Trust in a vendor is an attack surface you inherit.",
    phases: [
      {
        stage: "TROJAN UPDATE",
        console: [
          "plantsuite-4.7.2.msi  signed: valid, vendor cert, timestamp 03:11",
          "post-install: beacon to 4 domains, 2h jitter, DoH resolver",
          "vendor advisory published 09:40: build server compromised",
        ],
        prompt: "The signature is valid. What does that actually tell you?",
        options: [
          "The file is safe — signatures cannot be faked",
          "Only that it came from the vendor's pipeline, which is itself the compromise",
          "The vendor approved the beacon behaviour",
          "The certificate must be stolen",
        ],
        answer: 1,
        debrief: "Code signing proves origin, not intent. A compromised build server produces perfectly valid malware.",
      },
      {
        stage: "PERSISTENCE",
        console: [
          "WMI event subscription: __EventFilter 'SCM Event Log Filter' -> CommandLineEventConsumer",
          "scheduled task removed by responders at 10:02; beacon resumed 10:47",
        ],
        prompt: "Why did the beacon return after cleanup?",
        options: [
          "The responders missed a second host",
          "WMI event subscription persistence survived removal of the scheduled task",
          "The malware re-downloaded itself over the VPN",
          "The task deletion did not apply until reboot",
        ],
        answer: 1,
        debrief: "Attackers stack persistence mechanisms. Clearing the obvious one just proves which one you didn't find.",
      },
      {
        stage: "IT TO OT",
        console: [
          "jump host DMZ-01 reachable from both corporate VLAN and plant VLAN",
          "same local admin hash valid on 61 hosts across both zones",
        ],
        prompt: "Which weakness makes the plant reachable from a corporate laptop?",
        options: [
          "Weak WiFi encryption",
          "Shared local administrator credentials plus a dual-homed jump host bridging both zones",
          "Outdated antivirus definitions",
          "Missing email filtering",
        ],
        answer: 1,
        debrief: "Credential reuse plus a bridging host makes segmentation decorative — pass-the-hash walks straight across.",
      },
    ],
  },
  {
    levelId: 9,
    tier: 3,
    handle: "OBSIDIAN CHOIR",
    title: "The Final Threat",
    threat: "Inside the vault, encrypting backups before it touches production",
    taunts: [
      "i took your backups first",
      "the air gap was a spreadsheet",
      "count your restore points. i already did",
    ],
    defeat: "OBSIDIAN CHOIR was severed from the vault with the restore chain intact.",
    victory: "Vault held. The final lesson: attackers destroy your recovery before they destroy your data.",
    phases: [
      {
        stage: "BACKUP KILL",
        console: [
          "backup catalog: 412 restore points -> 3 in 40 minutes",
          "deletions authenticated with backup service account from a non-backup host",
          "immutability / object lock: not enabled",
        ],
        prompt: "Which control would have preserved recovery despite full domain compromise?",
        options: [
          "Daily instead of hourly backups",
          "Immutable, offline or object-locked copies outside the domain trust",
          "A longer backup service account password",
          "Storing backups on a second server in the same rack",
        ],
        answer: 1,
        debrief: "If the attacker's credentials can delete it, it is not a backup. Immutability outside the trust boundary is the control.",
      },
      {
        stage: "AIR GAP MYTH",
        console: [
          "vault host: no network route to corporate",
          "USB device VID:0781 mounted 11:04, autorun payload staged",
          "same serial seen on an engineer laptop the previous day",
        ],
        prompt: "How did code cross a network with no route?",
        options: [
          "Wireless side channel from a nearby AP",
          "Removable media carried the payload across — the human is the transport layer",
          "The gap was never real; there was a hidden VPN",
          "Bluetooth pairing with the HMI",
        ],
        answer: 1,
        debrief: "Air gaps fail at the loading dock. Media control and host allow-listing are what actually enforce the gap.",
      },
      {
        stage: "ENDGAME",
        console: [
          "encryption staged, not yet launched — 6 min estimated to trigger",
          "options: pay / negotiate / execute isolation and restore",
        ],
        prompt: "Final call. What ends this without funding the next attack?",
        options: [
          "Pay quickly to stop the launch",
          "Negotiate to buy time and keep systems online",
          "Isolate the vault segment, kill the attacker's sessions and credentials, restore from immutable copies",
          "Shut down power to the whole facility",
        ],
        answer: 2,
        debrief: "Payment buys a promise. Isolation plus a verified immutable restore is the only outcome you control.",
      },
    ],
  },
];

export const bossForLevel = (levelId: number) => hackBosses.find((b) => b.levelId === levelId) ?? null;
