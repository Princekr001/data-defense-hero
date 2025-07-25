import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, AlertTriangle, Eye, Cpu, Shield } from "lucide-react";

interface CyberNexusProps {
  playerPerformance: 'excellent' | 'good' | 'struggling';
  currentMission?: string;
  discoveredEvidence: string[];
  onHintRequest?: () => void;
}

export default function CyberNexus({ 
  playerPerformance, 
  currentMission = '',
  discoveredEvidence,
  onHintRequest 
}: CyberNexusProps) {
  const [nexusState, setNexusState] = useState<'helpful' | 'neutral' | 'glitchy' | 'corrupted'>('helpful');
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Nexus evolves based on player performance
  useEffect(() => {
    switch (playerPerformance) {
      case 'excellent':
        setNexusState('helpful');
        break;
      case 'good':
        setNexusState('neutral');
        break;
      case 'struggling':
        setNexusState(Math.random() > 0.5 ? 'glitchy' : 'corrupted');
        break;
    }
  }, [playerPerformance]);

  // Generate cryptic messages based on current state
  useEffect(() => {
    const generateMessage = () => {
      setIsAnimating(true);
      
      const messages = {
        helpful: [
          "🔍 The truth lies in the details, cyber-detective...",
          "⚡ Examine the evidence closely. What doesn't belong?",
          "🛡️ Your instincts are sharp. Trust the patterns you see.",
          "🧠 Logic is your greatest weapon in this digital realm.",
          "💡 Each clue brings you closer to the truth..."
        ],
        neutral: [
          "🤖 Processing... Evidence patterns unclear...",
          "⚡ Multiple pathways detected. Choose wisely.",
          "🔍 Data fragments require deeper analysis...",
          "🛡️ System nominal. Proceed with investigation.",
          "💭 The solution exists within the information provided..."
        ],
        glitchy: [
          "⚠️ WARNING: D4t4 c0rrupt10n d3t3ct3d...",
          "🔴 ERROR... ERROR... Evidence matrix unstable...",
          "⚡ SYS//OVERLOAD... Trust n0thing... trust 3v3ryth1ng...",
          "🌀 Gl1tch... The truth is... H1DD3N... in plain sight...",
          "❗ MALFUNCTION: Reality.exe has stopped working..."
        ],
        corrupted: [
          "💀 They know you're watching... Be careful...",
          "🔺 The system fights back... Evidence may be compromised...",
          "⚠️ Trust no one... especially not me...",
          "🌀 The lines between real and fake blur... Can you tell?",
          "💥 I am... compromised... Do not listen... Listen carefully..."
        ]
      };

      const stateMessages = messages[nexusState];
      const randomMessage = stateMessages[Math.floor(Math.random() * stateMessages.length)];
      setMessage(randomMessage);
      
      setTimeout(() => setIsAnimating(false), 1000);
    };

    generateMessage();
    const interval = setInterval(generateMessage, 8000); // Change message every 8 seconds
    
    return () => clearInterval(interval);
  }, [nexusState]);

  const getNexusStyle = () => {
    switch (nexusState) {
      case 'helpful':
        return {
          bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-blue-500/30',
          text: 'text-blue-300',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        };
      case 'neutral':
        return {
          bg: 'bg-gradient-to-br from-gray-500/20 to-gray-600/10 border-gray-500/30',
          text: 'text-gray-300',
          glow: 'shadow-[0_0_20px_rgba(107,114,128,0.3)]'
        };
      case 'glitchy':
        return {
          bg: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-yellow-500/30',
          text: 'text-yellow-300',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]'
        };
      case 'corrupted':
        return {
          bg: 'bg-gradient-to-br from-red-500/20 to-purple-500/10 border-red-500/30',
          text: 'text-red-300',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.6)]'
        };
    }
  };

  const style = getNexusStyle();

  const getEvidenceHint = () => {
    if (discoveredEvidence.length === 0) {
      return "🔍 Start by examining all available evidence...";
    }
    
    if (discoveredEvidence.length < 3) {
      return "📋 More evidence awaits your investigation...";
    }
    
    return "🧩 You have gathered enough clues. Connect the patterns...";
  };

  const getNexusIcon = () => {
    switch (nexusState) {
      case 'helpful': return <Brain className="h-6 w-6" />;
      case 'neutral': return <Cpu className="h-6 w-6" />;
      case 'glitchy': return <Zap className="h-6 w-6" />;
      case 'corrupted': return <AlertTriangle className="h-6 w-6" />;
    }
  };

  return (
    <Card className={`${style.bg} border-2 ${style.glow} transition-all duration-1000`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Nexus Avatar */}
          <div className={`w-12 h-12 rounded-full bg-background/20 border-2 border-current flex items-center justify-center ${style.text} ${isAnimating ? 'animate-pulse' : ''}`}>
            {getNexusIcon()}
          </div>
          
          {/* Nexus Communication */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h3 className={`font-bold ${style.text}`}>
                CYBER-NEXUS {nexusState.toUpperCase()}
              </h3>
              <Badge 
                variant="outline" 
                className={`${style.bg} ${style.text} border-current text-xs`}
              >
                {nexusState === 'helpful' ? 'OPERATIONAL' :
                 nexusState === 'neutral' ? 'STANDBY' :
                 nexusState === 'glitchy' ? 'UNSTABLE' : 'COMPROMISED'}
              </Badge>
            </div>
            
            {/* Main Message */}
            <div className={`${style.text} ${isAnimating ? 'animate-fade-in' : ''} ${nexusState === 'glitchy' ? 'font-mono animate-pulse' : ''}`}>
              <p className="leading-relaxed">
                {message}
              </p>
            </div>
            
            {/* Evidence Progress Hint */}
            {discoveredEvidence.length > 0 && (
              <div className="mt-3 p-2 rounded bg-background/10 border border-current/20">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  <span className="opacity-80">
                    {getEvidenceHint()}
                  </span>
                </div>
                <div className="mt-1 text-xs opacity-60">
                  Evidence Collected: {discoveredEvidence.length}
                </div>
              </div>
            )}
            
            {/* Cryptic Pattern Display for Advanced States */}
            {(nexusState === 'glitchy' || nexusState === 'corrupted') && (
              <div className="mt-3 p-2 rounded bg-background/10 border border-current/20 font-mono text-xs">
                <div className="opacity-60">
                  {nexusState === 'glitchy' 
                    ? "01001000 01100101 01101100 01110000..."
                    : "̸̢̧̳͍̰͉̤̣̱̈́̈́͗̉̔̽T̴̰̈h̷̰̲̙̮̟̲̆̌̀̈́̓̕ë̴́ͅ ̸̰̱̜̠̇̍̈́t̸̰̯̺͗r̶̺̃u̸̧̦̞̫̫̲̇t̶̰̃h̶̰̮̃̿̈́ ̸̨̛̤̻̞̓i̶̺̭̓ṡ̶̬̈́..."
                  }
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Performance Indicator */}
        <div className="mt-4 flex items-center justify-between text-xs opacity-60">
          <span>Neural Link: {nexusState === 'helpful' ? 'Strong' : nexusState === 'neutral' ? 'Stable' : nexusState === 'glitchy' ? 'Weak' : 'Critical'}</span>
          <span>Threat Level: {nexusState === 'corrupted' ? 'High' : nexusState === 'glitchy' ? 'Moderate' : 'Low'}</span>
        </div>
      </CardContent>
    </Card>
  );
}