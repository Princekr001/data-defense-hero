import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { gameScenarios } from "@/data/scenarios";
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
  Globe
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
}

const achievements: Achievement[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Complete your first scenario",
    icon: Star,
    condition: (player) => player.score >= 1,
    reward: 50
  },
  {
    id: "streak_master",
    name: "Streak Master", 
    description: "Achieve a 3-answer streak",
    icon: Flame,
    condition: (player) => player.streak >= 3,
    reward: 100
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Master 3 different concepts",
    icon: Brain,
    condition: (player) => player.conceptsMastered.length >= 3,
    reward: 150
  },
  {
    id: "cyber_ninja",
    name: "Cyber Ninja",
    description: "Reach Level 5",
    icon: Sword,
    condition: (player) => player.level >= 5,
    reward: 200
  },
  {
    id: "security_champion",
    name: "Security Champion", 
    description: "Perfect score on all scenarios",
    icon: Crown,
    condition: (player) => player.score >= gameScenarios.length,
    reward: 500
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

export default function InteractiveCyberGame() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'leaderboard'>('intro');
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
    rank: "Novice"
  });
  
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [comboCount, setComboCount] = useState(0);

  const { toast } = useToast();

  const currentScenario = gameScenarios[currentScenarioIndex];

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cyberGameLeaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

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
        
        toast({
          title: "🏆 Achievement Unlocked!",
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

  // Save to leaderboard
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
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentScenarioIndex(0);
    setAttempts(0);
    setComboCount(0);
  };

  const processChoice = (actionKey: string, isCorrect: boolean) => {
    setSelectedChoice(actionKey);
    setShowResult(true);
    setAttempts(prev => prev + 1);
    
    if (isCorrect) {
      const baseXP = currentScenario.xpReward;
      const streakBonus = playerData.streak * 15;
      const comboBonus = comboCount * 25;
      const totalXP = baseXP + streakBonus + comboBonus;
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

      const rewardEmojis = ["🎯", "⚡", "💎", "🔥", "⭐"];
      const randomEmoji = rewardEmojis[Math.floor(Math.random() * rewardEmojis.length)];

      toast({
        title: `${randomEmoji} Cyber Defense Activated!`,
        description: `+${totalXP} XP • Streak: ${playerData.streak + 1} • Combo: x${newComboCount}`,
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
      setGameState('leaderboard');
    }
  };

  const resetGame = () => {
    setPlayerData({
      name: '',
      score: 0,
      level: 1,
      xp: 0,
      streak: 0,
      conceptsMastered: [],
      achievements: [],
      title: "Security Scout",
      rank: "Novice"
    });
    setCurrentScenarioIndex(0);
    setGameState('intro');
    setSelectedChoice('');
    setShowResult(false);
    setAttempts(0);
    setComboCount(0);
  };

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4 flex items-center justify-center animate-fade-in">
        <Card className="max-w-2xl mx-auto animate-scale-in shadow-adventure">
          <CardHeader className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-adventure opacity-20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="text-8xl mb-4 animate-bounce-in">🥷</div>
              <CardTitle className="text-4xl bg-gradient-cyber bg-clip-text text-transparent animate-pulse-glow mb-2">
                Cyber Adventure Academy
              </CardTitle>
              <p className="text-lg text-muted-foreground mb-4">
                Embark on an epic cybersecurity journey!
              </p>
              <Badge className="bg-gradient-reward text-black px-4 py-1 text-sm font-bold animate-bounce-in">
                Adventure Mode Activated 🚀
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/30 animate-fade-in hover:scale-105 transition-transform" style={{animationDelay: '0.1s'}}>
                <Sword className="h-6 w-6 text-primary animate-pulse" />
                <div>
                  <div className="font-semibold text-primary">Battle Cyber Threats</div>
                  <div className="text-sm text-muted-foreground">Face real-world security challenges</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-success/10 to-accent/10 rounded-lg border border-success/30 animate-fade-in hover:scale-105 transition-transform" style={{animationDelay: '0.2s'}}>
                <Gem className="h-6 w-6 text-success animate-pulse" />
                <div>
                  <div className="font-semibold text-success">Earn Rewards & XP</div>
                  <div className="text-sm text-muted-foreground">Level up with streaks and combos</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-warning/10 to-destructive/10 rounded-lg border border-warning/30 animate-fade-in hover:scale-105 transition-transform" style={{animationDelay: '0.3s'}}>
                <Crown className="h-6 w-6 text-warning animate-pulse" />
                <div>
                  <div className="font-semibold text-warning">Unlock Achievements</div>
                  <div className="text-sm text-muted-foreground">Become the ultimate Cyber Guardian</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Input
                placeholder="Enter your hero name..."
                value={playerData.name}
                onChange={(e) => setPlayerData(prev => ({ ...prev, name: e.target.value }))}
                className="text-center text-lg py-3 border-primary/30 focus:border-primary bg-gradient-to-r from-background to-primary/5"
                onKeyPress={(e) => e.key === 'Enter' && playerData.name && startGame()}
              />
              <Button 
                onClick={startGame}
                disabled={!playerData.name}
                className="w-full bg-gradient-adventure hover:shadow-adventure transition-all duration-500 py-3 text-lg font-bold animate-pulse-glow"
                size="lg"
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

  // Main Game Interface
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4 relative">
        
        {/* Achievement Popup */}
        {showAchievement && (
          <div className="fixed top-4 right-4 z-50 animate-scale-in">
            <Card className="bg-gradient-reward border-warning shadow-reward animate-pulse-glow">
              <CardContent className="p-4 text-center">
                <showAchievement.icon className="h-8 w-8 mx-auto mb-2 text-warning" />
                <div className="font-bold text-warning-foreground">{showAchievement.name}</div>
                <div className="text-sm text-warning-foreground/80">{showAchievement.description}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="container mx-auto max-w-4xl animate-fade-in">
          
          {/* Enhanced Player Status */}
          <Card className="mb-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-success/10 border-primary/40 animate-scale-in shadow-cyber">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="text-3xl animate-bounce-in">🥷</div>
                    <div className="absolute -top-1 -right-1 text-xs animate-pulse-glow">
                      {playerData.level}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-primary flex items-center gap-2">
                      {playerData.name}
                      <Badge variant="outline" className="bg-gradient-cyber text-primary-foreground border-primary animate-pulse-glow">
                        {playerData.rank}
                      </Badge>
                    </h2>
                    <div className="text-sm text-muted-foreground">{playerData.title}</div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-warning" />
                        <span className="text-warning font-semibold">{playerData.xp} XP</span>
                      </div>
                      {playerData.streak > 0 && (
                        <Badge variant="outline" className="bg-gradient-to-r from-warning/20 to-destructive/20 text-warning border-warning animate-pulse-glow">
                          <Flame className="h-3 w-3 mr-1" />
                          {playerData.streak}
                        </Badge>
                      )}
                      {comboCount > 1 && (
                        <Badge variant="outline" className="bg-gradient-to-r from-success/20 to-accent/20 text-success border-success animate-bounce-in">
                          <Zap className="h-3 w-3 mr-1" />
                          x{comboCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary animate-bounce-in flex items-center gap-1">
                    <Trophy className="h-6 w-6 text-warning" />
                    {playerData.score}
                  </div>
                  <div className="text-xs text-muted-foreground">Mission Score</div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Mission Progress</span>
                  <span>{currentScenarioIndex + 1} / {gameScenarios.length}</span>
                </div>
                <Progress 
                  value={(currentScenarioIndex / gameScenarios.length) * 100} 
                  className="h-2 bg-muted shadow-inner"
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Scenario with Image */}
          <Card className="animate-slide-in-right shadow-cyber hover:shadow-adventure transition-all duration-300">
            <CardHeader className="pb-3 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src={getScenarioImage(currentScenarioIndex)} 
                  alt="Cyber scenario"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Shield className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <div>
                    <div className="text-primary">{currentScenario.title}</div>
                    <div className="text-sm font-normal text-muted-foreground flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="capitalize text-xs">
                        {currentScenario.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {currentScenario.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-muted/50 to-primary/5 p-4 rounded-lg border border-primary/20 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary mt-0.5 animate-pulse" />
                  <p className="text-sm leading-relaxed">{currentScenario.situation}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  Choose Your Action, {playerData.name}
                </h4>
                
                <div className="grid gap-3">
                  {Object.entries(currentScenario.actions).map(([key, action]: [string, any], index) => {
                    const isSelected = selectedChoice === key;
                    const isCorrect = action.type === 'safe';
                    
                    return (
                      <div 
                        key={key} 
                        className="animate-fade-in hover:scale-102 transition-all duration-300" 
                        style={{animationDelay: `${index * 0.2}s`}}
                      >
                        <Button
                          variant={isSelected ? (isCorrect ? "default" : "destructive") : "outline"}
                          className={`w-full p-4 h-auto text-left justify-start transition-all duration-500 ${
                            !selectedChoice ? 'hover:shadow-lg hover:border-primary/50' : ''
                          } ${isSelected && isCorrect ? 'bg-gradient-success shadow-success animate-pulse-glow' : ''} ${
                            isSelected && !isCorrect ? 'bg-gradient-danger shadow-danger animate-pulse-glow' : ''
                          }`}
                          onClick={() => !selectedChoice && processChoice(key, isCorrect)}
                          disabled={!!selectedChoice}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex-shrink-0">
                              {!selectedChoice && <Target className="h-5 w-5 text-muted-foreground" />}
                              {isSelected && isCorrect && <Shield className="h-5 w-5 text-success-foreground animate-bounce-in" />}
                              {isSelected && !isCorrect && <AlertTriangle className="h-5 w-5 text-destructive-foreground animate-bounce-in" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-base mb-1">{action.text}</div>
                              {showResult && isSelected && (
                                <div className={`text-sm animate-fade-in flex items-center gap-2 ${
                                  isCorrect ? 'text-success-foreground' : 'text-destructive-foreground'
                                }`}>
                                  {isCorrect ? (
                                    <>
                                      <Medal className="h-4 w-4" />
                                      Excellent choice! +{currentScenario.xpReward + (playerData.streak * 15) + (comboCount * 25)} XP
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="h-4 w-4" />
                                      Risky move! Learn and try again
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {showResult && (
                <div className="mt-4 p-4 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg border border-accent/30 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <div className="font-semibold text-accent mb-1">Learning Insight</div>
                      <div className="text-sm text-muted-foreground">{currentScenario.feedback.concept}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Enhanced Leaderboard
  if (gameState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4 flex items-center justify-center animate-fade-in">
        <Card className="max-w-3xl mx-auto w-full animate-scale-in shadow-adventure">
          <CardHeader className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-reward opacity-20"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce-in">🏆</div>
              <CardTitle className="text-3xl bg-gradient-cyber bg-clip-text text-transparent mb-2">
                Mission Complete, {playerData.name}!
              </CardTitle>
              <Badge className="bg-gradient-reward text-black px-4 py-2 text-base font-bold">
                {playerData.rank} • {playerData.title}
              </Badge>
              <p className="text-muted-foreground mt-4">
                You've mastered {playerData.conceptsMastered.length} cyber concepts and earned {playerData.achievements.length} achievements
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Player Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-success rounded-lg animate-pulse-glow">
                <div className="text-2xl font-bold text-success-foreground">{playerData.score}</div>
                <div className="text-success-foreground/80 text-sm">Final Score</div>
              </div>
              <div className="text-center p-4 bg-gradient-cyber rounded-lg animate-pulse-glow">
                <div className="text-2xl font-bold text-primary-foreground">{playerData.level}</div>
                <div className="text-primary-foreground/80 text-sm">Level Reached</div>
              </div>
              <div className="text-center p-4 bg-gradient-adventure rounded-lg animate-pulse-glow">
                <div className="text-2xl font-bold text-warning-foreground">{playerData.xp}</div>
                <div className="text-warning-foreground/80 text-sm">Total XP</div>
              </div>
              <div className="text-center p-4 bg-gradient-reward rounded-lg animate-pulse-glow">
                <div className="text-2xl font-bold text-black">{playerData.achievements.length}</div>
                <div className="text-black/80 text-sm">Achievements</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-xl">
                <Trophy className="h-6 w-6 text-warning" />
                Hall of Cyber Champions
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg animate-fade-in transition-all hover:scale-102 ${
                      entry.name === playerData.name ? 
                        'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50 shadow-cyber' : 
                        'bg-muted/50 hover:bg-muted/70'
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`font-bold text-2xl ${
                        index === 0 ? 'text-warning' : 
                        index === 1 ? 'text-muted-foreground' : 
                        index === 2 ? 'text-warning/70' : 'text-muted-foreground'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">{entry.rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{entry.score} pts</div>
                      <div className="text-sm text-muted-foreground">
                        Lv.{entry.level} • {entry.conceptsMastered} concepts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={resetGame} 
                className="flex-1 bg-gradient-adventure hover:shadow-adventure transition-all duration-500 py-3 text-lg font-bold"
              >
                <Rocket className="mr-2 h-5 w-5" />
                New Adventure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}