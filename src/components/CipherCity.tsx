import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useGameSave, SaveSlot } from "@/hooks/useGameSave";
import AudioSettings from "./AudioSettings";
import SaveLoadMenu from "./CipherCity/SaveLoadMenu";
import { 
  Shield, Gem, Users, Eye, Smartphone, Database, Zap, Trophy, MapPin, 
  MessageCircle, Star, GraduationCap, AlertTriangle, CheckCircle2, XCircle, 
  Brain, Moon, Crown, UserCheck, Scan, Clock, Sparkles, ChevronRight, 
  Volume2, VolumeX, BookOpen, Award, TrendingUp, Lock, ArrowLeft, User,
  Gamepad2, Target, Flame, Save, Download
} from "lucide-react";
import { missions, characters, districts, initialResources, abilities, evidenceCollection, Resource, Mission, Choice, Character } from "@/data/cipherCity";
import CityMap from "./CipherCity/CityMap";
import MiniGame from "./CipherCity/MiniGames";
import AchievementsPanel from "./CipherCity/AchievementsPanel";
import CharacterProfile from "./CipherCity/CharacterProfile";
import { achievementsList } from "./CipherCity/achievements";
import { Achievement, CharacterCustomization, GameState, GameProgress } from "./CipherCity/types";
import PhishingQuest from "./quests/PhishingQuest";

const initialCustomization: CharacterCustomization = {
  avatar: 'detective',
  frame: 'bronze',
  title: 'newcomer',
  trail: 'none'
};

export default function CipherCity() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [playerName, setPlayerName] = useState("");
  const [customization, setCustomization] = useState<CharacterCustomization>(initialCustomization);
  const [resources, setResources] = useState<Resource>({ ...initialResources, energy: 100 });
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [unlockedAbilities, setUnlockedAbilities] = useState<string[]>([]);
  const [collectedClues, setCollectedClues] = useState<string[]>([]);
  const [collectedEvidence, setCollectedEvidence] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsList);
  const [characterTrust, setCharacterTrust] = useState<Record<string, number>>({});
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [missionTimer, setMissionTimer] = useState<number | null>(null);
  const [perfectMissions, setPerfectMissions] = useState(0);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameType, setMiniGameType] = useState<'pattern' | 'decrypt' | 'sorting' | 'quickChoice'>('pattern');
  const [dailyStreak, setDailyStreak] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [saveMenuMode, setSaveMenuMode] = useState<'save' | 'load'>('save');
  const { toast } = useToast();
  const playTimeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Audio system
  const {
    soundEnabled,
    musicEnabled,
    soundVolume,
    musicVolume,
    toggleSound,
    toggleMusic,
    setSoundVolume,
    setMusicVolume,
    playSfx,
  } = useGameAudio();

  // Save system
  const {
    saveSlots,
    currentSlotId,
    lastSaveTime,
    createSave,
    quickSave,
    loadSave,
    deleteSave,
    hasSaves,
    getLastPlayedSave,
    getAllSaves,
    exportSaves,
    importSaves,
    setCurrentSlotId,
    AUTO_SAVE_INTERVAL
  } = useGameSave();

  // Track play time
  useEffect(() => {
    if (gameState !== 'intro' && gameState !== 'ending') {
      playTimeRef.current = setInterval(() => {
        setTotalPlayTime(prev => prev + 1);
      }, 60000); // Increment every minute
    }
    return () => {
      if (playTimeRef.current) clearInterval(playTimeRef.current);
    };
  }, [gameState]);

  // Build current game progress object
  const buildGameProgress = useCallback((): GameProgress => ({
    playerName,
    customization,
    resources,
    completedMissions,
    unlockedAbilities,
    collectedClues,
    collectedEvidence,
    characterTrust,
    achievements,
    dailyStreak,
    totalPlayTime,
    perfectMissions,
    lastPlayed: new Date()
  }), [playerName, customization, resources, completedMissions, unlockedAbilities, collectedClues, collectedEvidence, characterTrust, achievements, dailyStreak, totalPlayTime, perfectMissions]);

  // Auto-save functionality
  useEffect(() => {
    if (gameState === 'city' && playerName && currentSlotId !== null) {
      const autoSaveInterval = setInterval(() => {
        quickSave(buildGameProgress(), missions.length);
        toast({ 
          title: "Auto-saved", 
          description: "Your progress has been saved",
          duration: 2000 
        });
      }, AUTO_SAVE_INTERVAL);
      return () => clearInterval(autoSaveInterval);
    }
  }, [gameState, playerName, currentSlotId, buildGameProgress, quickSave, toast, AUTO_SAVE_INTERVAL]);

  // Load game progress from save
  const applyLoadedProgress = useCallback((progress: GameProgress) => {
    setPlayerName(progress.playerName);
    setCustomization(progress.customization);
    setResources(progress.resources);
    setCompletedMissions(progress.completedMissions);
    setUnlockedAbilities(progress.unlockedAbilities);
    setCollectedClues(progress.collectedClues);
    setCollectedEvidence(progress.collectedEvidence);
    setCharacterTrust(progress.characterTrust);
    setAchievements(progress.achievements);
    setDailyStreak(progress.dailyStreak);
    setTotalPlayTime(progress.totalPlayTime);
    setPerfectMissions(progress.perfectMissions);
    setGameState('city');
  }, []);

  const handleSave = useCallback((slotId: number, slotName: string) => {
    playSfx('success');
    createSave(slotId, slotName, buildGameProgress(), missions.length);
    toast({ title: "Game Saved!", description: `Saved to "${slotName}"` });
  }, [playSfx, createSave, buildGameProgress, toast]);

  const handleLoad = useCallback((slotId: number) => {
    const progress = loadSave(slotId);
    if (progress) {
      playSfx('success');
      applyLoadedProgress(progress);
      toast({ title: "Game Loaded!", description: `Welcome back, ${progress.playerName}!` });
    } else {
      playSfx('error');
      toast({ title: "Load Failed", description: "Could not load save", variant: "destructive" });
    }
  }, [loadSave, applyLoadedProgress, playSfx, toast]);

  const handleDeleteSave = useCallback((slotId: number) => {
    if (deleteSave(slotId)) {
      playSfx('click');
      toast({ title: "Save Deleted", description: "Save slot has been removed" });
    }
  }, [deleteSave, playSfx, toast]);

  const openSaveMenu = useCallback(() => {
    playSfx('click');
    setSaveMenuMode('save');
    setShowSaveMenu(true);
  }, [playSfx]);

  const openLoadMenu = useCallback(() => {
    playSfx('click');
    setSaveMenuMode('load');
    setShowSaveMenu(true);
  }, [playSfx]);

  useEffect(() => {
    const initialTrust: Record<string, number> = {};
    characters.forEach(char => { initialTrust[char.id] = char.trustLevel; });
    setCharacterTrust(initialTrust);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (missionTimer !== null && missionTimer > 0 && gameState === 'mission') {
      interval = setInterval(() => setMissionTimer(prev => prev !== null ? prev - 1 : null), 1000);
    }
    return () => clearInterval(interval);
  }, [missionTimer, gameState]);

  const getCharacterById = (id: string): Character | undefined => characters.find(c => c.id === id);
  const getAvatarEmoji = () => {
    const avatars: Record<string, string> = { detective: '🕵️', hacker: '👨‍💻', guardian: '🦸', agent: '🤵', ninja: '🥷', robot: '🤖', wizard: '🧙', astronaut: '👨‍🚀' };
    return avatars[customization.avatar] || '🕵️';
  };

  const updateAchievement = (id: string, progressAdd: number = 1) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id && !a.unlocked) {
        const newProgress = Math.min(a.progress + progressAdd, a.maxProgress);
        const unlocked = newProgress >= a.maxProgress;
        if (unlocked) {
          playSfx('achievement');
          toast({ title: `🏆 Achievement Unlocked!`, description: a.name });
          Object.entries(a.reward).forEach(([key, value]) => {
            setResources(r => ({ ...r, [key as keyof Resource]: r[key as keyof Resource] + (value || 0) }));
          });
        }
        return { ...a, progress: newProgress, unlocked };
      }
      return a;
    }));
  };

  const startGame = () => {
    if (playerName.trim().length < 2) {
      playSfx('error');
      toast({ title: "Name Required", description: "Please enter your name", variant: "destructive" });
      return;
    }
    playSfx('success');
    setGameState('customization');
  };

  const finishCustomization = () => {
    playSfx('transition');
    setGameState('city');
    toast({ title: `Welcome to Cipher City, ${playerName}!`, description: "Explore districts and complete missions!" });
  };

  const selectMission = (mission: Mission) => {
    playSfx('missionStart');
    setCurrentMission(mission);
    setCurrentDialogueIndex(0);
    setSelectedChoice(null);
    setShowConsequence(false);
    setMissionTimer(mission.timeLimit || null);
    setGameState(mission.dialogue?.length > 0 ? 'dialogue' : 'mission');
  };

  const advanceDialogue = () => {
    playSfx('dialogueAdvance');
    if (currentMission && currentDialogueIndex < currentMission.dialogue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      // Random chance to trigger mini-game before mission
      if (Math.random() > 0.5) {
        const types: ('pattern' | 'decrypt' | 'sorting' | 'quickChoice')[] = ['pattern', 'decrypt', 'sorting', 'quickChoice'];
        setMiniGameType(types[Math.floor(Math.random() * types.length)]);
        setShowMiniGame(true);
        playSfx('miniGameStart');
        setGameState('minigame');
      } else {
        setGameState('mission');
      }
    }
  };

  const handleMiniGameComplete = (success: boolean, score: number) => {
    setShowMiniGame(false);
    if (success) {
      playSfx('miniGameWin');
      setResources(prev => ({ ...prev, knowledge: Math.min(100, prev.knowledge + 5), energy: Math.min(100, prev.energy + 10) }));
      updateAchievement('code_breaker');
      toast({ title: "Mini-game Won!", description: `+${score} points!` });
    } else {
      playSfx('miniGameLose');
    }
    setGameState('mission');
  };

  const makeChoice = (choice: Choice) => {
    if (choice.requiredAbility && !unlockedAbilities.includes(choice.requiredAbility)) {
      playSfx('error');
      toast({ title: "Ability Required", description: `Need "${choice.requiredAbility}"`, variant: "destructive" });
      return;
    }
    playSfx('choiceSelect');
    setSelectedChoice(choice);
    setShowConsequence(true);
    setMissionTimer(null);

    const newResources = { ...resources };
    let hasGain = false;
    let hasLoss = false;
    Object.keys(choice.consequence.resources).forEach(key => {
      const k = key as keyof Resource;
      const change = choice.consequence.resources[k];
      if (change !== undefined) {
        if (change > 0) hasGain = true;
        if (change < 0) hasLoss = true;
        newResources[k] = Math.max(0, Math.min(100, newResources[k] + change));
      }
    });
    if (hasGain) playSfx('resourceGain');
    if (hasLoss) playSfx('resourceLoss');
    setResources(newResources);

    if (choice.consequence.unlocksAbility && !unlockedAbilities.includes(choice.consequence.unlocksAbility)) {
      setUnlockedAbilities(prev => [...prev, choice.consequence.unlocksAbility!]);
      toast({ title: "🎉 New Ability!", description: choice.consequence.unlocksAbility });
    }

    if (choice.consequence.clueReward && !collectedClues.includes(choice.consequence.clueReward)) {
      setCollectedClues(prev => [...prev, choice.consequence.clueReward!]);
      const evidence = evidenceCollection.find(e => e.missionId === currentMission?.id);
      if (evidence) setCollectedEvidence(prev => [...prev, evidence.id]);
      updateAchievement('detective');
    }
  };

  const completeMission = () => {
    if (currentMission) {
      playSfx('missionComplete');
      setCompletedMissions(prev => [...prev, currentMission.id]);
      updateAchievement('first_steps');
      updateAchievement('guardian');
      if (resources.privacyPoints >= 80) updateAchievement('privacy_pro');
      
      if (completedMissions.length + 1 >= missions.length) {
        setGameState('ending');
      } else {
        setGameState('city');
      }
      setCurrentMission(null);
    }
  };

  const resetGame = () => {
    playSfx('click');
    setGameState('intro');
    setPlayerName("");
    setResources({ ...initialResources, energy: 100 });
    setCompletedMissions([]);
    setUnlockedAbilities([]);
    setCollectedClues([]);
    setCollectedEvidence([]);
    setCurrentMission(null);
    setAchievements(achievementsList);
    setPerfectMissions(0);
  };

  const getDistrictIcon = (d: string) => {
    const icons: Record<string, JSX.Element> = { social: <Users className="h-5 w-5" />, app: <Smartphone className="h-5 w-5" />, memory: <Database className="h-5 w-5" />, guardian: <Shield className="h-5 w-5" />, shadow: <Eye className="h-5 w-5" /> };
    return icons[d] || <MapPin className="h-5 w-5" />;
  };

  // Audio settings component for all screens
  const AudioSettingsButton = () => (
    <div className="fixed top-4 right-4 z-50">
      <AudioSettings
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        soundVolume={soundVolume}
        musicVolume={musicVolume}
        onToggleSound={toggleSound}
        onToggleMusic={toggleMusic}
        onSoundVolumeChange={setSoundVolume}
        onMusicVolumeChange={setMusicVolume}
      />
    </div>
  );

  // SAVE/LOAD MENU
  if (showSaveMenu) {
    return (
      <>
        <AudioSettingsButton />
        <SaveLoadMenu
          mode={saveMenuMode}
          saveSlots={getAllSaves()}
          currentSlotId={currentSlotId}
          onSave={handleSave}
          onLoad={handleLoad}
          onDelete={handleDeleteSave}
          onClose={() => setShowSaveMenu(false)}
          onExport={exportSaves}
          onImport={importSaves}
        />
      </>
    );
  }

  // INTRO SCREEN
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center overflow-hidden">
        <AudioSettingsButton />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        </div>
        <Card className="max-w-2xl w-full bg-card/90 backdrop-blur-xl border-primary/30 shadow-2xl animate-fade-in relative z-10">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
                <Shield className="h-20 w-20 text-primary relative z-10" />
                <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <CardTitle className="text-5xl font-black bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent">
              CIPHER CITY
            </CardTitle>
            <p className="text-muted-foreground">Build Trust. Guard Secrets. Shape Your Digital World.</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1"><Gamepad2 className="h-3 w-3" />Mini-Games</Badge>
              <Badge variant="outline" className="gap-1"><Trophy className="h-3 w-3" />Achievements</Badge>
              <Badge variant="outline" className="gap-1"><User className="h-3 w-3" />Customization</Badge>
              <Badge variant="outline" className="gap-1"><Volume2 className="h-3 w-3" />Sound Effects</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Enter Your Defender Name:</label>
              <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && startGame()} placeholder="Choose wisely..." className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary" maxLength={20} />
            </div>
            <Button onClick={startGame} className="w-full text-lg py-6 bg-gradient-to-r from-primary via-purple-500 to-secondary" size="lg">
              Begin Your Journey <Zap className="ml-2 h-5 w-5" />
            </Button>
            {hasSaves() && (
              <Button onClick={openLoadMenu} variant="outline" className="w-full" size="lg">
                <Download className="h-5 w-5 mr-2" /> Continue Saved Game
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // CUSTOMIZATION SCREEN
  if (gameState === 'customization') {
    return (
      <>
        <AudioSettingsButton />
        <CharacterProfile playerName={playerName} customization={customization} resources={resources} onUpdateCustomization={(c) => { setCustomization(c); finishCustomization(); }} onClose={finishCustomization} />
      </>
    );
  }

  // ACHIEVEMENTS SCREEN
  if (gameState === 'achievements') {
    return (
      <>
        <AudioSettingsButton />
        <AchievementsPanel achievements={achievements} onClose={() => { playSfx('click'); setGameState('city'); }} />
      </>
    );
  }

  // PROFILE SCREEN
  if (gameState === 'profile') {
    return (
      <>
        <AudioSettingsButton />
        <CharacterProfile playerName={playerName} customization={customization} resources={resources} onUpdateCustomization={setCustomization} onClose={() => { playSfx('click'); setGameState('city'); }} />
      </>
    );
  }

  // MINI-GAME SCREEN
  if (gameState === 'minigame' && showMiniGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
        <AudioSettingsButton />
        <MiniGame type={miniGameType} difficulty={completedMissions.length} onComplete={handleMiniGameComplete} onCancel={() => { playSfx('click'); setShowMiniGame(false); setGameState('mission'); }} />
      </div>
    );
  }

  // DIALOGUE SCREEN
  if (gameState === 'dialogue' && currentMission) {
    const currentLine = currentMission.dialogue[currentDialogueIndex];
    const speaker = getCharacterById(currentLine.speaker);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
        <AudioSettingsButton />
        <Card className="max-w-3xl w-full bg-card/90 backdrop-blur-xl border-primary/30 animate-fade-in">
          <CardHeader className={`bg-gradient-to-r ${districts[currentMission.district].color} text-white`}>
            <CardTitle className="flex items-center gap-2">{getDistrictIcon(currentMission.district)} {currentMission.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="p-6 rounded-xl border-2 border-primary/30 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{speaker?.avatar}</div>
                <div className="flex-1">
                  <span className="font-bold text-lg">{speaker?.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">{speaker?.role}</Badge>
                  <p className="text-lg mt-2">{currentLine.text}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {currentMission.dialogue.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentDialogueIndex ? 'bg-primary w-6' : idx < currentDialogueIndex ? 'bg-primary/50' : 'bg-muted'}`} />
                ))}
              </div>
              <Button onClick={advanceDialogue}>{currentDialogueIndex < currentMission.dialogue.length - 1 ? 'Continue' : 'Begin Mission'} <ChevronRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CITY MAP SCREEN
  if (gameState === 'city') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
        <AudioSettingsButton />
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{getAvatarEmoji()}</div>
                  <div>
                    <h1 className="text-2xl font-bold">{playerName}</h1>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline"><Award className="h-3 w-3 mr-1" />Level {Math.floor(completedMissions.length / 2) + 1}</Badge>
                      <Badge variant="secondary"><Flame className="h-3 w-3 mr-1" />{dailyStreak} day streak</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={openSaveMenu}><Save className="h-4 w-4 mr-1" />Save</Button>
                  <Button variant="outline" size="sm" onClick={openLoadMenu}><Download className="h-4 w-4 mr-1" />Load</Button>
                  <Button variant="outline" size="sm" onClick={() => setGameState('profile')}><User className="h-4 w-4 mr-1" />Profile</Button>
                  <Button variant="outline" size="sm" onClick={() => setGameState('achievements')}><Trophy className="h-4 w-4 mr-1" />Achievements</Button>
                  <Button
                    size="sm"
                    onClick={() => { playSfx('click'); setGameState('phishingQuest'); }}
                    className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                  >
                    🎣 Phishing Quest
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                {[
                  { key: 'privacyPoints', icon: Shield, color: 'text-blue-400', label: 'Privacy' },
                  { key: 'trustCrystals', icon: Gem, color: 'text-purple-400', label: 'Crystals' },
                  { key: 'connections', icon: Users, color: 'text-cyan-400', label: 'Friends' },
                  { key: 'reputation', icon: TrendingUp, color: 'text-green-400', label: 'Rep' },
                  { key: 'knowledge', icon: Brain, color: 'text-yellow-400', label: 'Knowledge' },
                  { key: 'energy', icon: Zap, color: 'text-orange-400', label: 'Energy' },
                ].map(({ key, icon: Icon, color, label }) => (
                  <div key={key} className="text-center bg-muted/20 rounded-lg p-2">
                    <div className={`flex items-center justify-center gap-1 ${color}`}>
                      <Icon className="h-4 w-4" />
                      <span className="font-bold">{resources[key as keyof Resource]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive City Map */}
          <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-6 w-6 text-primary" />Cipher City Map</CardTitle>
              <p className="text-muted-foreground">Click a district to start a mission</p>
            </CardHeader>
            <CardContent>
              <CityMap completedMissions={completedMissions} onSelectMission={selectMission} hoveredDistrict={hoveredDistrict} setHoveredDistrict={setHoveredDistrict} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // MISSION SCREEN
  if (gameState === 'mission' && currentMission) {
    const district = districts[currentMission.district];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
        <AudioSettingsButton />
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {missionTimer !== null && missionTimer > 0 && (
            <div className={`text-center ${missionTimer < 30 ? 'text-destructive animate-pulse' : 'text-yellow-400'}`}>
              <Badge variant="outline" className="text-lg px-4 py-2"><Clock className="h-4 w-4 mr-2" />{Math.floor(missionTimer / 60)}:{(missionTimer % 60).toString().padStart(2, '0')}</Badge>
            </div>
          )}
          <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
            <CardHeader className={`bg-gradient-to-r ${district.color} text-white`}>
              <CardTitle className="flex items-center gap-2 text-xl">{getDistrictIcon(currentMission.district)} {currentMission.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-destructive/10 p-5 rounded-xl border border-destructive/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                  <div>
                    <h3 className="font-bold text-destructive">The Dilemma</h3>
                    <p className="text-muted-foreground mt-1">{currentMission.dilemma}</p>
                  </div>
                </div>
              </div>

              {!showConsequence ? (
                <div className="space-y-3">
                  <h3 className="font-bold flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary" />What do you do?</h3>
                  {currentMission.choices.map((choice, i) => {
                    const locked = choice.requiredAbility && !unlockedAbilities.includes(choice.requiredAbility);
                    return (
                      <Button key={choice.id} onClick={() => makeChoice(choice)} variant="outline" disabled={locked} className={`w-full justify-start text-left h-auto py-4 px-5 ${locked ? 'opacity-50' : 'hover:bg-primary/10 hover:border-primary'}`}>
                        <span className="font-bold mr-3 text-primary">{String.fromCharCode(65 + i)}.</span>
                        <span className="flex-1">{choice.text}</span>
                        {locked && <Badge variant="outline" className="ml-2"><Lock className="h-3 w-3 mr-1" />{choice.requiredAbility}</Badge>}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className={`p-5 rounded-xl border ${Object.values(selectedChoice!.consequence.resources).reduce((a, b) => (a || 0) + (b || 0), 0) >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-destructive/10 border-destructive/30'}`}>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      {Object.values(selectedChoice!.consequence.resources).reduce((a, b) => (a || 0) + (b || 0), 0) >= 0 ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                      Outcome
                    </h3>
                    <p className="text-muted-foreground">{selectedChoice!.consequence.outcomeText}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {Object.entries(selectedChoice!.consequence.resources).map(([k, v]) => v ? <Badge key={k} variant={v > 0 ? "default" : "destructive"}>{v > 0 ? '+' : ''}{v} {k}</Badge> : null)}
                    </div>
                  </div>
                  <div className="bg-primary/10 p-5 rounded-xl border border-primary/30">
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-primary"><GraduationCap className="h-5 w-5" />Privacy Lesson</h3>
                    <p className="text-muted-foreground">{currentMission.learningTakeaway}</p>
                  </div>
                  <Button onClick={completeMission} className="w-full">Complete Mission <ChevronRight className="h-4 w-4 ml-1" /></Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ENDING SCREEN
  if (gameState === 'ending') {
    const totalScore = resources.privacyPoints + resources.trustCrystals + resources.reputation + resources.knowledge;
    const percentage = Math.round((totalScore / 400) * 100);
    const ranks = [{ min: 90, name: "Master Guardian", emoji: "👑" }, { min: 75, name: "Elite Defender", emoji: "⭐" }, { min: 60, name: "Skilled Protector", emoji: "🔒" }, { min: 0, name: "Rising Shield", emoji: "📈" }];
    const rank = ranks.find(r => percentage >= r.min) || ranks[ranks.length - 1];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
        <AudioSettingsButton />
        <Card className="max-w-2xl w-full bg-card/90 backdrop-blur-xl border-primary/30 animate-fade-in">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{rank.emoji}</div>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Mission Complete!</CardTitle>
            <p className="text-muted-foreground mt-2">Congratulations, {playerName}!</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center"><Badge className="text-lg px-4 py-2">{rank.name}</Badge></div>
            <div className="grid grid-cols-2 gap-4">
              {[{ icon: Shield, value: resources.privacyPoints, label: 'Privacy', color: 'text-blue-400' }, { icon: Gem, value: resources.trustCrystals, label: 'Crystals', color: 'text-purple-400' }, { icon: TrendingUp, value: resources.reputation, label: 'Reputation', color: 'text-green-400' }, { icon: Brain, value: resources.knowledge, label: 'Knowledge', color: 'text-yellow-400' }].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="bg-muted/20 p-4 rounded-xl text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} />
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline"><Trophy className="h-3 w-3 mr-1" />{completedMissions.length} Missions</Badge>
              <Badge variant="outline"><Star className="h-3 w-3 mr-1" />{achievements.filter(a => a.unlocked).length} Achievements</Badge>
              <Badge variant="outline"><Sparkles className="h-3 w-3 mr-1" />{unlockedAbilities.length} Abilities</Badge>
            </div>
            <Button onClick={resetGame} className="w-full" size="lg"><Zap className="h-5 w-5 mr-2" />Play Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
