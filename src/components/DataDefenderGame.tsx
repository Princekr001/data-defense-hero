import { useState } from "react";
import { Button } from "@/components/ui/button";
import GameHeader from "./GameHeader";
import EraMap from "./EraMap";
import SimplifiedLearningScenario from "./SimplifiedLearningScenario";
import PlayerNameInput from "./PlayerNameInput";
import Leaderboard from "./Leaderboard";
import { gameEras, type Era, type TimelineEvent } from "@/data/eras";
import { gameScenarios } from "@/data/scenarios";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { History } from "lucide-react";

export default function DataDefenderGame() {
  // Core game state
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'era-map' | 'name-input' | 'playing' | 'feedback' | 'leaderboard'>('era-map');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  
  // Time travel game state
  const [currentEra, setCurrentEra] = useState<Era | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [dataLeaks, setDataLeaks] = useState(0);
  
  const { toast } = useToast();

  // Get scenarios for specific era
  const getEraScenarios = (eraId: string) => {
    const eraFilters = {
      'era-2005': ['phishing', 'password', 'malware'],
      'era-2010': ['social', 'phishing', 'privacy'],
      'era-2020': ['malware', 'network', 'scam'],
      'era-2035': ['phishing', 'social', 'network', 'gaming']
    };
    
    const categories = eraFilters[eraId as keyof typeof eraFilters] || ['phishing'];
    return gameScenarios.filter(scenario => categories.includes(scenario.category));
  };

  const totalRounds = currentEra ? getEraScenarios(currentEra.id).length : 10;
  const currentScenario = currentEra ? getEraScenarios(currentEra.id)[currentRound] : (gameScenarios && gameScenarios[currentRound]) ? gameScenarios[currentRound] : gameScenarios[0];

  const handleActionSelect = (actionKey: string, isCorrect: boolean) => {
    if (actionKey === '') {
      setSelectedAction(null);
      setGameState('playing');
      return;
    }

    setSelectedAction(actionKey);
    setGameState('feedback');
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct! 🛡️",
        description: "Great cyber awareness! You're protecting the digital world.",
        duration: 2000,
      });
    } else {
      toast({
        title: "Learning Opportunity! 💡",
        description: "Every mistake is a chance to learn. Try a different approach!",
        duration: 2000,
      });
    }
  };

  const handleNext = () => {
    if (currentRound < totalRounds - 1) {
      setCurrentRound(currentRound + 1);
      setGameState('playing');
      setSelectedAction(null);
    } else {
      setGameState('leaderboard');
    }
  };

  const handleRestart = () => {
    setCurrentRound(0);
    setScore(0);
    setGameState('era-map');
    setSelectedAction(null);
    setCurrentEra(null);
    setTimelineEvents([]);
    setDataLeaks(0);
  };

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setGameState('playing');
  };
  
  const handleEraSelect = (era: Era) => {
    setCurrentEra(era);
    setGameState('name-input');
    setCurrentRound(0);
    setDataLeaks(0);
    setScore(0);
  };

  if (gameState === 'era-map') {
    return (
      <EraMap
        currentEra={currentEra?.id || null}
        timelineEvents={timelineEvents}
        onEraSelect={handleEraSelect}
        firewallEnergy={{ current: 100, max: 100 }}
      />
    );
  }

  if (gameState === 'name-input') {
    return (
      <PlayerNameInput 
        onNameSubmit={handleNameSubmit} 
        era={currentEra}
      />
    );
  }

  if (gameState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Leaderboard 
          currentPlayer={{
            name: playerName,
            score: score,
            totalQuestions: totalRounds,
            era: currentEra?.name
          }}
          onPlayAgain={handleRestart} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
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

        {/* Simplified Game Header */}
        <div className="mb-8 space-y-4">
          <GameHeader 
            score={score} 
            round={currentRound + 1} 
            totalRounds={totalRounds} 
          />
            
          {/* Player Status */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <p className="font-bold text-primary">{playerName}</p>
                    <p className="text-sm text-muted-foreground">Cyber Defender</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-xl font-bold text-primary">{currentRound + 1}/{totalRounds}</p>
                </div>
              </div>
              <Progress value={((currentRound + 1) / totalRounds) * 100} className="mt-4 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Simplified Learning Scenario */}
        <div className="mb-8">
          <SimplifiedLearningScenario
            scenario={currentScenario}
            onActionSelect={handleActionSelect}
            showFeedback={gameState === 'feedback'}
            selectedAction={selectedAction}
            playerName={playerName}
          />
        </div>

        {gameState === 'feedback' && (
          <div className="text-center mt-8">
            <Button 
              variant="default" 
              size="lg" 
              onClick={handleNext}
              className="px-8 text-lg"
            >
              {currentRound < totalRounds - 1 ? 'Continue Learning Journey' : 'View Results 🏆'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}