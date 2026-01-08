import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Shuffle,
  Eye,
  Brain,
  Lock
} from 'lucide-react';

interface MiniGameProps {
  type: 'pattern' | 'decrypt' | 'sorting' | 'memory' | 'quickChoice';
  difficulty: number;
  onComplete: (success: boolean, score: number) => void;
  onCancel: () => void;
}

// Pattern Recognition Mini-Game
const PatternGame = ({ difficulty, onComplete }: { difficulty: number; onComplete: (success: boolean, score: number) => void }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(true);
  const [gamePhase, setGamePhase] = useState<'show' | 'input' | 'result'>('show');
  const [timeLeft, setTimeLeft] = useState(15);
  
  const gridSize = 3 + Math.floor(difficulty / 2);
  const patternLength = 3 + difficulty;

  useEffect(() => {
    // Generate random pattern
    const newPattern: number[] = [];
    for (let i = 0; i < patternLength; i++) {
      newPattern.push(Math.floor(Math.random() * (gridSize * gridSize)));
    }
    setPattern(newPattern);
    
    // Show pattern for a few seconds
    const timer = setTimeout(() => {
      setShowPattern(false);
      setGamePhase('input');
    }, 2000 + difficulty * 500);
    
    return () => clearTimeout(timer);
  }, [gridSize, patternLength, difficulty]);

  useEffect(() => {
    if (gamePhase === 'input' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleComplete(false);
    }
  }, [gamePhase, timeLeft]);

  const handleCellClick = (index: number) => {
    if (gamePhase !== 'input') return;
    
    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    
    // Check if pattern matches so far
    const correctSoFar = newUserPattern.every((val, idx) => val === pattern[idx]);
    
    if (!correctSoFar) {
      handleComplete(false);
    } else if (newUserPattern.length === pattern.length) {
      handleComplete(true);
    }
  };

  const handleComplete = (success: boolean) => {
    setGamePhase('result');
    setTimeout(() => {
      onComplete(success, success ? 100 + (timeLeft * 5) : 0);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="gap-1">
          <Eye className="h-3 w-3" />
          Pattern Memory
        </Badge>
        {gamePhase === 'input' && (
          <Badge className={timeLeft < 5 ? 'bg-destructive animate-pulse' : ''}>
            <Clock className="h-3 w-3 mr-1" />
            {timeLeft}s
          </Badge>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        {gamePhase === 'show' && "Memorize the glowing pattern..."}
        {gamePhase === 'input' && `Repeat the ${patternLength}-step pattern!`}
        {gamePhase === 'result' && (userPattern.length === pattern.length ? "Perfect!" : "Pattern broken!")}
      </p>
      
      <div 
        className="grid gap-2 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          maxWidth: `${gridSize * 60}px`
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const isInPattern = pattern.includes(idx);
          const patternIndex = pattern.indexOf(idx);
          const isClicked = userPattern.includes(idx);
          const userIndex = userPattern.indexOf(idx);
          
          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={gamePhase !== 'input' || isClicked}
              className={`
                aspect-square rounded-lg border-2 transition-all duration-200 relative
                ${showPattern && isInPattern 
                  ? 'bg-primary border-primary shadow-lg shadow-primary/50 scale-105' 
                  : isClicked 
                    ? userIndex === patternIndex 
                      ? 'bg-green-500 border-green-400' 
                      : 'bg-destructive border-destructive'
                    : 'bg-muted/50 border-muted hover:bg-muted hover:border-primary/50'
                }
              `}
            >
              {showPattern && isInPattern && (
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  {patternIndex + 1}
                </span>
              )}
              {isClicked && (
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  {userIndex + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <Progress value={(userPattern.length / pattern.length) * 100} className="h-2" />
    </div>
  );
};

// Decrypt Code Mini-Game
const DecryptGame = ({ difficulty, onComplete }: { difficulty: number; onComplete: (success: boolean, score: number) => void }) => {
  const codeLength = 4 + Math.floor(difficulty / 2);
  const [targetCode, setTargetCode] = useState<string>('');
  const [userCode, setUserCode] = useState<string>('');
  const [hints, setHints] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 6 - Math.floor(difficulty / 2);
  
  useEffect(() => {
    const chars = 'ABCDEFGH'.slice(0, 4 + difficulty);
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setTargetCode(code);
  }, [codeLength, difficulty]);

  const checkGuess = () => {
    if (userCode.length !== codeLength) return;
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (userCode === targetCode) {
      onComplete(true, 150 - (newAttempts * 20));
      return;
    }
    
    // Generate hint
    let correct = 0;
    let misplaced = 0;
    const targetArr = targetCode.split('');
    const userArr = userCode.split('');
    
    userArr.forEach((char, idx) => {
      if (char === targetArr[idx]) correct++;
      else if (targetArr.includes(char)) misplaced++;
    });
    
    setHints([...hints, `${userCode}: ${correct} correct, ${misplaced} misplaced`]);
    setUserCode('');
    
    if (newAttempts >= maxAttempts) {
      onComplete(false, 0);
    }
  };

  const chars = 'ABCDEFGH'.slice(0, 4 + difficulty).split('');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="gap-1">
          <Lock className="h-3 w-3" />
          Code Breaker
        </Badge>
        <Badge variant={attempts >= maxAttempts - 1 ? "destructive" : "secondary"}>
          {maxAttempts - attempts} attempts left
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Crack the {codeLength}-character code!
      </p>
      
      {/* Current guess display */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: codeLength }).map((_, idx) => (
          <div 
            key={idx}
            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all
              ${userCode[idx] ? 'border-primary bg-primary/20' : 'border-muted bg-muted/30'}
            `}
          >
            {userCode[idx] || '?'}
          </div>
        ))}
      </div>
      
      {/* Character buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {chars.map(char => (
          <Button
            key={char}
            variant="outline"
            size="sm"
            onClick={() => userCode.length < codeLength && setUserCode(userCode + char)}
            className="w-10 h-10 text-lg font-bold"
          >
            {char}
          </Button>
        ))}
      </div>
      
      <div className="flex gap-2 justify-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setUserCode(userCode.slice(0, -1))}
          disabled={userCode.length === 0}
        >
          ← Delete
        </Button>
        <Button 
          size="sm"
          onClick={checkGuess}
          disabled={userCode.length !== codeLength}
        >
          Check Code
        </Button>
      </div>
      
      {/* Hints */}
      {hints.length > 0 && (
        <div className="bg-muted/30 p-3 rounded-lg space-y-1 max-h-32 overflow-y-auto">
          {hints.map((hint, idx) => (
            <p key={idx} className="text-xs font-mono">{hint}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// Sorting Challenge Mini-Game
const SortingGame = ({ difficulty, onComplete }: { difficulty: number; onComplete: (success: boolean, score: number) => void }) => {
  const items = [
    { id: 'password', label: '🔐 Strong Password', safetyLevel: 5 },
    { id: '2fa', label: '📱 Two-Factor Auth', safetyLevel: 4 },
    { id: 'private', label: '🔒 Private Profile', safetyLevel: 3 },
    { id: 'verify', label: '✅ Verify Requests', safetyLevel: 2 },
    { id: 'public', label: '🌐 Public Sharing', safetyLevel: 1 },
    { id: 'overshare', label: '📢 Oversharing', safetyLevel: 0 },
  ].slice(0, 3 + difficulty);

  const [shuffled, setShuffled] = useState<typeof items>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(20 + difficulty * 5);

  useEffect(() => {
    setShuffled([...items].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else {
      checkOrder();
    }
  }, [timeLeft]);

  const swapItems = (idx1: number, idx2: number) => {
    const newShuffled = [...shuffled];
    [newShuffled[idx1], newShuffled[idx2]] = [newShuffled[idx2], newShuffled[idx1]];
    setShuffled(newShuffled);
  };

  const handleItemClick = (idx: number) => {
    if (selected === null) {
      setSelected(idx);
    } else {
      swapItems(selected, idx);
      setSelected(null);
    }
  };

  const checkOrder = () => {
    const isCorrect = shuffled.every((item, idx) => 
      idx === 0 || item.safetyLevel <= shuffled[idx - 1].safetyLevel
    );
    onComplete(isCorrect, isCorrect ? 100 + timeLeft * 3 : 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="gap-1">
          <Shuffle className="h-3 w-3" />
          Safety Sorting
        </Badge>
        <Badge className={timeLeft < 10 ? 'bg-destructive animate-pulse' : ''}>
          <Clock className="h-3 w-3 mr-1" />
          {timeLeft}s
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Sort from MOST safe (top) to LEAST safe (bottom)
      </p>
      
      <div className="space-y-2">
        {shuffled.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(idx)}
            className={`
              w-full p-3 rounded-lg border-2 text-left transition-all
              ${selected === idx 
                ? 'border-primary bg-primary/20 scale-102' 
                : 'border-muted bg-muted/30 hover:border-primary/50'
              }
            `}
          >
            <span className="font-mono text-xs text-muted-foreground mr-2">#{idx + 1}</span>
            {item.label}
          </button>
        ))}
      </div>
      
      <Button onClick={checkOrder} className="w-full">
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Submit Order
      </Button>
    </div>
  );
};

// Quick Choice Mini-Game
const QuickChoiceGame = ({ difficulty, onComplete }: { difficulty: number; onComplete: (success: boolean, score: number) => void }) => {
  const scenarios = [
    { question: "Someone asks for your password to 'help'", safe: "Decline politely", unsafe: "Share it quickly" },
    { question: "A free app wants access to all your photos", safe: "Check permissions", unsafe: "Allow everything" },
    { question: "Unknown friend request with no mutual friends", safe: "Investigate first", unsafe: "Accept immediately" },
    { question: "Email says 'Click here to claim prize!'", safe: "Ignore & delete", unsafe: "Click the link" },
    { question: "Friend asks you to forward a chain message", safe: "Break the chain", unsafe: "Forward to everyone" },
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  
  const numQuestions = Math.min(3 + difficulty, scenarios.length);
  const currentScenario = scenarios[currentIndex];
  const isSwapped = Math.random() > 0.5;

  useEffect(() => {
    if (timeLeft > 0 && answered === null) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && answered === null) {
      handleChoice(false);
    }
  }, [timeLeft, answered]);

  const handleChoice = (choseSafe: boolean) => {
    setAnswered(choseSafe);
    if (choseSafe) setScore(s => s + 1);
    
    setTimeout(() => {
      if (currentIndex + 1 < numQuestions) {
        setCurrentIndex(i => i + 1);
        setAnswered(null);
        setTimeLeft(5);
      } else {
        onComplete(score + (choseSafe ? 1 : 0) >= numQuestions / 2, (score + (choseSafe ? 1 : 0)) * 30);
      }
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="gap-1">
          <Zap className="h-3 w-3" />
          Quick Decisions
        </Badge>
        <div className="flex gap-2">
          <Badge variant="secondary">{currentIndex + 1}/{numQuestions}</Badge>
          <Badge className={timeLeft < 3 ? 'bg-destructive animate-pulse' : ''}>
            {timeLeft}s
          </Badge>
        </div>
      </div>
      
      <Progress value={(currentIndex / numQuestions) * 100} className="h-2" />
      
      <div className="bg-muted/30 p-4 rounded-lg text-center">
        <p className="font-medium">{currentScenario.question}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleChoice(!isSwapped)}
          disabled={answered !== null}
          className={`h-auto py-4 ${
            answered !== null 
              ? (!isSwapped ? 'bg-green-500/20 border-green-500' : 'bg-destructive/20 border-destructive')
              : ''
          }`}
        >
          {isSwapped ? currentScenario.unsafe : currentScenario.safe}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleChoice(isSwapped)}
          disabled={answered !== null}
          className={`h-auto py-4 ${
            answered !== null 
              ? (isSwapped ? 'bg-green-500/20 border-green-500' : 'bg-destructive/20 border-destructive')
              : ''
          }`}
        >
          {isSwapped ? currentScenario.safe : currentScenario.unsafe}
        </Button>
      </div>
      
      {answered !== null && (
        <p className={`text-center text-sm ${answered ? 'text-green-400' : 'text-destructive'}`}>
          {answered ? '✓ Good choice!' : '✗ That could be risky!'}
        </p>
      )}
    </div>
  );
};

export default function MiniGame({ type, difficulty, onComplete, onCancel }: MiniGameProps) {
  return (
    <Card className="max-w-md mx-auto bg-card/95 backdrop-blur-xl border-primary/30 shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Security Challenge
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Skip
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {type === 'pattern' && <PatternGame difficulty={difficulty} onComplete={onComplete} />}
        {type === 'decrypt' && <DecryptGame difficulty={difficulty} onComplete={onComplete} />}
        {type === 'sorting' && <SortingGame difficulty={difficulty} onComplete={onComplete} />}
        {type === 'quickChoice' && <QuickChoiceGame difficulty={difficulty} onComplete={onComplete} />}
        {type === 'memory' && <PatternGame difficulty={difficulty} onComplete={onComplete} />}
      </CardContent>
    </Card>
  );
}
