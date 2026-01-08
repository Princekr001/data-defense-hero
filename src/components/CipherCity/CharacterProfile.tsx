import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  User, 
  Sparkles, 
  Lock,
  Check,
  Gem
} from 'lucide-react';
import { avatarOptions, frameOptions, titleOptions } from './achievements';
import { CharacterCustomization, Resource } from './types';

interface CharacterProfileProps {
  playerName: string;
  customization: CharacterCustomization;
  resources: Resource;
  onUpdateCustomization: (customization: CharacterCustomization) => void;
  onClose: () => void;
}

export default function CharacterProfile({ 
  playerName, 
  customization, 
  resources,
  onUpdateCustomization, 
  onClose 
}: CharacterProfileProps) {
  const [selectedTab, setSelectedTab] = useState<'avatar' | 'frame' | 'title'>('avatar');
  const [previewCustomization, setPreviewCustomization] = useState(customization);

  const canAfford = (cost: number) => resources.trustCrystals >= cost;

  const handleSelect = (type: 'avatar' | 'frame' | 'title', id: string) => {
    const newCustomization = { ...previewCustomization, [type]: id };
    setPreviewCustomization(newCustomization);
  };

  const handleSave = () => {
    onUpdateCustomization(previewCustomization);
    onClose();
  };

  const getAvatarEmoji = () => {
    const avatar = avatarOptions.find(a => a.id === previewCustomization.avatar);
    return avatar?.emoji || '🕵️';
  };

  const getFrameClass = () => {
    const frame = frameOptions.find(f => f.id === previewCustomization.frame);
    return frame?.color || 'transparent';
  };

  const getTitle = () => {
    const title = titleOptions.find(t => t.id === previewCustomization.title);
    return title?.name || 'Newcomer';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Card className="bg-card/90 backdrop-blur-xl border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-primary" />
                  Customize Profile
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-purple-400" />
                <span className="font-bold">{resources.trustCrystals}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div className="flex justify-center">
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <div className={`
                    w-28 h-28 rounded-full flex items-center justify-center text-6xl
                    bg-gradient-to-br ${getFrameClass()} p-1
                  `}>
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      {getAvatarEmoji()}
                    </div>
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{playerName}</h2>
                  <Badge variant="outline" className="mt-1">{getTitle()}</Badge>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 justify-center">
              {(['avatar', 'frame', 'title'] as const).map(tab => (
                <Button
                  key={tab}
                  variant={selectedTab === tab ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTab(tab)}
                  className="capitalize"
                >
                  {tab}s
                </Button>
              ))}
            </div>

            {/* Options */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {selectedTab === 'avatar' && avatarOptions.map(option => {
                const isSelected = previewCustomization.avatar === option.id;
                const isUnlocked = option.unlockCost === 0 || canAfford(option.unlockCost);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => isUnlocked && handleSelect('avatar', option.id)}
                    className={`
                      relative aspect-square rounded-xl border-2 text-4xl flex items-center justify-center
                      transition-all duration-200
                      ${isSelected 
                        ? 'border-primary bg-primary/20 scale-105' 
                        : isUnlocked 
                          ? 'border-muted hover:border-primary/50 bg-muted/30' 
                          : 'border-muted/30 bg-muted/10 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    {option.emoji}
                    {isSelected && (
                      <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                    )}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                        <div className="text-center text-xs">
                          <Lock className="h-4 w-4 mx-auto mb-1" />
                          <span>{option.unlockCost}</span>
                          <Gem className="h-3 w-3 inline ml-0.5" />
                        </div>
                      </div>
                    )}
                    <span className="absolute bottom-1 left-0 right-0 text-[10px] text-muted-foreground">
                      {option.name}
                    </span>
                  </button>
                );
              })}
              
              {selectedTab === 'frame' && frameOptions.map(option => {
                const isSelected = previewCustomization.frame === option.id;
                const isUnlocked = option.unlockCost === 0 || canAfford(option.unlockCost);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => isUnlocked && handleSelect('frame', option.id)}
                    className={`
                      relative aspect-square rounded-xl border-2 flex items-center justify-center
                      transition-all duration-200
                      ${isSelected ? 'border-primary scale-105' : 'border-muted hover:border-primary/50'}
                      ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className={`
                      w-12 h-12 rounded-full bg-gradient-to-br ${option.color} p-0.5
                    `}>
                      <div className="w-full h-full rounded-full bg-card" />
                    </div>
                    {isSelected && (
                      <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                    )}
                    {!isUnlocked && option.unlockCost > 0 && (
                      <div className="absolute bottom-1 text-[10px] flex items-center gap-0.5">
                        {option.unlockCost}<Gem className="h-3 w-3" />
                      </div>
                    )}
                    <span className="absolute bottom-1 left-0 right-0 text-[10px] text-muted-foreground">
                      {option.name}
                    </span>
                  </button>
                );
              })}
              
              {selectedTab === 'title' && titleOptions.map(option => {
                const isSelected = previewCustomization.title === option.id;
                const isUnlocked = option.unlockCost === 0 || canAfford(option.unlockCost);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => isUnlocked && handleSelect('title', option.id)}
                    className={`
                      relative col-span-2 p-3 rounded-xl border-2 text-center
                      transition-all duration-200
                      ${isSelected 
                        ? 'border-primary bg-primary/20' 
                        : isUnlocked 
                          ? 'border-muted hover:border-primary/50 bg-muted/30' 
                          : 'border-muted/30 bg-muted/10 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">{option.name}</span>
                    {isSelected && (
                      <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                    )}
                    {!isUnlocked && (
                      <div className="flex items-center justify-center gap-1 text-xs mt-1">
                        <Lock className="h-3 w-3" />
                        {option.unlockCost}<Gem className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <Button onClick={handleSave} className="w-full" size="lg">
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
