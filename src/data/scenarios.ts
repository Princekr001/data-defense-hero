export interface Scenario {
  id: number;
  title: string;
  character: string;
  description: string;
  situation: string;
  actions: {
    action1: { text: string; type: 'safe' | 'risky'; };
    action2: { text: string; type: 'safe' | 'risky'; };
    action3?: { text: string; type: 'safe' | 'risky'; };
  };
  feedback: {
    correct: string;
    concept: string;
    tips: string[];
  };
  category: 'phishing' | 'password' | 'social' | 'network' | 'malware' | 'privacy' | 'scam' | 'gaming';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  xpReward: number;
  concept: string;
}

export const gameScenarios: Scenario[] = [
  {
    id: 1,
    title: "The Bank Email Mystery",
    character: "Alex Martinez",
    description: "Alex is checking their email during lunch break when something catches their eye.",
    situation: "Alex receives an urgent email claiming to be from their bank: 'Your account will be suspended in 24 hours unless you verify your details immediately!' The email has the bank's logo, but the sender's address is 'security-bank@email-verify.net' instead of the official domain.",
    actions: {
      action1: { text: "Click the verification link in the email", type: 'risky' },
      action2: { text: "Call the bank directly using the number on your debit card", type: 'safe' },
      action3: { text: "Forward the email to friends to ask their opinion", type: 'risky' }
    },
    feedback: {
      correct: "Great thinking! Calling the bank directly was the safest choice. You avoided a phishing scam that could have stolen your login credentials.",
      concept: "Phishing Prevention: Always verify suspicious communications through official channels.",
      tips: [
        "Banks never ask for account verification via email links",
        "Check sender addresses carefully - look for misspellings or wrong domains",
        "When in doubt, contact the organization directly using official contact info"
      ]
    },
    category: 'phishing',
    difficulty: 'beginner',
    xpReward: 100,
    concept: "Email Verification"
  },
  {
    id: 2,
    title: "The Password Creation Challenge",
    character: "Sarah Chen",
    description: "Sarah is creating an account for a new social media platform they're excited to join.",
    situation: "The sign-up form asks for a password. Sarah is thinking about using '12March1995' (their birthday) because it's easy to remember, 'SarahCool123' because it includes their name, or generating a random strong password with their password manager.",
    actions: {
      action1: { text: "Use birthday: '12March1995'", type: 'risky' },
      action2: { text: "Create a unique strong password with password manager", type: 'safe' },
      action3: { text: "Use a variation of the same password you use elsewhere", type: 'risky' }
    },
    feedback: {
      correct: "Excellent choice! Using a password manager to create unique, strong passwords is the gold standard of account security.",
      concept: "Password Security: Strong, unique passwords are your first line of defense.",
      tips: [
        "Avoid personal information like birthdays, names, or addresses",
        "Use different passwords for every account",
        "Password managers make strong passwords easy to use and remember"
      ]
    },
    category: 'password',
    difficulty: 'beginner',
    xpReward: 100,
    concept: "Strong Authentication"
  },
  {
    id: 3,
    title: "The Social Media Friend Request",
    character: "Marcus Johnson",
    description: "Marcus receives an interesting friend request while scrolling social media.",
    situation: "A profile named 'Jordan Smith' wants to connect, claiming they go to Marcus's school. The profile was created last week, has only 5 photos, 8 friends, and sent a message saying 'Hey! I think we have mutual friends! Want to chat?'",
    actions: {
      action1: { text: "Accept the request and start chatting", type: 'risky' },
      action2: { text: "Check with mutual friends first to verify", type: 'safe' },
      action3: { text: "Ignore the request and report if suspicious", type: 'safe' }
    },
    feedback: {
      correct: "Smart detective work! Verifying unknown contacts helps protect you from catfishing and social engineering attacks.",
      concept: "Social Engineering Defense: Verify before you trust.",
      tips: [
        "Be suspicious of new profiles with few friends or photos",
        "Verify identity through mutual connections or in person",
        "Trust your instincts - if something feels off, it probably is"
      ]
    },
    category: 'social',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "Identity Verification"
  },
  {
    id: 4,
    title: "The Coffee Shop Connection",
    character: "Emma Rodriguez",
    description: "Emma needs to access their bank account while studying at a busy coffee shop.",
    situation: "Emma's mobile data is running low, and they need to transfer money to a friend today. The coffee shop offers free Wi-Fi called 'CoffeeHouse_Free' with no password. Emma could also wait until getting home or use the remaining mobile data carefully.",
    actions: {
      action1: { text: "Connect to the free Wi-Fi and do the banking", type: 'risky' },
      action2: { text: "Wait until getting home to use secure internet", type: 'safe' },
      action3: { text: "Use remaining mobile data for the quick transaction", type: 'safe' }
    },
    feedback: {
      correct: "Wise decision! Protecting financial transactions on public networks prevents cybercriminals from intercepting your sensitive data.",
      concept: "Network Security: Keep financial data on trusted, secure connections.",
      tips: [
        "Public Wi-Fi is a hunting ground for hackers",
        "Use mobile data or VPN for sensitive transactions",
        "Save banking for secure, private networks when possible"
      ]
    },
    category: 'network',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "Secure Connections"
  },
  {
    id: 5,
    title: "The Free Game Temptation",
    character: "Tyler Kim",
    description: "Tyler really wants to play a popular mobile game that costs money in the official store.",
    situation: "Tyler discovers a website offering 'CyberRunner Pro' (normally $4.99) for free download. The site claims 'Skip the app store fees!' and shows glowing reviews. Tyler could download it for free, buy the official version, or look for legitimate free alternatives.",
    actions: {
      action1: { text: "Download the free version from the website", type: 'risky' },
      action2: { text: "Buy the official version from the app store", type: 'safe' },
      action3: { text: "Look for legitimate free games instead", type: 'safe' }
    },
    feedback: {
      correct: "Great choice! Official app stores verify software safety, protecting your device from malware and data theft.",
      concept: "Software Safety: Stick to official sources for downloads.",
      tips: [
        "'Free' versions of paid apps often contain malware",
        "Official app stores screen software for safety",
        "The small cost of legitimate apps is worth the security"
      ]
    },
    category: 'malware',
    difficulty: 'beginner',
    xpReward: 100,
    concept: "Safe Downloads"
  },
  {
    id: 6,
    title: "The Crypto Investment Opportunity",
    character: "Priya Patel",
    description: "Priya sees an enticing advertisement while browsing online.",
    situation: "A pop-up ad features a celebrity claiming they made millions from a new cryptocurrency investment: 'Join now with just $50 and become a millionaire in 30 days!' There's a countdown timer showing only 2 hours left for this 'exclusive opportunity.'",
    actions: {
      action1: { text: "Invest $50 quickly before the offer expires", type: 'risky' },
      action2: { text: "Research the investment thoroughly first", type: 'safe' },
      action3: { text: "Close the ad and report it as suspicious", type: 'safe' }
    },
    feedback: {
      correct: "Excellent critical thinking! You avoided a common cryptocurrency scam that preys on fear of missing out.",
      concept: "Scam Recognition: If it sounds too good to be true, it probably is.",
      tips: [
        "Legitimate investments never guarantee massive quick returns",
        "Pressure tactics and countdown timers are red flags",
        "Real celebrities don't endorse get-rich-quick schemes"
      ]
    },
    category: 'scam',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "Investment Fraud"
  },
  {
    id: 7,
    title: "The App Permissions Dilemma",
    character: "Jordan Lee",
    description: "Jordan is setting up a new photo editing app that's trending on social media.",
    situation: "During installation, the app requests permissions for contacts, location, microphone, camera, and all photos. The app claims these are 'necessary for the best experience,' but Jordan only wants to edit vacation photos.",
    actions: {
      action1: { text: "Grant all permissions for the full experience", type: 'risky' },
      action2: { text: "Only allow access to photos and camera", type: 'safe' },
      action3: { text: "Deny all permissions and find a different app", type: 'safe' }
    },
    feedback: {
      correct: "Smart privacy protection! Limiting permissions reduces your data exposure and protects your personal information.",
      concept: "Privacy Control: Only grant necessary permissions to apps.",
      tips: [
        "Apps often request excessive permissions for data collection",
        "Review what each permission actually allows",
        "You can usually change permissions later in settings"
      ]
    },
    category: 'privacy',
    difficulty: 'expert',
    xpReward: 200,
    concept: "Data Privacy"
  },
  {
    id: 8,
    title: "The Gaming Tournament Invitation",
    character: "Cameron Wright",
    description: "Cameron receives an exciting message on their favorite gaming platform.",
    situation: "A Discord user claiming to be a tournament organizer messages: 'Congratulations! You've been selected for our exclusive $10,000 gaming tournament! Click this link to claim your spot and download our special tournament client.'",
    actions: {
      action1: { text: "Click the link and download the tournament client", type: 'risky' },
      action2: { text: "Ask for verification and research the tournament", type: 'safe' },
      action3: { text: "Ignore the message and report it as spam", type: 'safe' }
    },
    feedback: {
      correct: "Great gaming instincts! You avoided a targeted malware attack designed to steal gaming accounts and personal data.",
      concept: "Gaming Security: Verify tournaments and avoid suspicious downloads.",
      tips: [
        "Legitimate tournaments don't randomly select players via DM",
        "Official tournaments use verified channels and known organizers",
        "Suspicious downloads often contain account stealers or keyloggers"
      ]
    },
    category: 'gaming',
    difficulty: 'expert',
    xpReward: 200,
    concept: "Gaming Safety"
  },
  {
    id: 9,
    title: "The Deepfake Video Call",
    character: "Zara Ahmed",
    description: "Zara gets an unexpected video call from someone who looks and sounds exactly like their school principal.",
    situation: "The caller says the school needs Zara's parent's credit card info to pay for a 'mandatory field trip fee' right now. The video quality flickers occasionally, and the caller seems to avoid turning their head sideways. Zara's friend got a similar call last week.",
    actions: {
      action1: { text: "Provide the payment details — it looks real", type: 'risky' },
      action2: { text: "Hang up and call the school office directly to verify", type: 'safe' },
      action3: { text: "Text the principal on a known number to confirm", type: 'safe' }
    },
    feedback: {
      correct: "Excellent awareness! AI-generated deepfake calls are a growing threat. Always verify through a separate, trusted channel.",
      concept: "Deepfake Awareness: AI can mimic voices and faces — verify identity independently.",
      tips: [
        "Deepfakes may flicker, glitch, or avoid certain head angles",
        "No school or employer will demand instant payment over video",
        "Verify urgent requests through a separate, known contact method"
      ]
    },
    category: 'scam',
    difficulty: 'expert',
    xpReward: 250,
    concept: "Deepfake Detection"
  },
  {
    id: 10,
    title: "The QR Code Trap",
    character: "Leo Santos",
    description: "Leo finds a QR code on a flyer posted near the school library.",
    situation: "The flyer says 'Scan to win free AirPods! Only 10 left — first come, first served!' The QR code sticker looks like it was placed over something else. Some students are already excitedly scanning it.",
    actions: {
      action1: { text: "Scan it quickly before the prizes run out", type: 'risky' },
      action2: { text: "Inspect the URL after scanning without opening it", type: 'safe' },
      action3: { text: "Report the suspicious flyer to school staff", type: 'safe' }
    },
    feedback: {
      correct: "Smart move! Malicious QR codes can redirect you to phishing sites or download malware. Physical stickers placed over legitimate codes are a growing scam.",
      concept: "QR Code Safety: Treat unknown QR codes like unknown links.",
      tips: [
        "QR code stickers placed over others are a major red flag",
        "Preview the URL before opening — look for suspicious domains",
        "Free giveaways with urgency pressure are almost always scams"
      ]
    },
    category: 'phishing',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "QR Code Security"
  },
  {
    id: 11,
    title: "The AI Homework Helper",
    character: "Mia Chen",
    description: "Mia discovers a new AI chatbot website that promises to write entire essays for free.",
    situation: "The site asks Mia to create an account using their school email and upload previous assignments 'to match their writing style.' It also wants access to their Google Drive. The site doesn't have HTTPS and the privacy policy is just one sentence.",
    actions: {
      action1: { text: "Sign up with school email and upload assignments", type: 'risky' },
      action2: { text: "Use a well-known, reputable AI tool instead", type: 'safe' },
      action3: { text: "Avoid it entirely — the data requests are excessive", type: 'safe' }
    },
    feedback: {
      correct: "Good judgment! Shady AI tools harvest your personal data and schoolwork. Stick to reputable services and protect your academic identity.",
      concept: "AI Tool Safety: Not all AI services are trustworthy — protect your data.",
      tips: [
        "Check for HTTPS and a real privacy policy before signing up",
        "Never upload personal documents to unverified websites",
        "School emails contain identifying info — use them carefully"
      ]
    },
    category: 'privacy',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "AI Tool Privacy"
  },
  {
    id: 12,
    title: "The USB Drive Mystery",
    character: "Noah Park",
    description: "Noah finds a USB drive in the school parking lot with a label that says 'Class Photos 2025.'",
    situation: "Noah is curious about the photos and considers plugging it into their laptop. A friend suggests they could also plug it into a school computer instead. The USB drive looks brand new.",
    actions: {
      action1: { text: "Plug it into your personal laptop to check", type: 'risky' },
      action2: { text: "Turn it in to the school's IT department", type: 'safe' },
      action3: { text: "Plug it into a school computer — it's not your device", type: 'risky' }
    },
    feedback: {
      correct: "Well done! Unknown USB drives are a classic attack vector. They can contain malware that auto-executes when plugged in, stealing data or locking your files.",
      concept: "Physical Security: Never plug in unknown devices.",
      tips: [
        "Attackers deliberately drop infected USB drives in public places",
        "Malware can auto-run the moment a USB is inserted",
        "Always hand found devices to IT — never plug them in yourself"
      ]
    },
    category: 'malware',
    difficulty: 'beginner',
    xpReward: 100,
    concept: "USB Security"
  },
  {
    id: 13,
    title: "The Two-Factor Bypass",
    character: "Aisha Khan",
    description: "Aisha gets a text message with a 2FA code she didn't request.",
    situation: "Moments later, someone messages Aisha on Instagram: 'Hey it's me from your group project! I accidentally entered your number when logging in. Can you just forward me that code? So sorry!' Aisha doesn't recognize the account.",
    actions: {
      action1: { text: "Forward the code — accidents happen", type: 'risky' },
      action2: { text: "Ignore the message and change your password immediately", type: 'safe' },
      action3: { text: "Ask them to prove their identity first", type: 'safe' }
    },
    feedback: {
      correct: "Critical save! Forwarding 2FA codes gives attackers full access to your account. A real person would never ask for your security codes.",
      concept: "2FA Protection: Never share authentication codes with anyone, ever.",
      tips: [
        "2FA codes are personal — no legitimate person or service will ask for them",
        "An unsolicited 2FA code means someone has your password already",
        "Change your password immediately if you receive unexpected codes"
      ]
    },
    category: 'social',
    difficulty: 'expert',
    xpReward: 200,
    concept: "Two-Factor Authentication"
  },
  {
    id: 14,
    title: "The Smart Home Spy",
    character: "Dylan Rivera",
    description: "Dylan's family just set up new smart home devices — cameras, speakers, and smart locks.",
    situation: "Dylan notices all devices are still using the default passwords shown in the manual: 'admin/admin123.' Their home Wi-Fi network is named 'Rivera_Home' and is visible to neighbors. Dylan's parent says changing it all seems too complicated.",
    actions: {
      action1: { text: "Leave it — the devices work fine as they are", type: 'risky' },
      action2: { text: "Change all default passwords and rename the Wi-Fi network", type: 'safe' },
      action3: { text: "Just change the Wi-Fi password, skip the devices", type: 'risky' }
    },
    feedback: {
      correct: "Essential home security! Default passwords on IoT devices are publicly known and easy targets for hackers who can then spy on your home.",
      concept: "IoT Security: Always change default credentials on smart devices.",
      tips: [
        "Default passwords for most devices are listed online",
        "Rename your Wi-Fi to not include personal identifiers",
        "Update smart device firmware regularly for security patches"
      ]
    },
    category: 'password',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "IoT Device Security"
  },
  {
    id: 15,
    title: "The Scholarship Scam",
    character: "Grace Okafor",
    description: "Grace finds an email about a scholarship that covers full tuition.",
    situation: "The email says Grace has been 'pre-selected' for a $25,000 scholarship. To claim it, she just needs to pay a $50 'processing fee' and provide her Social Security number for 'identity verification.' The deadline is tomorrow.",
    actions: {
      action1: { text: "Pay the fee quickly — it's a huge opportunity", type: 'risky' },
      action2: { text: "Research the scholarship organization independently", type: 'safe' },
      action3: { text: "Report it to a school counselor", type: 'safe' }
    },
    feedback: {
      correct: "You dodged a scam! Legitimate scholarships never require upfront fees or your Social Security number via email.",
      concept: "Financial Scam Awareness: Real opportunities don't demand money first.",
      tips: [
        "Legitimate scholarships never charge application or processing fees",
        "Never share your SSN over email or unverified websites",
        "Urgency and 'pre-selection' are classic pressure tactics in scams"
      ]
    },
    category: 'scam',
    difficulty: 'expert',
    xpReward: 200,
    concept: "Financial Scam Prevention"
  }
];