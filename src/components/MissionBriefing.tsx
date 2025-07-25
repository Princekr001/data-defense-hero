import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Rocket, Ship, Search, Castle, Cpu, 
  AlertTriangle, Clock, Target, Award 
} from "lucide-react";
import { Mission } from "@/data/missions";

interface MissionBriefingProps {
  mission: Mission;
  onStartMission: () => void;
  playerLevel: number;
  unlockedTools: string[];
}

export default function MissionBriefing({ 
  mission, 
  onStartMission, 
  playerLevel,
  unlockedTools 
}: MissionBriefingProps) {
  
  const getThemeConfig = (theme: string) => {
    const configs = {
      space: {
        icon: <Rocket className="h-8 w-8" />,
        bg: 'from-indigo-500/20 to-purple-600/10',
        border: 'border-indigo-500/30',
        text: 'text-indigo-300',
        accent: 'bg-indigo-500/20'
      },
      pirate: {
        icon: <Ship className="h-8 w-8" />,
        bg: 'from-amber-500/20 to-orange-600/10',
        border: 'border-amber-500/30',
        text: 'text-amber-300',
        accent: 'bg-amber-500/20'
      },
      detective: {
        icon: <Search className="h-8 w-8" />,
        bg: 'from-slate-500/20 to-gray-600/10',
        border: 'border-slate-500/30',
        text: 'text-slate-300',
        accent: 'bg-slate-500/20'
      },
      medieval: {
        icon: <Castle className="h-8 w-8" />,
        bg: 'from-green-500/20 to-emerald-600/10',
        border: 'border-green-500/30',
        text: 'text-green-300',
        accent: 'bg-green-500/20'
      },
      cyberpunk: {
        icon: <Cpu className="h-8 w-8" />,
        bg: 'from-cyan-500/20 to-blue-600/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-300',
        accent: 'bg-cyan-500/20'
      }
    };
    return configs[theme as keyof typeof configs] || configs.detective;
  };

  const getDifficultyConfig = (difficulty: string) => {
    const configs = {
      rookie: { 
        color: 'bg-green-500/20 text-green-300 border-green-500/30', 
        icon: '🌱', 
        label: 'Rookie Mission' 
      },
      detective: { 
        color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', 
        icon: '🔍', 
        label: 'Detective Level' 
      },
      expert: { 
        color: 'bg-red-500/20 text-red-300 border-red-500/30', 
        icon: '💀', 
        label: 'Expert Challenge' 
      }
    };
    return configs[difficulty as keyof typeof configs] || configs.rookie;
  };

  const themeConfig = getThemeConfig(mission.theme);
  const difficultyConfig = getDifficultyConfig(mission.difficulty);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Mission Header */}
      <Card className={`bg-gradient-to-br ${themeConfig.bg} border-2 ${themeConfig.border}`}>
        <CardHeader>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`p-4 rounded-xl ${themeConfig.accent} backdrop-blur-sm`}>
              {themeConfig.icon}
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center gap-3 justify-center">
                <Badge variant="outline" className={`${difficultyConfig.color} border-2`}>
                  {difficultyConfig.icon} {difficultyConfig.label}
                </Badge>
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                  {mission.concept}
                </Badge>
              </div>
            </div>
          </div>
          <CardTitle className={`text-3xl font-bold text-center ${themeConfig.text}`}>
            {mission.title}
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Based on: {mission.realWorldIncident}
          </p>
        </CardHeader>
      </Card>

      {/* Story Setup */}
      <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mission Briefing
          </h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${themeConfig.accent} border ${themeConfig.border}`}>
              <h4 className={`font-semibold ${themeConfig.text} mb-2`}>Setting</h4>
              <p className="text-foreground leading-relaxed">
                {mission.storySetup}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">The Crisis</h4>
              <p className="text-foreground leading-relaxed">
                {mission.situation}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evidence Preview */}
        <Card className="border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-amber-500/5">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-300 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Evidence Available
            </h3>
            <div className="space-y-3">
              {mission.evidence.slice(0, 3).map((evidence, index) => (
                <div key={evidence.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-foreground">{evidence.name}</span>
                  {evidence.suspicious && (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              ))}
              {mission.evidence.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{mission.evidence.length - 3} more pieces of evidence...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mission Rewards */}
        <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-300 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Mission Rewards
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-sm text-foreground">+{mission.xpReward} XP</span>
              </div>
              {mission.toolRewards.map((tool, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-sm text-foreground">
                    New Cyber Tool: {tool.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-sm text-foreground">Forensic Knowledge</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mission Objectives */}
      <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">
            Your Mission
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-blue-300 mb-1">Investigate</h4>
              <p className="text-xs text-muted-foreground">Examine all evidence carefully</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-blue-300 mb-1">Analyze</h4>
              <p className="text-xs text-muted-foreground">Identify threats and patterns</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-blue-300 mb-1">Decide</h4>
              <p className="text-xs text-muted-foreground">Choose the safest course of action</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Mission Button */}
      <div className="text-center">
        <Button 
          onClick={onStartMission}
          size="lg"
          className={`${themeConfig.accent} ${themeConfig.text} border-2 ${themeConfig.border} hover:scale-105 transition-all duration-300 px-8 py-6 text-lg font-bold`}
        >
          Begin Investigation
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          No time limits • No penalties • Learn at your own pace
        </p>
      </div>
    </div>
  );
}