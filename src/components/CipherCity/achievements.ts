import { Achievement } from './types';

export const achievementsList: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first mission',
    icon: '👣',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    reward: { trustCrystals: 10 }
  },
  {
    id: 'privacy_pro',
    name: 'Privacy Pro',
    description: 'Maintain 80+ privacy points for 3 missions',
    icon: '🛡️',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    reward: { privacyPoints: 20, trustCrystals: 25 }
  },
  {
    id: 'perfect_streak',
    name: 'Perfect Streak',
    description: 'Complete 3 missions with perfect choices',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    reward: { reputation: 30, energy: 10 }
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Build trust with 5 characters',
    icon: '🦋',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    reward: { connections: 15, trustCrystals: 20 }
  },
  {
    id: 'code_breaker',
    name: 'Code Breaker',
    description: 'Win 5 mini-games',
    icon: '🔓',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    reward: { knowledge: 25, energy: 15 }
  },
  {
    id: 'detective',
    name: 'Master Detective',
    description: 'Collect all evidence pieces',
    icon: '🔍',
    unlocked: false,
    progress: 0,
    maxProgress: 6,
    reward: { reputation: 40, trustCrystals: 50 }
  },
  {
    id: 'guardian',
    name: 'City Guardian',
    description: 'Complete all missions',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 6,
    reward: { privacyPoints: 50, reputation: 50, knowledge: 50 }
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a timed mission with 50%+ time remaining',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    reward: { energy: 20, trustCrystals: 15 }
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Answer 5 investigation questions correctly',
    icon: '📚',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    reward: { knowledge: 30 }
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Recover from a bad choice with a perfect next mission',
    icon: '🔄',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    reward: { reputation: 20, privacyPoints: 15 }
  }
];

export const avatarOptions = [
  { id: 'detective', emoji: '🕵️', name: 'Detective', unlockCost: 0 },
  { id: 'hacker', emoji: '👨‍💻', name: 'Hacker', unlockCost: 0 },
  { id: 'guardian', emoji: '🦸', name: 'Guardian', unlockCost: 0 },
  { id: 'agent', emoji: '🤵', name: 'Agent', unlockCost: 20 },
  { id: 'ninja', emoji: '🥷', name: 'Ninja', unlockCost: 30 },
  { id: 'robot', emoji: '🤖', name: 'Robot', unlockCost: 40 },
  { id: 'wizard', emoji: '🧙', name: 'Wizard', unlockCost: 50 },
  { id: 'astronaut', emoji: '👨‍🚀', name: 'Astronaut', unlockCost: 75 },
];

export const frameOptions = [
  { id: 'none', name: 'None', color: 'transparent', unlockCost: 0 },
  { id: 'bronze', name: 'Bronze', color: 'from-amber-700 to-amber-500', unlockCost: 0 },
  { id: 'silver', name: 'Silver', color: 'from-gray-400 to-gray-200', unlockCost: 15 },
  { id: 'gold', name: 'Gold', color: 'from-yellow-500 to-yellow-300', unlockCost: 30 },
  { id: 'diamond', name: 'Diamond', color: 'from-cyan-400 to-blue-300', unlockCost: 50 },
  { id: 'cosmic', name: 'Cosmic', color: 'from-purple-500 via-pink-500 to-cyan-500', unlockCost: 100 },
];

export const titleOptions = [
  { id: 'newcomer', name: 'Newcomer', unlockCost: 0 },
  { id: 'defender', name: 'Privacy Defender', unlockCost: 0 },
  { id: 'protector', name: 'Data Protector', unlockCost: 25 },
  { id: 'sentinel', name: 'Digital Sentinel', unlockCost: 50 },
  { id: 'master', name: 'Master Guardian', unlockCost: 100 },
  { id: 'legend', name: 'Cipher Legend', unlockCost: 200 },
];
