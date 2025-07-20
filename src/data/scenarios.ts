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
    title: "Suspicious Email Alert",
    description: "You receive an urgent email claiming to be from your bank, asking you to click a link to 'verify your account immediately' due to suspicious activity. The email looks official but has some spelling mistakes.",
    choices: {
      secure: "Ignore the email and log into your bank's official website directly",
      surrender: "Click the link to verify your account quickly"
    },
    correctChoice: 'secure',
    explanation: "Always verify suspicious emails by contacting your bank directly or visiting their official website. Phishing emails often contain urgent language and spelling errors to trick you into clicking malicious links."
  },
  {
    id: 2,
    title: "Password Power",
    description: "You're creating a new account for an important online service. You need to choose a password that you'll remember easily but also keeps your account safe.",
    choices: {
      secure: "Create a strong password like 'Tr@il$2024#Safe!' with letters, numbers, and symbols",
      surrender: "Use 'password123' because it's simple and easy to remember"
    },
    correctChoice: 'secure',
    explanation: "Strong passwords with a mix of uppercase, lowercase, numbers, and symbols are much harder to crack. Weak passwords like 'password123' can be guessed in seconds by hackers."
  },
  {
    id: 3,
    title: "Social Media Stranger",
    description: "While gaming online, someone you don't know sends you a friend request and starts asking personal questions like where you live and what school you attend. They seem friendly and claim to be your age.",
    choices: {
      secure: "Don't accept the request and avoid sharing personal information",
      surrender: "Accept the request and share details since they seem nice"
    },
    correctChoice: 'secure',
    explanation: "Never share personal information with strangers online, even if they seem friendly. Predators often pose as teenagers to gain trust and gather information that could be used to harm you."
  },
  {
    id: 4,
    title: "Public WiFi Dilemma",
    description: "You're at a coffee shop and need to check your bank account balance urgently. The free WiFi network 'CoffeeShop_Guest' is available, but it's not password-protected.",
    choices: {
      secure: "Wait until you get home or use your mobile data instead",
      surrender: "Connect to the free WiFi and check your bank account"
    },
    correctChoice: 'secure',
    explanation: "Public WiFi networks are not secure and can be easily monitored by hackers. Never access sensitive accounts like banking on public WiFi. Use your mobile data or wait for a secure connection."
  },
  {
    id: 5,
    title: "Download Decision",
    description: "You want to download a popular mobile game, but instead of getting it from the official app store, you found a website offering it for free with 'premium features unlocked.' The site looks a bit sketchy but the game is expensive in the store.",
    choices: {
      secure: "Download from the official app store and pay for the legitimate version",
      surrender: "Download the free version from the sketchy website"
    },
    correctChoice: 'secure',
    explanation: "Always download apps from official sources like Google Play Store or Apple App Store. Third-party websites often bundle malware with 'free' apps that can steal your data or damage your device."
  }
];