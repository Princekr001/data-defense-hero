import { useState, useCallback, useEffect } from 'react';
import { GameProgress, Resource, Achievement, CharacterCustomization } from '@/components/CipherCity/types';

const SAVE_KEY = 'cipher_city_save';
const AUTO_SAVE_INTERVAL = 30000; // Auto-save every 30 seconds

export interface SaveSlot {
  id: number;
  name: string;
  progress: GameProgress;
  timestamp: string;
  playtime: string;
  completionPercentage: number;
}

interface SaveData {
  slots: SaveSlot[];
  lastPlayedSlot: number | null;
}

export function useGameSave() {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [lastPlayedSlot, setLastPlayedSlot] = useState<number | null>(null);
  const [currentSlotId, setCurrentSlotId] = useState<number | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  // Load save data from localStorage
  const loadSaveData = useCallback((): SaveData => {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          slots: parsed.slots || [],
          lastPlayedSlot: parsed.lastPlayedSlot ?? null
        };
      }
    } catch (error) {
      console.error('Failed to load save data:', error);
    }
    return { slots: [], lastPlayedSlot: null };
  }, []);

  // Save data to localStorage
  const persistSaveData = useCallback((data: SaveData) => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }, []);

  // Initialize save slots on mount
  useEffect(() => {
    const data = loadSaveData();
    setSaveSlots(data.slots);
    setLastPlayedSlot(data.lastPlayedSlot);
  }, [loadSaveData]);

  // Calculate playtime string
  const formatPlaytime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate completion percentage
  const calculateCompletion = (progress: GameProgress, totalMissions: number): number => {
    const missionProgress = (progress.completedMissions.length / totalMissions) * 50;
    const achievementProgress = (progress.achievements.filter(a => a.unlocked).length / progress.achievements.length) * 30;
    const abilityProgress = (progress.unlockedAbilities.length / 10) * 20; // Assuming max 10 abilities
    return Math.round(Math.min(100, missionProgress + achievementProgress + abilityProgress));
  };

  // Create a new save slot
  const createSave = useCallback((
    slotId: number,
    slotName: string,
    progress: GameProgress,
    totalMissions: number
  ): SaveSlot => {
    const slot: SaveSlot = {
      id: slotId,
      name: slotName,
      progress: { ...progress, lastPlayed: new Date() },
      timestamp: new Date().toISOString(),
      playtime: formatPlaytime(progress.totalPlayTime),
      completionPercentage: calculateCompletion(progress, totalMissions)
    };

    const data = loadSaveData();
    const existingIndex = data.slots.findIndex(s => s.id === slotId);
    
    if (existingIndex >= 0) {
      data.slots[existingIndex] = slot;
    } else {
      data.slots.push(slot);
    }
    
    data.lastPlayedSlot = slotId;
    persistSaveData(data);
    setSaveSlots(data.slots);
    setLastPlayedSlot(slotId);
    setCurrentSlotId(slotId);
    setLastSaveTime(new Date());
    
    return slot;
  }, [loadSaveData, persistSaveData]);

  // Quick save to current slot
  const quickSave = useCallback((
    progress: GameProgress,
    totalMissions: number
  ): boolean => {
    if (currentSlotId === null) {
      // Create a new slot if none exists
      const data = loadSaveData();
      const newSlotId = data.slots.length > 0 
        ? Math.max(...data.slots.map(s => s.id)) + 1 
        : 1;
      createSave(newSlotId, `Save ${newSlotId}`, progress, totalMissions);
      return true;
    }
    
    const data = loadSaveData();
    const slot = data.slots.find(s => s.id === currentSlotId);
    if (slot) {
      createSave(currentSlotId, slot.name, progress, totalMissions);
      return true;
    }
    return false;
  }, [currentSlotId, loadSaveData, createSave]);

  // Load a save slot
  const loadSave = useCallback((slotId: number): GameProgress | null => {
    const data = loadSaveData();
    const slot = data.slots.find(s => s.id === slotId);
    
    if (slot) {
      data.lastPlayedSlot = slotId;
      persistSaveData(data);
      setLastPlayedSlot(slotId);
      setCurrentSlotId(slotId);
      return slot.progress;
    }
    return null;
  }, [loadSaveData, persistSaveData]);

  // Delete a save slot
  const deleteSave = useCallback((slotId: number): boolean => {
    const data = loadSaveData();
    const index = data.slots.findIndex(s => s.id === slotId);
    
    if (index >= 0) {
      data.slots.splice(index, 1);
      if (data.lastPlayedSlot === slotId) {
        data.lastPlayedSlot = data.slots.length > 0 ? data.slots[0].id : null;
      }
      persistSaveData(data);
      setSaveSlots(data.slots);
      setLastPlayedSlot(data.lastPlayedSlot);
      if (currentSlotId === slotId) {
        setCurrentSlotId(null);
      }
      return true;
    }
    return false;
  }, [loadSaveData, persistSaveData, currentSlotId]);

  // Check if there are any saves
  const hasSaves = useCallback((): boolean => {
    return saveSlots.length > 0;
  }, [saveSlots]);

  // Get the last played save
  const getLastPlayedSave = useCallback((): SaveSlot | null => {
    if (lastPlayedSlot === null) return null;
    return saveSlots.find(s => s.id === lastPlayedSlot) || null;
  }, [saveSlots, lastPlayedSlot]);

  // Get all save slots
  const getAllSaves = useCallback((): SaveSlot[] => {
    return [...saveSlots].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [saveSlots]);

  // Export save data as JSON string
  const exportSaves = useCallback((): string => {
    const data = loadSaveData();
    return JSON.stringify(data, null, 2);
  }, [loadSaveData]);

  // Import save data from JSON string
  const importSaves = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as SaveData;
      if (data.slots && Array.isArray(data.slots)) {
        persistSaveData(data);
        setSaveSlots(data.slots);
        setLastPlayedSlot(data.lastPlayedSlot);
        return true;
      }
    } catch (error) {
      console.error('Failed to import saves:', error);
    }
    return false;
  }, [persistSaveData]);

  return {
    saveSlots,
    currentSlotId,
    lastSaveTime,
    createSave,
    quickSave,
    loadSave,
    deleteSave,
    hasSaves,
    getLastPlayedSave,
    getAllSaves,
    exportSaves,
    importSaves,
    setCurrentSlotId,
    AUTO_SAVE_INTERVAL
  };
}
