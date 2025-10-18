export interface Resource {
  privacyPoints: number;
  trustCrystals: number;
  connections: number;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
}

export interface Choice {
  id: string;
  text: string;
  consequence: {
    resources: Partial<Resource>;
    outcomeText: string;
    unlocksAbility?: string;
    triggersEvent?: string;
    clueReward?: string;
  };
}

export interface Mission {
  id: number;
  title: string;
  district: 'social' | 'app' | 'memory' | 'guardian' | 'shadow';
  districtName: string;
  storyText: string;
  dilemma: string;
  characters: string[];
  choices: Choice[];
  learningTakeaway: string;
  clueReward?: string;
}

export const districts = {
  social: {
    name: "Social Square",
    description: "Where connections are made",
    color: "from-blue-500 to-cyan-500",
    icon: "Users"
  },
  app: {
    name: "App Arcade",
    description: "Download zone with apps",
    color: "from-purple-500 to-pink-500",
    icon: "Smartphone"
  },
  memory: {
    name: "Memory Market",
    description: "Where personal data is traded",
    color: "from-orange-500 to-red-500",
    icon: "Database"
  },
  guardian: {
    name: "Guardian's Gate",
    description: "Privacy protection HQ",
    color: "from-green-500 to-emerald-500",
    icon: "Shield"
  },
  shadow: {
    name: "Shadow Net",
    description: "Where scammers lurk",
    color: "from-gray-700 to-gray-900",
    icon: "Eye"
  }
};

export const characters: Character[] = [
  {
    id: "cipher",
    name: "Cipher",
    role: "AI Guide",
    avatar: "🤖",
    description: "A friendly hologram who explains city rules"
  },
  {
    id: "mayor",
    name: "Mayor Secure",
    role: "City Leader",
    avatar: "👔",
    description: "Champions privacy rights"
  },
  {
    id: "flash",
    name: "Flash",
    role: "Influencer",
    avatar: "⚡",
    description: "A fast-talking influencer who overshares"
  },
  {
    id: "lock",
    name: "Lock",
    role: "Guardian Twin",
    avatar: "🔒",
    description: "Runs Guardian's Gate with Key"
  },
  {
    id: "key",
    name: "Key",
    role: "Guardian Twin",
    avatar: "🔑",
    description: "Runs Guardian's Gate with Lock"
  },
  {
    id: "phantom",
    name: "The Phantom",
    role: "Mysterious Figure",
    avatar: "👻",
    description: "Behind the data leaks"
  },
  {
    id: "max",
    name: "Max",
    role: "New Friend",
    avatar: "😊",
    description: "Your new friend in the city"
  }
];

export const missions: Mission[] = [
  {
    id: 1,
    title: "The Friend Request Flood",
    district: "social",
    districtName: "Social Square",
    storyText: "You arrive in Cipher City and immediately get 20 friend requests from residents you've never met. The holographic profiles float around you, each one promising friendship and connections.",
    dilemma: "Flash the influencer approaches you with a dazzling smile: 'Hey newbie! Accept everyone and share your welcome package with me! I'll make you popular instantly! Your address, interests, family info - it's all just data, right?'",
    characters: ["cipher", "flash"],
    choices: [
      {
        id: "accept_all",
        text: "Accept all 20 requests and share your info with Flash",
        consequence: {
          resources: { privacyPoints: -30, trustCrystals: 5, connections: 20 },
          outcomeText: "Within minutes, clones of you appear around the city making fake posts and scam offers. The Phantom has stolen your data! Your Privacy Points drop severely. Flash laughs and disappears into the crowd.",
          triggersEvent: "phantom_clone_attack"
        }
      },
      {
        id: "verify_first",
        text: "Only accept people you've actually met in person",
        consequence: {
          resources: { privacyPoints: 20, trustCrystals: 15, connections: 3 },
          outcomeText: "Smart choice! You carefully verify each request, accepting only genuine residents you've spoken with. Cipher appears: 'Excellent! You've shown wisdom. Here's your reward.' You gain Trust Crystals and help other residents identify fake profiles.",
          unlocksAbility: "Detective Vision"
        }
      },
      {
        id: "check_profiles",
        text: "Check profiles carefully and ask mutual friends first",
        consequence: {
          resources: { privacyPoints: 30, trustCrystals: 25, connections: 8 },
          outcomeText: "Brilliant detective work! You thoroughly investigate each profile, finding that 15 of the 20 requests are fake accounts controlled by The Phantom. You unlock 'Detective Vision' - the ability to see suspicious profiles glowing red. Lock and Key commend your caution.",
          unlocksAbility: "Detective Vision",
          clueReward: "Phantom uses mass friend requests"
        }
      }
    ],
    learningTakeaway: "In Cipher City, real friends don't rush you. Take time to verify before connecting."
  },
  {
    id: 2,
    title: "The App Arcade Trap",
    district: "app",
    districtName: "App Arcade",
    storyText: "The App Arcade glows with neon lights and promises of amazing tools. You need a photo editor to create your Trust Badge - an important symbol of your reputation in Cipher City.",
    dilemma: "Three shops offer apps: SnapMagic from the official store (costs 5 Trust Crystals), InstaPro from a suspicious website (free! promises premium features!), and PicPower (recommended by Lock & Key). Which do you choose?",
    characters: ["cipher", "lock", "key"],
    choices: [
      {
        id: "instapro",
        text: "Download InstaPro - it's free and has premium features!",
        consequence: {
          resources: { privacyPoints: -40, trustCrystals: -10, connections: -5 },
          outcomeText: "ERROR! Your phone glitches violently! InstaPro was malware created by The Phantom! All your photos vanish, and The Phantom gains access to your account. Your private messages are displayed publicly in Social Square. Mayor Secure helps you recover, but the damage is done.",
          triggersEvent: "malware_infection"
        }
      },
      {
        id: "snapmagic",
        text: "Buy SnapMagic from the official store",
        consequence: {
          resources: { privacyPoints: 10, trustCrystals: -5, connections: 0 },
          outcomeText: "A safe choice! SnapMagic works perfectly and protects your data. It cost Trust Crystals, but your photos and privacy remain secure. Cipher nods approvingly: 'Official sources may cost more, but they protect what matters.'"
        }
      },
      {
        id: "picpower",
        text: "Use PicPower recommended by Lock & Key",
        consequence: {
          resources: { privacyPoints: 20, trustCrystals: 10, connections: 5 },
          outcomeText: "Excellent! PicPower is safe, recommended by trusted friends, and works beautifully. Lock and Key smile: 'Trust networks matter! We only recommend verified apps.' You earn bonus Connection points for trusting your friends' advice.",
          unlocksAbility: "Trusted Network",
          clueReward: "The Phantom spreads fake apps"
        }
      }
    ],
    learningTakeaway: "Free isn't always better. Official sources and trusted recommendations protect your digital treasures."
  },
  {
    id: 3,
    title: "The Password Pact",
    district: "memory",
    districtName: "Memory Market",
    storyText: "You're exploring Memory Market, where residents access different city zones. Your new friend Max rushes up to you, looking stressed.",
    dilemma: "Max: 'Hey! I forgot something at Guardian's Gate but I'm locked out of my account. Can I borrow your password? Just for a minute! Everyone shares passwords with close friends here. We trust each other, right?'",
    characters: ["max", "cipher", "lock"],
    choices: [
      {
        id: "share_password",
        text: "Give Max your Guardian's Gate password",
        consequence: {
          resources: { privacyPoints: -50, trustCrystals: -20, connections: -10 },
          outcomeText: "SECURITY BREACH! Max's account was already compromised by The Phantom, who now has YOUR password too! Both accounts spread fake news and scam messages. The city's trust in you plummets. Lock and Key help you recover, but explain: 'Sharing passwords endangers everyone, even with good intentions.'",
          triggersEvent: "account_compromise"
        }
      },
      {
        id: "get_item",
        text: "Offer to get the item yourself",
        consequence: {
          resources: { privacyPoints: 20, trustCrystals: 15, connections: 10 },
          outcomeText: "Max sighs with relief: 'You're right, that makes more sense!' You retrieve the item safely, maintaining both accounts' security. Cipher appears: 'You protected both of you! Teaching boundaries to friends makes friendships stronger.' You've shown Max how to be safer.",
          unlocksAbility: "Security Mentor"
        }
      },
      {
        id: "help_reset",
        text: "Suggest Max reset their own access at Guardian's Gate",
        consequence: {
          resources: { privacyPoints: 30, trustCrystals: 25, connections: 15 },
          outcomeText: "Perfect solution! You walk Max to Guardian's Gate where Lock and Key help them reset their access properly. While there, you notice suspicious activity on Max's account - The Phantom tried to hack it! You've caught a crucial clue and earned the 'Security Mentor' badge. Max is grateful you protected them.",
          unlocksAbility: "Security Mentor",
          clueReward: "The Phantom targets password sharing"
        }
      }
    ],
    learningTakeaway: "Even best friends protect each other by keeping passwords private."
  },
  {
    id: 4,
    title: "The Photo Parade Panic",
    district: "social",
    districtName: "Social Square (Cipher Festival)",
    storyText: "The annual Cipher Festival fills Social Square with music, lights, and celebration! Citizens dance and celebrate privacy awareness. You're having fun when suddenly...",
    dilemma: "Someone takes your photo and posts it without asking! The post tags your exact location, your school district, and your daily schedule. Comments flood in, including suspicious ones: 'What time do you usually leave?', 'Do you live alone?', 'Nice place - what's the address?'",
    characters: ["cipher", "mayor", "phantom"],
    choices: [
      {
        id: "comment_angrily",
        text: "Comment angrily on the post calling them out",
        consequence: {
          resources: { privacyPoints: -10, trustCrystals: -15, connections: -20 },
          outcomeText: "Your angry comment starts a huge argument in the comments! The drama attracts more attention to the post, spreading your information further. The Phantom's bots amplify the conflict. Mayor Secure intervenes: 'Anger spreads problems faster than solutions. Let's handle this properly.' You lose Connection points from the public confrontation."
        }
      },
      {
        id: "report_message",
        text: "Report the post and message the person privately",
        consequence: {
          resources: { privacyPoints: 30, trustCrystals: 30, connections: 20 },
          outcomeText: "Perfect approach! You calmly report the post to city authorities and message the photographer privately. They apologize immediately: 'I'm so sorry! I didn't realize I tagged your personal info. I'll never post without asking again!' The post is removed. Mayor Secure awards you the 'Privacy Advocate' badge. Now you can help other residents with similar issues!",
          unlocksAbility: "Privacy Advocate",
          clueReward: "The Phantom exploits photo metadata"
        }
      },
      {
        id: "do_nothing",
        text: "Do nothing, hoping it disappears on its own",
        consequence: {
          resources: { privacyPoints: -30, trustCrystals: -10, connections: 0 },
          outcomeText: "By ignoring it, the post stays up for days. The Phantom collects all your data from the post - your patterns, schedule, and location. Days later, you receive targeted scam attempts using this information. Cipher warns: 'Inaction allows problems to grow. Always protect your digital presence.'"
        }
      }
    ],
    learningTakeaway: "Your image is yours to share. Always ask permission before posting photos of others, and speak up when yours are shared without consent."
  }
];

export const initialResources: Resource = {
  privacyPoints: 100,
  trustCrystals: 10,
  connections: 0
};

export const abilities = {
  "Detective Vision": {
    name: "Detective Vision",
    description: "See suspicious profiles and activities highlighted in red",
    icon: "Eye"
  },
  "Trusted Network": {
    name: "Trusted Network",
    description: "Access verified apps and resources recommended by friends",
    icon: "Users"
  },
  "Security Mentor": {
    name: "Security Mentor",
    description: "Help other residents improve their privacy practices",
    icon: "GraduationCap"
  },
  "Privacy Advocate": {
    name: "Privacy Advocate",
    description: "Assist residents with consent and photo sharing issues",
    icon: "Shield"
  }
};
