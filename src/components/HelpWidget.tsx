import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  X, 
  MessageCircle, 
  Book, 
  Lightbulb, 
  Shield,
  Keyboard,
  Volume2,
  VolumeX
} from "lucide-react";

interface HelpWidgetProps {
  playerLevel?: number;
  onVoiceToggle?: (enabled: boolean) => void;
  voiceEnabled?: boolean;
}

export default function HelpWidget({ 
  playerLevel = 1, 
  onVoiceToggle,
  voiceEnabled = false 
}: HelpWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'help' | 'tips' | 'shortcuts'>('help');

  const helpContent = {
    help: [
      { 
        icon: Shield, 
        title: "Game Objective", 
        content: "Defend against cyber threats by choosing the correct security responses. Each right answer builds your expertise!" 
      },
      { 
        icon: MessageCircle, 
        title: "Scoring System", 
        content: "Earn XP for correct answers, bonus points for streaks, and unlock achievements as you progress." 
      },
      { 
        icon: Book, 
        title: "Learning Path", 
        content: "Progress through scenarios of increasing difficulty. Master concepts to unlock advanced challenges." 
      }
    ],
    tips: [
      { 
        icon: Lightbulb, 
        title: "Build Streaks", 
        content: "Consecutive correct answers multiply your XP. Focus on accuracy over speed!" 
      },
      { 
        icon: Shield, 
        title: "Read Carefully", 
        content: "Each scenario provides clues. Look for keywords that indicate the best security practice." 
      },
      { 
        icon: MessageCircle, 
        title: "Learn From Mistakes", 
        content: "Wrong answers show explanations. Use this feedback to improve your cybersecurity knowledge." 
      }
    ],
    shortcuts: [
      { key: "1-4", action: "Select answer choice" },
      { key: "Enter", action: "Confirm selection" },
      { key: "Space", action: "Next scenario" },
      { key: "R", action: "Restart game" },
      { key: "H", action: "Toggle help" },
      { key: "V", action: "Toggle voice" }
    ]
  };

  const getPersonalizedTip = () => {
    if (playerLevel >= 5) return "🏆 You're mastering cybersecurity! Try voice commands for hands-free learning.";
    if (playerLevel >= 3) return "🚀 Great progress! Focus on building longer streaks for maximum XP.";
    return "🌟 New to cybersecurity? Take your time reading each scenario carefully.";
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full w-12 h-12 bg-gradient-cyber hover:shadow-cyber transition-all duration-300 animate-pulse-glow"
        size="icon"
        aria-label="Open help widget"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-scale-in">
      <Card className="w-80 max-h-96 overflow-hidden bg-card/95 backdrop-blur-md border-primary/30 shadow-cyber">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Cyber Assistant
            </CardTitle>
            <div className="flex gap-1">
              {onVoiceToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onVoiceToggle(!voiceEnabled)}
                  className="h-8 w-8"
                  aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
                >
                  {voiceEnabled ? (
                    <Volume2 className="h-4 w-4 text-primary" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
                aria-label="Close help"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Badge className="bg-gradient-reward text-black text-xs">
            {getPersonalizedTip()}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Tab Navigation */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {(['help', 'tips', 'shortcuts'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-xs ${
                  activeTab === tab ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                {tab === 'help' && <Book className="h-3 w-3 mr-1" />}
                {tab === 'tips' && <Lightbulb className="h-3 w-3 mr-1" />}
                {tab === 'shortcuts' && <Keyboard className="h-3 w-3 mr-1" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="max-h-60 overflow-y-auto space-y-3">
            {activeTab === 'shortcuts' ? (
              <div className="space-y-2">
                {helpContent.shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <Badge variant="outline" className="font-mono text-xs">
                      {shortcut.key}
                    </Badge>
                    <span className="text-muted-foreground">{shortcut.action}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {helpContent[activeTab].map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary mt-0.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}