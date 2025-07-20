import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GameScenarioProps {
  scenario: {
    id: number;
    title: string;
    description: string;
    choices: {
      secure: string;
      surrender: string;
    };
    correctChoice: 'secure' | 'surrender';
    explanation: string;
  };
  onChoice: (choice: 'secure' | 'surrender') => void;
  showFeedback: boolean;
  userChoice: 'secure' | 'surrender' | null;
}

export default function GameScenario({ 
  scenario, 
  onChoice, 
  showFeedback, 
  userChoice 
}: GameScenarioProps) {
  const isCorrect = userChoice === scenario.correctChoice;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            Scenario #{scenario.id}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {scenario.title}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg border-l-4 border-l-primary">
            <p className="text-lg leading-relaxed text-foreground">
              {scenario.description}
            </p>
          </div>

          {!showFeedback && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="secure"
                size="xl"
                onClick={() => onChoice('secure')}
                className="h-auto p-6 flex flex-col items-center gap-3"
              >
                <Shield className="h-8 w-8" />
                <span className="text-lg font-semibold">✅ SECURE</span>
                <span className="text-sm opacity-90 text-center leading-tight">
                  {scenario.choices.secure}
                </span>
              </Button>
              
              <Button
                variant="surrender"
                size="xl" 
                onClick={() => onChoice('surrender')}
                className="h-auto p-6 flex flex-col items-center gap-3"
              >
                <AlertTriangle className="h-8 w-8" />
                <span className="text-lg font-semibold">❌ SURRENDER</span>
                <span className="text-sm opacity-90 text-center leading-tight">
                  {scenario.choices.surrender}
                </span>
              </Button>
            </div>
          )}

          {showFeedback && (
            <div className="space-y-4">
              <div className={`p-6 rounded-lg border-2 ${
                isCorrect 
                  ? 'bg-success/10 border-success text-success-foreground' 
                  : 'bg-destructive/10 border-destructive text-destructive-foreground'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {isCorrect ? (
                    <>
                      <Shield className="h-6 w-6" />
                      <span className="text-xl font-bold">Correct! 🎉</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-6 w-6" />
                      <span className="text-xl font-bold">Incorrect! 😬</span>
                    </>
                  )}
                </div>
                <p className="text-lg leading-relaxed">
                  {scenario.explanation}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  The correct choice was: <span className="font-semibold text-primary">
                    {scenario.correctChoice === 'secure' ? '✅ SECURE' : '❌ SURRENDER'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}