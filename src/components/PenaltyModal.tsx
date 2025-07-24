import { AlertTriangle, RotateCcw, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface PenaltyModalProps {
  isOpen: boolean;
  onRestart: () => void;
  reason: 'wrong-answer' | 'timeout';
  lostLevel: number;
  lostXp: number;
}

export default function PenaltyModal({ 
  isOpen, 
  onRestart, 
  reason, 
  lostLevel, 
  lostXp 
}: PenaltyModalProps) {
  const penaltyData = {
    'wrong-answer': {
      title: 'Security Breach!',
      icon: '💥',
      description: 'Your wrong choice led to a security incident!',
      consequence: 'The attackers have compromised the system.',
    },
    'timeout': {
      title: 'Time\'s Up!',
      icon: '⏰',
      description: 'You failed to respond in time!',
      consequence: 'Delayed response allowed the threat to succeed.',
    }
  };

  const data = penaltyData[reason];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md border-destructive bg-gradient-to-br from-destructive/10 to-destructive/5">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">{data.icon}</div>
          <DialogTitle className="text-2xl font-bold text-destructive flex items-center justify-center gap-2">
            <Skull className="h-6 w-6" />
            {data.title}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            {data.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-center text-destructive font-medium mb-3">
              {data.consequence}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lost Level:</span>
                <Badge variant="destructive">{lostLevel}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lost XP:</span>
                <Badge variant="destructive">{lostXp}</Badge>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span className="font-semibold text-warning">HARSH PENALTY MODE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              One mistake resets your progress to Level 1. Learn from this experience and try again!
            </p>
          </div>

          <Button 
            onClick={onRestart}
            variant="destructive" 
            size="lg" 
            className="w-full text-lg gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Restart from Level 1
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}