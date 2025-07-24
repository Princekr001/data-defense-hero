import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GameHeader from "./GameHeader";
import GameScenario from "./GameScenario";
import GameResults from "./GameResults";
import CharacterSelect, { Character } from "./CharacterSelect";
import GameTimer from "./GameTimer";
import PenaltyModal from "./PenaltyModal";
import EraMap from "./EraMap";
import AIGuideBot from "./AIGuideBot";
import { gameScenarios } from "@/data/scenarios";
import { gameEras, type Era, type TimelineEvent, type FirewallEnergy } from "@/data/eras";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Shield, Star, Award, Crown, Clock, AlertTriangle, History, Target } from "lucide-react";
import { getLevelData, getNextLevelData, calculateLevel, getLevelProgress } from "@/data/levels";

export default function DataDefenderGame() {
  // Core game state
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'era-map' | 'character-select' | 'playing' | 'feedback' | 'finished' | 'penalty'>('era-map');
  const [userChoice, setUserChoice] = useState<'secure' | 'surrender' | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [penaltyReason, setPenaltyReason] = useState<'wrong-answer' | 'timeout'>('wrong-answer');
  
  // Time travel game state
  const [currentEra, setCurrentEra] = useState<Era | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [firewallEnergy, setFirewallEnergy] = useState<FirewallEnergy>({ current: 100, max: 100, regenRate: 5 });
  const [dataLeaks, setDataLeaks] = useState(0);
  const [missionStartTime, setMissionStartTime] = useState<number>(0);
  
  const { toast } = useToast();

  // Get scenarios for specific era
  const getEraScenarios = (eraId: string) => {
    const eraFilters = {
      'era-2005': ['phishing', 'password', 'malware'],
      'era-2010': ['social', 'phishing', 'privacy'],
      'era-2020': ['malware', 'network', 'scam'],
      'era-2035': ['phishing', 'social', 'network', 'gaming'] // Future AI-driven threats
    };
    
    const categories = eraFilters[eraId as keyof typeof eraFilters] || ['phishing'];
    return gameScenarios.filter(scenario => categories.includes(scenario.category));
  };

  const totalRounds = currentEra ? getEraScenarios(currentEra.id).length : 10;
  const currentScenario = currentEra ? getEraScenarios(currentEra.id)[currentRound] : gameScenarios[currentRound];
  
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
      // Restore firewall energy on correct answer
      setFirewallEnergy(prev => ({
        ...prev,
        current: Math.min(prev.max, prev.current + 20)
      }));
      
      const newScore = score + 1;
      const newStreak = streak + 1;
      const baseXp = 50;
      const eraMultiplier = currentEra?.year === 2035 ? 2.5 : currentEra?.year === 2020 ? 2 : currentEra?.year === 2010 ? 1.5 : 1;
      const difficultyMultiplier = currentScenario.difficulty === 'hard' ? 2 : currentScenario.difficulty === 'medium' ? 1.5 : 1;
      const streakBonus = Math.min(newStreak * 10, 50);
      const levelBonus = getXpBonus(baseXp);
      const earnedXp = Math.floor(baseXp * difficultyMultiplier * eraMultiplier + streakBonus + levelBonus);
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
      const eraBonus = eraMultiplier > 1 ? ` (+${Math.floor((eraMultiplier - 1) * 100)}% era bonus)` : '';
      toast({
        title: "Timeline Secured! 🎉",
        description: `+${earnedXp} XP earned! ${streakBonus > 0 ? `(+${streakBonus} streak)` : ''}${bonusText}${eraBonus}`,
        duration: 3000,
      });
    } else {
      // Create data leak and reduce firewall energy
      const newDataLeaks = dataLeaks + 1;
      setDataLeaks(newDataLeaks);
      setFirewallEnergy(prev => ({
        ...prev,
        current: Math.max(0, prev.current - 30)
      }));
      
      // Update timeline event
      if (currentEra) {
        setTimelineEvents(prev => {
          const existingEvent = prev.find(e => e.eraId === currentEra.id);
          if (existingEvent) {
            return prev.map(e => 
              e.eraId === currentEra.id 
                ? { ...e, dataLeaks: e.dataLeaks + 1 }
                : e
            );
          } else {
            return [...prev, { 
              eraId: currentEra.id, 
              isRepaired: false, 
              dataLeaks: 1, 
              completionTime: 0 
            }];
          }
        });
      }
      
      toast({
        title: "Timeline Breach! ⚠️",
        description: `Data leak created! Firewall energy depleted. This will affect future eras...`,
        duration: 4000,
      });
      
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
      // Era completed - update timeline
      if (currentEra) {
        const completionTime = Math.floor((Date.now() - missionStartTime) / 1000);
        setTimelineEvents(prev => {
          const existingEvent = prev.find(e => e.eraId === currentEra.id);
          if (existingEvent) {
            return prev.map(e => 
              e.eraId === currentEra.id 
                ? { ...e, isRepaired: dataLeaks === 0, completionTime }
                : e
            );
          } else {
            return [...prev, { 
              eraId: currentEra.id, 
              isRepaired: dataLeaks === 0, 
              dataLeaks, 
              completionTime 
            }];
          }
        });
        
        toast({
          title: dataLeaks === 0 ? "🎊 Era Secured!" : "⚠️ Era Compromised",
          description: dataLeaks === 0 
            ? `Perfect timeline repair in ${Math.floor(completionTime / 60)}:${(completionTime % 60).toString().padStart(2, '0')}!`
            : `Timeline damaged with ${dataLeaks} data leaks. Future eras will be affected.`,
          duration: 5000,
        });
      }
      
      setGameState('era-map');
      setCurrentEra(null);
      setCurrentRound(0);
      setDataLeaks(0);
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
    setGameState('era-map');
    setUserChoice(null);
    setSelectedCharacter(null);
    setTimerActive(false);
    setShowPenaltyModal(false);
    setTimerKey(prev => prev + 1);
    setCurrentEra(null);
    setTimelineEvents([]);
    setFirewallEnergy({ current: 100, max: 100, regenRate: 5 });
    setDataLeaks(0);
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setGameState('playing');
    setTimerActive(true);
    setTimerKey(prev => prev + 1);
  };

  const handlePenaltyRestart = () => {
    setShowPenaltyModal(false);
    setGameState('era-map');
    setSelectedCharacter(null);
    setTimerActive(false);
    setTimerKey(prev => prev + 1);
    setCurrentEra(null);
    setCurrentRound(0);
    setDataLeaks(0);
  };
  
  const handleEraSelect = (era: Era) => {
    setCurrentEra(era);
    setGameState('character-select');
    setCurrentRound(0);
    setDataLeaks(0);
    setMissionStartTime(Date.now());
    setFirewallEnergy({ current: 100, max: 100, regenRate: 5 });
  };

  // Character-based effects
  useEffect(() => {
    if (gameState === 'playing' && !timerActive) {
      setTimerActive(true);
    }
  }, [gameState]);

  if (gameState === 'era-map') {
    return (
      <EraMap
        currentEra={currentEra?.id || null}
        timelineEvents={timelineEvents}
        onEraSelect={handleEraSelect}
        firewallEnergy={firewallEnergy}
      />
    );
  }

  if (gameState === 'character-select') {
    return (
      <div className="min-h-screen" style={{ 
        background: currentEra 
          ? `linear-gradient(135deg, ${currentEra.backgroundColor.replace('from-', '').replace('to-', ', ')})` 
          : undefined 
      }}>
        <CharacterSelect 
          onCharacterSelect={handleCharacterSelect} 
          era={currentEra}
        />
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
    <div className="min-h-screen bg-background p-4" style={{ 
      background: currentEra 
        ? `linear-gradient(135deg, ${currentEra.backgroundColor.replace('from-', '').replace('to-', ', ')})` 
        : undefined 
    }}>
      <div className="container mx-auto py-8">
        {/* Era Header */}
        {currentEra && (
          <Card className={`mb-6 p-4 bg-gradient-to-r ${currentEra.backgroundColor} border-${currentEra.theme}`}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{currentEra.icon}</div>
                  <div>
                    <h1 className={`text-2xl font-bold ${currentEra.textColor}`}>
                      {currentEra.year} - {currentEra.name}
                    </h1>
                    <p className="text-muted-foreground">{currentEra.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setGameState('era-map')}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  Timeline
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
          
          {/* Firewall Energy & Mission Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Firewall Energy</p>
                    <p className="text-xl font-bold text-blue-400">{firewallEnergy.current}</p>
                  </div>
                  <Zap className="h-6 w-6 text-blue-400" />
                </div>
                <Progress value={(firewallEnergy.current / firewallEnergy.max) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/5 border-red-500/20">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Data Leaks</p>
                    <p className="text-xl font-bold text-red-400">{dataLeaks}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {dataLeaks === 0 ? 'Timeline Secure' : 'Timeline Corrupted'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Mission Progress</p>
                    <p className="text-xl font-bold text-green-400">{currentRound + 1}/{totalRounds}</p>
                  </div>
                  <Target className="h-6 w-6 text-green-400" />
                </div>
                <Progress value={((currentRound + 1) / totalRounds) * 100} className="mt-2 h-2" />
              </CardContent>
            </Card>
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
        
        <AIGuideBot
          playerScore={score}
          dataLeaks={dataLeaks}
          currentEra={currentEra?.id || ''}
          isVisible={gameState === 'playing' || gameState === 'feedback'}
        />
      </div>
    </div>
  );
}