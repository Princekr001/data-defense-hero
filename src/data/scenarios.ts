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
    explanation: "Smart move! Alex avoided a phishing trap. Real banks never ask for verification via email links. Always contact financial institutions directly through official channels."
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
    explanation: "Excellent choice! Alex protected their account with a strong password. Personal information like birthdays are easy for hackers to guess. Password managers make strong passwords simple to use."
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
    explanation: "Well done! Alex avoided a potential catfish or scammer. Fake profiles often have few photos, recent creation dates, and limited connections. Always verify someone's identity before connecting."
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
    explanation: "Perfect decision! Alex protected their financial information. Public Wi-Fi networks are hunting grounds for cybercriminals who can intercept banking details. Sensitive transactions should only happen on secure, private networks."
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
    explanation: "Brilliant choice! Alex avoided a malware trap. 'Free' apps from unofficial sources often contain viruses, spyware, or steal personal data. The small cost of official apps is worth the security and peace of mind."
  }
];