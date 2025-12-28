import { useState, useEffect, useCallback } from "react";
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
  XCircle,
  Brain,
  Heart,
  Moon,
  Crown,
  UserCheck,
  Scan,
  Bug,
  Key,
  Image,
  Server,
  Target,
  Clock,
  Sparkles,
  ChevronRight,
  Volume2,
  VolumeX,
  BookOpen,
  Award,
  TrendingUp,
  Lock,
  ArrowLeft
} from "lucide-react";
import { 
  missions, 
  characters, 
  districts, 
  initialResources, 
  abilities, 
  evidenceCollection,
  Resource, 
  Mission, 
  Choice,
  DialogueLine,
  Character
} from "@/data/cipherCity";

type GameState = 'intro' | 'city' | 'mission' | 'dialogue' | 'investigation' | 'ending';

interface GameProgress {
  playerName: string;
  resources: Resource;
  completedMissions: number[];
  unlockedAbilities: string[];
  collectedClues: string[];
  collectedEvidence: string[];
  characterTrust: Record<string, number>;
  totalPlayTime: number;
  perfectMissions: number;
}

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
  const [collectedEvidence, setCollectedEvidence] = useState<string[]>([]);
  const [trustBadgeLevel, setTrustBadgeLevel] = useState(1);
  const [characterTrust, setCharacterTrust] = useState<Record<string, number>>({});
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showInvestigation, setShowInvestigation] = useState(false);
  const [investigationAnswered, setInvestigationAnswered] = useState(false);
  const [investigationCorrect, setInvestigationCorrect] = useState(false);
  const [missionTimer, setMissionTimer] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [perfectMissions, setPerfectMissions] = useState(0);
  const [animatingResource, setAnimatingResource] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize character trust levels
  useEffect(() => {
    const initialTrust: Record<string, number> = {};
    characters.forEach(char => {
      initialTrust[char.id] = char.trustLevel;
    });
    setCharacterTrust(initialTrust);
  }, []);

  // Calculate trust badge level
  useEffect(() => {
    const avgScore = (resources.privacyPoints + resources.reputation + resources.knowledge) / 3;
    if (avgScore >= 80) setTrustBadgeLevel(5);
    else if (avgScore >= 60) setTrustBadgeLevel(4);
    else if (avgScore >= 40) setTrustBadgeLevel(3);
    else if (avgScore >= 20) setTrustBadgeLevel(2);
    else setTrustBadgeLevel(1);
  }, [resources]);

  // Mission timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (missionTimer !== null && missionTimer > 0 && gameState === 'mission') {
      interval = setInterval(() => {
        setMissionTimer(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [missionTimer, gameState]);

  const getCharacterById = (id: string): Character | undefined => {
    return characters.find(c => c.id === id);
  };

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
      description: "Build trust. Guard secrets. Uncover the mystery.",
    });
  };

  const selectMission = (mission: Mission) => {
    setCurrentMission(mission);
    setCurrentDialogueIndex(0);
    setSelectedChoice(null);
    setShowConsequence(false);
    setShowInvestigation(false);
    setInvestigationAnswered(false);
    
    if (mission.timeLimit) {
      setMissionTimer(mission.timeLimit);
    } else {
      setMissionTimer(null);
    }
    
    if (mission.dialogue && mission.dialogue.length > 0) {
      setGameState('dialogue');
    } else {
      setGameState('mission');
    }
  };

  const advanceDialogue = () => {
    if (currentMission && currentDialogueIndex < currentMission.dialogue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      setGameState('mission');
    }
  };

  const animateResourceChange = (resourceName: string) => {
    setAnimatingResource(resourceName);
    setTimeout(() => setAnimatingResource(null), 600);
  };

  const makeChoice = (choice: Choice) => {
    if (choice.requiredAbility && !unlockedAbilities.includes(choice.requiredAbility)) {
      toast({
        title: "Ability Required",
        description: `You need "${choice.requiredAbility}" to choose this option.`,
        variant: "destructive"
      });
      return;
    }

    if (choice.requiredReputation && resources.reputation < choice.requiredReputation) {
      toast({
        title: "Reputation Too Low",
        description: `You need ${choice.requiredReputation} reputation for this option.`,
        variant: "destructive"
      });
      return;
    }

    setSelectedChoice(choice);
    setShowConsequence(true);
    setMissionTimer(null);

    // Apply resource changes with animation
    const newResources = { ...resources };
    Object.keys(choice.consequence.resources).forEach(key => {
      const resourceKey = key as keyof Resource;
      const change = choice.consequence.resources[resourceKey];
      if (change !== undefined) {
        newResources[resourceKey] = Math.max(0, Math.min(100, newResources[resourceKey] + change));
        if (change !== 0) animateResourceChange(resourceKey);
      }
    });
    setResources(newResources);

    // Update character trust
    if (choice.consequence.characterReaction) {
      const { characterId, trustChange } = choice.consequence.characterReaction;
      setCharacterTrust(prev => ({
        ...prev,
        [characterId]: Math.max(0, Math.min(100, (prev[characterId] || 50) + trustChange))
      }));
      
      const char = getCharacterById(characterId);
      if (char) {
        toast({
          title: trustChange > 0 ? `${char.name} trusts you more!` : `${char.name}'s trust decreased`,
          description: trustChange > 0 ? "Your relationship strengthened" : "Your relationship weakened",
          variant: trustChange > 0 ? "default" : "destructive"
        });
      }
    }

    // Unlock abilities
    if (choice.consequence.unlocksAbility) {
      if (!unlockedAbilities.includes(choice.consequence.unlocksAbility)) {
        setUnlockedAbilities(prev => [...prev, choice.consequence.unlocksAbility!]);
        toast({
          title: "🎉 New Ability Unlocked!",
          description: choice.consequence.unlocksAbility,
        });
      }
    }

    // Collect clues
    if (choice.consequence.clueReward) {
      if (!collectedClues.includes(choice.consequence.clueReward)) {
        setCollectedClues(prev => [...prev, choice.consequence.clueReward!]);
        
        // Also add evidence
        const evidence = evidenceCollection.find(e => e.missionId === currentMission?.id);
        if (evidence && !collectedEvidence.includes(evidence.id)) {
          setCollectedEvidence(prev => [...prev, evidence.id]);
        }
        
        toast({
          title: "🔍 Evidence Collected!",
          description: choice.consequence.clueReward,
        });
      }
    }

    // Check for perfect mission (best outcome)
    const bestChoice = currentMission?.choices.reduce((best, current) => {
      const bestTotal = Object.values(best.consequence.resources).reduce((a, b) => (a || 0) + (b || 0), 0);
      const currentTotal = Object.values(current.consequence.resources).reduce((a, b) => (a || 0) + (b || 0), 0);
      return currentTotal > bestTotal ? current : best;
    });

    if (bestChoice && choice.id === bestChoice.id) {
      setPerfectMissions(prev => prev + 1);
    }
  };

  const handleInvestigation = (correct: boolean) => {
    setInvestigationAnswered(true);
    setInvestigationCorrect(correct);
    
    if (correct) {
      setResources(prev => ({
        ...prev,
        knowledge: Math.min(100, prev.knowledge + 10),
        trustCrystals: prev.trustCrystals + 5
      }));
      toast({
        title: "✅ Correct!",
        description: "Your knowledge increases!",
      });
    } else {
      toast({
        title: "❌ Not quite...",
        description: "Review the explanation to learn more.",
        variant: "destructive"
      });
    }
  };

  const completeMission = () => {
    if (currentMission) {
      setCompletedMissions(prev => [...prev, currentMission.id]);
      
      if (currentMission.investigation && !investigationAnswered) {
        setShowInvestigation(true);
        setGameState('investigation');
        return;
      }
      
      if (completedMissions.length + 1 === missions.length) {
        setGameState('ending');
      } else {
        setGameState('city');
      }
      
      setCurrentMission(null);
    }
  };

  const finishInvestigation = () => {
    if (completedMissions.length === missions.length) {
      setGameState('ending');
    } else {
      setGameState('city');
    }
    setCurrentMission(null);
    setShowInvestigation(false);
    setInvestigationAnswered(false);
  };

  const resetGame = () => {
    setGameState('intro');
    setPlayerName("");
    setResources(initialResources);
    setCompletedMissions([]);
    setUnlockedAbilities([]);
    setCollectedClues([]);
    setCollectedEvidence([]);
    setCurrentMission(null);
    setSelectedChoice(null);
    setShowConsequence(false);
    setPerfectMissions(0);
    setMissionTimer(null);
    
    const initialTrust: Record<string, number> = {};
    characters.forEach(char => {
      initialTrust[char.id] = char.trustLevel;
    });
    setCharacterTrust(initialTrust);
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

  const getAbilityIcon = (iconName: string) => {
    switch(iconName) {
      case 'Eye': return <Eye className="h-4 w-4" />;
      case 'Users': return <Users className="h-4 w-4" />;
      case 'GraduationCap': return <GraduationCap className="h-4 w-4" />;
      case 'Shield': return <Shield className="h-4 w-4" />;
      case 'Moon': return <Moon className="h-4 w-4" />;
      case 'UserCheck': return <UserCheck className="h-4 w-4" />;
      case 'Crown': return <Crown className="h-4 w-4" />;
      case 'Heart': return <Heart className="h-4 w-4" />;
      case 'Scan': return <Scan className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-primary/20 text-primary';
    }
  };

  const getEmotionStyle = (emotion?: string) => {
    switch(emotion) {
      case 'happy': return 'border-green-500/50 bg-green-500/10';
      case 'worried': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'angry': return 'border-red-500/50 bg-red-500/10';
      case 'mysterious': return 'border-purple-500/50 bg-purple-500/10';
      default: return 'border-primary/50 bg-primary/10';
    }
  };

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <Card className="max-w-2xl w-full bg-card/90 backdrop-blur-xl border-primary/30 shadow-2xl shadow-primary/20 animate-fade-in relative z-10">
          <CardHeader className="text-center space-y-6 pb-2">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
                <Shield className="h-24 w-24 text-primary relative z-10" />
                <Gem className="h-10 w-10 text-secondary absolute -top-2 -right-2 animate-bounce" />
                <Sparkles className="h-6 w-6 text-yellow-400 absolute -bottom-1 -left-1 animate-pulse" />
              </div>
            </div>
            <div>
              <CardTitle className="text-5xl font-black bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent tracking-tight">
                CIPHER CITY
              </CardTitle>
              <p className="text-lg text-muted-foreground mt-2 font-medium">
                Build Trust. Guard Secrets. Shape Your Digital World.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 rounded-xl border border-primary/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                <BookOpen className="h-5 w-5" />
                Your Mission Awaits
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Welcome to Cipher City — a vibrant digital metropolis where data flows like electricity. 
                As a new resident, you'll build your reputation, forge alliances, and uncover a sinister 
                mystery about <span className="text-destructive font-semibold">The Phantom</span>, a data thief threatening the entire city.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <div className="text-sm">
                    <div className="font-semibold">Privacy Points</div>
                    <div className="text-muted-foreground text-xs">Your safety score</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                  <Gem className="h-5 w-5 text-purple-400" />
                  <div className="text-sm">
                    <div className="font-semibold">Trust Crystals</div>
                    <div className="text-muted-foreground text-xs">Currency earned</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <div className="text-sm">
                    <div className="font-semibold">Reputation</div>
                    <div className="text-muted-foreground text-xs">City standing</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                  <Brain className="h-5 w-5 text-yellow-400" />
                  <div className="text-sm">
                    <div className="font-semibold">Knowledge</div>
                    <div className="text-muted-foreground text-xs">Privacy wisdom</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Enter Your Defender Name:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
                placeholder="Choose wisely..."
                className="w-full px-4 py-4 rounded-xl border-2 border-primary/30 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
                maxLength={20}
                aria-label="Enter your name"
              />
            </div>

            <Button 
              onClick={startGame}
              className="w-full text-lg py-6 bg-gradient-to-r from-primary via-purple-500 to-secondary hover:opacity-90 transition-all shadow-lg shadow-primary/30 font-bold"
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

  // Dialogue Screen
  if (gameState === 'dialogue' && currentMission) {
    const currentLine = currentMission.dialogue[currentDialogueIndex];
    const speaker = getCharacterById(currentLine.speaker);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
        <Card className="max-w-3xl w-full bg-card/90 backdrop-blur-xl border-primary/30 shadow-2xl animate-fade-in">
          <CardHeader className={`bg-gradient-to-r ${districts[currentMission.district].color} text-white`}>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getDistrictIcon(currentMission.district)}
                {currentMission.title}
              </CardTitle>
              <Badge variant="secondary" className={getDifficultyColor(currentMission.difficulty)}>
                {currentMission.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/30">
              <p className="text-muted-foreground italic">{currentMission.storyText}</p>
            </div>
            
            <div className={`p-6 rounded-xl border-2 ${getEmotionStyle(currentLine.emotion)} transition-all`}>
              <div className="flex items-start gap-4">
                <div className="text-5xl">{speaker?.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">{speaker?.name}</span>
                    <Badge variant="outline" className="text-xs">{speaker?.role}</Badge>
                  </div>
                  <p className="text-lg leading-relaxed">{currentLine.text}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {currentMission.dialogue.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentDialogueIndex ? 'bg-primary w-6' : idx < currentDialogueIndex ? 'bg-primary/50' : 'bg-muted'}`} 
                  />
                ))}
              </div>
              
              <Button onClick={advanceDialogue} className="gap-2">
                {currentDialogueIndex < currentMission.dialogue.length - 1 ? 'Continue' : 'Begin Mission'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // City Map Screen
  if (gameState === 'city') {
    const availableMissions = missions.filter(m => !completedMissions.includes(m.id));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          {/* Header with Resources */}
          <Card className="bg-card/90 backdrop-blur-xl border-primary/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Shield className="h-8 w-8 text-primary" />
                    {playerName}'s Command Center
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="gap-1">
                      <Award className="h-3 w-3" />
                      Trust Level {trustBadgeLevel}
                    </Badge>
                    <Badge variant="secondary">
                      {completedMissions.length}/{missions.length} Missions
                    </Badge>
                    {perfectMissions > 0 && (
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        <Star className="h-3 w-3 mr-1" />
                        {perfectMissions} Perfect
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { key: 'privacyPoints', icon: Shield, color: 'text-blue-400', label: 'Privacy' },
                    { key: 'trustCrystals', icon: Gem, color: 'text-purple-400', label: 'Crystals' },
                    { key: 'connections', icon: Users, color: 'text-cyan-400', label: 'Friends' },
                    { key: 'reputation', icon: TrendingUp, color: 'text-green-400', label: 'Rep' },
                    { key: 'knowledge', icon: Brain, color: 'text-yellow-400', label: 'Knowledge' },
                  ].map(({ key, icon: Icon, color, label }) => (
                    <div key={key} className={`text-center ${animatingResource === key ? 'animate-scale-in' : ''}`}>
                      <div className={`flex items-center justify-center gap-1 mb-1 ${color}`}>
                        <Icon className="h-4 w-4" />
                        <span className="font-bold text-lg">{resources[key as keyof Resource]}</span>
                      </div>
                      {key === 'privacyPoints' && <Progress value={resources.privacyPoints} className="w-16 h-1.5 mx-auto" />}
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abilities and Evidence */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Abilities */}
            <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Abilities ({unlockedAbilities.length}/{Object.keys(abilities).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(abilities).map(([name, ability]) => {
                    const unlocked = unlockedAbilities.includes(name);
                    return (
                      <Badge 
                        key={name} 
                        variant={unlocked ? "default" : "outline"}
                        className={`gap-1 ${!unlocked ? 'opacity-40' : ''}`}
                      >
                        {getAbilityIcon(ability.icon)}
                        {name}
                        {!unlocked && <Lock className="h-3 w-3 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Evidence */}
            <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-primary" />
                  Phantom Evidence ({collectedEvidence.length}/{evidenceCollection.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {evidenceCollection.map(evidence => {
                    const collected = collectedEvidence.includes(evidence.id);
                    return (
                      <div 
                        key={evidence.id}
                        className={`p-2 rounded-lg border text-center ${collected ? 'border-primary/50 bg-primary/10' : 'border-muted/30 opacity-40'}`}
                        title={collected ? evidence.description : "???"}
                      >
                        <div className="text-2xl mb-1">{collected ? '📁' : '❓'}</div>
                        <p className="text-xs truncate">{collected ? evidence.name : '???'}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Missions */}
          <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Cipher City Districts
              </CardTitle>
              <p className="text-muted-foreground">Choose your next mission</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableMissions.map(mission => {
                  const district = districts[mission.district];
                  const isLocked = mission.id > 1 && !completedMissions.includes(mission.id - 1);
                  
                  return (
                    <Card 
                      key={mission.id}
                      className={`transition-all duration-300 border-2 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-primary/20 cursor-pointer hover:border-primary/50 hover:-translate-y-1'}`}
                      onClick={() => !isLocked && selectMission(mission)}
                    >
                      <CardHeader className={`bg-gradient-to-r ${district.color} text-white py-3`}>
                        <CardTitle className="flex items-center justify-between text-base">
                          <span className="flex items-center gap-2">
                            {getDistrictIcon(mission.district)}
                            {mission.title}
                          </span>
                          {isLocked && <Lock className="h-4 w-4" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-3 space-y-2">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">{district.name}</Badge>
                          <Badge className={`text-xs ${getDifficultyColor(mission.difficulty)}`}>
                            {mission.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {mission.storyText.substring(0, 80)}...
                        </p>
                        {mission.timeLimit && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {mission.timeLimit}s time limit
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {availableMissions.length === 0 && (
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
                  <p className="text-xl font-bold">All missions complete!</p>
                  <p className="text-muted-foreground mb-4">View your final results</p>
                  <Button onClick={() => setGameState('ending')}>
                    See Results
                  </Button>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Timer */}
          {missionTimer !== null && missionTimer > 0 && (
            <div className={`text-center ${missionTimer < 30 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
              <div className="inline-flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full border border-current">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-xl font-bold">{Math.floor(missionTimer / 60)}:{(missionTimer % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          )}

          <Card className="bg-card/90 backdrop-blur-xl border-primary/30 shadow-xl">
            <CardHeader className={`bg-gradient-to-r ${district.color} text-white`}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {getDistrictIcon(currentMission.district)}
                  {currentMission.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{district.name}</Badge>
                  <Badge className={getDifficultyColor(currentMission.difficulty)}>
                    {currentMission.difficulty}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Dilemma */}
              <div className="bg-destructive/10 p-6 rounded-xl border border-destructive/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-destructive">The Dilemma</h3>
                    <p className="text-muted-foreground leading-relaxed">{currentMission.dilemma}</p>
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
                  {currentMission.choices.map((choice, index) => {
                    const locked = choice.requiredAbility && !unlockedAbilities.includes(choice.requiredAbility);
                    const lowRep = choice.requiredReputation && resources.reputation < choice.requiredReputation;
                    
                    return (
                      <Button
                        key={choice.id}
                        onClick={() => makeChoice(choice)}
                        variant="outline"
                        disabled={locked || lowRep}
                        className={`w-full justify-start text-left h-auto py-4 px-6 transition-all ${locked || lowRep ? 'opacity-50' : 'hover:bg-primary/10 hover:border-primary hover:-translate-x-1'}`}
                      >
                        <span className="font-bold mr-3 text-primary">{String.fromCharCode(65 + index)}.</span>
                        <span className="flex-1">{choice.text}</span>
                        {locked && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            {choice.requiredAbility}
                          </Badge>
                        )}
                        {lowRep && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Need {choice.requiredReputation} rep
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Consequence */}
              {showConsequence && selectedChoice && (
                <div className="space-y-6 animate-fade-in">
                  <div className={`p-6 rounded-xl border ${Object.values(selectedChoice.consequence.resources).reduce((a, b) => (a || 0) + (b || 0), 0) >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      {Object.values(selectedChoice.consequence.resources).reduce((a, b) => (a || 0) + (b || 0), 0) >= 0 
                        ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                        : <XCircle className="h-5 w-5 text-red-500" />
                      }
                      Outcome
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{selectedChoice.consequence.outcomeText}</p>
                    
                    {/* Resource changes */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {Object.entries(selectedChoice.consequence.resources).map(([key, value]) => {
                        if (!value) return null;
                        return (
                          <Badge 
                            key={key} 
                            variant={value > 0 ? "default" : "destructive"}
                            className="gap-1"
                          >
                            {value > 0 ? '+' : ''}{value} {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learning Takeaway */}
                  <div className="bg-primary/10 p-6 rounded-xl border border-primary/30">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-primary">
                      <GraduationCap className="h-5 w-5" />
                      Privacy Lesson
                    </h3>
                    <p className="text-muted-foreground">{currentMission.learningTakeaway}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => setGameState('city')} variant="outline" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Return to City
                    </Button>
                    <Button onClick={completeMission} className="flex-1 gap-2">
                      {currentMission.investigation ? 'Take Knowledge Quiz' : 'Complete Mission'}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Investigation Screen
  if (gameState === 'investigation' && currentMission?.investigation) {
    const investigation = currentMission.investigation;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-card/90 backdrop-blur-xl border-primary/30 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Knowledge Check
            </CardTitle>
            <p className="text-muted-foreground">Test what you've learned!</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/30">
              <h3 className="text-lg font-bold mb-2">{investigation.question}</h3>
            </div>
            
            <div className="space-y-3">
              {investigation.options.map((option, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleInvestigation(option.correct)}
                  disabled={investigationAnswered}
                  variant="outline"
                  className={`w-full justify-start text-left h-auto py-4 px-6 transition-all ${
                    investigationAnswered 
                      ? option.correct 
                        ? 'bg-green-500/20 border-green-500' 
                        : 'opacity-50'
                      : 'hover:bg-primary/10 hover:border-primary'
                  }`}
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span>
                  {option.text}
                  {investigationAnswered && option.correct && (
                    <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                  )}
                </Button>
              ))}
            </div>
            
            {investigationAnswered && (
              <div className={`p-4 rounded-xl border animate-fade-in ${investigationCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                <p className="text-sm">
                  <strong>Explanation:</strong> {investigation.options.find(o => o.correct)?.explanation}
                </p>
              </div>
            )}
            
            {investigationAnswered && (
              <Button onClick={finishInvestigation} className="w-full gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ending Screen
  if (gameState === 'ending') {
    const totalScore = resources.privacyPoints + resources.trustCrystals + resources.reputation + resources.knowledge;
    const maxScore = 400;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    let rank = "Novice Defender";
    let rankEmoji = "🛡️";
    if (percentage >= 90) { rank = "Master Guardian"; rankEmoji = "👑"; }
    else if (percentage >= 75) { rank = "Elite Defender"; rankEmoji = "⭐"; }
    else if (percentage >= 60) { rank = "Skilled Protector"; rankEmoji = "🔒"; }
    else if (percentage >= 40) { rank = "Rising Shield"; rankEmoji = "📈"; }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-card/90 backdrop-blur-xl border-primary/30 shadow-xl animate-fade-in">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{rankEmoji}</div>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mission Complete!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Congratulations, {playerName}! You've completed all missions in Cipher City.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge className="text-lg px-4 py-2">{rank}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/30 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">{resources.privacyPoints}</div>
                <div className="text-sm text-muted-foreground">Privacy Points</div>
              </div>
              <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/30 text-center">
                <Gem className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">{resources.trustCrystals}</div>
                <div className="text-sm text-muted-foreground">Trust Crystals</div>
              </div>
              <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/30 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">{resources.reputation}</div>
                <div className="text-sm text-muted-foreground">Reputation</div>
              </div>
              <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/30 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold">{resources.knowledge}</div>
                <div className="text-sm text-muted-foreground">Knowledge</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Score</span>
                <span className="font-bold">{totalScore}/{maxScore}</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="gap-1">
                <Trophy className="h-3 w-3" />
                {completedMissions.length} Missions
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3" />
                {perfectMissions} Perfect
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {unlockedAbilities.length} Abilities
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Eye className="h-3 w-3" />
                {collectedEvidence.length} Evidence
              </Badge>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-xl border border-primary/30">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Key Privacy Lessons Learned
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Verify friend requests before accepting</li>
                <li>• Download apps only from trusted sources</li>
                <li>• Never share passwords, even with friends</li>
                <li>• Protect your photos and personal data</li>
                <li>• Trust but verify online identities</li>
                <li>• Privacy is a community responsibility</li>
              </ul>
            </div>
            
            <Button onClick={resetGame} className="w-full gap-2" size="lg">
              <Zap className="h-5 w-5" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}