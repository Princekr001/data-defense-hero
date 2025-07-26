import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Star, Crown, Zap, RotateCcw } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: number;
  era?: string;
}

interface LeaderboardProps {
  currentPlayer: {
    name: string;
    score: number;
    totalQuestions: number;
    era?: string;
  };
  onPlayAgain: () => void;
}

export default function Leaderboard({ currentPlayer, onPlayAgain }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentPlayerRank, setCurrentPlayerRank] = useState<number>(0);

  useEffect(() => {
    // Load existing leaderboard from localStorage
    const savedLeaderboard = localStorage.getItem('cyber-defender-leaderboard');
    let existingEntries: LeaderboardEntry[] = savedLeaderboard ? JSON.parse(savedLeaderboard) : [];

    // Add current player's score
    const newEntry: LeaderboardEntry = {
      name: currentPlayer.name,
      score: currentPlayer.score,
      totalQuestions: currentPlayer.totalQuestions,
      percentage: Math.round((currentPlayer.score / currentPlayer.totalQuestions) * 100),
      timestamp: Date.now(),
      era: currentPlayer.era
    };

    // Add to leaderboard and sort by percentage, then by score
    existingEntries.push(newEntry);
    existingEntries.sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return b.score - a.score;
    });

    // Keep only top 10
    existingEntries = existingEntries.slice(0, 10);

    // Find current player's rank
    const playerRank = existingEntries.findIndex(entry => 
      entry.name === newEntry.name && 
      entry.timestamp === newEntry.timestamp
    ) + 1;

    setLeaderboard(existingEntries);
    setCurrentPlayerRank(playerRank);

    // Save updated leaderboard
    localStorage.setItem('cyber-defender-leaderboard', JSON.stringify(existingEntries));
  }, [currentPlayer]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30';
      default: return 'bg-card border-border';
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 75) return 'text-blue-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🏆 Cyber Defender Leaderboard
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Current Player Result */}
      <Card className={`border-2 ${currentPlayerRank <= 3 ? getRankColor(currentPlayerRank) : 'border-primary/20 bg-primary/5'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🛡️</div>
              <div>
                <h3 className="text-2xl font-bold text-primary">{currentPlayer.name}</h3>
                <p className="text-muted-foreground">Your Result</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {getRankIcon(currentPlayerRank)}
                <span className="text-2xl font-bold">#{currentPlayerRank}</span>
              </div>
              <Badge variant="outline" className={`${getPercentageColor(Math.round((currentPlayer.score / currentPlayer.totalQuestions) * 100))} border-current`}>
                {currentPlayer.score}/{currentPlayer.totalQuestions} ({Math.round((currentPlayer.score / currentPlayer.totalQuestions) * 100)}%)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Top Cyber Defenders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboard.map((entry, index) => {
            const rank = index + 1;
            const isCurrentPlayer = entry.name === currentPlayer.name && entry.timestamp === Date.now();
            
            return (
              <Card 
                key={`${entry.name}-${entry.timestamp}`}
                className={`${getRankColor(rank)} ${isCurrentPlayer ? 'ring-2 ring-primary' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(rank)}
                        <span className="text-lg font-bold">#{rank}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{entry.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                          {entry.era && ` • ${entry.era}`}
                        </p>
                      </div>
                      {isCurrentPlayer && (
                        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{entry.score}/{entry.totalQuestions}</div>
                      <div className={`text-sm font-medium ${getPercentageColor(entry.percentage)}`}>
                        {entry.percentage}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-green-400 mb-3">
            {currentPlayerRank === 1 ? '👑 Congratulations, Cyber Champion!' : 
             currentPlayerRank <= 3 ? '🥉 Excellent job, top defender!' :
             '🛡️ Keep practicing to improve your rank!'}
          </h3>
          <p className="text-muted-foreground mb-4">
            Every cyber defender makes the digital world safer. Share your knowledge with others!
          </p>
          <Button onClick={onPlayAgain} size="lg" className="px-8">
            <RotateCcw className="h-5 w-5 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
