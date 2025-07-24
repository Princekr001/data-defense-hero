import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GameHeader from "./GameHeader";
import GameScenario from "./GameScenario";
import GameResults from "./GameResults";
import CharacterSelect, { Character } from "./CharacterSelect";
import GameTimer from "./GameTimer";
import PenaltyModal from "./PenaltyModal";
import { gameScenarios } from "@/data/scenarios";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Shield, Star, Award, Crown, Clock, AlertTriangle } from "lucide-react";
import { getLevelData, getNextLevelData, calculateLevel, getLevelProgress } from "@/data/levels";

export default function DataDefenderGame() {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'character-select' | 'playing' | 'feedback' | 'finished' | 'penalty'>('character-select');
  const [userChoice, setUserChoice] = useState<'secure' | 'surrender' | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [penaltyReason, setPenaltyReason] = useState<'wrong-answer' | 'timeout'>('wrong-answer');
  const { toast } = useToast();

  const totalRounds = 10;
  const currentScenario = gameScenarios[currentRound];
  
  // Enhanced level calculations
  const currentLevel = calculateLevel(xp);
  const currentLevelData = getLevelData(currentLevel);
  const nextLevelData = getNextLevelData(currentLevel);
  const levelProgress = getLevelProgress(xp, currentLevel);
  
  // XP bonus calculation based on level
  const getXpBonus = (baseXp: number): number => {
    const bonusPercentage = Math.max(0, (currentLevel - 1) * 5); // 5% per level above 1
    return Math.floor(baseXp * (bonusPercentage / 100));
  };
  
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
    setTimerActive(false);
    setUserChoice(choice);
    setGameState('feedback');

    const isCorrect = choice === currentScenario.correctChoice;
    
    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      const baseXp = 50;
      const difficultyMultiplier = currentScenario.difficulty === 'hard' ? 2 : currentScenario.difficulty === 'medium' ? 1.5 : 1;
      const streakBonus = Math.min(newStreak * 10, 50);
      const levelBonus = getXpBonus(baseXp);
      const earnedXp = Math.floor(baseXp * difficultyMultiplier + streakBonus + levelBonus);
      const newXp = xp + earnedXp;
      const newLevel = calculateLevel(newXp);
      
      setScore(newScore);
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      setXp(newXp);
      
      if (newLevel > level) {
        const newLevelData = getLevelData(newLevel);
        setLevel(newLevel);
        toast({
          title: `🎊 LEVEL UP! ${newLevelData.icon}`,
          description: `${newLevelData.title} - ${newLevelData.rank} Rank Achieved!`,
          duration: 5000,
        });
        
        // Show rewards
        if (newLevelData.rewards.length > 0) {
          setTimeout(() => {
            toast({
              title: "🎁 New Rewards Unlocked!",
              description: newLevelData.rewards.join(", "),
              duration: 4000,
            });
          }, 1500);
        }
      }
      
      checkAchievements(newScore, newStreak, newXp);
      
      const bonusText = levelBonus > 0 ? ` (+${levelBonus} level bonus)` : '';
      toast({
        title: "Correct! 🎉",
        description: `+${earnedXp} XP earned! ${streakBonus > 0 ? `(+${streakBonus} streak)` : ''}${bonusText}`,
        duration: 3000,
      });
    } else {
      // HARSH PENALTY: Wrong answer = restart from level 1
      handlePenalty('wrong-answer');
    }
  };

  const handleTimeout = () => {
    setTimerActive(false);
    // HARSH PENALTY: Timeout = restart from level 1
    handlePenalty('timeout');
  };

  const handlePenalty = (reason: 'wrong-answer' | 'timeout') => {
    const lostLevel = level - 1;
    const lostXp = xp;
    
    setPenaltyReason(reason);
    setShowPenaltyModal(true);
    
    // Reset everything to level 1
    setScore(0);
    setXp(0);
    setLevel(1);
    setStreak(0);
    setCurrentRound(0);
    setAchievements([]);
    setGameState('penalty');
  };

  const handleNext = () => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound(currentRound + 1);
      setGameState('playing');
      setUserChoice(null);
      setTimerActive(true);
      setTimerKey(prev => prev + 1); // Force timer reset
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
    setGameState('character-select');
    setUserChoice(null);
    setSelectedCharacter(null);
    setTimerActive(false);
    setShowPenaltyModal(false);
    setTimerKey(prev => prev + 1);
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setGameState('playing');
    setTimerActive(true);
    setTimerKey(prev => prev + 1);
  };

  const handlePenaltyRestart = () => {
    setShowPenaltyModal(false);
    setGameState('character-select');
    setSelectedCharacter(null);
    setTimerActive(false);
    setTimerKey(prev => prev + 1);
  };

  // Character-based effects
  useEffect(() => {
    if (gameState === 'playing' && !timerActive) {
      setTimerActive(true);
    }
  }, [gameState]);

  if (gameState === 'character-select') {
    return <CharacterSelect onCharacterSelect={handleCharacterSelect} />;
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
          
          {/* Character Info & Timer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCharacter && (
              <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedCharacter.avatar}</div>
                    <div>
                      <p className="font-bold text-secondary">{selectedCharacter.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedCharacter.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <GameTimer
              key={timerKey}
              duration={30}
              onTimeUp={handleTimeout}
              isActive={timerActive && gameState === 'playing'}
            />
          </div>
          
          {/* Enhanced Player Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 relative overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Level {currentLevel}</p>
                    <p className="text-lg font-bold" style={{ color: currentLevelData.color.replace('text-', '') }}>
                      {currentLevelData.icon} {currentLevelData.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{currentLevelData.rank}</p>
                  </div>
                  <Crown className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Progress value={levelProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {nextLevelData ? `${Math.floor(levelProgress)}% to ${nextLevelData.title}` : 'Max Level!'}
                  </p>
                </div>
                {/* Level background decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -translate-y-8 translate-x-8"></div>
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
          
          {/* Level Benefits Display */}
          {currentLevel > 1 && (
            <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-0">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  Current Level Benefits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentLevelData.rewards.map((reward, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-purple-500/10 border-purple-500/30 text-purple-700"
                    >
                      {reward}
                    </Badge>
                  ))}
                </div>
                {nextLevelData && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Next: {nextLevelData.title} ({nextLevelData.xpRequired - xp} XP needed)
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Achievement Badges */}
          {achievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Achievements
              </h3>
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
            </div>
          )}
        </div>
        
        <GameScenario
          scenario={currentScenario}
          onChoice={handleChoice}
          showFeedback={gameState === 'feedback'}
          userChoice={userChoice}
          character={selectedCharacter}
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
        
        <PenaltyModal
          isOpen={showPenaltyModal}
          onRestart={handlePenaltyRestart}
          reason={penaltyReason}
          lostLevel={level - 1}
          lostXp={xp}
        />
      </div>
    </div>
  );
}