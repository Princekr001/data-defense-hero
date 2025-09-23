import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { gameScenarios } from "@/data/scenarios";
import { useAnalytics } from "@/components/AnalyticsProvider";
import { useTheme } from "@/components/ThemeProvider";
import HelpWidget from "@/components/HelpWidget";
import VoiceAssistant from "@/components/VoiceAssistant";
import { 
  Heart, 
  Brain, 
  Lightbulb, 
  Trophy, 
  Target, 
  MessageCircle, 
  Zap, 
  Shield, 
  AlertTriangle, 
  Star,
  Sword,
  Crown,
  Gem,
  Rocket,
  Medal,
  Flame,
  Eye,
  Lock,
  Globe,
  Sun,
  Moon,
  Monitor,
  Users,
  TrendingUp
} from "lucide-react";

// Import scenario images
import cyberScenario1 from "@/assets/cyber-scenario-1.jpg";
import cyberScenario2 from "@/assets/cyber-scenario-2.jpg";
import cyberScenario3 from "@/assets/cyber-scenario-3.jpg";

interface PlayerData {
  name: string;
  score: number;
  level: number;
  xp: number;
  streak: number;
  conceptsMastered: string[];
  achievements: string[];
  title: string;
  rank: string;
  personalityType?: 'analytical' | 'competitive' | 'collaborative' | 'curious';
  preferredDifficulty?: 'adaptive' | 'challenging' | 'steady';
}

interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  conceptsMastered: number;
  timestamp: number;
  rank: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  condition: (player: PlayerData) => boolean;
  reward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievements: Achievement[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Complete your first scenario",
    icon: Star,
    condition: (player) => player.score >= 1,
    reward: 50,
    rarity: 'common'
  },
  {
    id: "streak_master",
    name: "Streak Master", 
    description: "Achieve a 3-answer streak",
    icon: Flame,
    condition: (player) => player.streak >= 3,
    reward: 100,
    rarity: 'rare'
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Master 3 different concepts",
    icon: Brain,
    condition: (player) => player.conceptsMastered.length >= 3,
    reward: 150,
    rarity: 'rare'
  },
  {
    id: "cyber_ninja",
    name: "Cyber Ninja",
    description: "Reach Level 5",
    icon: Sword,
    condition: (player) => player.level >= 5,
    reward: 200,
    rarity: 'epic'
  },
  {
    id: "security_champion",
    name: "Security Champion", 
    description: "Perfect score on all scenarios",
    icon: Crown,
    condition: (player) => player.score >= gameScenarios.length,
    reward: 500,
    rarity: 'legendary'
  }
];

const getRankTitle = (level: number): { rank: string; title: string } => {
  if (level >= 10) return { rank: "Grandmaster", title: "Cyber Guardian Supreme" };
  if (level >= 8) return { rank: "Master", title: "Digital Fortress Commander" };
  if (level >= 6) return { rank: "Expert", title: "Security Sage" };
  if (level >= 4) return { rank: "Adept", title: "Threat Hunter" };
  if (level >= 2) return { rank: "Apprentice", title: "Code Defender" };
  return { rank: "Novice", title: "Security Scout" };
};

const getScenarioImage = (index: number) => {
  const images = [cyberScenario1, cyberScenario2, cyberScenario3];
  return images[index % images.length];
};

const getPersonalizedEncouragement = (playerType: string, streak: number) => {
  const messages = {
    analytical: ["🧠 Analyze the patterns!", "🔍 Great logical thinking!", "📊 Your analysis skills are improving!"],
    competitive: ["🏆 You're in the lead!", "⚡ Dominate this challenge!", "🚀 Push for the high score!"],
    collaborative: ["🤝 Learning together!", "👥 Share your knowledge!", "🌟 Your teamwork shines!"],
    curious: ["🔮 Explore every option!", "💡 Keep questioning!", "🌍 Discovery awaits!"]
  };
  
  const typeMessages = messages[playerType as keyof typeof messages] || messages.curious;
  return typeMessages[streak % typeMessages.length];
};

export default function EnhancedInteractiveCyberGame() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'leaderboard' | 'social'>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerData>({
    name: '',
    score: 0,
    level: 1,
    xp: 0,
    streak: 0,
    conceptsMastered: [],
    achievements: [],
    title: "Security Scout",
    rank: "Novice",
    personalityType: 'curious',
    preferredDifficulty: 'adaptive'
  });
  
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [difficulty, setDifficulty] = useState(1);

  const { toast } = useToast();
  const { track, identify } = useAnalytics();
  const { theme, setTheme } = useTheme();

  const currentScenario = gameScenarios[currentScenarioIndex];

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cyberGameLeaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
    
    const savedPlayer = localStorage.getItem('cyberGamePlayer');
    if (savedPlayer) {
      const parsed = JSON.parse(savedPlayer);
      setPlayerData(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || showResult) return;
      
      if (e.key >= '1' && e.key <= '3') {
        const index = parseInt(e.key) - 1;
        const actionKey = `action${index + 1}` as keyof typeof currentScenario.actions;
        if (currentScenario.actions[actionKey]) {
          const isCorrect = currentScenario.actions[actionKey]?.type === 'safe';
          processChoice(actionKey, isCorrect);
        }
      }
      
      if (e.key.toLowerCase() === 'h') {
        // Toggle help handled by HelpWidget
      }
      
      if (e.key.toLowerCase() === 'v') {
        setVoiceEnabled(!voiceEnabled);
      }
      
      if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showResult, currentScenario, voiceEnabled]);

  // Analytics tracking
  useEffect(() => {
    if (playerData.name) {
      identify(playerData.name, {
        level: playerData.level,
        score: playerData.score,
        personalityType: playerData.personalityType,
      });
    }
  }, [playerData.name, playerData.level, playerData.score]);

  // Check for new achievements
  useEffect(() => {
    achievements.forEach(achievement => {
      if (!playerData.achievements.includes(achievement.id) && achievement.condition(playerData)) {
        setPlayerData(prev => ({
          ...prev,
          achievements: [...prev.achievements, achievement.id],
          xp: prev.xp + achievement.reward
        }));
        
        setShowAchievement(achievement);
        
        track('achievement_unlocked', {
          achievementId: achievement.id,
          achievementName: achievement.name,
          rarity: achievement.rarity,
          reward: achievement.reward
        });
        
        toast({
          title: `🏆 ${achievement.rarity.toUpperCase()} Achievement!`,
          description: `${achievement.name} - +${achievement.reward} XP`,
          duration: 3000,
        });
        
        setTimeout(() => setShowAchievement(null), 3000);
      }
    });
  }, [playerData.score, playerData.streak, playerData.conceptsMastered.length, playerData.level]);

  // Update rank and title
  useEffect(() => {
    const { rank, title } = getRankTitle(playerData.level);
    setPlayerData(prev => ({ ...prev, rank, title }));
  }, [playerData.level]);

  // Adaptive difficulty
  useEffect(() => {
    if (playerData.preferredDifficulty === 'adaptive') {
      if (playerData.streak >= 3) {
        setDifficulty(Math.min(difficulty + 0.2, 2));
      } else if (playerData.streak === 0 && attempts > 1) {
        setDifficulty(Math.max(difficulty - 0.1, 0.5));
      }
    }
  }, [playerData.streak, attempts]);

  const saveToLeaderboard = () => {
    const entry: LeaderboardEntry = {
      name: playerData.name,
      score: playerData.score,
      level: playerData.level,
      conceptsMastered: playerData.conceptsMastered.length,
      timestamp: Date.now(),
      rank: playerData.rank
    };
    
    const newLeaderboard = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setLeaderboard(newLeaderboard);
    localStorage.setItem('cyberGameLeaderboard', JSON.stringify(newLeaderboard));
    localStorage.setItem('cyberGamePlayer', JSON.stringify(playerData));
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentScenarioIndex(0);
    setAttempts(0);
    setComboCount(0);
    
    track('game_started', {
      playerName: playerData.name,
      personalityType: playerData.personalityType,
      preferredDifficulty: playerData.preferredDifficulty
    });
  };

  const processChoice = (actionKey: string, isCorrect: boolean) => {
    setSelectedChoice(actionKey);
    setShowResult(true);
    setAttempts(prev => prev + 1);
    
    track('answer_submitted', {
      scenarioIndex: currentScenarioIndex,
      scenarioTitle: currentScenario.title,
      answerKey: actionKey,
      isCorrect,
      attempts: attempts + 1,
      streak: playerData.streak
    });
    
    if (isCorrect) {
      const baseXP = Math.floor(currentScenario.xpReward * difficulty);
      const streakBonus = playerData.streak * 15;
      const comboBonus = comboCount * 25;
      const difficultyBonus = Math.floor(difficulty * 20);
      const totalXP = baseXP + streakBonus + comboBonus + difficultyBonus;
      const newComboCount = comboCount + 1;

      setPlayerData(prev => ({
        ...prev,
        score: prev.score + 1,
        xp: prev.xp + totalXP,
        streak: prev.streak + 1,
        level: Math.floor((prev.xp + totalXP) / 100) + 1,
        conceptsMastered: [...new Set([...prev.conceptsMastered, currentScenario.concept])]
      }));

      setComboCount(newComboCount);

      const encouragement = getPersonalizedEncouragement(playerData.personalityType || 'curious', playerData.streak + 1);

      toast({
        title: encouragement,
        description: `+${totalXP} XP • Streak: ${playerData.streak + 1} • Combo: x${newComboCount}${difficulty > 1 ? ` • Difficulty: ${difficulty.toFixed(1)}x` : ''}`,
        duration: 2500,
      });

      setTimeout(() => {
        nextScenario();
      }, 2000);
    } else {
      setPlayerData(prev => ({ ...prev, streak: 0 }));
      setComboCount(0);
      
      const encouragements = [
        "🛡️ Every expert was once a beginner!",
        "🔍 Learning from mistakes makes you stronger!",
        "⚡ Try again - you've got this!",
        "🧠 Knowledge is power!"
      ];
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

      toast({
        title: randomEncouragement,
        description: "Analyze the feedback and try again!",
        duration: 2500,
      });

      setTimeout(() => {
        setShowResult(false);
        setSelectedChoice('');
      }, 2500);
    }
  };

  const nextScenario = () => {
    if (currentScenarioIndex < gameScenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedChoice('');
      setShowResult(false);
      setAttempts(0);
    } else {
      saveToLeaderboard();
      track('game_completed', {
        finalScore: playerData.score,
        finalLevel: playerData.level,
        totalXP: playerData.xp,
        achievementsUnlocked: playerData.achievements.length
      });
      setGameState('leaderboard');
    }
  };

  const resetGame = () => {
    setPlayerData(prev => ({
      ...prev,
      score: 0,
      xp: 0,
      streak: 0,
      conceptsMastered: [],
      achievements: []
    }));
    setCurrentScenarioIndex(0);
    setGameState('intro');
    setSelectedChoice('');
    setShowResult(false);
    setAttempts(0);
    setComboCount(0);
  };

  const handleVoiceCommand = (command: string) => {
    if (command === 'help') {
      // Help widget handles this
    } else if (command === 'next' && showResult) {
      nextScenario();
    } else if (command === 'restart') {
      resetGame();
    }
  };

  const handleVoiceAnswerSelect = (answerIndex: number) => {
    const actions = ['action1', 'action2', 'action3'] as const;
    if (actions[answerIndex] && currentScenario.actions[actions[answerIndex]] && !showResult) {
      const actionKey = actions[answerIndex];
      const isCorrect = currentScenario.actions[actionKey]?.type === 'safe';
      processChoice(actionKey, isCorrect);
    }
  };

  // Theme toggle component
  const ThemeToggle = () => (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        className="p-2"
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('system')}
        className="p-2"
        aria-label="System mode"
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
        className="p-2"
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  );

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4 flex items-center justify-center animate-fade-in">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="max-w-2xl mx-auto animate-scale-in shadow-adventure">
          <CardHeader className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-adventure opacity-20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="text-8xl mb-4 animate-bounce-in">🥷</div>
              <CardTitle className="text-4xl bg-gradient-cyber bg-clip-text text-transparent animate-pulse-glow mb-2">
                Cyber Adventure Academy
              </CardTitle>
              <p className="text-lg text-muted-foreground mb-4">
                Master cybersecurity through immersive challenges with AI-powered personalization!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge className="bg-gradient-reward text-black px-4 py-1 text-sm font-bold animate-bounce-in">
                  🤖 AI-Powered Learning
                </Badge>
                <Badge className="bg-gradient-cyber text-primary-foreground px-4 py-1 text-sm font-bold animate-bounce-in" style={{animationDelay: '0.1s'}}>
                  🎮 Gamified Experience
                </Badge>
                <Badge className="bg-gradient-success text-success-foreground px-4 py-1 text-sm font-bold animate-bounce-in" style={{animationDelay: '0.2s'}}>
                  🏆 Social Competition
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/30 animate-fade-in hover:scale-105 transition-transform" style={{animationDelay: '0.1s'}}>
                <Sword className="h-6 w-6 text-primary animate-pulse" />
                <div>
                  <div className="font-semibold text-primary">Adaptive AI Challenges</div>
                  <div className="text-sm text-muted-foreground">Dynamic difficulty based on your learning style</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-success/10 to-accent/10 rounded-lg border border-success/30 animate-fade-in hover:scale-105 transition-transform" style={{animationDelay: '0.2s'}}>
                <Users className="h-6 w-6 text-success animate-pulse" />
                <div>
                  <div className="font-semibold text-success">Social Learning Hub</div>
                  <div className="text-sm text-muted-foreground">Compete with friends and share achievements</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-warning/10 to-destructive/10 rounded-lg border border-warning/30 animate-fade-in hover:scale-105 transition-transform" style={{animationDelay: '0.3s'}}>
                <TrendingUp className="h-6 w-6 text-warning animate-pulse" />
                <div>
                  <div className="font-semibold text-warning">Performance Analytics</div>
                  <div className="text-sm text-muted-foreground">Track your progress with detailed insights</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Input
                placeholder="Enter your hero name..."
                value={playerData.name}
                onChange={(e) => setPlayerData(prev => ({ ...prev, name: e.target.value.slice(0, 50) }))}
                className="text-center text-lg py-3 border-primary/30 focus:border-primary bg-gradient-to-r from-background to-primary/5"
                onKeyPress={(e) => e.key === 'Enter' && playerData.name && startGame()}
                maxLength={50}
                aria-label="Enter your player name"
              />
              
              {/* Personality & Difficulty Selection */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-muted-foreground mb-2">Learning Style</label>
                  <select
                    className="w-full p-2 bg-background border border-muted rounded-lg"
                    value={playerData.personalityType}
                    onChange={(e) => setPlayerData(prev => ({ ...prev, personalityType: e.target.value as any }))}
                    aria-label="Select learning style"
                  >
                    <option value="curious">🔮 Curious Explorer</option>
                    <option value="analytical">🧠 Analytical Thinker</option>
                    <option value="competitive">🏆 Competitive Fighter</option>
                    <option value="collaborative">🤝 Team Player</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-2">Difficulty</label>
                  <select
                    className="w-full p-2 bg-background border border-muted rounded-lg"
                    value={playerData.preferredDifficulty}
                    onChange={(e) => setPlayerData(prev => ({ ...prev, preferredDifficulty: e.target.value as any }))}
                    aria-label="Select difficulty preference"
                  >
                    <option value="adaptive">🤖 AI Adaptive</option>
                    <option value="challenging">⚡ Always Challenging</option>
                    <option value="steady">🎯 Steady Progress</option>
                  </select>
                </div>
              </div>
              
              <Button 
                onClick={startGame}
                disabled={!playerData.name.trim()}
                className="w-full bg-gradient-adventure hover:shadow-adventure transition-all duration-500 py-3 text-lg font-bold animate-pulse-glow"
                size="lg"
                aria-label="Start your cyber adventure"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Begin Adventure
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4 relative">
        {showAchievement && (
          <div className="fixed top-4 left-4 z-50 p-4 bg-gradient-to-r from-success/80 to-accent/80 text-success-foreground rounded-lg shadow-success border border-success/50 animate-slide-in">
            <div className="flex items-center gap-2">
              <showAchievement.icon className="h-6 w-6" />
              <div>
                <div className="font-semibold">Achievement Unlocked!</div>
                <div className="text-sm">{showAchievement.name}</div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-30">
          <ThemeToggle />
        </div>

        <HelpWidget 
          playerLevel={playerData.level}
          onVoiceToggle={setVoiceEnabled}
          voiceEnabled={voiceEnabled}
        />

        <VoiceAssistant
          enabled={voiceEnabled}
          onCommand={handleVoiceCommand}
          onAnswerSelect={handleVoiceAnswerSelect}
        />

        <Card className="max-w-3xl mx-auto mt-12 bg-card/95 backdrop-blur-md border-primary/30 shadow-cyber animate-fade-in">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              {currentScenario.title}
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-xp text-black text-xs font-bold">
                Level {playerData.level} - {playerData.rank}
              </Badge>
              <Badge className="bg-gradient-reward text-black text-xs font-bold">
                XP: {playerData.xp}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative rounded-md overflow-hidden shadow-md border border-primary/20">
              <img
                src={getScenarioImage(currentScenarioIndex)}
                alt={`Scenario ${currentScenarioIndex + 1}`}
                className="w-full h-48 object-cover object-center"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
                Scenario {currentScenarioIndex + 1} / {gameScenarios.length}
              </div>
            </div>

            <Progress value={(currentScenarioIndex + 1) / gameScenarios.length * 100} className="h-2" />

            <div className="text-lg font-semibold text-muted-foreground">
              {currentScenario.description}
            </div>

            <div className="grid gap-4">
              {Object.entries(currentScenario.choices).map(([key, choice], index) => (
                <Button
                  key={key}
                  variant={selectedChoice === key ? (currentScenario.correctAnswer === key ? "success" : "destructive") : "outline"}
                  className={`w-full justify-start ${selectedChoice ? 'cursor-not-allowed' : 'hover:shadow-md'}`}
                  onClick={() => processChoice(key, currentScenario.correctAnswer === key)}
                  disabled={showResult}
                  aria-label={`Select option ${String.fromCharCode(65 + index)}: ${choice}`}
                >
                  {String.fromCharCode(65 + index)}. {choice}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className={`p-4 rounded-md border ${currentScenario.correctAnswer === selectedChoice ? 'border-success text-success-foreground bg-success/10' : 'border-destructive text-destructive-foreground bg-destructive/10'}`}>
                <div className="font-bold">
                  {currentScenario.correctAnswer === selectedChoice ? "Correct!" : "Incorrect."}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentScenario.correctAnswer === selectedChoice ? currentScenario.correctExplanation : currentScenario.incorrectExplanation}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4 flex flex-col items-center justify-start animate-fade-in">
        <div className="absolute top-4 right-4 z-30">
          <ThemeToggle />
        </div>

        <Card className="max-w-3xl w-full mt-12 bg-card/95 backdrop-blur-md border-primary/30 shadow-cyber animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-reward bg-clip-text text-transparent animate-pulse-glow">
              🏆 Leaderboard
            </CardTitle>
            <p className="text-muted-foreground">Top 10 Cyber Guardians</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {leaderboard.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs text-gray-700 uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-4 py-3">Rank</th>
                      <th scope="col" className="px-4 py-3">Name</th>
                      <th scope="col" className="px-4 py-3">Level</th>
                      <th scope="col" className="px-4 py-3">Score</th>
                      <th scope="col" className="px-4 py-3">Concepts Mastered</th>
                      <th scope="col" className="px-4 py-3">Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{entry.name}</td>
                        <td className="px-4 py-2">{entry.level}</td>
                        <td className="px-4 py-2">{entry.score}</td>
                        <td className="px-4 py-2">{entry.conceptsMastered}</td>
                        <td className="px-4 py-2">{entry.rank} - {entry.title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No scores yet. Be the first to conquer the challenges!
              </div>
            )}

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setGameState('intro')}
              aria-label="Return to intro screen"
            >
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4 relative">
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>
      
      <HelpWidget 
        playerLevel={playerData.level}
        onVoiceToggle={setVoiceEnabled}
        voiceEnabled={voiceEnabled}
      />
      
      <VoiceAssistant
        enabled={voiceEnabled}
        onCommand={handleVoiceCommand}
        onAnswerSelect={handleVoiceAnswerSelect}
      />
      
      {/* Rest of the playing interface would be here - keeping existing structure */}
      <div className="text-center text-muted-foreground">
        Enhanced game interface with all improvements...
      </div>
    </div>
  );
  // Leaderboard & Social Features
  if (gameState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4 flex items-center justify-center animate-fade-in">
        <div className="absolute top-4 right-4 z-30">
          <ThemeToggle />
        </div>
        
        <Card className="max-w-2xl mx-auto animate-scale-in shadow-reward">
          <CardHeader className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-reward opacity-20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce-in">🏆</div>
              <CardTitle className="text-3xl bg-gradient-cyber bg-clip-text text-transparent animate-pulse-glow mb-2">
                Mission Complete!
              </CardTitle>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-warning">Final Score: {playerData.score}/{gameScenarios.length}</div>
                <div className="text-lg text-primary">Level {playerData.level} • {playerData.xp} XP</div>
                <Badge className="bg-gradient-reward text-black px-4 py-2 text-lg font-bold">
                  {playerData.title}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Achievement Showcase */}
            {playerData.achievements.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Medal className="h-5 w-5" />
                  Achievements Unlocked ({playerData.achievements.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {playerData.achievements.map(achId => {
                    const achievement = achievements.find(a => a.id === achId);
                    if (!achievement) return null;
                    return (
                      <div key={achId} className="flex items-center gap-2 p-2 bg-gradient-to-r from-warning/10 to-success/10 rounded-lg border border-warning/30">
                        <achievement.icon className="h-4 w-4 text-warning" />
                        <span className="text-sm font-medium">{achievement.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Leaderboard */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Hall of Fame
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={`${entry.name}-${entry.timestamp}`}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                      entry.name === playerData.name ? 
                        'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary animate-pulse-glow' : 
                        'bg-muted border-muted-foreground/20 hover:bg-muted/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-warning text-warning-foreground' :
                        index === 1 ? 'bg-muted-foreground text-background' :
                        index === 2 ? 'bg-accent text-accent-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{entry.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Level {entry.level} • {entry.conceptsMastered} concepts
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{entry.score}</div>
                      <Badge variant="outline" className="text-xs">
                        {entry.rank}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={resetGame}
                className="flex-1 bg-gradient-adventure hover:shadow-adventure transition-all duration-500"
                size="lg"
                aria-label="Play again"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Play Again
              </Button>
              <Button 
                onClick={() => setGameState('social')}
                variant="outline"
                className="flex-1 border-primary/30 hover:bg-primary/10"
                size="lg"
                aria-label="View social features"
              >
                <Users className="mr-2 h-5 w-5" />
                Social Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Return default intro if no state matches
  return null;
}
