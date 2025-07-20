import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Shield, AlertTriangle, RotateCcw } from "lucide-react";

interface GameResultsProps {
  score: number;
  totalRounds: number;
  onRestart: () => void;
}

export default function GameResults({ score, totalRounds, onRestart }: GameResultsProps) {
  const percentage = Math.round((score / totalRounds) * 100);
  
  const getResultMessage = () => {
    if (percentage >= 80) {
      return {
        title: "🛡️ Cyber Security Champion!",
        message: "Excellent work! You're well-prepared to defend against online threats.",
        icon: <Trophy className="h-12 w-12 text-matrix-green" />,
        bgClass: "bg-success/10 border-success"
      };
    } else if (percentage >= 60) {
      return {
        title: "🎯 Data Defender in Training",
        message: "Good job! With a bit more practice, you'll be a security expert.",
        icon: <Shield className="h-12 w-12 text-primary" />,
        bgClass: "bg-primary/10 border-primary"
      };
    } else {
      return {
        title: "⚠️ Security Awareness Needed",
        message: "You're vulnerable to cyber threats! Time to level up your security knowledge.",
        icon: <AlertTriangle className="h-12 w-12 text-destructive" />,
        bgClass: "bg-destructive/10 border-destructive"
      };
    }
  };

  const result = getResultMessage();

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <Card className="bg-card border-border shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex justify-center mb-4">
            {result.icon}
          </div>
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            Game Complete!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${result.bgClass}`}>
            <h2 className="text-2xl font-bold mb-3">{result.title}</h2>
            <p className="text-lg leading-relaxed mb-4">{result.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{score}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Remember:</h3>
            <ul className="text-left text-sm space-y-1 text-muted-foreground">
              <li>• Always verify suspicious links and emails</li>
              <li>• Use strong, unique passwords for all accounts</li>
              <li>• Be cautious with personal information online</li>
              <li>• Keep your software and apps updated</li>
              <li>• Think before you click, share, or download</li>
            </ul>
          </div>

          <Button
            variant="cyber"
            size="xl"
            onClick={onRestart}
            className="w-full md:w-auto"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}