import { Shield, Target } from "lucide-react";

interface GameHeaderProps {
  score: number;
  round: number;
  totalRounds: number;
}

export default function GameHeader({ score, round, totalRounds }: GameHeaderProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-cyber-glow" />
          <h1 className="text-4xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
            SOS: Secure or Surrender
          </h1>
          <Target className="h-8 w-8 text-neon-purple" />
        </div>
        <p className="text-lg text-muted-foreground">
          Data Defender Challenge - Make the right choice!
        </p>
      </div>
      
      <div className="flex justify-between items-center bg-card border border-border rounded-lg p-4 shadow-cyber">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Score:</span>
          <span className="text-2xl font-bold text-primary">{score}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Round:</span>
          <span className="text-xl font-semibold text-foreground">
            {round} / {totalRounds}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-cyber transition-all duration-500"
          style={{ width: `${(round / totalRounds) * 100}%` }}
        />
      </div>
    </div>
  );
}