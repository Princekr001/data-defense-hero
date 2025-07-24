import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Zap, Heart, Brain, Target } from 'lucide-react';

export interface Character {
  id: string;
  name: string;
  avatar: string;
  title: string;
  description: string;
  specialty: string;
  color: string;
  icon: React.ComponentType<any>;
}

interface CharacterSelectProps {
  onCharacterSelect: (character: Character) => void;
}

const characters: Character[] = [
  {
    id: 'alex',
    name: 'Alex',
    avatar: '🧑‍💻',
    title: 'The Analyst',
    description: 'A cybersecurity analyst who thinks before acting. Prefers methodical approaches.',
    specialty: 'Analysis & Detection',
    color: 'text-blue-500',
    icon: Brain
  },
  {
    id: 'sam',
    name: 'Sam',
    avatar: '👨‍🔬',
    title: 'The Researcher',
    description: 'A security researcher who dives deep into threats. Knowledge is power.',
    specialty: 'Threat Research',
    color: 'text-purple-500',
    icon: Target
  },
  {
    id: 'jordan',
    name: 'Jordan',
    avatar: '👩‍💼',
    title: 'The Guardian',
    description: 'A security officer who protects at all costs. Defense is the best offense.',
    specialty: 'Defense & Protection',
    color: 'text-green-500',
    icon: Shield
  },
  {
    id: 'riley',
    name: 'Riley',
    avatar: '🧑‍🎓',
    title: 'The Student',
    description: 'An eager learner in cybersecurity. Every mistake is a lesson.',
    specialty: 'Learning & Growth',
    color: 'text-yellow-500',
    icon: Heart
  },
  {
    id: 'morgan',
    name: 'Morgan',
    avatar: '👨‍⚡',
    title: 'The Responder',
    description: 'An incident responder who acts fast under pressure. Time is critical.',
    specialty: 'Rapid Response',
    color: 'text-red-500',
    icon: Zap
  }
];

export default function CharacterSelect({ onCharacterSelect }: CharacterSelectProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      onCharacterSelect(selectedCharacter);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-cyber bg-clip-text text-transparent mb-4">
            Choose Your Cyber Defender
          </h1>
          <p className="text-xl text-muted-foreground">
            Each character brings unique perspectives to cybersecurity scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {characters.map((character) => {
            const IconComponent = character.icon;
            const isSelected = selectedCharacter?.id === character.id;
            
            return (
              <Card 
                key={character.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-cyber ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-cyber bg-primary/5' 
                    : 'hover:bg-card/80'
                }`}
                onClick={() => handleSelect(character)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">
                    <div className="text-6xl mb-2">{character.avatar}</div>
                    <div className={`inline-flex p-2 rounded-lg bg-background/50 ${character.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">{character.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {character.title}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Badge 
                    variant="outline" 
                    className={`w-full justify-center ${character.color} border-current`}
                  >
                    {character.specialty}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {character.description}
                  </p>
                  
                  {isSelected && (
                    <div className="text-center pt-2">
                      <div className="inline-flex items-center gap-2 text-primary">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedCharacter && (
          <div className="text-center">
            <Button 
              variant="cyber" 
              size="xl" 
              onClick={handleConfirm}
              className="text-xl px-12 py-6"
            >
              Start Mission with {selectedCharacter.name}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}