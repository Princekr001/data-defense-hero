import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Sparkles } from "lucide-react";

interface Character {
  name: string;
  avatar: string;
  title: string;
  specialty: string;
}

interface CharacterCustomizerProps {
  character: Character;
  onCustomize: (customizedCharacter: Character) => void;
  onSkip: () => void;
}

export default function CharacterCustomizer({ character, onCustomize, onSkip }: CharacterCustomizerProps) {
  const [customName, setCustomName] = useState(character.name);
  const [selectedAvatar, setSelectedAvatar] = useState(character.avatar);

  const availableAvatars = [
    '🧑‍💻', '👩‍💻', '🕵️', '🦸‍♀️', '🦸‍♂️', '🧙‍♀️', '🧙‍♂️', '👨‍🔬', '👩‍🔬',
    '🤖', '👽', '🦄', '🐉', '🦅', '🦁', '🐺', '🐱', '🐻'
  ];

  const handleCustomize = () => {
    onCustomize({
      ...character,
      name: customName.trim() || character.name,
      avatar: selectedAvatar
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm border-primary/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Customize Your Cyber Agent
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-lg">
            Make this character truly yours! Personalize their name and appearance.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Character Preview */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl border-4 border-primary/30">
              {selectedAvatar}
            </div>
            <h3 className="text-2xl font-bold text-foreground">{customName || character.name}</h3>
            <Badge variant="outline" className="mt-2 text-primary border-primary/30">
              {character.title}
            </Badge>
            <p className="text-muted-foreground mt-2">{character.specialty}</p>
          </div>

          {/* Name Customization */}
          <div className="space-y-3">
            <Label htmlFor="character-name" className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Character Name
            </Label>
            <Input
              id="character-name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={`Enter a name (e.g., ${character.name}, Alex, Jordan, etc.)`}
              className="text-lg p-3 bg-background/50 border-primary/30 focus:border-primary"
            />
            <p className="text-sm text-muted-foreground">
              💡 Try using your own name, a friend's name, or someone you look up to!
            </p>
          </div>

          {/* Avatar Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Choose Your Avatar</Label>
            <div className="grid grid-cols-6 md:grid-cols-9 gap-3">
              {availableAvatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-12 h-12 rounded-lg text-2xl transition-all duration-200 hover:scale-110 ${
                    selectedAvatar === avatar
                      ? 'bg-primary/30 border-2 border-primary shadow-lg shadow-primary/25'
                      : 'bg-muted/50 border border-border hover:bg-muted'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1"
            >
              Skip Customization
            </Button>
            <Button
              onClick={handleCustomize}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Start Learning Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}