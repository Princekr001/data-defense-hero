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
  },
  {
    id: 16,
    title: "The Ransomware Lockdown",
    character: "Jordan Lee",
    description: "Jordan boots up their laptop and sees a terrifying message on screen.",
    situation: "Jordan's computer displays a full-screen warning: 'Your files have been encrypted! Pay 0.5 Bitcoin within 48 hours or your files will be permanently deleted.' A countdown timer is ticking. Jordan has important school projects on the laptop but also has cloud backups enabled.",
    actions: {
      action1: { text: "Pay the ransom to get the files back quickly", type: 'risky' },
      action2: { text: "Disconnect from the network, report it, and restore from backups", type: 'safe' },
      action3: { text: "Try to negotiate a lower ransom amount", type: 'risky' }
    },
    feedback: {
      correct: "Smart move! Disconnecting limits the spread, and restoring from backups is the safest recovery. Paying ransoms funds criminal operations and doesn't guarantee file recovery.",
      concept: "Ransomware Response: Never pay the ransom — disconnect, report, and restore.",
      tips: [
        "Regular backups are your best defense against ransomware",
        "Disconnect infected devices from the network immediately",
        "Report ransomware attacks to IT support and law enforcement",
        "Paying the ransom doesn't guarantee you'll get your files back"
      ]
    },
    category: 'malware',
    difficulty: 'intermediate',
    xpReward: 175,
    concept: "Ransomware Defense"
  },
  {
    id: 17,
    title: "The SIM Swap Attack",
    character: "Priya Sharma",
    description: "Priya suddenly loses cell service and starts getting alarming notifications.",
    situation: "Priya's phone suddenly shows 'No Service.' Minutes later, she receives email alerts about password reset requests for her bank and social media accounts. A friend texts her on another platform saying someone is posting strange things from her account.",
    actions: {
      action1: { text: "Wait for service to come back — it's probably a network outage", type: 'risky' },
      action2: { text: "Contact your carrier immediately from another phone and freeze affected accounts", type: 'safe' },
      action3: { text: "Try restarting your phone multiple times", type: 'risky' }
    },
    feedback: {
      correct: "Excellent response! SIM swapping is a serious attack where criminals transfer your number to their device. Contacting your carrier immediately and freezing accounts limits the damage.",
      concept: "SIM Swap Prevention: Act fast when you unexpectedly lose service.",
      tips: [
        "Set up a PIN or passphrase with your mobile carrier",
        "Use authenticator apps instead of SMS for two-factor authentication",
        "Sudden loss of cell service combined with account alerts is a red flag",
        "Contact your carrier immediately if you suspect a SIM swap"
      ]
    },
    category: 'social',
    difficulty: 'expert',
    xpReward: 225,
    concept: "SIM Swap Protection"
  },
  {
    id: 18,
    title: "The Social Media Takeover",
    character: "Marcus Chen",
    description: "Marcus discovers his Instagram account is posting content he never created.",
    situation: "Marcus's friends message him asking why he's promoting a 'crypto investment opportunity' on his Instagram stories. He can still log in, but notices his email was changed to an unknown address. His bio now has a suspicious link, and DMs are being sent to all his followers.",
    actions: {
      action1: { text: "Just delete the suspicious posts and hope it stops", type: 'risky' },
      action2: { text: "Change password, enable 2FA, revoke all sessions, and alert followers", type: 'safe' },
      action3: { text: "Create a new account and abandon the old one", type: 'risky' }
    },
    feedback: {
      correct: "Perfect! Securing the account immediately, enabling 2FA, revoking other sessions, and warning followers prevents further damage and protects your community.",
      concept: "Account Recovery: Secure, verify, and communicate when compromised.",
      tips: [
        "Enable two-factor authentication on all social media accounts",
        "Use unique passwords for each platform",
        "Regularly review connected third-party apps",
        "Warn your followers immediately so they don't fall for scams posted from your account"
      ]
    },
    category: 'social',
    difficulty: 'intermediate',
    xpReward: 175,
    concept: "Account Security"
  },
  {
    id: 19,
    title: "The Credential Stuffing Blitz",
    character: "Olivia Torres",
    description: "Olivia gets a flood of 'new login' alerts from multiple services overnight.",
    situation: "Olivia wakes up to 12 emails: login alerts from her streaming service, online shopping accounts, and a gaming platform — all from locations she's never been. She used the same password ('OliviaT2024!') across all these accounts after a major data breach was reported in the news last week.",
    actions: {
      action1: { text: "Ignore the alerts — it's probably just a glitch", type: 'risky' },
      action2: { text: "Change all passwords to unique ones and enable 2FA on every account", type: 'safe' },
      action3: { text: "Only change the password on the most important account", type: 'risky' }
    },
    feedback: {
      correct: "Exactly right! Credential stuffing uses leaked passwords to break into multiple accounts. Unique passwords for each service and 2FA stops attackers cold.",
      concept: "Credential Stuffing Defense: One password per service, always.",
      tips: [
        "Never reuse passwords across different services",
        "Use a password manager to generate and store unique passwords",
        "Check haveibeenpwned.com to see if your credentials were leaked",
        "Enable 2FA on every account that supports it"
      ]
    },
    category: 'password',
    difficulty: 'intermediate',
    xpReward: 175,
    concept: "Password Hygiene"
  },
  {
    id: 20,
    title: "The Ransomware Email Attachment",
    character: "David Kim",
    description: "David receives an email with an attachment from what looks like his professor.",
    situation: "David gets an email that appears to be from his professor with the subject 'Updated Syllabus - URGENT.' The attachment is named 'Syllabus_Updated.pdf.exe'. The email says 'Please review the attached updated syllabus before tomorrow's class.' David notices the professor's email is slightly misspelled.",
    actions: {
      action1: { text: "Download and open the attachment — it's from a professor", type: 'risky' },
      action2: { text: "Verify with the professor through a separate channel before opening", type: 'safe' },
      action3: { text: "Forward it to classmates to check if they got it too", type: 'risky' }
    },
    feedback: {
      correct: "Great instinct! The '.pdf.exe' double extension is a classic ransomware delivery trick. Always verify unexpected attachments through a separate communication channel.",
      concept: "Malware Prevention: Verify before you click, especially with double extensions.",
      tips: [
        "Files ending in .exe, .bat, or .scr are executable — never open unexpected ones",
        "Double extensions like .pdf.exe are a red flag for malware",
        "Verify unexpected attachments by contacting the sender through another channel",
        "Keep your antivirus software updated and active"
      ]
    },
    category: 'malware',
    difficulty: 'beginner',
    xpReward: 125,
    concept: "Email Attachment Safety"
  },
  {
    id: 21,
    title: "The Fake Customer Support",
    character: "Aisha Johnson",
    description: "Aisha searches online for tech support and finds a number that seems helpful.",
    situation: "Aisha's laptop is running slowly, so she Googles 'Microsoft support phone number.' She calls the first result, and the 'technician' asks her to install remote access software and provide her login credentials to 'run diagnostics.' They sound professional and claim her computer has '47 critical viruses.'",
    actions: {
      action1: { text: "Install the remote access software — they sound like real support", type: 'risky' },
      action2: { text: "Hang up, find support through the official Microsoft website only", type: 'safe' },
      action3: { text: "Give them limited access just to check for viruses", type: 'risky' }
    },
    feedback: {
      correct: "Well done! Tech support scams are extremely common. Legitimate companies never cold-call or ask you to install remote access tools. Always use official websites for support.",
      concept: "Tech Support Scam Awareness: Real support never asks for remote access unsolicited.",
      tips: [
        "Never call tech support numbers from search engine ads",
        "Microsoft and Apple will never ask you to install remote access tools",
        "Scammers create urgency with fake virus counts and warnings",
        "Always navigate directly to official support websites"
      ]
    },
    category: 'scam',
    difficulty: 'beginner',
    xpReward: 125,
    concept: "Tech Support Scam Prevention"
  },
  {
    id: 22,
    title: "The Public Charging Trap",
    character: "Noah Williams",
    description: "Noah's phone is at 5% battery at the airport with hours until his flight.",
    situation: "Noah spots a free charging station at the airport with USB cables already plugged in. A sign says 'Free Fast Charging.' His phone has sensitive work emails and banking apps. He also has a portable battery pack in his bag, but it only has 30% charge left.",
    actions: {
      action1: { text: "Use the free USB cable — it's just charging", type: 'risky' },
      action2: { text: "Use your own portable battery or find an AC outlet for your own charger", type: 'safe' },
      action3: { text: "Use the USB cable but turn off your phone first", type: 'risky' }
    },
    feedback: {
      correct: "Smart choice! 'Juice jacking' uses compromised USB ports to steal data or install malware. Always use your own charger and cable with a regular power outlet.",
      concept: "Juice Jacking Prevention: Never trust public USB charging ports.",
      tips: [
        "Public USB ports can transfer data, not just power",
        "Carry a portable battery pack or your own charging cable",
        "Use AC power outlets with your own adapter when possible",
        "Consider a USB data blocker if you must use public ports"
      ]
    },
    category: 'network',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "Physical Security"
  }
  ,
  {
    id: 23,
    title: "Read the Real Link",
    character: "You",
    description: "Hands-on drill: inspect the actual destination before clicking.",
    situation: "You hover over a 'Reset your password' button in an email. The status bar shows: https://accounts.google.com.secure-login-verify.ru/reset?u=you%40mail.com . The visible text says accounts.google.com.",
    actions: {
      action1: { text: "Read the domain right-to-left: the real host is secure-login-verify.ru — delete the mail", type: 'safe' },
      action2: { text: "It starts with accounts.google.com, so it is genuine — click it", type: 'risky' },
      action3: { text: "Click it but do not type a password, just look at the page", type: 'risky' }
    },
    feedback: {
      correct: "Correct. The real domain is the last two labels before the first single slash. Everything left of it can be faked.",
      concept: "URL Parsing: read domains right-to-left, ignore subdomain padding.",
      tips: [
        "Real host = the part just before the first single '/'",
        "Anything before it (accounts.google.com.) is attacker-controlled text",
        "Long URLs with %40, @ or punycode (xn--) are strong red flags",
        "Type the site yourself instead of clicking"
      ]
    },
    category: 'phishing',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "URL Inspection"
  },
  {
    id: 24,
    title: "The Permission Audit",
    character: "You",
    description: "Practical task: review what an installed app can actually access.",
    situation: "A free flashlight app on your phone requests: Camera, Contacts, Microphone, Precise Location (always), and SMS. You already installed it last month.",
    actions: {
      action1: { text: "Revoke every permission except Camera, then uninstall if the app breaks or nags", type: 'safe' },
      action2: { text: "Leave it — it already works and revoking might break the flashlight", type: 'risky' },
      action3: { text: "Set Location to 'While using' and keep Contacts/SMS on for convenience", type: 'risky' }
    },
    feedback: {
      correct: "Right. Grant only what the core function needs. A flashlight needs the camera flash — nothing else.",
      concept: "Least Privilege on Devices: permissions are data taps, audit them monthly.",
      tips: [
        "Android: Settings > Privacy > Permission manager; iOS: Settings > Privacy & Security",
        "SMS access can read your OTP codes",
        "'Always' location builds a full movement history",
        "Uninstall apps you have not opened in 60 days"
      ]
    },
    category: 'privacy',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "Permission Hygiene"
  },
  {
    id: 25,
    title: "Breach Response in 10 Minutes",
    character: "You",
    description: "Practical drill: your password showed up in a breach dump.",
    situation: "A breach notification says your email and password from a shopping site were leaked in plaintext. You reused a similar password on your email and one bank login. You have 10 minutes before class.",
    actions: {
      action1: { text: "Change the email password first, enable 2FA there, then the bank, then the shop", type: 'safe' },
      action2: { text: "Change the shopping site password — that is where the leak happened", type: 'risky' },
      action3: { text: "Add a '2' to the end of your old password everywhere", type: 'risky' }
    },
    feedback: {
      correct: "Exactly. Email is the master key: it can reset every other account. Secure it first, then financial, then the rest.",
      concept: "Incident Triage: fix accounts in order of blast radius.",
      tips: [
        "Order: email > banking > social > everything else",
        "Also revoke active sessions and app passwords",
        "Password patterns (adding digits) are trivially cracked",
        "Check haveibeenpwned.com for other exposures"
      ]
    },
    category: 'password',
    difficulty: 'expert',
    xpReward: 200,
    concept: "Breach Response"
  },
  {
    id: 26,
    title: "The OTP Call",
    character: "You",
    description: "Live pressure test: someone is on the phone while a code arrives.",
    situation: "Your phone rings: 'Delivery department — we need the 6-digit code we just sent to confirm your parcel.' A real SMS arrives: 'Code 481920. Never share this code. Login attempt from Kyiv.'",
    actions: {
      action1: { text: "Hang up, read the SMS text itself, and change the password for that account", type: 'safe' },
      action2: { text: "Read only the first 3 digits so the parcel isn't cancelled", type: 'risky' },
      action3: { text: "Share the code — the caller already knew your name and address", type: 'risky' }
    },
    feedback: {
      correct: "Correct. The SMS itself told you it was a login attempt, not a delivery. No legitimate service ever asks for your OTP.",
      concept: "Vishing + OTP theft: the code is the last lock — never hand it over.",
      tips: [
        "Always read the OTP message body, not just the digits",
        "Knowing your name/address proves nothing — that data is cheap",
        "Partial codes still help attackers narrow brute-force",
        "Move to app-based or hardware 2FA where possible"
      ]
    },
    category: 'social',
    difficulty: 'expert',
    xpReward: 200,
    concept: "OTP Protection"
  },
  {
    id: 27,
    title: "Wi-Fi Field Check",
    character: "You",
    description: "Practical task: choose and harden a connection at a cafe.",
    situation: "Three networks appear: 'CafeAroma_Guest' (WPA2, password on receipt), 'CafeAroma Free WiFi' (open, strongest signal), 'Free_Public_WiFi' (open). You must submit an assignment with your college login.",
    actions: {
      action1: { text: "Use your phone hotspot, or CafeAroma_Guest with a VPN after confirming the name at the counter", type: 'safe' },
      action2: { text: "Take the strongest open network — HTTPS protects you anyway", type: 'risky' },
      action3: { text: "Use the open network but only after switching to incognito mode", type: 'risky' }
    },
    feedback: {
      correct: "Right. Open networks with lookalike names are classic evil-twin setups. Verify the SSID at the counter, prefer tethering, and tunnel with a VPN.",
      concept: "Evil Twin APs: signal strength means proximity, not legitimacy.",
      tips: [
        "Attackers copy the venue name and boost power to win clients",
        "Incognito hides history locally — it does not encrypt traffic",
        "Turn off auto-join for open networks",
        "A VPN protects DNS and metadata that HTTPS still leaks"
      ]
    },
    category: 'network',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "Safe Connectivity"
  },
  {
    id: 28,
    title: "Verify the Invoice",
    character: "You",
    description: "Practical process drill: money is about to move.",
    situation: "Your club's regular vendor emails an invoice from the usual address, but with new bank details and 'please pay today, our old account is frozen'. Reply-To is set to vendor.accounts@gmail.com.",
    actions: {
      action1: { text: "Call the vendor on the number you already have on file and confirm the change verbally", type: 'safe' },
      action2: { text: "Reply to the email asking them to confirm the new account", type: 'risky' },
      action3: { text: "Pay a small test amount first to check the account works", type: 'risky' }
    },
    feedback: {
      correct: "Correct. Out-of-band verification with a known-good number is the only reliable control against invoice fraud.",
      concept: "Business Email Compromise: verify bank-detail changes on a separate channel.",
      tips: [
        "A mismatched Reply-To is a hijack indicator",
        "Replying just talks to the attacker",
        "Urgency + payment change = fraud pattern",
        "Require two-person approval for account detail changes"
      ]
    },
    category: 'scam',
    difficulty: 'expert',
    xpReward: 200,
    concept: "Payment Verification"
  },
  {
    id: 29,
    title: "The Backup Test",
    character: "You",
    description: "Hands-on: prove your backup actually works before you need it.",
    situation: "Ransomware hits a classmate's laptop. You have cloud sync turned on for your project folder and an external drive that stays plugged in 24/7. You have never restored a file.",
    actions: {
      action1: { text: "Keep one offline copy unplugged plus versioned cloud backup, and restore a test file today", type: 'safe' },
      action2: { text: "Cloud sync is enough — files are always uploaded", type: 'risky' },
      action3: { text: "Rely on the external drive since it copies everything automatically", type: 'risky' }
    },
    feedback: {
      correct: "Right. Ransomware encrypts anything it can write to — including synced folders and always-connected drives. Offline + versioned + tested is the rule.",
      concept: "3-2-1 Backups: 3 copies, 2 media, 1 offline, all tested.",
      tips: [
        "Sync propagates encryption to the cloud copy",
        "Enable file version history so you can roll back",
        "Unplug the external drive between backups",
        "An untested backup is only a hope, not a plan"
      ]
    },
    category: 'malware',
    difficulty: 'intermediate',
    xpReward: 175,
    concept: "Data Recovery"
  },
  {
    id: 30,
    title: "Scan the QR at the Parking Meter",
    character: "You",
    description: "Practical field decision with a physical attack surface.",
    situation: "A QR sticker on the parking meter opens a payment page. Your browser preview shows 'parking-city-pay.co' and the page asks for card number, CVV and your phone's OTP. The sticker edge is slightly peeling over another print.",
    actions: {
      action1: { text: "Stop — a sticker over a sticker plus an unknown domain means quishing; pay at the machine or the official app", type: 'safe' },
      action2: { text: "Pay quickly — the page has the city logo and HTTPS padlock", type: 'risky' },
      action3: { text: "Enter card details but skip the OTP field", type: 'risky' }
    },
    feedback: {
      correct: "Correct. Overlaid QR stickers are a cheap, high-yield attack. Padlocks and logos cost the attacker nothing.",
      concept: "Quishing: verify the physical medium and the domain, not the design.",
      tips: [
        "Check for stickers layered over original print",
        "HTTPS means encrypted, not trustworthy",
        "Legit parking systems never need CVV plus OTP on a random domain",
        "Use the official app or card reader on the machine"
      ]
    },
    category: 'scam',
    difficulty: 'expert',
    xpReward: 200,
    concept: "Physical Phishing"
  }
  ,{
    id: 31,
    title: "Target 2013: The HVAC Vendor Door",
    character: "You (SOC analyst, retail)",
    description: "Based on the 2013 Target breach — 40M cards stolen via a third-party vendor.",
    situation: "An HVAC maintenance contractor asks for remote access to submit invoices. Their account would sit on the same flat network as the store point-of-sale systems. They want it today so billing isn't delayed.",
    actions: {
      action1: { text: "Grant access, but only to an isolated billing portal on a segmented network, with MFA and time-limited credentials", type: 'safe' },
      action2: { text: "Give them a standard vendor account on the corporate network — it's just invoicing", type: 'risky' },
      action3: { text: "Share an existing shared vendor login so nothing new has to be provisioned", type: 'risky' }
    },
    feedback: {
      correct: "Correct. In 2013 attackers stole an HVAC vendor's credentials, pivoted across a flat network and planted RAM-scraping malware on POS terminals — 40M cards and ~$18.5M in settlements.",
      concept: "Third-party risk + network segmentation: a vendor account must never reach payment systems.",
      tips: [
        "Segment payment/OT networks away from corporate and vendor zones",
        "MFA and least privilege on every third-party account",
        "Time-box vendor access and review it quarterly",
        "Monitor east-west traffic, not just the perimeter"
      ]
    },
    category: 'network',
    difficulty: 'expert',
    xpReward: 220,
    concept: "Supply Chain Breach"
  },
  {
    id: 32,
    title: "WannaCry 2017: The Unpatched Ward",
    character: "You (hospital IT)",
    description: "Based on WannaCry, which hit 80 NHS trusts and 200k machines in 150 countries.",
    situation: "A vulnerability in SMBv1 has a patch released two months ago. 300 clinical workstations still run it because 'the imaging software vendor hasn't certified the patch'. Ransomware exploiting it is spreading in the wild today.",
    actions: {
      action1: { text: "Emergency-patch what you can, disable SMBv1, and isolate the rest in a segmented VLAN with blocked port 445 until vendor sign-off", type: 'safe' },
      action2: { text: "Wait for the vendor to certify the patch — breaking clinical software is riskier", type: 'risky' },
      action3: { text: "Rely on the antivirus signature update to catch the worm", type: 'risky' }
    },
    feedback: {
      correct: "Correct. WannaCry spread by worming over SMBv1 with no user action. Compensating controls — disable the protocol, block 445, segment — buy time when patching is blocked.",
      concept: "Patch management: when you can't patch, compensate. Never just wait.",
      tips: [
        "Legacy protocols (SMBv1, Telnet, FTP) should be off by default",
        "Compensating controls: segmentation, firewall rules, allow-listing",
        "Offline, tested backups defeat ransomware extortion",
        "Track vendor certification SLAs contractually"
      ]
    },
    category: 'malware',
    difficulty: 'expert',
    xpReward: 220,
    concept: "Patch & Compensating Controls"
  },
  {
    id: 33,
    title: "Equifax 2017: The Known CVE",
    character: "You (application owner)",
    description: "Based on the Equifax breach — 147M records via an unpatched Apache Struts flaw.",
    situation: "A critical RCE in a web framework your public dispute portal uses was announced 68 days ago. Your asset inventory is incomplete, and the scanner didn't flag this server because its certificate expired so inspection failed silently.",
    actions: {
      action1: { text: "Patch immediately, then fix the root causes: complete asset inventory, alert on scanner/cert failures, and monitor egress for bulk data transfer", type: 'safe' },
      action2: { text: "Patch the server and close the ticket — the gap is handled", type: 'risky' },
      action3: { text: "Put a WAF rule in front of it and schedule patching next quarter", type: 'risky' }
    },
    feedback: {
      correct: "Correct. Equifax patched too late, could not see the asset, and an expired cert blinded inspection for 19 months — 147M records and a $700M settlement.",
      concept: "You cannot protect what you cannot inventory. Silent control failures are breaches waiting to happen.",
      tips: [
        "Maintain an authoritative asset and software inventory (SBOM)",
        "Alert when a security control stops reporting",
        "Critical internet-facing CVEs: patch in days, not quarters",
        "Detect unusual outbound bulk data flows"
      ]
    },
    category: 'network',
    difficulty: 'expert',
    xpReward: 220,
    concept: "Vulnerability Management"
  },
  {
    id: 34,
    title: "Colonial Pipeline 2021: One Legacy VPN",
    character: "You (identity admin, critical infrastructure)",
    description: "Based on the 2021 ransomware shutdown of the largest US fuel pipeline.",
    situation: "An audit finds a decommissioned-but-live VPN account with no MFA, whose password appears in a public breach dump. Turning it off might break an unknown legacy integration.",
    actions: {
      action1: { text: "Disable the account now, force MFA on all remote access, and hunt for prior logins from unfamiliar IPs", type: 'safe' },
      action2: { text: "Rotate the password but leave the account enabled without MFA", type: 'risky' },
      action3: { text: "Leave it until you can prove nothing depends on it", type: 'risky' }
    },
    feedback: {
      correct: "Correct. DarkSide entered Colonial through exactly this: a legacy VPN account with a reused password and no MFA. Fuel supply for the US East Coast stopped for days; $4.4M ransom paid.",
      concept: "Dormant credentials are live attack paths. MFA on every remote access route, no exceptions.",
      tips: [
        "Quarterly review and disable of dormant accounts",
        "Check corporate credentials against breach corpora",
        "MFA is mandatory for VPN, RDP and admin portals",
        "Threat-hunt historic logs after finding an exposed credential"
      ]
    },
    category: 'password',
    difficulty: 'expert',
    xpReward: 220,
    concept: "Credential Hygiene"
  },
  {
    id: 35,
    title: "Twitter 2020: The Helpdesk Call",
    character: "You (internal support agent)",
    description: "Based on the July 2020 Twitter breach — 130 high-profile accounts hijacked via vishing.",
    situation: "A caller says they're from the IT team handling a VPN migration, knows your team lead's name and your shift pattern, and asks you to log into a 'new' internal SSO page they'll send so your access isn't lost.",
    actions: {
      action1: { text: "Hang up, never enter credentials on a link sent to you, and report the call to security via the internal channel", type: 'safe' },
      action2: { text: "Log in — they knew internal details only staff would know", type: 'risky' },
      action3: { text: "Ask a few verification questions, then log in if the answers sound right", type: 'risky' }
    },
    feedback: {
      correct: "Correct. Attackers phoned employees, harvested credentials on a cloned SSO page, reached admin tooling and tweeted a Bitcoin scam from Obama, Musk and Apple accounts.",
      concept: "Vishing: internal knowledge is cheap to gather (LinkedIn, leaks). Never authenticate on an inbound-supplied link.",
      tips: [
        "Call back on a directory number — never a number the caller gives",
        "Phishing-resistant MFA (FIDO2 keys) defeats cloned login pages",
        "Restrict and log admin tooling access",
        "Report social engineering attempts even if you didn't fall for them"
      ]
    },
    category: 'social',
    difficulty: 'expert',
    xpReward: 220,
    concept: "Vishing / Social Engineering"
  },
  {
    id: 36,
    title: "Uber 2022: MFA Fatigue at Midnight",
    character: "You (contractor)",
    description: "Based on the 2022 Uber breach via MFA push bombing plus WhatsApp social engineering.",
    situation: "It's 00:40. Your phone has buzzed with 14 MFA push approvals in ten minutes. A WhatsApp message from 'Uber IT' says the notifications will stop as soon as you accept one.",
    actions: {
      action1: { text: "Deny every prompt, change your password from a known-good device, and report the incident immediately", type: 'safe' },
      action2: { text: "Approve one so you can sleep — it's probably a system glitch", type: 'risky' },
      action3: { text: "Ignore the prompts and deal with it in the morning", type: 'risky' }
    },
    feedback: {
      correct: "Correct. Repeated pushes mean someone already has your password. One accidental approval gave the Uber attacker a VPN foothold, then a PowerShell script with hardcoded admin secrets.",
      concept: "MFA fatigue: an unexpected prompt is an alarm, not an inconvenience.",
      tips: [
        "Use number matching or FIDO2 keys instead of simple push approval",
        "Unrequested MFA prompt = your password is compromised; rotate it",
        "Never trust IT contact over consumer messaging apps",
        "Never hardcode admin secrets in scripts — use a vault"
      ]
    },
    category: 'password',
    difficulty: 'expert',
    xpReward: 220,
    concept: "MFA Fatigue Attack"
  },
  {
    id: 37,
    title: "MGM 2023: The Reset That Cost $100M",
    character: "You (service desk)",
    description: "Based on the 2023 casino breach where attackers social-engineered a password reset.",
    situation: "A caller claiming to be a senior engineer, whose LinkedIn details all check out, says they're locked out before a board demo and needs an MFA reset in the next five minutes.",
    actions: {
      action1: { text: "Follow the identity-proofing process — manager approval or in-band verification — no matter the urgency claimed", type: 'safe' },
      action2: { text: "Reset it; their details match LinkedIn and the demo is critical", type: 'risky' },
      action3: { text: "Reset MFA but leave a note for review tomorrow", type: 'risky' }
    },
    feedback: {
      correct: "Correct. Scattered Spider used a ten-minute helpdesk call to reset MFA at MGM. Slot machines and hotel systems went dark for days; ~$100M impact.",
      concept: "Urgency is the attack. Identity-proofing procedures exist precisely for high-pressure calls.",
      tips: [
        "Require video or manager verification for MFA resets",
        "Publicly available details are not identity proof",
        "Log and randomly audit every reset",
        "Empower staff to say 'no' to executives"
      ]
    },
    category: 'social',
    difficulty: 'expert',
    xpReward: 220,
    concept: "Helpdesk Social Engineering"
  },
  {
    id: 38,
    title: "SolarWinds 2020: The Signed Update",
    character: "You (platform engineer)",
    description: "Based on the SUNBURST supply-chain compromise affecting ~18,000 organisations.",
    situation: "A monitoring agent with domain-wide privileges pushes a signed auto-update. Afterwards it starts making DNS requests to a domain it has never contacted, on a 12-day delay.",
    actions: {
      action1: { text: "Treat the anomalous egress as an incident: isolate, verify build provenance, and restrict the agent's privileges and outbound destinations", type: 'safe' },
      action2: { text: "Ignore it — the update is digitally signed by the vendor", type: 'risky' },
      action3: { text: "Whitelist the new domain so monitoring alerts stop firing", type: 'risky' }
    },
    feedback: {
      correct: "Correct. SUNBURST was signed, legitimate-looking, and dormant for two weeks before beaconing. Trusted software can be the intrusion.",
      concept: "Zero trust for software: signature proves origin, not safety. Behaviour monitoring catches what signatures miss.",
      tips: [
        "Baseline normal egress per application; alert on new destinations",
        "Least privilege for management agents",
        "Require build provenance / SBOM from vendors",
        "Stage vendor updates before fleet-wide rollout"
      ]
    },
    category: 'malware',
    difficulty: 'expert',
    xpReward: 240,
    concept: "Supply Chain / Zero Trust"
  },
  {
    id: 39,
    title: "Marriott: Four Years Undetected",
    character: "You (data governance lead)",
    description: "Based on the Starwood/Marriott breach — 339M guest records, exposed for ~4 years.",
    situation: "You're acquiring a company. Due diligence budget is tight and the deal team wants to merge networks on day one to save cost. Nobody has run a compromise assessment on the target.",
    actions: {
      action1: { text: "Require a compromise assessment and keep the networks separate until the target's environment is validated", type: 'safe' },
      action2: { text: "Merge immediately — integration delays cost more than the risk", type: 'risky' },
      action3: { text: "Merge, but run a vulnerability scan sometime after cutover", type: 'risky' }
    },
    feedback: {
      correct: "Correct. Marriott inherited an already-compromised Starwood environment; intruders sat undetected for years. The UK ICO fined Marriott £18.4M.",
      concept: "M&A cyber due diligence: you inherit the acquired company's intruders along with its assets.",
      tips: [
        "Compromise assessment before network integration",
        "Encrypt and minimise stored personal data — including passport numbers",
        "Regulators judge detection time, not just prevention",
        "Set a breach-notification clock: GDPR gives 72 hours"
      ]
    },
    category: 'privacy',
    difficulty: 'expert',
    xpReward: 220,
    concept: "M&A Cyber Due Diligence"
  },
  {
    id: 40,
    title: "Log4Shell: The Line in the Logs",
    character: "You (incident responder)",
    description: "Based on CVE-2021-44228, a trivially exploitable RCE in a ubiquitous logging library.",
    situation: "A critical RCE lands in a logging library embedded deep inside dozens of your apps and appliances. Exploit strings are already appearing in your web logs, and you can't tell which systems bundle the library.",
    actions: {
      action1: { text: "Build an SBOM-driven inventory, patch or mitigate by exposure order, block outbound LDAP/RMI egress, and hunt for exploit strings in logs", type: 'safe' },
      action2: { text: "Wait for each vendor to publish a patched release before doing anything", type: 'risky' },
      action3: { text: "Only patch your own code — third-party appliances are the vendor's problem", type: 'risky' }
    },
    feedback: {
      correct: "Correct. Log4Shell was exploitable with a single crafted string. Egress blocking of LDAP/RMI stopped the callback stage while inventory and patching caught up.",
      concept: "Dependency risk: your attack surface includes every library your suppliers ship.",
      tips: [
        "Maintain SBOMs for internal and vendor software",
        "Restrict outbound connections from servers by default",
        "Prioritise internet-facing systems first",
        "Assume exploitation and hunt, don't just patch"
      ]
    },
    category: 'malware',
    difficulty: 'expert',
    xpReward: 240,
    concept: "Dependency / SBOM Risk"
  },
  {
    id: 41,
    title: "Cert Check: The CIA Triad",
    character: "Exam Mode",
    description: "Certification-style question (Security+ / CC domain: security concepts).",
    situation: "A ransomware attack encrypts a hospital's patient records. Staff cannot open any files, but investigators confirm no data was copied out and no records were altered. Which element of the CIA triad was primarily impacted?",
    actions: {
      action1: { text: "Availability — the data exists and is intact but cannot be accessed when needed", type: 'safe' },
      action2: { text: "Confidentiality — ransomware is by definition a data-disclosure event", type: 'risky' },
      action3: { text: "Integrity — encryption changes the bytes, so the data was modified", type: 'risky' }
    },
    feedback: {
      correct: "Availability. No exfiltration means confidentiality held; reversible encryption with a valid backup means integrity is recoverable. The loss is timely access.",
      concept: "CIA triad: Confidentiality = disclosure, Integrity = unauthorised change, Availability = access when needed.",
      tips: [
        "Double-extortion ransomware also breaks confidentiality — check for exfiltration",
        "Backups and redundancy are availability controls",
        "Hashing and digital signatures protect integrity",
        "Encryption and access control protect confidentiality"
      ]
    },
    category: 'network',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "CIA Triad"
  },
  {
    id: 42,
    title: "Cert Check: Risk Treatment",
    character: "Exam Mode",
    description: "Certification-style question (risk management domain).",
    situation: "A company assesses a risk with a potential annual loss of $50,000. The control costs $70,000 a year. Instead, they buy a cyber-insurance policy covering the loss. Which risk-treatment strategy is this?",
    actions: {
      action1: { text: "Risk transference — the financial impact is shifted to a third party", type: 'safe' },
      action2: { text: "Risk avoidance — the loss will no longer occur", type: 'risky' },
      action3: { text: "Risk mitigation — insurance reduces the likelihood of the event", type: 'risky' }
    },
    feedback: {
      correct: "Transference. Insurance moves financial consequence to another party; it does not reduce likelihood, and the risk still exists.",
      concept: "Four treatments: Avoid (stop the activity), Mitigate (reduce), Transfer (insure/outsource), Accept (document and monitor).",
      tips: [
        "ALE = SLE x ARO; never spend more on a control than the ALE",
        "Insurance rarely covers reputational damage or regulatory fines",
        "Accepted risk must be formally signed off by the risk owner",
        "Residual risk is what remains after treatment"
      ]
    },
    category: 'network',
    difficulty: 'intermediate',
    xpReward: 150,
    concept: "Risk Management"
  },
  {
    id: 43,
    title: "Cert Check: Incident Response Order",
    character: "Exam Mode",
    description: "Certification-style question (NIST SP 800-61 incident response lifecycle).",
    situation: "Malware is confirmed active on a finance workstation and is beaconing out. Following the standard incident-response lifecycle, what is the correct next action?",
    actions: {
      action1: { text: "Contain — isolate the host from the network while preserving volatile evidence, then eradicate and recover", type: 'safe' },
      action2: { text: "Power the machine off immediately to stop the malware", type: 'risky' },
      action3: { text: "Reimage the machine right away to restore the user's productivity", type: 'risky' }
    },
    feedback: {
      correct: "Containment comes after detection and before eradication. Pulling power destroys memory-resident evidence; reimaging first destroys the whole investigation.",
      concept: "Lifecycle: Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-incident (lessons learned).",
      tips: [
        "Network-isolate rather than power off, to keep RAM artefacts",
        "Maintain chain of custody for anything that may go legal",
        "Eradicate root cause, not just the visible payload",
        "Lessons-learned within two weeks while memory is fresh"
      ]
    },
    category: 'malware',
    difficulty: 'intermediate',
    xpReward: 160,
    concept: "Incident Response"
  },
  {
    id: 44,
    title: "Cert Check: Symmetric or Asymmetric?",
    character: "Exam Mode",
    description: "Certification-style question (cryptography domain).",
    situation: "You must send a 4 GB encrypted archive to a partner you've never exchanged keys with, and prove that it came from you. Which approach is correct?",
    actions: {
      action1: { text: "Encrypt the file with a symmetric key (AES), encrypt that key with the partner's public key, and sign the hash with your private key", type: 'safe' },
      action2: { text: "Encrypt the whole 4 GB file with the partner's public RSA key", type: 'risky' },
      action3: { text: "Email an AES key first, then send the encrypted file separately", type: 'risky' }
    },
    feedback: {
      correct: "That is hybrid (envelope) encryption — symmetric for bulk speed, asymmetric for key exchange, signature for non-repudiation.",
      concept: "Asymmetric crypto is slow and size-limited; it exchanges keys and signs. Symmetric crypto does the bulk work.",
      tips: [
        "Encrypt with the recipient's public key; sign with your private key",
        "Signing a hash gives integrity, authenticity and non-repudiation",
        "Never transmit a key over the same channel as the data",
        "Prefer AES-256-GCM (authenticated encryption) over raw AES-CBC"
      ]
    },
    category: 'privacy',
    difficulty: 'expert',
    xpReward: 180,
    concept: "Cryptography Fundamentals"
  },
  {
    id: 45,
    title: "Cert Check: Access Control Model",
    character: "Exam Mode",
    description: "Certification-style question (identity and access management domain).",
    situation: "A hospital wants access decided by clearance and data labels enforced by the system, where users cannot re-share files they can read. Which access-control model applies?",
    actions: {
      action1: { text: "Mandatory Access Control (MAC) — the system enforces labels and clearances; owners cannot delegate", type: 'safe' },
      action2: { text: "Discretionary Access Control (DAC) — the file owner decides who else may read it", type: 'risky' },
      action3: { text: "Role-Based Access Control (RBAC) — permissions attach to job roles", type: 'risky' }
    },
    feedback: {
      correct: "MAC. The system, not the data owner, enforces the decision, which is exactly what 'cannot re-share' requires.",
      concept: "DAC = owner decides. MAC = system labels decide. RBAC = role decides. ABAC = attributes/context decide.",
      tips: [
        "RBAC is the most common enterprise model — clean and auditable",
        "ABAC adds context: device, location, time, risk score",
        "Least privilege and separation of duties apply to every model",
        "Recertify access quarterly to fight privilege creep"
      ]
    },
    category: 'privacy',
    difficulty: 'intermediate',
    xpReward: 160,
    concept: "Access Control Models"
  },
  {
    id: 46,
    title: "Cert Check: Reading a Vulnerability Report",
    character: "Exam Mode",
    description: "Certification-style question (security operations / vulnerability management).",
    situation: "A scanner reports 'Critical: Apache 2.2 remote code execution' on a host. Investigation shows the host runs a patched Apache 2.4 and the version banner is stale. How do you classify and handle this?",
    actions: {
      action1: { text: "False positive — validate, document the evidence, tune the scanner signature, and keep the finding auditable", type: 'safe' },
      action2: { text: "True positive — the scanner is authoritative, so schedule emergency patching", type: 'risky' },
      action3: { text: "Delete the finding so it stops appearing in reports", type: 'risky' }
    },
    feedback: {
      correct: "False positive. Banner-based detection is unauthenticated guesswork; validate against the actual package version, then tune — but never silently delete evidence.",
      concept: "False positive = alert with no real issue. False negative = the dangerous one: a real issue with no alert.",
      tips: [
        "Authenticated scans dramatically cut false positives",
        "Document validation so auditors can follow the decision",
        "Prioritise with CVSS plus exploitability and asset value",
        "Track false-negative risk with penetration testing"
      ]
    },
    category: 'network',
    difficulty: 'expert',
    xpReward: 180,
    concept: "Vulnerability Triage"
  }
];
