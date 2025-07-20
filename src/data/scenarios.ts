export interface Scenario {
  id: number;
  title: string;
  description: string;
  choices: {
    secure: string;
    surrender: string;
  };
  correctChoice: 'secure' | 'surrender';
  explanation: string;
  category: 'phishing' | 'password' | 'social' | 'network' | 'malware' | 'privacy' | 'scam' | 'gaming';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const gameScenarios: Scenario[] = [
  {
    id: 1,
    title: "The Mysterious Email",
    description: "Alex receives an urgent email that appears to be from their bank. The message says 'Your account will be suspended in 24 hours unless you verify your details immediately!' The email looks official with the bank's logo, but something feels off about the sender's address...",
    choices: {
      secure: "Alex contacts the bank directly using the official phone number to verify",
      surrender: "Alex clicks the link in the email to quickly 'verify' the account"
    },
    correctChoice: 'secure',
    explanation: "Smart move! Alex avoided a phishing trap. Real banks never ask for verification via email links. Always contact financial institutions directly through official channels.",
    category: 'phishing',
    difficulty: 'easy'
  },
  {
    id: 2,
    title: "The Password Dilemma",
    description: "Alex is signing up for a new social media account and needs to create a password. The app suggests using a complex password, but Alex is tempted to use something simple like their birthday '12031995' because it's easy to remember and they're in a hurry...",
    choices: {
      secure: "Alex creates a strong, unique password using a password manager",
      surrender: "Alex uses their birthday - it's quick and easy to remember"
    },
    correctChoice: 'secure',
    explanation: "Excellent choice! Alex protected their account with a strong password. Personal information like birthdays are easy for hackers to guess. Password managers make strong passwords simple to use.",
    category: 'password',
    difficulty: 'easy'
  },
  {
    id: 3,
    title: "The Mysterious Friend Request",
    description: "While scrolling through social media, Alex receives a friend request from someone named 'Jamie Wilson' who claims to go to their school. The profile has only 3 photos, 12 friends, and was created just last week. The person is messaging: 'Hey! I think we have mutual friends!'",
    choices: {
      secure: "Alex ignores the request and reports the suspicious profile",
      surrender: "Alex accepts the request and starts chatting with this 'classmate'"
    },
    correctChoice: 'secure',
    explanation: "Well done! Alex avoided a potential catfish or scammer. Fake profiles often have few photos, recent creation dates, and limited connections. Always verify someone's identity before connecting.",
    category: 'social',
    difficulty: 'medium'
  },
  {
    id: 4,
    title: "The Coffee Shop Dilemma",
    description: "Alex is at a bustling coffee shop and suddenly remembers they need to transfer money to a friend today. Their phone shows only 2% mobile data remaining. The coffee shop offers free Wi-Fi called 'CoffeeShop_FREE' with no password required. Alex opens their banking app...",
    choices: {
      secure: "Alex waits until getting home or uses the remaining mobile data carefully",
      surrender: "Alex connects to the free Wi-Fi and completes the bank transfer"
    },
    correctChoice: 'secure',
    explanation: "Perfect decision! Alex protected their financial information. Public Wi-Fi networks are hunting grounds for cybercriminals who can intercept banking details. Sensitive transactions should only happen on secure, private networks.",
    category: 'network',
    difficulty: 'medium'
  },
  {
    id: 5,
    title: "The Free Game Trap",
    description: "Alex really wants to play 'CyberRunner Pro,' a popular game that costs $4.99 in the official app store. While searching online, Alex discovers a website offering the exact same game for free download. The site says 'Skip the app store fees!' and the download button is flashing temptingly...",
    choices: {
      secure: "Alex saves up and buys the official version from the app store",
      surrender: "Alex downloads the free version from the unofficial website"
    },
    correctChoice: 'secure',
    explanation: "Brilliant choice! Alex avoided a malware trap. 'Free' apps from unofficial sources often contain viruses, spyware, or steal personal data. The small cost of official apps is worth the security and peace of mind.",
    category: 'malware',
    difficulty: 'easy'
  },
  {
    id: 6,
    title: "The Crypto Fortune",
    description: "While watching YouTube, Alex sees an ad featuring a famous celebrity claiming they made millions from a new cryptocurrency investment. The ad says 'Join now with just $50 and become a millionaire in 30 days!' There's a countdown timer showing only 2 hours left to join this 'exclusive opportunity'...",
    choices: {
      secure: "Alex researches the investment thoroughly and recognizes it as a scam",
      surrender: "Alex quickly sends $50 before the 'limited time offer' expires"
    },
    correctChoice: 'secure',
    explanation: "Excellent critical thinking! Alex avoided a cryptocurrency scam. Real investments never guarantee massive returns overnight, and legitimate opportunities don't use celebrity endorsements or pressure tactics.",
    category: 'scam',
    difficulty: 'medium'
  },
  {
    id: 7,
    title: "The Privacy Settings Puzzle",
    description: "Alex just installed a new photo editing app that's trending on social media. During setup, the app requests permission to access contacts, location, microphone, camera, and all photos. The app says these permissions are 'necessary for the best experience' but Alex only wants to edit a few vacation photos...",
    choices: {
      secure: "Alex denies unnecessary permissions and only grants access to photos",
      surrender: "Alex grants all permissions to get the 'full experience'"
    },
    correctChoice: 'secure',
    explanation: "Smart privacy protection! Alex limited data exposure by only granting necessary permissions. Apps often request excessive permissions to collect user data for advertising or other purposes.",
    category: 'privacy',
    difficulty: 'hard'
  },
  {
    id: 8,
    title: "The Gaming Tournament Invitation",
    description: "Alex receives a Discord message from someone claiming to be a tournament organizer: 'Congratulations! You've been selected for our exclusive $10,000 gaming tournament! Click this link to claim your spot and download our special tournament client.' The message includes an official-looking logo and website link...",
    choices: {
      secure: "Alex ignores the message and reports it as spam",
      surrender: "Alex clicks the link and downloads the 'tournament client'"
    },
    correctChoice: 'secure',
    explanation: "Great instincts! Alex avoided a gaming-targeted malware attack. Legitimate tournaments don't randomly select players via DM, and suspicious downloads often contain keyloggers or account stealers.",
    category: 'gaming',
    difficulty: 'hard'
  },
  {
    id: 9,
    title: "The Emergency Tech Support",
    description: "Alex's computer suddenly displays a pop-up warning: 'CRITICAL SECURITY ALERT! Your computer is infected with 5 viruses! Call Microsoft Support immediately at 1-800-HELP-NOW or your data will be permanently deleted in 10 minutes!' The pop-up is flashing red and won't close easily...",
    choices: {
      secure: "Alex forces the browser closed and runs legitimate antivirus software",
      surrender: "Alex panics and calls the number to get 'immediate help'"
    },
    correctChoice: 'secure',
    explanation: "Perfect response! Alex avoided a tech support scam. Real security companies never use pop-up warnings or pressure tactics. These scams trick users into paying for fake fixes or installing malware.",
    category: 'scam',
    difficulty: 'medium'
  },
  {
    id: 10,
    title: "The Smart Home Setup",
    description: "Alex is setting up a new smart doorbell camera at home. The default login is 'admin/admin' and the setup wizard asks if they want to change it. Alex is excited to start using the camera and thinks 'I'll change it later when I have more time.' The current password works fine for testing...",
    choices: {
      secure: "Alex immediately changes the default password to something strong and unique",
      surrender: "Alex skips the password change to start using the camera right away"
    },
    correctChoice: 'secure',
    explanation: "Excellent security hygiene! Alex protected their home network. Default passwords on IoT devices are publicly known and create easy entry points for hackers to access home networks and spy on families.",
    category: 'network',
    difficulty: 'hard'
  }
];