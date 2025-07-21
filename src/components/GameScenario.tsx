import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Mail, Lock, Users, Wifi, Download, DollarSign, Eye, Gamepad2, Phone, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    category: 'phishing' | 'password' | 'social' | 'network' | 'malware' | 'privacy' | 'scam' | 'gaming';
    difficulty: 'easy' | 'medium' | 'hard';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'phishing': return Mail;
      case 'password': return Lock;
      case 'social': return Users;
      case 'network': return Wifi;
      case 'malware': return Download;
      case 'privacy': return Eye;
      case 'scam': return DollarSign;
      case 'gaming': return Gamepad2;
      default: return Shield;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'phishing': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'password': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'social': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'network': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'malware': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'privacy': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      case 'scam': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'gaming': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const CategoryIcon = getCategoryIcon(scenario.category);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-card border-border shadow-lg overflow-hidden">
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className={`p-3 rounded-xl ${getCategoryColor(scenario.category)}`}>
              <CategoryIcon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getCategoryColor(scenario.category)}>
                  {scenario.category.toUpperCase()}
                </Badge>
                <Badge variant="outline" className={getDifficultyColor(scenario.difficulty)}>
                  {scenario.difficulty.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            Episode #{scenario.id}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {scenario.title}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Character Story Section */}
          <div className="bg-gradient-to-br from-muted/50 to-muted p-6 rounded-xl border border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-cyber"></div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">🧑‍💻</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg leading-relaxed text-foreground mb-4">
                  {scenario.description}
                </p>
                {!showFeedback && (
                  <p className="text-primary font-medium animate-pulse">
                    What should Alex do? Help them make the right choice...
                  </p>
                )}
              </div>
            </div>
          </div>

          {!showFeedback && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center text-foreground mb-6">
                Choose Alex's Action:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="group cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => onChoice('secure')}
                >
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/20 hover:border-success/40 p-6 h-full transition-all duration-300 hover:shadow-lg hover:shadow-success/10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-success/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-success/20">
                          <Shield className="h-6 w-6 text-success" />
                        </div>
                        <span className="text-lg font-bold text-success">SECURE</span>
                      </div>
                      <p className="text-foreground leading-relaxed">
                        {scenario.choices.secure}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-success/80">
                        <span className="text-sm font-medium">Recommended</span>
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="group cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => onChoice('surrender')}
                >
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border-2 border-destructive/20 hover:border-destructive/40 p-6 h-full transition-all duration-300 hover:shadow-lg hover:shadow-destructive/10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-destructive/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-destructive/20">
                          <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <span className="text-lg font-bold text-destructive">SURRENDER</span>
                      </div>
                      <p className="text-foreground leading-relaxed">
                        {scenario.choices.surrender}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-destructive/80">
                        <span className="text-sm font-medium">Dangerous</span>
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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