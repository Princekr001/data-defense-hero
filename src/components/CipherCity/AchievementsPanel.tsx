import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Lock, Gift, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { Achievement } from './types';
import { Resource } from '@/data/cipherCity';

interface AchievementsPanelProps {
  achievements: Achievement[];
  onClose: () => void;
  onClaimReward?: (achievement: Achievement) => void;
}

export default function AchievementsPanel({ achievements, onClose, onClaimReward }: AchievementsPanelProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  
  const getRewardText = (reward: Partial<Resource>) => {
    return Object.entries(reward)
      .map(([key, value]) => `+${value} ${key.replace(/([A-Z])/g, ' $1').trim()}`)
      .join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Trophy className="h-7 w-7 text-yellow-400" />
                    Achievements
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">
                    {unlockedCount} of {totalAchievements} unlocked
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                {Math.round((unlockedCount / totalAchievements) * 100)}%
              </Badge>
            </div>
            <Progress value={(unlockedCount / totalAchievements) * 100} className="h-2 mt-4" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300
                    ${achievement.unlocked 
                      ? 'border-yellow-500/50 bg-yellow-500/10 shadow-lg shadow-yellow-500/10' 
                      : 'border-muted/30 bg-muted/10 opacity-70'
                    }
                  `}
                >
                  {/* Achievement icon */}
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                      ${achievement.unlocked 
                        ? 'bg-yellow-500/20' 
                        : 'bg-muted/30'
                      }
                    `}>
                      {achievement.unlocked ? achievement.icon : <Lock className="h-6 w-6 text-muted-foreground" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                          {achievement.name}
                        </h3>
                        {achievement.unlocked && (
                          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      
                      {/* Progress bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className={achievement.unlocked ? 'text-yellow-400' : 'text-muted-foreground'}>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className={`h-1.5 ${achievement.unlocked ? 'bg-yellow-500/20' : ''}`}
                        />
                      </div>
                      
                      {/* Reward */}
                      <div className={`
                        mt-3 p-2 rounded-lg text-xs
                        ${achievement.unlocked ? 'bg-yellow-500/10' : 'bg-muted/20'}
                      `}>
                        <div className="flex items-center gap-1">
                          <Gift className={`h-3 w-3 ${achievement.unlocked ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                          <span className={achievement.unlocked ? 'text-yellow-400' : 'text-muted-foreground'}>
                            {getRewardText(achievement.reward)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Unlocked badge */}
                  {achievement.unlocked && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-black text-xs">
                        ✓ Unlocked
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
