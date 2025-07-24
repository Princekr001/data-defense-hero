import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle } from 'lucide-react';

interface GameTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  onReset?: () => void;
}

export default function GameTimer({ duration, onTimeUp, isActive, onReset }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (onReset) {
      setTimeLeft(duration);
    }
  }, [onReset, duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const progress = ((duration - timeLeft) / duration) * 100;
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className={`bg-card border rounded-lg p-4 transition-all duration-300 ${
      isCritical ? 'border-destructive shadow-danger animate-pulse' : 
      isWarning ? 'border-warning' : 'border-border'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className={`h-5 w-5 ${
            isCritical ? 'text-destructive' : 
            isWarning ? 'text-warning' : 'text-muted-foreground'
          }`} />
          <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
        </div>
        
        {isWarning && (
          <AlertTriangle className={`h-5 w-5 ${
            isCritical ? 'text-destructive' : 'text-warning'
          }`} />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold ${
            isCritical ? 'text-destructive' : 
            isWarning ? 'text-warning' : 'text-foreground'
          }`}>
            {timeLeft}s
          </span>
          
          {isCritical && (
            <span className="text-sm text-destructive font-medium animate-pulse">
              HURRY!
            </span>
          )}
        </div>
        
        <Progress 
          value={progress} 
          className={`h-3 ${
            isCritical ? '[&>div]:bg-destructive' : 
            isWarning ? '[&>div]:bg-warning' : '[&>div]:bg-primary'
          }`}
        />
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        {isCritical ? 'Make your choice now!' : 
         isWarning ? 'Time is running out...' : 
         'Think carefully and choose wisely'}
      </div>
    </div>
  );
}