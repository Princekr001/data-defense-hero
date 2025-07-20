import { useState } from "react";
import { Button } from "@/components/ui/button";
import GameHeader from "./GameHeader";
import GameScenario from "./GameScenario";
import GameResults from "./GameResults";
import { gameScenarios } from "@/data/scenarios";
import { useToast } from "@/hooks/use-toast";

export default function DataDefenderGame() {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [userChoice, setUserChoice] = useState<'secure' | 'surrender' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  const totalRounds = 10; // Increased from 5 to 10
  const currentScenario = gameScenarios[currentRound];

  const handleChoice = (choice: 'secure' | 'surrender') => {
    setUserChoice(choice);
    setGameState('feedback');

    const isCorrect = choice === currentScenario.correctChoice;
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct! 🎉",
        description: "You made the secure choice!",
        duration: 2000,
      });
    } else {
      toast({
        title: "Incorrect 😬",
        description: "Learn from this and stay vigilant!",
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
            <h2 className="text-2xl font-semibold mb-4 text-primary">How to Play:</h2>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>• You'll face 10 diverse cybersecurity scenarios</li>
              <li>• Choose between ✅ <strong>SECURE</strong> (safe choice) or ❌ <strong>SURRENDER</strong> (risky choice)</li>
              <li>• Experience different threat categories: phishing, passwords, social engineering, and more</li>
              <li>• Get instant feedback and learn from each decision</li>
              <li>• Aim for the highest score to become a Data Defender!</li>
            </ul>
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
          onRestart={handleRestart} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        <GameHeader 
          score={score} 
          round={currentRound + 1} 
          totalRounds={totalRounds} 
        />
        
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
              className="px-8"
            >
              {currentRound < totalRounds - 1 ? 'Next Scenario' : 'View Results'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}