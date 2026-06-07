export interface Resource {
  privacyPoints: number;
  trustCrystals: number;
  connections: number;
  reputation: number;
  knowledge: number;
  energy: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: Partial<Resource>;
}

export interface CharacterCustomization {
  avatar: string;
  frame: string;
  title: string;
  trail: string;
}

export interface MiniGame {
  type: 'pattern' | 'decrypt' | 'sorting' | 'memory' | 'quickChoice';
  difficulty: number;
  timeLimit: number;
  data: any;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  reward: Partial<Resource>;
  completed: boolean;
  expiresAt: Date;
}

export type GameState = 
  | 'intro' 
  | 'customization'
  | 'city' 
  | 'district'
  | 'mission' 
  | 'dialogue' 
  | 'minigame'
  | 'investigation' 
  | 'ending'
  | 'achievements'
  | 'profile'
  | 'phishingQuest';

export interface GameProgress {
  playerName: string;
  customization: CharacterCustomization;
  resources: Resource;
  completedMissions: number[];
  unlockedAbilities: string[];
  collectedClues: string[];
  collectedEvidence: string[];
  characterTrust: Record<string, number>;
  achievements: Achievement[];
  dailyStreak: number;
  totalPlayTime: number;
  perfectMissions: number;
  lastPlayed: Date;
}
