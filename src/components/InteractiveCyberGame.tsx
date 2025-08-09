import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { gameScenarios } from "@/data/scenarios";
import { Heart, Brain, Lightbulb, Trophy, Target, MessageCircle, Zap, Shield, AlertTriangle } from "lucide-react";

interface PlayerData {
  name: string;
  score: number;
  level: number;
  xp: number;
  streak: number;
  conceptsMastered: string[];
}

interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  conceptsMastered: number;
  timestamp: number;
}

export default function InteractiveCyberGame() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'leaderboard'>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerData>({
    name: '',
    score: 0,
    level: 1,
    xp: 0,
    streak: 0,
    conceptsMastered: []
  });
  
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const { toast } = useToast();

  const currentScenario = gameScenarios[currentScenarioIndex];

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cyberGameLeaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  // Save to leaderboard
  const saveToLeaderboard = () => {
    const entry: LeaderboardEntry = {
      name: playerData.name,
      score: playerData.score,
      level: playerData.level,
      conceptsMastered: playerData.conceptsMastered.length,
      timestamp: Date.now()
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
  };

  const processChoice = (actionKey: string, isCorrect: boolean) => {
    setSelectedChoice(actionKey);
    setShowResult(true);
    setAttempts(prev => prev + 1);
    
    if (isCorrect) {
      const baseXP = currentScenario.xpReward;
      const streakBonus = playerData.streak * 10;
      const totalXP = baseXP + streakBonus;

      setPlayerData(prev => ({
        ...prev,
        score: prev.score + 1,
        xp: prev.xp + totalXP,
        streak: prev.streak + 1,
        level: Math.floor((prev.xp + totalXP) / 100) + 1,
        conceptsMastered: [...new Set([...prev.conceptsMastered, currentScenario.concept])]
      }));

      toast({
        title: "🎯 Cyber Ninja Move!",
        description: `+${totalXP} XP • ${playerData.streak + 1} streak!`,
        duration: 2000,
      });

      setTimeout(() => {
        nextScenario();
      }, 1500);
    } else {
      setPlayerData(prev => ({ ...prev, streak: 0 }));
      
      toast({
        title: "🛡️ Learning Moment!",
        description: "Every mistake makes you stronger!",
        duration: 2000,
      });

      setTimeout(() => {
        setShowResult(false);
        setSelectedChoice('');
      }, 2000);
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
      conceptsMastered: []
    });
    setCurrentScenarioIndex(0);
    setGameState('intro');
    setSelectedChoice('');
    setShowResult(false);
    setAttempts(0);
  };

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex items-center justify-center animate-fade-in">
        <Card className="max-w-xl mx-auto animate-scale-in shadow-cyber">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4 animate-bounce-in">🥷</div>
            <CardTitle className="text-3xl bg-gradient-cyber bg-clip-text text-transparent animate-pulse-glow">
              Cyber Ninja Academy
            </CardTitle>
            <p className="text-muted-foreground">
              Quick scenarios • Real learning • No time pressure
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20 animate-fade-in" style={{animationDelay: '0.1s'}}>
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm">Learn WHY, not just what</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <Zap className="h-4 w-4 text-success" />
                <span className="text-sm">Quick 30-second scenarios</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg border border-secondary/20 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <Trophy className="h-4 w-4 text-secondary" />
                <span className="text-sm">Earn XP and build streaks</span>
              </div>
            </div>
            
            <div className="space-y-3 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Input
                placeholder="Enter your ninja name..."
                value={playerData.name}
                onChange={(e) => setPlayerData(prev => ({ ...prev, name: e.target.value }))}
                className="text-center"
                onKeyPress={(e) => e.key === 'Enter' && playerData.name && startGame()}
              />
              <Button 
                onClick={startGame}
                disabled={!playerData.name}
                className="w-full bg-gradient-cyber hover:shadow-cyber transition-all duration-300"
                size="lg"
              >
                Start Mission 🚀
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="container mx-auto max-w-3xl animate-fade-in">
          
          {/* Compact Player Status */}
          <Card className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 animate-scale-in">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl animate-bounce-in">🥷</div>
                  <div>
                    <h2 className="font-bold text-primary">{playerData.name}</h2>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" className="animate-pulse-glow">Lv.{playerData.level}</Badge>
                      <span className="text-muted-foreground">{playerData.xp} XP</span>
                      {playerData.streak > 0 && (
                        <Badge variant="outline" className="bg-warning/20 text-warning-foreground border-warning animate-pulse-glow">
                          🔥 {playerData.streak}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary animate-bounce-in">{playerData.score}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
              <Progress value={(currentScenarioIndex / gameScenarios.length) * 100} className="mt-2 h-1.5" />
            </CardContent>
          </Card>

          {/* Scenario */}
          <Card className="mb-4 animate-slide-in-right">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {currentScenario.title}
                </CardTitle>
                <Badge variant="outline" className="capitalize text-xs">{currentScenario.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-3 rounded-lg mb-4 animate-fade-in">
                <p className="text-sm">{currentScenario.situation}</p>
              </div>

              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                What's your move, {playerData.name}?
              </h4>
              
              <div className="grid gap-2">
                {Object.entries(currentScenario.actions).map(([key, action]: [string, any], index) => (
                  <Button
                    key={key}
                    variant={selectedChoice === key ? (action.type === 'safe' ? "default" : "destructive") : "outline"}
                    className={`p-3 h-auto text-left justify-start transition-all duration-300 animate-fade-in ${
                      !selectedChoice ? 'hover:scale-105 hover:shadow-lg' : ''
                    } ${selectedChoice === key && action.type === 'safe' ? 'bg-gradient-success shadow-success' : ''}`}
                    style={{animationDelay: `${index * 0.1}s`}}
                    onClick={() => !selectedChoice && processChoice(key, action.type === 'safe')}
                    disabled={!!selectedChoice}
                  >
                    <div className="w-full flex items-start gap-2">
                      {!selectedChoice && (
                        <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      )}
                      {selectedChoice === key && action.type === 'safe' && (
                        <Shield className="h-4 w-4 mt-0.5 text-success-foreground animate-bounce-in" />
                      )}
                      {selectedChoice === key && action.type === 'risky' && (
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive-foreground animate-bounce-in" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{action.text}</div>
                        {showResult && selectedChoice === key && (
                          <div className={`text-xs mt-1 animate-fade-in ${
                            action.type === 'safe' ? 'text-success-foreground' : 'text-destructive-foreground'
                          }`}>
                            {action.type === 'safe' ? '✅ Smart choice!' : '⚠️ Risky move! Try again...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Leaderboard
  if (gameState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex items-center justify-center animate-fade-in">
        <Card className="max-w-2xl mx-auto w-full animate-scale-in">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2 animate-bounce-in">🏆</div>
            <CardTitle className="text-2xl bg-gradient-cyber bg-clip-text text-transparent">
              Mission Complete, {playerData.name}!
            </CardTitle>
            <p className="text-muted-foreground">You've mastered {playerData.conceptsMastered.length} cyber concepts</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-gradient-success rounded-lg animate-pulse-glow">
              <div className="text-3xl font-bold text-success-foreground">{playerData.score}</div>
              <div className="text-success-foreground/80">Final Score</div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                Top Cyber Ninjas
              </h3>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg animate-fade-in ${
                      entry.name === playerData.name ? 'bg-primary/20 border border-primary/40' : 'bg-muted/50'
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${index < 3 ? 'text-warning' : 'text-muted-foreground'}`}>
                        #{index + 1}
                      </span>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.score} pts • Lv.{entry.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={resetGame} className="w-full bg-gradient-cyber hover:shadow-cyber transition-all duration-300">
              New Mission 🚀
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}