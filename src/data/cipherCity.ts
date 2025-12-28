export interface Resource {
  privacyPoints: number;
  trustCrystals: number;
  connections: number;
  reputation: number;
  knowledge: number;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  trustLevel: number;
  dialogue: string[];
}

export interface DialogueLine {
  speaker: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'worried' | 'angry' | 'mysterious';
}

export interface Choice {
  id: string;
  text: string;
  requiredAbility?: string;
  requiredReputation?: number;
  consequence: {
    resources: Partial<Resource>;
    outcomeText: string;
    unlocksAbility?: string;
    triggersEvent?: string;
    clueReward?: string;
    characterReaction?: { characterId: string; trustChange: number };
  };
}

export interface Evidence {
  id: string;
  name: string;
  description: string;
  icon: string;
  missionId: number;
}

export interface Investigation {
  id: string;
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
}

export interface Mission {
  id: number;
  title: string;
  district: 'social' | 'app' | 'memory' | 'guardian' | 'shadow';
  districtName: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  storyText: string;
  dialogue: DialogueLine[];
  dilemma: string;
  characters: string[];
  choices: Choice[];
  learningTakeaway: string;
  clueReward?: string;
  investigation?: Investigation;
  timeLimit?: number;
  bonusObjective?: { description: string; reward: Partial<Resource> };
}

export const districts = {
  social: {
    name: "Social Square",
    description: "The bustling heart of connections and friendships",
    color: "from-blue-500 to-cyan-500",
    icon: "Users",
    dangerLevel: 2
  },
  app: {
    name: "App Arcade",
    description: "Neon-lit marketplace of digital tools and traps",
    color: "from-purple-500 to-pink-500",
    icon: "Smartphone",
    dangerLevel: 3
  },
  memory: {
    name: "Memory Market",
    description: "Where personal data flows like currency",
    color: "from-orange-500 to-red-500",
    icon: "Database",
    dangerLevel: 4
  },
  guardian: {
    name: "Guardian's Gate",
    description: "The fortress of privacy protection",
    color: "from-green-500 to-emerald-500",
    icon: "Shield",
    dangerLevel: 1
  },
  shadow: {
    name: "Shadow Net",
    description: "Dark corners where data thieves lurk",
    color: "from-gray-700 to-gray-900",
    icon: "Eye",
    dangerLevel: 5
  }
};

export const characters: Character[] = [
  {
    id: "cipher",
    name: "Cipher",
    role: "AI Guide & Mentor",
    avatar: "🤖",
    description: "A wise holographic AI who's been protecting Cipher City for decades. Speaks in riddles but always helps.",
    trustLevel: 100,
    dialogue: [
      "Every choice leaves a digital footprint, young one.",
      "The Phantom feeds on carelessness. Stay vigilant.",
      "Trust is earned one decision at a time."
    ]
  },
  {
    id: "mayor",
    name: "Mayor Secure",
    role: "City Leader & Founder",
    avatar: "👔",
    description: "Built Cipher City as a sanctuary for digital privacy. Carries the Master Key that can lock any data breach.",
    trustLevel: 95,
    dialogue: [
      "This city was built on one principle: your data, your rules.",
      "The Phantom was once a trusted citizen... before the corruption.",
      "Every resident here has a right to privacy. Protect it."
    ]
  },
  {
    id: "flash",
    name: "Flash",
    role: "Viral Influencer",
    avatar: "⚡",
    description: "Famous for sharing EVERYTHING online. Unknowingly helps The Phantom spread data. Well-meaning but naive.",
    trustLevel: 30,
    dialogue: [
      "OMG you HAVE to see this! Share it everywhere!",
      "Privacy? That's so old-school. Go viral or go home!",
      "Wait... my account got hacked? But I share everything anyway..."
    ]
  },
  {
    id: "lock",
    name: "Lock",
    role: "Guardian Twin (Defense)",
    avatar: "🔒",
    description: "Specializes in keeping threats OUT. Never trusts anyone on first meeting. Protective and strategic.",
    trustLevel: 85,
    dialogue: [
      "Trust no one until they've proven themselves.",
      "My sister Key and I have protected this gate for years.",
      "The Phantom has tried to breach us 47 times. 47 failures."
    ]
  },
  {
    id: "key",
    name: "Key",
    role: "Guardian Twin (Access)",
    avatar: "🔑",
    description: "Specializes in granting ACCESS to those who deserve it. More optimistic than Lock, but equally wise.",
    trustLevel: 85,
    dialogue: [
      "Everyone deserves a second chance... but not a third.",
      "Access should be earned, not demanded.",
      "Together with Lock, we keep balance in Cipher City."
    ]
  },
  {
    id: "phantom",
    name: "The Phantom",
    role: "Data Thief Mastermind",
    avatar: "👻",
    description: "A shadowy figure who feeds on leaked data. Once a city founder, now corrupted by greed for information.",
    trustLevel: 0,
    dialogue: [
      "Every secret has a price... and I always collect.",
      "You think you can hide from me? I see EVERYTHING you share.",
      "Cipher City will fall, one overshare at a time..."
    ]
  },
  {
    id: "max",
    name: "Max",
    role: "Your Best Friend",
    avatar: "😊",
    description: "Your loyal friend who sometimes makes mistakes but always means well. Learning alongside you.",
    trustLevel: 75,
    dialogue: [
      "Hey, we're in this together, right?",
      "I didn't know that was dangerous... thanks for warning me!",
      "You always have my back. That's what real friends do."
    ]
  },
  {
    id: "nova",
    name: "Nova",
    role: "Underground Hacker",
    avatar: "💫",
    description: "A reformed hacker who now uses skills for good. Knows The Phantom's tactics from the inside.",
    trustLevel: 60,
    dialogue: [
      "I used to work in Shadow Net... I know how they think.",
      "Every scam has a pattern. Learn to see it.",
      "The Phantom taught me everything. Now I use it against them."
    ]
  },
  {
    id: "echo",
    name: "Echo",
    role: "Memory Keeper",
    avatar: "🔮",
    description: "Ancient AI that stores all of Cipher City's history. Speaks in cryptic memories.",
    trustLevel: 90,
    dialogue: [
      "I remember when this city was young... and when The Phantom was kind.",
      "Data forgotten is data lost. Data shared carelessly is data stolen.",
      "The future is written by the choices you make today."
    ]
  }
];

export const missions: Mission[] = [
  {
    id: 1,
    title: "The Friend Request Flood",
    district: "social",
    districtName: "Social Square",
    difficulty: "beginner",
    storyText: "You step into Social Square for the first time. Holographic billboards flash welcome messages. Suddenly, your wrist device buzzes violently — 20 friend requests flood in simultaneously.",
    dialogue: [
      { speaker: "cipher", text: "Ah, a newcomer! Welcome to Cipher City. But be careful...", emotion: "neutral" },
      { speaker: "cipher", text: "Those requests came awfully fast. In my experience, that's never random.", emotion: "worried" },
      { speaker: "flash", text: "HEY NEW FRIEND! Accept me! Accept everyone! I'll make you FAMOUS!", emotion: "happy" },
      { speaker: "flash", text: "Just share your welcome package — address, interests, family info — it's all just data, right?", emotion: "happy" }
    ],
    dilemma: "Flash bounces around you excitedly while your device shows 20 unknown faces wanting to connect. Something feels... off. Why would strangers be THIS eager?",
    characters: ["cipher", "flash"],
    choices: [
      {
        id: "accept_all",
        text: "Accept all 20 requests and share everything with Flash",
        consequence: {
          resources: { privacyPoints: -30, trustCrystals: 5, connections: 20, reputation: -15 },
          outcomeText: "Within minutes, CLONES of you appear around the city making fake posts and scam offers! The Phantom has stolen your identity. Your privacy crumbles. Flash looks genuinely confused: 'Wait... that wasn't supposed to happen...'",
          triggersEvent: "phantom_clone_attack",
          characterReaction: { characterId: "cipher", trustChange: -10 }
        }
      },
      {
        id: "verify_first",
        text: "Only accept people you've actually spoken to in person",
        consequence: {
          resources: { privacyPoints: 20, trustCrystals: 15, connections: 3, reputation: 10, knowledge: 5 },
          outcomeText: "Smart choice! You carefully verify each request, accepting only genuine residents. Cipher materializes beside you, smiling: 'Wisdom in a newcomer! That's rare.' You notice Flash looking slightly hurt, but respecting your boundary.",
          unlocksAbility: "Profile Scanner",
          characterReaction: { characterId: "cipher", trustChange: 15 }
        }
      },
      {
        id: "investigate",
        text: "Run a background check on each profile before deciding",
        consequence: {
          resources: { privacyPoints: 30, trustCrystals: 25, connections: 8, reputation: 20, knowledge: 15 },
          outcomeText: "BRILLIANT! Your investigation reveals 15 of the 20 profiles are FAKE — hollow shells controlled by The Phantom. You expose the scheme publicly, earning respect from Lock and Key who watch from Guardian's Gate. Your reputation soars!",
          unlocksAbility: "Detective Vision",
          clueReward: "The Phantom uses mass fake friend requests to harvest data"
        }
      }
    ],
    learningTakeaway: "Real connections take time. Anyone rushing you to connect and share is likely not who they claim to be.",
    investigation: {
      id: "friend_check",
      question: "How can you identify a fake social media profile?",
      options: [
        { text: "It has lots of followers", correct: false, explanation: "Followers can be bought or faked easily." },
        { text: "Recently created with few posts and generic photos", correct: true, explanation: "Fake profiles often have little history, stock photos, and were created recently." },
        { text: "It has a verified badge", correct: false, explanation: "While verification helps, even this can be faked in some cases." },
        { text: "They message you first", correct: false, explanation: "Real people also message first, but combined with other red flags, be cautious." }
      ]
    },
    bonusObjective: { description: "Identify all 15 fake profiles", reward: { trustCrystals: 10, knowledge: 10 } }
  },
  {
    id: 2,
    title: "The App Arcade Trap",
    district: "app",
    districtName: "App Arcade",
    difficulty: "beginner",
    storyText: "The App Arcade dazzles with neon lights and holographic app previews. You need a photo editor to create your official Trust Badge — your passport to city services.",
    dialogue: [
      { speaker: "lock", text: "Careful in the Arcade. Not every shop is what it seems.", emotion: "worried" },
      { speaker: "key", text: "We recommend PicPower. Verified and trusted for years.", emotion: "happy" },
      { speaker: "cipher", text: "Three options before you. Only your wisdom can choose correctly.", emotion: "neutral" }
    ],
    dilemma: "Three app shops glow before you: 'SnapMagic' (official store, 5 Trust Crystals), 'InstaPro' (shady alley, FREE with 'premium features'), and 'PicPower' (Lock & Key's recommendation). Your Trust Badge deadline is tomorrow.",
    characters: ["cipher", "lock", "key"],
    choices: [
      {
        id: "instapro",
        text: "Download InstaPro — it's free with premium features!",
        consequence: {
          resources: { privacyPoints: -40, trustCrystals: -10, connections: -5, reputation: -20, knowledge: 0 },
          outcomeText: "CRITICAL ERROR! Your device SCREAMS with alerts. InstaPro was MALWARE! The Phantom's code rips through your data — photos vanish, messages leak, your Trust Badge application gets corrupted. Mayor Secure himself arrives to help with damage control.",
          triggersEvent: "malware_infection",
          characterReaction: { characterId: "lock", trustChange: -15 }
        }
      },
      {
        id: "snapmagic",
        text: "Buy SnapMagic from the official store (5 crystals)",
        consequence: {
          resources: { privacyPoints: 10, trustCrystals: -5, connections: 0, reputation: 5, knowledge: 5 },
          outcomeText: "Safe and sound! SnapMagic works perfectly. It cost crystals, but your data remains secure. Cipher nods approvingly: 'Sometimes the best protection has a price. Well chosen.'",
          characterReaction: { characterId: "cipher", trustChange: 5 }
        }
      },
      {
        id: "picpower",
        text: "Use PicPower as Lock & Key recommended",
        consequence: {
          resources: { privacyPoints: 20, trustCrystals: 10, connections: 5, reputation: 15, knowledge: 10 },
          outcomeText: "Excellent choice! PicPower is safe AND free for trusted residents. Lock smiles — a rare sight: 'You listened. That's respectable.' Key adds: 'Trust networks exist for exactly this reason.' You've strengthened your bond with the Guardians.",
          unlocksAbility: "Trusted Network",
          clueReward: "The Phantom spreads malware through 'free premium' apps"
        }
      }
    ],
    learningTakeaway: "If something is free and seems too good to be true, YOU might be the product. Trust recommendations from verified sources.",
    investigation: {
      id: "app_safety",
      question: "What's the safest way to download apps?",
      options: [
        { text: "From any website that offers it free", correct: false, explanation: "Unofficial sources often contain malware or modified apps." },
        { text: "From official app stores or trusted recommendations", correct: true, explanation: "Official stores have verification processes, and trusted friends can vouch for safety." },
        { text: "From pop-up ads that say 'Download Now!'", correct: false, explanation: "Pop-up ads are a classic malware distribution method." },
        { text: "From email attachments", correct: false, explanation: "Email attachments are extremely risky for app downloads." }
      ]
    }
  },
  {
    id: 3,
    title: "The Password Pact",
    district: "memory",
    districtName: "Memory Market",
    difficulty: "intermediate",
    storyText: "Memory Market hums with the energy of countless data transactions. Encrypted containers flow through tubes overhead. Your friend Max runs up, looking panicked.",
    dialogue: [
      { speaker: "max", text: "You're here! Oh thank goodness!", emotion: "worried" },
      { speaker: "max", text: "I left something super important at Guardian's Gate but I'm locked out!", emotion: "worried" },
      { speaker: "max", text: "Can you just... give me your password? Just for a minute?", emotion: "neutral" },
      { speaker: "cipher", text: "*appears silently* Interesting request. Watch closely, young defender.", emotion: "mysterious" }
    ],
    dilemma: "Max looks genuinely distressed. But sharing your password means sharing access to EVERYTHING — your messages, your crystals, your reputation. Is there another way to help your friend?",
    characters: ["max", "cipher", "lock"],
    choices: [
      {
        id: "share_password",
        text: "Give Max your password — friends trust each other",
        consequence: {
          resources: { privacyPoints: -50, trustCrystals: -20, connections: -10, reputation: -25, knowledge: 0 },
          outcomeText: "SECURITY BREACH! Max's device was already COMPROMISED by The Phantom! Your password flows straight to Shadow Net. Within hours, both accounts spread fake news and scam messages. Max is horrified: 'I... I didn't know my device was hacked!' Lock arrives grimly: 'This is why we never share keys.'",
          triggersEvent: "account_compromise",
          characterReaction: { characterId: "lock", trustChange: -20 }
        }
      },
      {
        id: "get_item",
        text: "Offer to retrieve the item yourself using YOUR access",
        consequence: {
          resources: { privacyPoints: 20, trustCrystals: 15, connections: 10, reputation: 10, knowledge: 10 },
          outcomeText: "Max sighs with relief: 'That's... actually smarter, isn't it?' You retrieve the item while Max's account stays secure. Cipher materializes: 'You protected both of you. THIS is what true friendship looks like.' Max learns an important lesson.",
          unlocksAbility: "Security Mentor",
          characterReaction: { characterId: "max", trustChange: 10 }
        }
      },
      {
        id: "help_reset",
        text: "Walk Max to Guardian's Gate for an official password reset",
        consequence: {
          resources: { privacyPoints: 30, trustCrystals: 25, connections: 15, reputation: 20, knowledge: 15 },
          outcomeText: "PERFECT solution! At Guardian's Gate, Lock runs a security scan and discovers The Phantom's malware on Max's device! 'Good thing you came here,' Lock says, removing the threat. 'If that password had been shared...' Key adds: 'You've saved two accounts today.' Max is shaken but grateful.",
          unlocksAbility: "Security Mentor",
          clueReward: "The Phantom plants malware to intercept shared passwords"
        }
      }
    ],
    learningTakeaway: "Never share passwords, even with close friends. There's always a safer way to help.",
    investigation: {
      id: "password_safety",
      question: "What should you do if a friend asks for your password?",
      options: [
        { text: "Share it — friends trust each other", correct: false, explanation: "Even trusted friends can have compromised devices." },
        { text: "Find an alternative way to help them", correct: true, explanation: "Real friends find solutions that don't risk your security." },
        { text: "Give them a temporary password", correct: false, explanation: "Any shared password can be intercepted or misused." },
        { text: "Only share it in person", correct: false, explanation: "The risk isn't about HOW you share, but THAT you share at all." }
      ]
    },
    bonusObjective: { description: "Discover the malware on Max's device", reward: { knowledge: 15, reputation: 10 } }
  },
  {
    id: 4,
    title: "The Photo Parade Panic",
    district: "social",
    districtName: "Social Square — Cipher Festival",
    difficulty: "intermediate",
    storyText: "The annual Cipher Festival transforms Social Square into a carnival of lights, music, and celebration! Citizens dance, play games, and share memories. You're having an amazing time when suddenly—",
    dialogue: [
      { speaker: "cipher", text: "Something's wrong. Check your notification feed. NOW.", emotion: "worried" },
      { speaker: "mayor", text: "This is Mayor Secure. We have a consent violation in Social Square.", emotion: "angry" }
    ],
    dilemma: "Someone photographed you and posted it WITHOUT ASKING! The post tags your exact location, reveals your school district, AND shows your daily schedule. Suspicious comments flood in: 'What time do you leave?', 'Nice place — where is it?', 'Are you alone?'",
    characters: ["cipher", "mayor", "phantom"],
    choices: [
      {
        id: "comment_angrily",
        text: "Comment angrily on the post calling them out publicly",
        consequence: {
          resources: { privacyPoints: -10, trustCrystals: -15, connections: -20, reputation: -10, knowledge: 0 },
          outcomeText: "Your fury is understandable, but... the argument goes VIRAL. Thousands now see the post. The Phantom's bots amplify the drama, spreading your data even further. Mayor Secure intervenes: 'Anger gives them exactly what they want — attention. Let's fix this properly.'",
          characterReaction: { characterId: "mayor", trustChange: -5 }
        }
      },
      {
        id: "report_message",
        text: "Report the post AND message the person privately",
        consequence: {
          resources: { privacyPoints: 30, trustCrystals: 30, connections: 20, reputation: 25, knowledge: 10 },
          outcomeText: "Perfect approach! You report through official channels AND reach out privately. The photographer is mortified: 'I had no idea I tagged all that info! I'm so sorry!' The post disappears. Mayor Secure awards you the 'Privacy Advocate' badge: 'Calm resolve protects privacy better than rage.'",
          unlocksAbility: "Privacy Advocate",
          clueReward: "The Phantom exploits photo metadata and location tags"
        }
      },
      {
        id: "do_nothing",
        text: "Ignore it — it'll blow over eventually",
        consequence: {
          resources: { privacyPoints: -30, trustCrystals: -10, connections: 0, reputation: -15, knowledge: 0 },
          outcomeText: "The post stays up for DAYS. The Phantom harvests everything — your patterns, locations, schedule. Days later, targeted scams arrive using YOUR information. Cipher appears sadly: 'Inaction is a choice. Unfortunately, it chose poorly for you.'",
          characterReaction: { characterId: "cipher", trustChange: -10 }
        }
      }
    ],
    learningTakeaway: "Your image is YOUR property. Always ask permission before posting others' photos, and always speak up when yours are shared without consent.",
    investigation: {
      id: "photo_consent",
      question: "What information can be hidden in a digital photo?",
      options: [
        { text: "Just the image itself", correct: false, explanation: "Photos contain 'metadata' — hidden information." },
        { text: "Location, time, device info, and sometimes more", correct: true, explanation: "Photo metadata can reveal GPS coordinates, timestamps, camera model, and other personal details." },
        { text: "Only the file name", correct: false, explanation: "Much more than the filename is embedded." },
        { text: "Nothing if you crop it", correct: false, explanation: "Cropping doesn't remove metadata." }
      ]
    }
  },
  {
    id: 5,
    title: "The Shadow Net Invitation",
    district: "shadow",
    districtName: "Shadow Net — The Dark Zone",
    difficulty: "advanced",
    storyText: "A mysterious message appears on your device: 'You've been selected. Meet me at the Shadow Net entrance. Bring no one. —N' The message is signed with Nova's signature...",
    dialogue: [
      { speaker: "nova", text: "You came. Good. We don't have much time.", emotion: "worried" },
      { speaker: "nova", text: "The Phantom is planning something big. A data heist that could expose EVERYONE.", emotion: "worried" },
      { speaker: "nova", text: "I know their methods. I used to be... one of them.", emotion: "mysterious" },
      { speaker: "nova", text: "But to stop this, I need you to enter Shadow Net with me. It's dangerous.", emotion: "neutral" }
    ],
    dilemma: "Nova, the reformed hacker, wants you to enter the most dangerous district of Cipher City. The Shadow Net is where The Phantom operates. But Nova says this is the only way to stop the coming attack. Do you trust someone who admits they used to work for the enemy?",
    characters: ["nova", "phantom", "cipher"],
    choices: [
      {
        id: "refuse_mission",
        text: "Refuse — this is too risky and Nova can't be trusted",
        consequence: {
          resources: { privacyPoints: 10, trustCrystals: 0, connections: 0, reputation: 5, knowledge: 0 },
          outcomeText: "Caution isn't wrong, but... Nova vanishes into the shadows, disappointed. Days later, a smaller data breach occurs — not the big one Nova warned about, but significant. Cipher finds you: 'Sometimes, trust must be earned through action. Nova will try again.'",
          characterReaction: { characterId: "nova", trustChange: -15 }
        }
      },
      {
        id: "go_alone",
        text: "Go with Nova, but inform Lock & Key first",
        consequence: {
          resources: { privacyPoints: 30, trustCrystals: 35, connections: 20, reputation: 30, knowledge: 25 },
          outcomeText: "SMART! You trust Nova but verify with backup. Lock and Key shadow your mission from a safe distance. Deep in Shadow Net, you discover The Phantom's server hub — MASSIVE data collection from oversharing citizens! Nova disables the core while you document everything. Evidence secured!",
          unlocksAbility: "Shadow Walker",
          clueReward: "The Phantom stores stolen data in hidden Shadow Net servers"
        }
      },
      {
        id: "trap_test",
        text: "Test if this is a trap first by asking questions only real Nova would know",
        consequence: {
          resources: { privacyPoints: 25, trustCrystals: 20, connections: 15, reputation: 20, knowledge: 30 },
          outcomeText: "Clever verification! You ask about Nova's past missions — details only the REAL Nova would know. Nova answers correctly and smiles: 'Good. You should ALWAYS verify. That's exactly why I chose you.' Your skepticism earns respect. The mission proceeds with enhanced trust.",
          unlocksAbility: "Identity Verifier",
          characterReaction: { characterId: "nova", trustChange: 20 }
        }
      }
    ],
    learningTakeaway: "Trust but verify. Even allies should be confirmed before entering risky situations.",
    investigation: {
      id: "verify_identity",
      question: "How can you verify someone's identity online?",
      options: [
        { text: "Just ask them if they're really who they say", correct: false, explanation: "Impersonators will always say yes." },
        { text: "Check their profile picture", correct: false, explanation: "Profile pictures can be stolen or faked." },
        { text: "Ask questions only they would know, or verify through a separate channel", correct: true, explanation: "Private information or confirmation through another method (like a phone call) helps verify identity." },
        { text: "Trust the message because it sounds like them", correct: false, explanation: "Writing style can be mimicked." }
      ]
    },
    bonusObjective: { description: "Gather 3 pieces of evidence from Shadow Net", reward: { knowledge: 20, reputation: 15 } }
  },
  {
    id: 6,
    title: "The Phantom's Gambit",
    district: "guardian",
    districtName: "Guardian's Gate — Final Stand",
    difficulty: "expert",
    storyText: "ALERT! Guardian's Gate is under attack! The Phantom has launched a coordinated assault using all the data collected from careless citizens. Lock and Key are overwhelmed!",
    dialogue: [
      { speaker: "lock", text: "They're breaking through! How does The Phantom know our protocols?!", emotion: "angry" },
      { speaker: "key", text: "Someone shared internal access codes. We're compromised!", emotion: "worried" },
      { speaker: "phantom", text: "*echoing through speakers* Did you really think you could hide from me? I KNOW you all now!", emotion: "mysterious" },
      { speaker: "mayor", text: "All defenders to Guardian's Gate! This is not a drill!", emotion: "angry" },
      { speaker: "echo", text: "The patterns repeat... but this time, you can break the cycle.", emotion: "mysterious" }
    ],
    dilemma: "The Phantom is using leaked personal data to bypass security. Citizens who overshared are now vulnerabilities. You have three options, but time is running out. The city's entire privacy infrastructure depends on this moment.",
    characters: ["lock", "key", "mayor", "phantom", "echo"],
    choices: [
      {
        id: "direct_attack",
        text: "Lead a direct counter-attack on The Phantom's forces",
        consequence: {
          resources: { privacyPoints: 15, trustCrystals: 20, connections: 25, reputation: 20, knowledge: 5 },
          outcomeText: "Brave but costly! Your direct assault pushes back the attack, but The Phantom escapes with significant data. Lock is injured, Key is furious. Mayor Secure stabilizes the gate: 'We survived, but The Phantom learned our defense patterns. They'll be back stronger.'",
          characterReaction: { characterId: "lock", trustChange: 10 }
        }
      },
      {
        id: "use_clues",
        text: "Use all collected Phantom clues to predict and counter their strategy",
        requiredAbility: "Detective Vision",
        consequence: {
          resources: { privacyPoints: 40, trustCrystals: 50, connections: 30, reputation: 50, knowledge: 40 },
          outcomeText: "MASTERFUL! Your investigation pays off! Using every clue collected, you predict The Phantom's next moves perfectly. Nova's intel, the fake profile patterns, the malware signatures — it all connects! You redirect The Phantom's attack back at their own servers, corrupting THEIR data! The Phantom SCREAMS and retreats. Victory!",
          unlocksAbility: "Master Defender",
          clueReward: "The Phantom's weakness: they rely on predictable human mistakes"
        }
      },
      {
        id: "evacuate_protect",
        text: "Focus on protecting citizens and securing vulnerable data",
        consequence: {
          resources: { privacyPoints: 30, trustCrystals: 35, connections: 40, reputation: 35, knowledge: 20 },
          outcomeText: "Compassion and strategy! While others fight, you coordinate citizen evacuation and data backup. Not a single resident loses their information. Mayor Secure later says: 'We can rebuild walls, but not trust. You protected what matters most.' The Phantom retreats, finding nothing left to steal.",
          unlocksAbility: "Guardian Angel",
          characterReaction: { characterId: "mayor", trustChange: 25 }
        }
      }
    ],
    learningTakeaway: "Privacy is everyone's responsibility. One person's careless sharing can endanger an entire community.",
    investigation: {
      id: "final_lesson",
      question: "What's the most important lesson about digital privacy?",
      options: [
        { text: "Never use the internet", correct: false, explanation: "Avoidance isn't practical — awareness is key." },
        { text: "Privacy is a personal AND community responsibility", correct: true, explanation: "Your privacy choices affect you AND everyone connected to you." },
        { text: "Only trust technology experts", correct: false, explanation: "Everyone can learn to protect themselves." },
        { text: "Hackers will always win", correct: false, explanation: "Smart, informed choices create strong defenses." }
      ]
    },
    timeLimit: 120,
    bonusObjective: { description: "Complete the mission with 0 casualties", reward: { reputation: 30, trustCrystals: 25 } }
  }
];

export const initialResources: Resource = {
  privacyPoints: 100,
  trustCrystals: 10,
  connections: 0,
  reputation: 50,
  knowledge: 0
};

export const abilities = {
  "Profile Scanner": {
    name: "Profile Scanner",
    description: "Quickly analyze profiles for authenticity markers",
    icon: "Scan",
    tier: 1
  },
  "Detective Vision": {
    name: "Detective Vision",
    description: "See suspicious profiles and activities highlighted in red",
    icon: "Eye",
    tier: 2
  },
  "Trusted Network": {
    name: "Trusted Network",
    description: "Access verified apps and resources recommended by friends",
    icon: "Users",
    tier: 1
  },
  "Security Mentor": {
    name: "Security Mentor",
    description: "Help other residents improve their privacy practices",
    icon: "GraduationCap",
    tier: 2
  },
  "Privacy Advocate": {
    name: "Privacy Advocate",
    description: "Assist residents with consent and photo sharing issues",
    icon: "Shield",
    tier: 2
  },
  "Shadow Walker": {
    name: "Shadow Walker",
    description: "Navigate dangerous areas with enhanced awareness",
    icon: "Moon",
    tier: 3
  },
  "Identity Verifier": {
    name: "Identity Verifier",
    description: "Advanced techniques to confirm someone's true identity",
    icon: "UserCheck",
    tier: 2
  },
  "Master Defender": {
    name: "Master Defender",
    description: "Full mastery of Cipher City's defensive protocols",
    icon: "Crown",
    tier: 4
  },
  "Guardian Angel": {
    name: "Guardian Angel",
    description: "Exceptional ability to protect others from digital harm",
    icon: "Heart",
    tier: 3
  }
};

export const evidenceCollection: Evidence[] = [
  {
    id: "fake_profiles",
    name: "Fake Profile Database",
    description: "Evidence that The Phantom uses mass fake friend requests",
    icon: "Users",
    missionId: 1
  },
  {
    id: "malware_code",
    name: "Malware Signature",
    description: "Code sample from The Phantom's fake apps",
    icon: "Bug",
    missionId: 2
  },
  {
    id: "password_trap",
    name: "Password Intercept Log",
    description: "Proof that malware intercepts shared passwords",
    icon: "Key",
    missionId: 3
  },
  {
    id: "metadata_exploit",
    name: "Metadata Exploitation Guide",
    description: "The Phantom's manual for extracting photo data",
    icon: "Image",
    missionId: 4
  },
  {
    id: "server_location",
    name: "Shadow Server Coordinates",
    description: "Location of The Phantom's hidden data storage",
    icon: "Server",
    missionId: 5
  },
  {
    id: "phantom_weakness",
    name: "The Phantom's Achilles Heel",
    description: "Critical weakness in The Phantom's strategy",
    icon: "Target",
    missionId: 6
  }
];