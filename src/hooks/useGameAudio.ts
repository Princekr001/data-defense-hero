import { useState, useEffect, useCallback, useRef } from 'react';

export type SoundEffect = 
  | 'click'
  | 'success'
  | 'error'
  | 'achievement'
  | 'missionStart'
  | 'missionComplete'
  | 'dialogueAdvance'
  | 'choiceSelect'
  | 'resourceGain'
  | 'resourceLoss'
  | 'miniGameStart'
  | 'miniGameWin'
  | 'miniGameLose'
  | 'hover'
  | 'transition';

// Web Audio API-based sound generation
const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return null;
};

const generateSound = (
  ctx: AudioContext,
  type: OscillatorType,
  frequency: number,
  duration: number,
  volume: number = 0.3,
  attack: number = 0.01,
  decay: number = 0.1
) => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

const playClick = (ctx: AudioContext) => {
  generateSound(ctx, 'sine', 800, 0.05, 0.15);
};

const playSuccess = (ctx: AudioContext) => {
  generateSound(ctx, 'sine', 523.25, 0.1, 0.2); // C5
  setTimeout(() => generateSound(ctx, 'sine', 659.25, 0.1, 0.2), 100); // E5
  setTimeout(() => generateSound(ctx, 'sine', 783.99, 0.15, 0.25), 200); // G5
};

const playError = (ctx: AudioContext) => {
  generateSound(ctx, 'sawtooth', 200, 0.3, 0.15);
};

const playAchievement = (ctx: AudioContext) => {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => generateSound(ctx, 'sine', freq, 0.2, 0.2), i * 100);
  });
};

const playMissionStart = (ctx: AudioContext) => {
  generateSound(ctx, 'sine', 261.63, 0.15, 0.2); // C4
  setTimeout(() => generateSound(ctx, 'sine', 329.63, 0.15, 0.2), 150); // E4
  setTimeout(() => generateSound(ctx, 'sine', 392, 0.2, 0.25), 300); // G4
};

const playMissionComplete = (ctx: AudioContext) => {
  const notes = [392, 440, 523.25, 659.25, 783.99]; // G4, A4, C5, E5, G5
  notes.forEach((freq, i) => {
    setTimeout(() => generateSound(ctx, 'sine', freq, 0.15, 0.2), i * 80);
  });
};

const playDialogueAdvance = (ctx: AudioContext) => {
  generateSound(ctx, 'sine', 600, 0.03, 0.1);
};

const playChoiceSelect = (ctx: AudioContext) => {
  generateSound(ctx, 'sine', 440, 0.08, 0.15);
  setTimeout(() => generateSound(ctx, 'sine', 550, 0.08, 0.15), 50);
};

const playResourceGain = (ctx: AudioContext) => {
  generateSound(ctx, 'sine', 880, 0.1, 0.15);
  setTimeout(() => generateSound(ctx, 'sine', 1100, 0.1, 0.15), 80);
};

const playResourceLoss = (ctx: AudioContext) => {
  generateSound(ctx, 'sine', 300, 0.15, 0.15);
  setTimeout(() => generateSound(ctx, 'sine', 200, 0.2, 0.15), 100);
};

const playMiniGameStart = (ctx: AudioContext) => {
  generateSound(ctx, 'square', 440, 0.1, 0.1);
  setTimeout(() => generateSound(ctx, 'square', 550, 0.1, 0.1), 100);
  setTimeout(() => generateSound(ctx, 'square', 660, 0.15, 0.1), 200);
};

const playMiniGameWin = (ctx: AudioContext) => {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((freq, i) => {
    setTimeout(() => generateSound(ctx, 'sine', freq, 0.12, 0.18), i * 60);
  });
};

const playMiniGameLose = (ctx: AudioContext) => {
  generateSound(ctx, 'sawtooth', 250, 0.3, 0.12);
  setTimeout(() => generateSound(ctx, 'sawtooth', 180, 0.4, 0.12), 200);
};

const playHover = (ctx: AudioContext) => {
  generateSound(ctx, 'sine', 1200, 0.02, 0.05);
};

const playTransition = (ctx: AudioContext) => {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => generateSound(ctx, 'sine', 300 + i * 100, 0.05, 0.08), i * 30);
  }
};

// Background music generator using Web Audio
class BackgroundMusicGenerator {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private volume: number = 0.15;
  private gainNode: GainNode | null = null;

  constructor() {
    this.ctx = createAudioContext();
    if (this.ctx) {
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.value = this.volume;
    }
  }

  private playChord(frequencies: number[], duration: number) {
    if (!this.ctx || !this.gainNode) return;
    
    frequencies.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.connect(gain);
      gain.connect(this.gainNode!);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, this.ctx!.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, this.ctx!.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + duration);
      
      osc.start(this.ctx!.currentTime);
      osc.stop(this.ctx!.currentTime + duration);
    });
  }

  start() {
    if (this.isPlaying || !this.ctx) return;
    
    // Resume context if suspended (required for Chrome)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.isPlaying = true;
    
    // Ambient cyberpunk chords progression
    const chords = [
      [130.81, 196, 261.63], // C minor
      [146.83, 220, 293.66], // D minor
      [164.81, 246.94, 329.63], // E minor
      [130.81, 196, 261.63], // C minor
      [174.61, 261.63, 349.23], // F major
      [196, 293.66, 392], // G major
    ];
    
    let chordIndex = 0;
    
    const playNext = () => {
      if (!this.isPlaying) return;
      this.playChord(chords[chordIndex], 4);
      chordIndex = (chordIndex + 1) % chords.length;
    };
    
    playNext();
    this.intervalId = setInterval(playNext, 4000);
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setVolume(vol: number) {
    this.volume = vol;
    if (this.gainNode) {
      this.gainNode.gain.value = vol;
    }
  }
  
  getContext() {
    return this.ctx;
  }
}

export function useGameAudio() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [musicVolume, setMusicVolume] = useState(0.3);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicGeneratorRef = useRef<BackgroundMusicGenerator | null>(null);

  useEffect(() => {
    audioContextRef.current = createAudioContext();
    musicGeneratorRef.current = new BackgroundMusicGenerator();
    
    return () => {
      musicGeneratorRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (musicEnabled) {
      musicGeneratorRef.current?.start();
    } else {
      musicGeneratorRef.current?.stop();
    }
  }, [musicEnabled]);

  useEffect(() => {
    musicGeneratorRef.current?.setVolume(musicVolume * 0.5);
  }, [musicVolume]);

  const playSfx = useCallback((effect: SoundEffect) => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    switch (effect) {
      case 'click':
        playClick(ctx);
        break;
      case 'success':
        playSuccess(ctx);
        break;
      case 'error':
        playError(ctx);
        break;
      case 'achievement':
        playAchievement(ctx);
        break;
      case 'missionStart':
        playMissionStart(ctx);
        break;
      case 'missionComplete':
        playMissionComplete(ctx);
        break;
      case 'dialogueAdvance':
        playDialogueAdvance(ctx);
        break;
      case 'choiceSelect':
        playChoiceSelect(ctx);
        break;
      case 'resourceGain':
        playResourceGain(ctx);
        break;
      case 'resourceLoss':
        playResourceLoss(ctx);
        break;
      case 'miniGameStart':
        playMiniGameStart(ctx);
        break;
      case 'miniGameWin':
        playMiniGameWin(ctx);
        break;
      case 'miniGameLose':
        playMiniGameLose(ctx);
        break;
      case 'hover':
        playHover(ctx);
        break;
      case 'transition':
        playTransition(ctx);
        break;
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => !prev);
  }, []);

  return {
    soundEnabled,
    musicEnabled,
    soundVolume,
    musicVolume,
    setSoundEnabled,
    setMusicEnabled,
    setSoundVolume,
    setMusicVolume,
    toggleSound,
    toggleMusic,
    playSfx,
  };
}
