import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Volume2, VolumeX, Music, Music2 } from "lucide-react";

interface AudioSettingsProps {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onSoundVolumeChange: (value: number) => void;
  onMusicVolumeChange: (value: number) => void;
}

export default function AudioSettings({
  soundEnabled,
  musicEnabled,
  soundVolume,
  musicVolume,
  onToggleSound,
  onToggleMusic,
  onSoundVolumeChange,
  onMusicVolumeChange,
}: AudioSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isAnyAudioEnabled = soundEnabled || musicEnabled;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary/20 transition-all"
        >
          {isAnyAudioEnabled ? (
            <Volume2 className="h-5 w-5 text-primary" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
          {musicEnabled && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-card/95 backdrop-blur-xl border-primary/30" align="end">
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Audio Settings
            </h4>
            <p className="text-sm text-muted-foreground">
              Customize your audio experience
            </p>
          </div>

          {/* Sound Effects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-blue-400" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="sound-toggle" className="font-medium">
                  Sound Effects
                </Label>
              </div>
              <Switch
                id="sound-toggle"
                checked={soundEnabled}
                onCheckedChange={onToggleSound}
              />
            </div>
            {soundEnabled && (
              <div className="flex items-center gap-3 pl-7">
                <VolumeX className="h-3 w-3 text-muted-foreground" />
                <Slider
                  value={[soundVolume * 100]}
                  onValueChange={([value]) => onSoundVolumeChange(value / 100)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Volume2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground w-8">
                  {Math.round(soundVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Background Music */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {musicEnabled ? (
                  <Music className="h-4 w-4 text-green-400" />
                ) : (
                  <Music2 className="h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="music-toggle" className="font-medium">
                  Background Music
                </Label>
              </div>
              <Switch
                id="music-toggle"
                checked={musicEnabled}
                onCheckedChange={onToggleMusic}
              />
            </div>
            {musicEnabled && (
              <div className="flex items-center gap-3 pl-7">
                <Music2 className="h-3 w-3 text-muted-foreground" />
                <Slider
                  value={[musicVolume * 100]}
                  onValueChange={([value]) => onMusicVolumeChange(value / 100)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Music className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground w-8">
                  {Math.round(musicVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                if (!soundEnabled) onToggleSound();
                if (!musicEnabled) onToggleMusic();
              }}
            >
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                if (soundEnabled) onToggleSound();
                if (musicEnabled) onToggleMusic();
              }}
            >
              Mute All
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
