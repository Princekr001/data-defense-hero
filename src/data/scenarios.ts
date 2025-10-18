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
  }
];