import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, Lock, Users, Wifi, Download, Eye, DollarSign, Gamepad2, 
  Shield, Brain, Lightbulb, Star, CheckCircle, AlertCircle
} from "lucide-react";

interface LearningScenarioProps {
  scenario: {
    id: number;
    title: string;
    description: string;
    situation: string;
    actions: {
      action1: { text: string; type: 'safe' | 'risky'; };
      action2: { text: string; type: 'safe' | 'risky'; };
      action3?: { text: string; type: 'safe' | 'risky'; };
    };
    feedback: {
      correct: string;
      concept: string;
      tips: string[];
    };
    category: 'phishing' | 'password' | 'social' | 'network' | 'malware' | 'privacy' | 'scam' | 'gaming';
    difficulty: 'beginner' | 'intermediate' | 'expert';
    xpReward: number;
    concept: string;
  };
  onActionSelect: (actionKey: string, isCorrect: boolean, xpEarned: number) => void;
  showFeedback: boolean;
  selectedAction: string | null;
  character?: {
    name: string;
    avatar: string;
  } | null;
}

export default function LearningScenario({ 
  scenario, 
  onActionSelect, 
  showFeedback, 
  selectedAction,
  character
}: LearningScenarioProps) {
  const [showRetry, setShowRetry] = useState(false);

  const getCategoryIcon = (category: string) => {
    const icons = {
      phishing: Mail, password: Lock, social: Users, network: Wifi,
      malware: Download, privacy: Eye, scam: DollarSign, gaming: Gamepad2
    };
    return icons[category as keyof typeof icons] || Shield;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      phishing: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-300',
      password: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300',
      social: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300',
      network: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-300',
      malware: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-300',
      privacy: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300',
      scam: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-300',
      gaming: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-300'
    };
    return colors[category as keyof typeof colors] || 'from-primary/20 to-primary/10 border-primary/30 text-primary';
  };

  const getDifficultyInfo = (difficulty: string) => {
    const info = {
      beginner: { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: '🌱', label: 'Beginner Friendly' },
      intermediate: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: '⚡', label: 'Intermediate' },
      expert: { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: '🔥', label: 'Expert Level' }
    };
    return info[difficulty as keyof typeof info] || info.beginner;
  };

  const handleActionClick = (actionKey: string) => {
    if (showFeedback) return;

    const action = scenario.actions[actionKey as keyof typeof scenario.actions];
    const isCorrect = action?.type === 'safe';
    const xpEarned = isCorrect ? scenario.xpReward : Math.floor(scenario.xpReward * 0.3); // Partial XP for trying

    onActionSelect(actionKey, isCorrect, xpEarned);

    if (!isCorrect) {
      setShowRetry(true);
    }
  };

  const handleRetry = () => {
    setShowRetry(false);
    // Reset to allow another attempt
    onActionSelect('', false, 0);
  };

  const CategoryIcon = getCategoryIcon(scenario.category);
  const categoryStyle = getCategoryColor(scenario.category);
  const difficultyInfo = getDifficultyInfo(scenario.difficulty);

  const getActionStyle = (actionKey: string, actionType: 'safe' | 'risky') => {
    if (!showFeedback) {
      return actionType === 'safe' 
        ? 'border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 hover:border-emerald-500/50 hover:from-emerald-500/20'
        : 'border-2 border-slate-500/30 bg-gradient-to-br from-slate-500/10 to-slate-600/5 hover:border-slate-500/50 hover:from-slate-500/20';
    }

    if (selectedAction === actionKey) {
      return actionType === 'safe'
        ? 'border-2 border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10'
        : 'border-2 border-red-500 bg-gradient-to-br from-red-500/20 to-red-600/10';
    }

    return 'border-2 border-muted bg-muted/50 opacity-50';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Scenario Header */}
      <Card className={`bg-gradient-to-br ${categoryStyle} border-2`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-4 rounded-xl bg-background/20 backdrop-blur-sm">
              <CategoryIcon className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`${difficultyInfo.color} border-2`}>
                  {difficultyInfo.icon} {difficultyInfo.label}
                </Badge>
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                  {scenario.concept}
                </Badge>
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">{scenario.title}</CardTitle>
          <CardDescription className="text-lg opacity-90">
            {scenario.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Story Section */}
      <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                {character?.avatar || '🧑‍💻'}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-3 text-primary">
                {character?.name || 'Alex'}'s Situation
              </h3>
              <p className="text-lg leading-relaxed text-foreground">
                {scenario.situation}
              </p>
              {!showFeedback && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-primary font-medium flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    What would you do in this situation? Think carefully about each option...
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Selection */}
      {!showFeedback && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-center text-foreground">
            Choose Your Action
          </h3>
          <div className="grid gap-4">
            {Object.entries(scenario.actions).map(([key, action]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getActionStyle(key, action.type)}`}
                onClick={() => handleActionClick(key)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      action.type === 'safe' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {action.type === 'safe' ? <Shield className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                    </div>
                    <p className="text-lg font-medium text-foreground flex-1">
                      {action.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {showFeedback && (
        <div className="space-y-6">
          {/* Action Result */}
          <Card className={`border-2 ${
            scenario.actions[selectedAction as keyof typeof scenario.actions]?.type === 'safe'
              ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500'
              : 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {scenario.actions[selectedAction as keyof typeof scenario.actions]?.type === 'safe' ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-300">Great Choice! 🎉</h3>
                      <p className="text-emerald-400/80">You demonstrated excellent cyber awareness</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-8 w-8 text-amber-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-amber-300">Learning Opportunity! 💡</h3>
                      <p className="text-amber-400/80">Let's explore a safer approach</p>
                    </div>
                  </>
                )}
              </div>
              <p className="text-lg leading-relaxed">
                {scenario.feedback.correct}
              </p>
            </CardContent>
          </Card>

          {/* Concept Learning */}
          <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold text-primary">Key Concept</h3>
              </div>
              <p className="text-lg font-semibold mb-4 text-foreground">
                {scenario.feedback.concept}
              </p>
              <div className="space-y-2">
                {scenario.feedback.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Retry Option for Wrong Answers */}
          {showRetry && (
            <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-blue-300 mb-3">Want to Try Again?</h3>
                <p className="text-foreground mb-4">
                  Understanding comes through practice. Feel free to explore other options!
                </p>
                <Button 
                  onClick={handleRetry}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Try Different Approach
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* XP Progress */}
      <Card className="border border-muted bg-card/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XP Reward</p>
                <p className="font-bold text-primary">+{scenario.xpReward} points</p>
              </div>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30">
              {scenario.category.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}