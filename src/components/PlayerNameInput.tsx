import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Gamepad2 } from 'lucide-react';

interface PlayerNameInputProps {
  onNameSubmit: (name: string) => void;
  era?: {
    id: string;
    year: number;
    name: string;
    description: string;
    theme: string;
    backgroundColor: string;
    textColor: string;
    icon: string;
  } | null;
}

export default function PlayerNameInput({ onNameSubmit, era }: PlayerNameInputProps) {
  const [playerName, setPlayerName] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleNameChange = (value: string) => {
    setPlayerName(value);
    setIsValid(value.trim().length >= 2);
  };

  const handleSubmit = () => {
    if (isValid) {
      onNameSubmit(playerName.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          {era && (
            <div className="mb-6">
              <Badge variant="outline" className={`text-lg px-4 py-2 ${era.textColor} border-current`}>
                {era.icon} {era.year} - {era.name}
              </Badge>
              <p className="text-muted-foreground mt-2">{era.description}</p>
            </div>
          )}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            🛡️ Join the Cyber Defense Team
          </h1>
          <p className="text-xl text-muted-foreground">
            Enter your name to begin your cyber security mission
          </p>
        </div>

        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <div className="p-4 rounded-full bg-primary/20">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Enter Your Cyber Name</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="playerName" className="text-lg font-medium">
                What should we call you, cyber defender?
              </Label>
              <Input
                id="playerName"
                type="text"
                placeholder="Enter your name..."
                value={playerName}
                onChange={(e) => handleNameChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-3 px-4 border-2 focus:border-primary"
                maxLength={30}
                autoFocus
              />
              <p className="text-sm text-muted-foreground">
                This name will be used throughout your cyber adventure
              </p>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-primary">Ready to start?</p>
                  <p className="text-sm text-muted-foreground">
                    You'll learn to identify cyber threats and protect digital assets
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full text-lg py-3"
              size="lg"
            >
              Start Cyber Mission
            </Button>
            
            {!isValid && playerName.length > 0 && (
              <p className="text-sm text-destructive text-center">
                Name must be at least 2 characters long
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}