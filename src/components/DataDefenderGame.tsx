import { useState } from "react";
import { Button } from "@/components/ui/button";
import GameHeader from "./GameHeader";
import GameScenario from "./GameScenario";
import GameResults from "./GameResults";
import { gameScenarios } from "@/data/scenarios";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Shield, Star, Award } from "lucide-react";

export default function DataDefenderGame() {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [userChoice, setUserChoice] = useState<'secure' | 'surrender' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const totalRounds = 10;
  const currentScenario = gameScenarios[currentRound];
  
  // Gamification calculations
  const xpToNextLevel = level * 100;
  const currentLevelXp = xp % 100;
  const levelProgress = (currentLevelXp / xpToNextLevel) * 100;
  
  const checkAchievements = (newScore: number, newStreak: number, newXp: number) => {
    const newAchievements = [...achievements];
    
    if (newScore >= 5 && !achievements.includes('first-defender')) {
      newAchievements.push('first-defender');
      toast({
        title: "🏆 Achievement Unlocked!",
        description: "First Defender - Score 5 correct answers!",
        duration: 3000,
      });
    }
    
    if (newStreak >= 3 && !achievements.includes('streak-master')) {
      newAchievements.push('streak-master');
      toast({
        title: "🔥 Achievement Unlocked!",
        description: "Streak Master - 3 correct answers in a row!",
        duration: 3000,
      });
    }
    
    if (newXp >= 500 && !achievements.includes('xp-warrior')) {
      newAchievements.push('xp-warrior');
      toast({
        title: "⚡ Achievement Unlocked!",
        description: "XP Warrior - Earned 500 XP!",
        duration: 3000,
      });
    }
    
    setAchievements(newAchievements);
  };

  const handleChoice = (choice: 'secure' | 'surrender') => {
    setUserChoice(choice);
    setGameState('feedback');

    const isCorrect = choice === currentScenario.correctChoice;
    
    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      const baseXp = 50;
      const difficultyMultiplier = currentScenario.difficulty === 'hard' ? 2 : currentScenario.difficulty === 'medium' ? 1.5 : 1;
      const streakBonus = Math.min(newStreak * 10, 50);
      const earnedXp = Math.floor(baseXp * difficultyMultiplier + streakBonus);
      const newXp = xp + earnedXp;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      setScore(newScore);
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      setXp(newXp);
      
      if (newLevel > level) {
        setLevel(newLevel);
        toast({
          title: "🎊 LEVEL UP!",
          description: `Congratulations! You reached Level ${newLevel}!`,
          duration: 4000,
        });
      }
      
      checkAchievements(newScore, newStreak, newXp);
      
      toast({
        title: "Correct! 🎉",
        description: `+${earnedXp} XP earned! ${streakBonus > 0 ? `(+${streakBonus} streak bonus)` : ''}`,
        duration: 3000,
      });
    } else {
      setStreak(0);
      toast({
        title: "Incorrect 😬",
        description: "Streak broken! Learn from this mistake.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleNext = () => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound(currentRound + 1);
      setGameState('playing');
      setUserChoice(null);
    } else {
      setGameState('finished');
    }
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setScore(0);
    setXp(0);
    setLevel(1);
    setStreak(0);
    setMaxStreak(0);
    setAchievements([]);
    setGameState('playing');
    setUserChoice(null);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-cyber bg-clip-text text-transparent mb-4">
              SOS: Secure or Surrender
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Test your cybersecurity knowledge and learn to defend against online threats!
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 mb-8 shadow-cyber">
            <h2 className="text-2xl font-semibold mb-4 text-primary">🎮 Game Features:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">🎯 Core Gameplay</h3>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• 10 cybersecurity scenarios</li>
                  <li>• Choose SECURE or SURRENDER</li>
                  <li>• Multiple threat categories</li>
                  <li>• Instant feedback & learning</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">⚡ Gamification</h3>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Earn XP points for correct answers</li>
                  <li>• Level up your defender rank</li>
                  <li>• Build scoring streaks</li>
                  <li>• Unlock achievements</li>
                </ul>
              </div>
            </div>
          </div>

          <Button 
            variant="cyber" 
            size="xl" 
            onClick={startGame}
            className="text-xl px-12 py-6"
          >
            Start Challenge
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <GameResults 
          score={score} 
          totalRounds={totalRounds}
          xp={xp}
          level={level}
          maxStreak={maxStreak}
          achievements={achievements}
          onRestart={handleRestart} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        {/* Enhanced Game Header with Gamification */}
        <div className="mb-8 space-y-4">
          <GameHeader 
            score={score} 
            round={currentRound + 1} 
            totalRounds={totalRounds} 
          />
          
          {/* Player Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-2xl font-bold text-primary">{level}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Progress value={levelProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentLevelXp}/{xpToNextLevel} XP
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold text-yellow-600">{xp}</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-2xl font-bold text-orange-600">{streak}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-600">🔥</div>
                    <p className="text-xs text-muted-foreground">Max: {maxStreak}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                    <p className="text-2xl font-bold text-purple-600">{achievements.length}</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Achievement Badges */}
          {achievements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-700 px-3 py-1"
                >
                  {achievement === 'first-defender' && '🏆 First Defender'}
                  {achievement === 'streak-master' && '🔥 Streak Master'}
                  {achievement === 'xp-warrior' && '⚡ XP Warrior'}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <GameScenario
          scenario={currentScenario}
          onChoice={handleChoice}
          showFeedback={gameState === 'feedback'}
          userChoice={userChoice}
        />

        {gameState === 'feedback' && (
          <div className="text-center mt-8">
            <Button 
              variant="default" 
              size="lg" 
              onClick={handleNext}
              className="px-8 text-lg"
            >
              {currentRound < totalRounds - 1 ? 'Next Scenario →' : 'View Final Results 🎯'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}