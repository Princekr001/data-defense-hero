import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// TypeScript interfaces for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface VoiceAssistantProps {
  enabled: boolean;
  onCommand: (command: string) => void;
  onAnswerSelect?: (answerIndex: number) => void;
}

export default function VoiceAssistant({ enabled, onCommand, onAnswerSelect }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.toLowerCase().trim();
          handleVoiceCommand(transcript);
        }
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          toast({
            title: "🎤 No speech detected",
            description: "Try speaking clearly into your microphone.",
          });
        }
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    // Answer selection commands
    const answerPatterns = [
      { pattern: /(option |answer |choice )?a|first|one/i, index: 0 },
      { pattern: /(option |answer |choice )?b|second|two/i, index: 1 },
      { pattern: /(option |answer |choice )?c|third|three/i, index: 2 },
      { pattern: /(option |answer |choice )?d|fourth|four/i, index: 3 }
    ];

    for (const { pattern, index } of answerPatterns) {
      if (pattern.test(command)) {
        onAnswerSelect?.(index);
        speak(`Selected option ${String.fromCharCode(65 + index)}`);
        return;
      }
    }

    // General commands
    if (command.includes('help')) {
      onCommand('help');
      speak("Opening help panel");
    } else if (command.includes('next') || command.includes('continue')) {
      onCommand('next');
      speak("Moving to next scenario");
    } else if (command.includes('restart') || command.includes('reset')) {
      onCommand('restart');
      speak("Restarting game");
    } else if (command.includes('repeat') || command.includes('read again')) {
      onCommand('repeat');
      speak("Reading scenario again");
    } else {
      toast({
        title: "🎤 Command not recognized",
        description: `Try: "Option A", "Help", "Next", or "Restart"`,
      });
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window && enabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognition.current || !enabled) return;

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
      toast({
        title: "🎤 Voice Assistant Active",
        description: "Say 'Option A', 'Help', 'Next', or 'Restart'",
      });
    }
  };

  if (!isSupported || !enabled) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      className={`fixed bottom-20 right-4 z-40 rounded-full w-12 h-12 transition-all duration-300 ${
        isListening 
          ? 'bg-destructive/20 border-destructive text-destructive animate-pulse' 
          : 'bg-primary/20 border-primary text-primary hover:bg-primary/30'
      }`}
      aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
    >
      {isListening ? (
        <Mic className="h-5 w-5 animate-pulse" />
      ) : (
        <MicOff className="h-5 w-5" />
      )}
    </Button>
  );
}

// Extend Window interface for speech recognition
// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}