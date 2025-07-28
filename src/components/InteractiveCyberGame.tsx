import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { gameScenarios } from "@/data/scenarios";
import { Heart, Brain, Lightbulb, Trophy, Target, MessageCircle } from "lucide-react";

interface PlayerData {
  name: string;
  score: number;
  level: number;
  xp: number;
  streak: number;
  conceptsMastered: string[];
}

interface AIPersonality {
  name: string;
  emoji: string;
  style: string;
  encouragement: string[];
  hints: string[];
}

interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  conceptsMastered: number;
  timestamp: number;
}

export default function InteractiveCyberGame() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'concept-check' | 'leaderboard' | 'character-setup'>('intro');
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
  const [playerExplanation, setPlayerExplanation] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [characterNames, setCharacterNames] = useState<{[key: string]: string}>({
    friend: 'Alex',
    teacher: 'Ms. Johnson',
    stranger: 'Unknown User',
    colleague: 'Sarah'
  });

  const { toast } = useToast();

  // AI Personality changes based on player performance
  const getAIPersonality = (): AIPersonality => {
    if (playerData.streak >= 5) {
      return {
        name: "CyberMentor Pro",
        emoji: "🧠",
        style: "expert",
        encouragement: ["Exceptional! You're thinking like a true cyber ninja!", "Your intuition is spot-on!", "I'm impressed by your cyber awareness!"],
        hints: ["Consider the deeper implications...", "What would a security expert look for?", "Think about the long-term consequences..."]
      };
    } else if (playerData.streak >= 3) {
      return {
        name: "CyberGuide",
        emoji: "🛡️",
        style: "confident",
        encouragement: ["Great job! You're getting the hang of this!", "Your cybersecurity skills are improving!", "Nice streak going!"],
        hints: ["Look for red flags in the scenario...", "What seems suspicious here?", "Remember the security principles we've learned..."]
      };
    } else if (attempts > 1) {
      return {
        name: "CyberPal",
        emoji: "💫",
        style: "supportive",
        encouragement: ["Don't worry, learning takes practice!", "Every mistake is a step forward!", "You're building important skills!"],
        hints: ["Let's break this down step by step...", "What could go wrong in this situation?", "Think about what you would do in real life..."]
      };
    } else {
      return {
        name: "CyberCoach",
        emoji: "🎯",
        style: "friendly",
        encouragement: ["Let's explore this together!", "You've got this!", "Great thinking!"],
        hints: ["What stands out as unusual?", "Trust your instincts!", "What would make you feel safer?"]
      };
    }
  };

  const currentScenario = gameScenarios[currentScenarioIndex];
  const aiPersonality = getAIPersonality();

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

  const handleNameSubmit = (name: string) => {
    setPlayerData(prev => ({ ...prev, name }));
    setGameState('character-setup');
  };

  const handleCharacterNameChange = (role: string, name: string) => {
    setCharacterNames(prev => ({ ...prev, [role]: name }));
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentScenarioIndex(0);
    setAttempts(0);
  };

  const processChoice = (actionKey: string, isCorrect: boolean) => {
    setSelectedChoice(actionKey);
    setAttempts(prev => prev + 1);
    
    if (isCorrect) {
      // Calculate XP based on attempts (fewer attempts = more XP)
      const baseXP = currentScenario.xpReward;
      const bonusXP = Math.max(0, baseXP - (attempts * 20));
      const streakBonus = playerData.streak * 10;
      const totalXP = baseXP + bonusXP + streakBonus;

      setPlayerData(prev => ({
        ...prev,
        score: prev.score + 1,
        xp: prev.xp + totalXP,
        streak: prev.streak + 1,
        level: Math.floor((prev.xp + totalXP) / 100) + 1,
        conceptsMastered: [...new Set([...prev.conceptsMastered, currentScenario.concept])]
      }));

      toast({
        title: `${aiPersonality.emoji} ${aiPersonality.encouragement[Math.floor(Math.random() * aiPersonality.encouragement.length)]}`,
        description: `+${totalXP} XP (Base: ${baseXP}, Bonus: ${bonusXP}, Streak: ${streakBonus})`,
        duration: 3000,
      });

      setGameState('concept-check');
    } else {
      setPlayerData(prev => ({ ...prev, streak: 0 }));
      setShowHint(true);
      
      toast({
        title: `${aiPersonality.emoji} Learning Opportunity!`,
        description: aiPersonality.hints[Math.floor(Math.random() * aiPersonality.hints.length)],
        duration: 4000,
      });
    }
  };

  const handleExplanationSubmit = () => {
    if (playerExplanation.length < 20) {
      toast({
        title: "Tell me more!",
        description: "Help me understand your thinking with a bit more detail.",
      });
      return;
    }

    // Bonus XP for good explanations
    const explanationBonus = Math.min(50, playerExplanation.length);
    setPlayerData(prev => ({ ...prev, xp: prev.xp + explanationBonus }));

    toast({
      title: "🧠 Thoughtful Analysis!",
      description: `Great explanation! +${explanationBonus} bonus XP`,
      duration: 2000,
    });

    nextScenario();
  };

  const nextScenario = () => {
    if (currentScenarioIndex < gameScenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setGameState('playing');
      setSelectedChoice('');
      setPlayerExplanation('');
      setShowHint(false);
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
    setPlayerExplanation('');
    setShowHint(false);
    setAttempts(0);
  };

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🥷</div>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Cyber Ninja Academy
            </CardTitle>
            <p className="text-lg text-muted-foreground mt-2">
              Master cybersecurity through understanding, not memorization
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
                <span>Learn WHY choices matter, not just what's right</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>AI guide adapts to your learning style</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
                <span>Earn XP for deep thinking and explanations</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
                <span>No time pressure - focus on understanding</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Input
                placeholder="Enter your name to begin your ninja journey..."
                value={playerData.name}
                onChange={(e) => setPlayerData(prev => ({ ...prev, name: e.target.value }))}
                className="text-center text-lg"
                onKeyPress={(e) => e.key === 'Enter' && playerData.name && handleNameSubmit(playerData.name)}
              />
              <Button 
                onClick={() => handleNameSubmit(playerData.name)}
                disabled={!playerData.name}
                className="w-full text-lg py-6"
                size="lg"
              >
                Start Your Cyber Journey 🚀
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Character Setup
  if (gameState === 'character-setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">👋</div>
            <CardTitle className="text-2xl">Welcome, {playerData.name}!</CardTitle>
            <p className="text-muted-foreground">
              Customize character names to make scenarios more relatable
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {Object.entries(characterNames).map(([role, name]) => (
                <div key={role} className="flex items-center gap-3">
                  <label className="font-medium w-20 capitalize">{role}:</label>
                  <Input
                    value={name}
                    onChange={(e) => handleCharacterNameChange(role, e.target.value)}
                    placeholder={`Name for ${role}`}
                  />
                </div>
              ))}
            </div>
            <Button onClick={startGame} className="w-full text-lg py-6" size="lg">
              Begin Cyber Ninja Training 🥷
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Game Interface
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="container mx-auto max-w-4xl">
          
          {/* Player Status Header */}
          <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🥷</div>
                  <div>
                    <h2 className="text-xl font-bold text-primary">{playerData.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">Level {playerData.level}</Badge>
                      <span>{playerData.xp} XP</span>
                      {playerData.streak > 0 && (
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200">
                          🔥 {playerData.streak} streak
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{playerData.score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              </div>
              <Progress value={(currentScenarioIndex / gameScenarios.length) * 100} className="mt-3 h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Scenario {currentScenarioIndex + 1} of {gameScenarios.length}
              </div>
            </CardContent>
          </Card>

          {/* AI Guide */}
          <Card className="mb-6 bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{aiPersonality.emoji}</div>
                <div>
                  <h3 className="font-semibold text-secondary-foreground">{aiPersonality.name}</h3>
                  <p className="text-sm text-muted-foreground">Your AI Cyber Guide</p>
                </div>
              </div>
              {attempts === 0 ? (
                <p className="text-secondary-foreground">
                  Let's explore this scenario together, {playerData.name}. Think about what makes this situation safe or risky.
                </p>
              ) : showHint ? (
                <div className="bg-amber-500/10 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800">Hint</span>
                  </div>
                  <p className="text-amber-700">
                    {aiPersonality.hints[Math.floor(Math.random() * aiPersonality.hints.length)]}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Scenario */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{currentScenario.title}</CardTitle>
                <Badge variant="outline" className="capitalize">{currentScenario.category}</Badge>
              </div>
              <p className="text-muted-foreground">{currentScenario.description}</p>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">The Situation:</h4>
                <p>{currentScenario.situation.replace(/Alex/g, characterNames.friend)}</p>
              </div>

              <h4 className="font-semibold mb-4">What would you do, {playerData.name}?</h4>
              <div className="grid gap-3">
                {Object.entries(currentScenario.actions).map(([key, action]: [string, any]) => (
                  <Button
                    key={key}
                    variant={selectedChoice === key ? "default" : "outline"}
                    className="p-4 h-auto text-left justify-start"
                    onClick={() => processChoice(key, action.type === 'safe')}
                    disabled={!!selectedChoice}
                  >
                    <div className="w-full">
                      <div className="font-medium mb-1">{action.text}</div>
                      {selectedChoice === key && action.type === 'risky' && (
                        <div className="text-sm text-red-600 mt-1">
                          ⚠️ This choice could be risky. Try again!
                        </div>
                      )}
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

  // Concept Check (after correct answer)
  if (gameState === 'concept-check') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">🧠</div>
            <CardTitle className="text-2xl text-green-600">Excellent Choice!</CardTitle>
            <p className="text-muted-foreground">
              Now help me understand your cybersecurity thinking...
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-500/10 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Why was this the right choice?</h4>
              <p className="text-green-700">{currentScenario.feedback.correct}</p>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Explain in your own words why you chose this option:
              </label>
              <Textarea
                value={playerExplanation}
                onChange={(e) => setPlayerExplanation(e.target.value)}
                placeholder={`I chose this because...`}
                className="min-h-20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The more thoughtful your explanation, the more bonus XP you'll earn!
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">💡 Key Concept: {currentScenario.concept}</h4>
              <p className="text-sm">{currentScenario.feedback.concept}</p>
              <div className="mt-3">
                <p className="font-medium text-sm mb-2">Remember these tips:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {currentScenario.feedback.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Button 
              onClick={handleExplanationSubmit}
              className="w-full text-lg py-6"
              size="lg"
              disabled={playerExplanation.length < 10}
            >
              Continue My Ninja Journey 🥷
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Leaderboard
  if (gameState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <CardTitle className="text-2xl">Cyber Ninja Leaderboard</CardTitle>
            <p className="text-muted-foreground">
              You've completed your training, {playerData.name}!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Player Stats */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Your Cyber Ninja Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{playerData.score}</div>
                  <div className="text-muted-foreground">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{playerData.level}</div>
                  <div className="text-muted-foreground">Final Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{playerData.xp}</div>
                  <div className="text-muted-foreground">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{playerData.conceptsMastered.length}</div>
                  <div className="text-muted-foreground">Concepts Mastered</div>
                </div>
              </div>
            </div>

            {/* Concepts Mastered */}
            {playerData.conceptsMastered.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Cybersecurity Concepts You've Mastered:</h4>
                <div className="flex flex-wrap gap-2">
                  {playerData.conceptsMastered.map((concept, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                      ✓ {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Top Players */}
            {leaderboard.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">🏆 Top Cyber Ninjas</h4>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.name === playerData.name ? 'bg-primary/10 border-primary/20' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div>
                          <div className="font-medium">{entry.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Level {entry.level} • {entry.conceptsMastered} concepts
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary">{entry.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={resetGame} variant="outline" className="flex-1">
                Train Again 🔄
              </Button>
              <Button onClick={() => setGameState('leaderboard')} className="flex-1">
                View Stats 📊
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}