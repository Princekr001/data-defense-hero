import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield, AlertTriangle, RotateCcw, Zap, Award, Star, Crown } from "lucide-react";
import { getLevelData } from "@/data/levels";

interface GameResultsProps {
  score: number;
  totalRounds: number;
  xp?: number;
  level?: number;
  maxStreak?: number;
  achievements?: string[];
  onRestart: () => void;
}

export default function GameResults({ 
  score, 
  totalRounds, 
  xp = 0, 
  level = 1, 
  maxStreak = 0, 
  achievements = [], 
  onRestart 
}: GameResultsProps) {
  const percentage = Math.round((score / totalRounds) * 100);
  const finalLevelData = getLevelData(level);
  
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

          {/* Final Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-2">{score}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <div className="text-3xl font-bold text-secondary mb-2">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Zap className="h-6 w-6 text-yellow-600" />
                <div className="text-3xl font-bold text-yellow-600">{xp}</div>
              </div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20 relative overflow-hidden">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Crown className="h-6 w-6 text-primary" />
                <div className="text-3xl font-bold text-primary">{level}</div>
              </div>
              <div className="text-sm text-muted-foreground">Final Level</div>
              <div className="text-xs font-semibold text-primary mt-1">
                {finalLevelData.icon} {finalLevelData.title}
              </div>
              <div className="text-xs text-muted-foreground">{finalLevelData.rank}</div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-full -translate-y-6 translate-x-6"></div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-600 mb-2">🔥 {maxStreak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Award className="h-5 w-5 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{achievements.length}</div>
              </div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
          </div>

          {/* Achievement Showcase */}
          {achievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Achievements Unlocked
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {achievements.map((achievement, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-700 px-4 py-2"
                  >
                    {achievement === 'first-defender' && '🏆 First Defender'}
                    {achievement === 'streak-master' && '🔥 Streak Master'}
                    {achievement === 'xp-warrior' && '⚡ XP Warrior'}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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