export interface LevelData {
  level: number;
  title: string;
  rank: string;
  xpRequired: number;
  color: string;
  icon: string;
  description: string;
  rewards: string[];
  unlocks?: string[];
}

export const levelSystem: LevelData[] = [
  {
    level: 1,
    title: "Digital Rookie",
    rank: "Trainee",
    xpRequired: 0,
    color: "text-gray-600",
    icon: "🆕",
    description: "Just starting your cybersecurity journey",
    rewards: ["Basic cybersecurity knowledge"],
    unlocks: ["Access to easy scenarios"]
  },
  {
    level: 2,
    title: "Security Cadet",
    rank: "Junior",
    xpRequired: 100,
    color: "text-blue-600",
    icon: "👤",
    description: "Learning the fundamentals of digital safety",
    rewards: ["10% XP bonus on easy scenarios"],
    unlocks: ["Access to medium scenarios"]
  },
  {
    level: 3,
    title: "Cyber Scout",
    rank: "Intermediate",
    xpRequired: 250,
    color: "text-green-600",
    icon: "🔍",
    description: "Developing keen threat detection skills",
    rewards: ["15% XP bonus", "Streak protection (1 mistake forgiven)"],
    unlocks: ["Advanced threat indicators"]
  },
  {
    level: 4,
    title: "Data Guardian",
    rank: "Advanced",
    xpRequired: 450,
    color: "text-purple-600",
    icon: "🛡️",
    description: "Protecting digital assets with confidence",
    rewards: ["20% XP bonus", "Double streak multiplier"],
    unlocks: ["Access to hard scenarios"]
  },
  {
    level: 5,
    title: "Security Specialist",
    rank: "Expert",
    xpRequired: 700,
    color: "text-orange-600",
    icon: "🎯",
    description: "Mastering advanced security concepts",
    rewards: ["25% XP bonus", "Extended streak protection"],
    unlocks: ["Expert scenario variants"]
  },
  {
    level: 6,
    title: "Threat Hunter",
    rank: "Senior",
    xpRequired: 1000,
    color: "text-red-600",
    icon: "🕵️",
    description: "Actively seeking and neutralizing threats",
    rewards: ["30% XP bonus", "Streak immunity (2 mistakes)"],
    unlocks: ["Advanced phishing detection"]
  },
  {
    level: 7,
    title: "Cyber Analyst",
    rank: "Principal",
    xpRequired: 1350,
    color: "text-cyan-600",
    icon: "📊",
    description: "Analyzing complex security patterns",
    rewards: ["35% XP bonus", "Bonus scenarios unlock"],
    unlocks: ["Deep threat analysis mode"]
  },
  {
    level: 8,
    title: "Security Architect",
    rank: "Senior Principal",
    xpRequired: 1750,
    color: "text-indigo-600",
    icon: "🏗️",
    description: "Designing robust security frameworks",
    rewards: ["40% XP bonus", "Scenario preview feature"],
    unlocks: ["Security architecture challenges"]
  },
  {
    level: 9,
    title: "Cyber Warrior",
    rank: "Distinguished",
    xpRequired: 2200,
    color: "text-pink-600",
    icon: "⚔️",
    description: "Fighting on the front lines of cybersecurity",
    rewards: ["45% XP bonus", "Elite status badge"],
    unlocks: ["Warrior-class scenarios"]
  },
  {
    level: 10,
    title: "Security Master",
    rank: "Legendary",
    xpRequired: 2700,
    color: "text-yellow-600",
    icon: "🏆",
    description: "The pinnacle of cybersecurity expertise",
    rewards: ["50% XP bonus", "Master's exclusive content"],
    unlocks: ["Master-tier challenges", "Legendary badge"]
  },
  {
    level: 11,
    title: "Cyber Legend",
    rank: "Mythical",
    xpRequired: 3250,
    color: "text-amber-600",
    icon: "👑",
    description: "A legendary figure in digital defense",
    rewards: ["60% XP bonus", "Legend status", "Custom title"],
    unlocks: ["Mythical scenarios", "Hall of Fame entry"]
  },
  {
    level: 12,
    title: "Digital Deity",
    rank: "Transcendent",
    xpRequired: 3850,
    color: "text-gradient-rainbow",
    icon: "✨",
    description: "Transcended beyond mortal cybersecurity limits",
    rewards: ["75% XP bonus", "Divine protection", "Rainbow title"],
    unlocks: ["Transcendent challenges", "Divine badge"]
  }
];

export const getLevelData = (level: number): LevelData => {
  return levelSystem.find(l => l.level === level) || levelSystem[0];
};

export const getNextLevelData = (level: number): LevelData | null => {
  return levelSystem.find(l => l.level === level + 1) || null;
};

export const calculateLevel = (xp: number): number => {
  for (let i = levelSystem.length - 1; i >= 0; i--) {
    if (xp >= levelSystem[i].xpRequired) {
      return levelSystem[i].level;
    }
  }
  return 1;
};

export const getXpForNextLevel = (currentLevel: number): number => {
  const nextLevel = getNextLevelData(currentLevel);
  return nextLevel ? nextLevel.xpRequired : 0;
};

export const getLevelProgress = (xp: number, currentLevel: number): number => {
  const currentLevelData = getLevelData(currentLevel);
  const nextLevelData = getNextLevelData(currentLevel);
  
  if (!nextLevelData) return 100; // Max level reached
  
  const currentLevelXp = xp - currentLevelData.xpRequired;
  const xpNeeded = nextLevelData.xpRequired - currentLevelData.xpRequired;
  
  return Math.min((currentLevelXp / xpNeeded) * 100, 100);
};