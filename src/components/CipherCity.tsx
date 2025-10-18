import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Gem, 
  Users, 
  Eye, 
  Smartphone,
  Database,
  Zap,
  Trophy,
  MapPin,
  MessageCircle,
  Star,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { missions, characters, districts, initialResources, abilities, Resource, Mission, Choice } from "@/data/cipherCity";


type GameState = 'intro' | 'city' | 'mission' | 'ending';

export default function CipherCity() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [playerName, setPlayerName] = useState("");
  const [resources, setResources] = useState<Resource>(initialResources);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [unlockedAbilities, setUnlockedAbilities] = useState<string[]>([]);
  const [collectedClues, setCollectedClues] = useState<string[]>([]);
  const [trustBadgeLevel, setTrustBadgeLevel] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate trust badge level based on resources
    const avgScore = (resources.privacyPoints + resources.trustCrystals + resources.connections) / 3;
    if (avgScore >= 80) setTrustBadgeLevel(5);
    else if (avgScore >= 60) setTrustBadgeLevel(4);
    else if (avgScore >= 40) setTrustBadgeLevel(3);
    else if (avgScore >= 20) setTrustBadgeLevel(2);
    else setTrustBadgeLevel(1);
  }, [resources]);

  const startGame = () => {
    if (playerName.trim().length < 2) {
      toast({
        title: "Name Required",
        description: "Please enter your name to begin your journey",
        variant: "destructive"
      });
      return;
    }
    setGameState('city');
    toast({
      title: `Welcome to Cipher City, ${playerName}!`,
      description: "Build trust. Guard secrets. Shape your digital world.",
    });
  };

  const selectMission = (mission: Mission) => {
    setCurrentMission(mission);
    setGameState('mission');
    setSelectedChoice(null);
    setShowConsequence(false);
  };

  const makeChoice = (choice: Choice) => {
    setSelectedChoice(choice);
    setShowConsequence(true);

    // Apply resource changes
    const newResources = { ...resources };
    if (choice.consequence.resources.privacyPoints !== undefined) {
      newResources.privacyPoints = Math.max(0, Math.min(100, newResources.privacyPoints + choice.consequence.resources.privacyPoints));
    }
    if (choice.consequence.resources.trustCrystals !== undefined) {
      newResources.trustCrystals = Math.max(0, newResources.trustCrystals + choice.consequence.resources.trustCrystals);
    }
    if (choice.consequence.resources.connections !== undefined) {
      newResources.connections = Math.max(0, newResources.connections + choice.consequence.resources.connections);
    }
    setResources(newResources);

    // Unlock abilities
    if (choice.consequence.unlocksAbility) {
      setUnlockedAbilities(prev => [...prev, choice.consequence.unlocksAbility!]);
      toast({
        title: "🎉 New Ability Unlocked!",
        description: choice.consequence.unlocksAbility,
      });
    }

    // Collect clues
    if (choice.consequence.clueReward) {
      setCollectedClues(prev => [...prev, choice.consequence.clueReward!]);
      toast({
        title: "🔍 Clue Discovered!",
        description: choice.consequence.clueReward,
      });
    }
  };

  const completeMission = () => {
    if (currentMission) {
      setCompletedMissions(prev => [...prev, currentMission.id]);
      
      if (completedMissions.length + 1 === missions.length) {
        setGameState('ending');
      } else {
        setGameState('city');
      }
      
      setCurrentMission(null);
    }
  };

  const resetGame = () => {
    setGameState('intro');
    setPlayerName("");
    setResources(initialResources);
    setCompletedMissions([]);
    setUnlockedAbilities([]);
    setCollectedClues([]);
    setCurrentMission(null);
    setSelectedChoice(null);
    setShowConsequence(false);
  };

  const getDistrictIcon = (district: string) => {
    switch(district) {
      case 'social': return <Users className="h-5 w-5" />;
      case 'app': return <Smartphone className="h-5 w-5" />;
      case 'memory': return <Database className="h-5 w-5" />;
      case 'guardian': return <Shield className="h-5 w-5" />;
      case 'shadow': return <Eye className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-card/95 backdrop-blur-md border-primary/30 shadow-cyber animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Shield className="h-20 w-20 text-primary animate-pulse" />
                <Gem className="h-8 w-8 text-secondary absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CIPHER CITY
            </CardTitle>
            <p className="text-xl text-muted-foreground">
              Build Trust. Guard Secrets. Shape Your Digital World.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/30">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Your Mission
              </h3>
              <p className="text-muted-foreground mb-4">
                Welcome to Cipher City, a vibrant digital metropolis where data flows like electricity. 
                You're a new resident who must build your reputation, make friends, and uncover a mystery 
                about a data leak threatening the city.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <strong>Privacy Points:</strong> Your digital safety score
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Gem className="h-5 w-5 text-secondary mt-1" />
                  <div>
                    <strong>Trust Crystals:</strong> Earned through smart decisions
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <strong>Connections:</strong> Your friendships and network
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Enter Your Name:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
                placeholder="Your name..."
                className="w-full px-4 py-3 rounded-lg border border-primary/30 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={20}
                aria-label="Enter your name"
              />
            </div>

            <Button 
              onClick={startGame}
              className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              size="lg"
            >
              Enter Cipher City
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // City Map Screen
  if (gameState === 'city') {
    const availableMissions = missions.filter(m => !completedMissions.includes(m.id));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          {/* Header with Resources */}
          <Card className="bg-card/95 backdrop-blur-md border-primary/30 shadow-cyber">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Shield className="h-8 w-8 text-primary" />
                    {playerName}'s Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Trust Badge Level {trustBadgeLevel} • {completedMissions.length}/{missions.length} Missions Complete
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="font-bold text-2xl">{resources.privacyPoints}</span>
                    </div>
                    <Progress value={resources.privacyPoints} className="w-24 h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Privacy</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Gem className="h-5 w-5 text-secondary" />
                      <span className="font-bold text-2xl">{resources.trustCrystals}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Crystals</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-5 w-5 text-accent" />
                      <span className="font-bold text-2xl">{resources.connections}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Connections</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abilities and Clues */}
          {(unlockedAbilities.length > 0 || collectedClues.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4">
              {unlockedAbilities.length > 0 && (
                <Card className="bg-card/95 backdrop-blur-md border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Unlocked Abilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {unlockedAbilities.map(ability => (
                      <Badge key={ability} variant="secondary" className="mr-2">
                        {ability}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {collectedClues.length > 0 && (
                <Card className="bg-card/95 backdrop-blur-md border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Phantom Clues Collected
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {collectedClues.map((clue, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        {clue}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Available Missions */}
          <Card className="bg-card/95 backdrop-blur-md border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Cipher City Districts
              </CardTitle>
              <p className="text-muted-foreground">Choose a district to explore</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {availableMissions.map(mission => {
                  const district = districts[mission.district];
                  return (
                    <Card 
                      key={mission.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50"
                      onClick={() => selectMission(mission)}
                    >
                      <CardHeader className={`bg-gradient-to-r ${district.color} text-white`}>
                        <CardTitle className="flex items-center gap-2">
                          {getDistrictIcon(mission.district)}
                          {mission.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Badge className="mb-2">{district.name}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {mission.storyText.substring(0, 100)}...
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {availableMissions.length === 0 && (
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 mx-auto text-primary mb-4" />
                  <p className="text-xl font-bold">All missions complete!</p>
                  <p className="text-muted-foreground">Check your final score</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mission Screen
  if (gameState === 'mission' && currentMission) {
    const district = districts[currentMission.district];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <Card className="bg-card/95 backdrop-blur-md border-primary/30 shadow-cyber">
            <CardHeader className={`bg-gradient-to-r ${district.color} text-white`}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {getDistrictIcon(currentMission.district)}
                  {currentMission.title}
                </CardTitle>
                <Badge variant="secondary">{district.name}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Story */}
              <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/30">
                <p className="text-lg leading-relaxed">{currentMission.storyText}</p>
              </div>

              {/* Dilemma */}
              <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">The Dilemma</h3>
                    <p className="text-muted-foreground">{currentMission.dilemma}</p>
                  </div>
                </div>
              </div>

              {/* Choices */}
              {!showConsequence && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    What do you do?
                  </h3>
                  {currentMission.choices.map((choice, index) => (
                    <Button
                      key={choice.id}
                      onClick={() => makeChoice(choice)}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-4 px-6 hover:bg-primary/10 hover:border-primary"
                    >
                      <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {choice.text}
                    </Button>
                  ))}
                </div>
              )}

              {/* Consequence */}
              {showConsequence && selectedChoice && (
                <div className="space-y-4 animate-fade-in">
                  <div className={`p-6 rounded-lg border-2 ${
                    (selectedChoice.consequence.resources.privacyPoints ?? 0) >= 0 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-destructive/10 border-destructive'
                  }`}>
                    <div className="flex items-start gap-3 mb-4">
                      {(selectedChoice.consequence.resources.privacyPoints ?? 0) >= 0 ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive" />
                      )}
                      <div>
                        <h3 className="font-bold text-lg mb-2">Consequence</h3>
                        <p className="leading-relaxed">{selectedChoice.consequence.outcomeText}</p>
                      </div>
                    </div>

                    {/* Resource Changes */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-primary/30">
                      {selectedChoice.consequence.resources.privacyPoints !== undefined && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          <span className={selectedChoice.consequence.resources.privacyPoints >= 0 ? 'text-primary' : 'text-destructive'}>
                            {selectedChoice.consequence.resources.privacyPoints >= 0 ? '+' : ''}{selectedChoice.consequence.resources.privacyPoints}
                          </span>
                        </div>
                      )}
                      {selectedChoice.consequence.resources.trustCrystals !== undefined && (
                        <div className="flex items-center gap-2">
                          <Gem className="h-5 w-5" />
                          <span className={selectedChoice.consequence.resources.trustCrystals >= 0 ? 'text-primary' : 'text-destructive'}>
                            {selectedChoice.consequence.resources.trustCrystals >= 0 ? '+' : ''}{selectedChoice.consequence.resources.trustCrystals}
                          </span>
                        </div>
                      )}
                      {selectedChoice.consequence.resources.connections !== undefined && (
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          <span className={selectedChoice.consequence.resources.connections >= 0 ? 'text-primary' : 'text-destructive'}>
                            {selectedChoice.consequence.resources.connections >= 0 ? '+' : ''}{selectedChoice.consequence.resources.connections}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Learning Takeaway */}
                  <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/30">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-6 w-6 text-secondary mt-1" />
                      <div>
                        <h3 className="font-bold text-lg mb-2">What You Learned</h3>
                        <p className="text-muted-foreground">{currentMission.learningTakeaway}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={completeMission}
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary"
                    size="lg"
                  >
                    Continue Your Journey
                    <Zap className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Ending Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 flex items-center justify-center">
      <Card className="max-w-3xl w-full bg-card/95 backdrop-blur-md border-primary/30 shadow-cyber animate-fade-in">
        <CardHeader className="text-center">
          <Trophy className="h-20 w-20 mx-auto text-primary mb-4 animate-bounce" />
          <CardTitle className="text-4xl font-bold">Mission Complete!</CardTitle>
          <p className="text-muted-foreground mt-2">
            You've completed all missions in Cipher City
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-primary/10 p-6 rounded-lg">
              <Shield className="h-10 w-10 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold">{resources.privacyPoints}</div>
              <div className="text-sm text-muted-foreground">Privacy Points</div>
            </div>
            <div className="bg-secondary/10 p-6 rounded-lg">
              <Gem className="h-10 w-10 mx-auto mb-2 text-secondary" />
              <div className="text-3xl font-bold">{resources.trustCrystals}</div>
              <div className="text-sm text-muted-foreground">Trust Crystals</div>
            </div>
            <div className="bg-accent/10 p-6 rounded-lg">
              <Users className="h-10 w-10 mx-auto mb-2 text-accent" />
              <div className="text-3xl font-bold">{resources.connections}</div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </div>
          </div>

          <div className="bg-secondary/10 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Your Achievements</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Trust Badge Level: <strong>{trustBadgeLevel}</strong>
              </p>
              <p className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Missions Completed: <strong>{completedMissions.length}</strong>
              </p>
              <p className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Abilities Unlocked: <strong>{unlockedAbilities.length}</strong>
              </p>
              <p className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Phantom Clues Found: <strong>{collectedClues.length}/{missions.length}</strong>
              </p>
            </div>
          </div>

          {collectedClues.length === missions.length && (
            <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary animate-pulse">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Mystery Solved!
              </h3>
              <p className="text-muted-foreground">
                You've collected all the clues and uncovered The Phantom's identity! 
                The city is now safer because of your vigilant privacy practices. 
                Mayor Secure has named you the Guardian of Cipher City!
              </p>
            </div>
          )}

          <Button 
            onClick={resetGame}
            className="w-full text-lg py-6"
            variant="outline"
            size="lg"
          >
            Play Again
            <Zap className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
