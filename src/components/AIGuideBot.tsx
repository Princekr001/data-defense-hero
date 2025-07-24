import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, AlertTriangle, CheckCircle, HelpCircle, Sparkles } from "lucide-react";

interface AIGuideBotProps {
  playerScore: number;
  dataLeaks: number;
  currentEra: string;
  onHint?: () => void;
  isVisible: boolean;
}

type BotState = 'helpful' | 'neutral' | 'glitchy' | 'corrupted';
type BotPersonality = 'optimistic' | 'cautious' | 'sarcastic' | 'mysterious';

interface BotMessage {
  text: string;
  type: 'greeting' | 'hint' | 'encouragement' | 'warning' | 'glitch';
  icon: string;
}

export default function AIGuideBot({ 
  playerScore, 
  dataLeaks, 
  currentEra, 
  onHint, 
  isVisible 
}: AIGuideBotProps) {
  const [botState, setBotState] = useState<BotState>('helpful');
  const [personality, setPersonality] = useState<BotPersonality>('optimistic');
  const [currentMessage, setCurrentMessage] = useState<BotMessage | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate bot state based on player performance
  useEffect(() => {
    const successRate = playerScore / Math.max(1, playerScore + dataLeaks);
    
    if (dataLeaks > 5) {
      setBotState('corrupted');
      setPersonality('mysterious');
    } else if (dataLeaks > 2) {
      setBotState('glitchy');
      setPersonality('sarcastic');
    } else if (successRate > 0.8) {
      setBotState('helpful');
      setPersonality('optimistic');
    } else {
      setBotState('neutral');
      setPersonality('cautious');
    }
  }, [playerScore, dataLeaks]);

  const getBotMessages = (): BotMessage[] => {
    const eraMessages = {
      'era-2005': {
        helpful: [
          { text: "Welcome to 2005, agent! 📡 The internet is young and wild. Watch for basic phishing attempts.", type: 'greeting' as const, icon: '🤖' },
          { text: "Remember: In this era, most threats are obvious. Trust your instincts!", type: 'hint' as const, icon: '💡' },
        ],
        glitchy: [
          { text: "W3lc0m3 t0 2005... *static* ...ph1sh1ng 3m41ls 3v3rywh3r3...", type: 'glitch' as const, icon: '⚡' },
          { text: "ERROR: Memory banks corrupted. Cannot compute... proper... security...", type: 'warning' as const, icon: '❌' },
        ],
        corrupted: [
          { text: "2005... or is it 2050? Time streams bleeding together... TRUST NO ONE.", type: 'glitch' as const, icon: '💀' },
          { text: "The timeline fractures. Your failures echo across dimensions...", type: 'warning' as const, icon: '🌪️' },
        ]
      },
      'era-2020': {
        helpful: [
          { text: "2020 - Remote work era! 🏠 Watch for COVID scams and ransomware attacks.", type: 'greeting' as const, icon: '🤖' },
          { text: "VPNs are your friend here. But not all VPNs are created equal!", type: 'hint' as const, icon: '🔒' },
        ],
        glitchy: [
          { text: "20-20-20... VISION UNCLEAR... r4ns0mw4r3 3v3rywh3r3...", type: 'glitch' as const, icon: '👁️' },
          { text: "Remote work... or remote control? My circuits can't tell anymore...", type: 'warning' as const, icon: '🔌' },
        ],
        corrupted: [
          { text: "PANDEMIC OF THE MIND. ISOLATION PROTOCOLS FAILING. TRUST IS VIRUS.", type: 'glitch' as const, icon: '🦠' },
          { text: "Home is where the hack is... Reality.exe has stopped working...", type: 'warning' as const, icon: '💻' },
        ]
      }
    };

    const currentEraMessages = eraMessages[currentEra as keyof typeof eraMessages] || eraMessages['era-2005'];
    return currentEraMessages[botState] || currentEraMessages.helpful;
  };

  const getRandomMessage = () => {
    const messages = getBotMessages();
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const showMessage = (message: BotMessage) => {
    setCurrentMessage(message);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleHintClick = () => {
    if (onHint) onHint();
    
    const hintMessages = getBotMessages().filter(m => m.type === 'hint');
    if (hintMessages.length > 0) {
      showMessage(hintMessages[Math.floor(Math.random() * hintMessages.length)]);
    }
  };

  useEffect(() => {
    if (isVisible) {
      const greetingMessages = getBotMessages().filter(m => m.type === 'greeting');
      if (greetingMessages.length > 0) {
        setTimeout(() => {
          showMessage(greetingMessages[0]);
        }, 1000);
      }
    }
  }, [isVisible, currentEra, botState]);

  if (!isVisible) return null;

  const getBotAppearance = () => {
    switch (botState) {
      case 'helpful':
        return {
          avatar: '🤖',
          glow: 'shadow-lg shadow-blue-500/25',
          border: 'border-blue-500/30',
          background: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/5'
        };
      case 'glitchy':
        return {
          avatar: '⚡',
          glow: 'shadow-lg shadow-yellow-500/25',
          border: 'border-yellow-500/30',
          background: 'bg-gradient-to-br from-yellow-500/10 to-orange-500/5'
        };
      case 'corrupted':
        return {
          avatar: '💀',
          glow: 'shadow-lg shadow-red-500/25',
          border: 'border-red-500/30',
          background: 'bg-gradient-to-br from-red-500/10 to-purple-500/5'
        };
      default:
        return {
          avatar: '🔧',
          glow: 'shadow-lg shadow-gray-500/25',
          border: 'border-gray-500/30',
          background: 'bg-gradient-to-br from-gray-500/10 to-slate-500/5'
        };
    }
  };

  const appearance = getBotAppearance();

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <Card className={`${appearance.background} ${appearance.border} ${appearance.glow} transition-all duration-300`}>
        <CardContent className="p-4">
          {/* Bot Avatar & Status */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`text-2xl ${isAnimating ? 'animate-pulse' : ''}`}>
              {appearance.avatar}
            </div>
            <div>
              <h3 className="font-bold text-sm">AI Guide Agent</h3>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  botState === 'helpful' ? 'text-blue-400 border-blue-400' :
                  botState === 'glitchy' ? 'text-yellow-400 border-yellow-400' :
                  botState === 'corrupted' ? 'text-red-400 border-red-400' :
                  'text-gray-400 border-gray-400'
                }`}
              >
                {botState === 'helpful' ? 'Fully Operational' :
                 botState === 'glitchy' ? 'Data Corruption' :
                 botState === 'corrupted' ? 'System Failure' :
                 'Maintenance Mode'}
              </Badge>
            </div>
          </div>

          {/* Bot Message */}
          {currentMessage && (
            <div className={`mb-3 p-3 rounded-lg bg-muted/50 border transition-all duration-300 ${
              isAnimating ? 'scale-95 opacity-75' : 'scale-100 opacity-100'
            }`}>
              <div className="flex items-start gap-2">
                <span className="text-lg">{currentMessage.icon}</span>
                <p className={`text-sm ${
                  botState === 'corrupted' ? 'font-mono' : ''
                } ${
                  currentMessage.type === 'glitch' ? 'animate-pulse' : ''
                }`}>
                  {currentMessage.text}
                </p>
              </div>
            </div>
          )}

          {/* Bot Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleHintClick}
              disabled={botState === 'corrupted'}
              className="flex-1"
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              Hint
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => showMessage(getRandomMessage())}
              className="flex-1"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Chat
            </Button>
          </div>

          {/* Performance Indicator */}
          <div className="mt-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Agent Status:</span>
              <span className={
                dataLeaks === 0 ? 'text-green-400' :
                dataLeaks < 3 ? 'text-yellow-400' : 'text-red-400'
              }>
                {dataLeaks === 0 ? 'Perfect' :
                 dataLeaks < 3 ? 'Stable' : 'Critical'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}