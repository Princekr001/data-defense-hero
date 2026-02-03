import { useState, useCallback, useEffect } from 'react';
import { GameProgress } from '@/components/CipherCity/types';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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

interface CloudSaveSlot {
  id: string;
  user_id: string;
  slot_id: number;
  slot_name: string;
  progress: GameProgress;
  timestamp: string;
  playtime: string;
  completion_percentage: number;
}

export function useGameSave() {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [lastPlayedSlot, setLastPlayedSlot] = useState<number | null>(null);
  const [currentSlotId, setCurrentSlotId] = useState<number | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Track auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load save data from localStorage
  const loadLocalSaveData = useCallback((): SaveData => {
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
      console.error('Failed to load local save data:', error);
    }
    return { slots: [], lastPlayedSlot: null };
  }, []);

  // Save data to localStorage
  const persistLocalSaveData = useCallback((data: SaveData) => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data locally:', error);
    }
  }, []);

  // Load saves from cloud
  const loadCloudSaves = useCallback(async (): Promise<SaveSlot[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', user.id)
        .order('slot_id', { ascending: true });

      if (error) {
        console.error('Failed to load cloud saves:', error);
        return [];
      }

      if (!data) return [];

      return data.map(save => ({
        id: save.slot_id,
        name: save.slot_name,
        progress: save.progress as unknown as GameProgress,
        timestamp: save.timestamp,
        playtime: save.playtime,
        completionPercentage: save.completion_percentage,
      }));
    } catch (error) {
      console.error('Failed to load cloud saves:', error);
      return [];
    }
  }, [user]);

  // Save to cloud
  const saveToCloud = useCallback(async (slot: SaveSlot): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsSyncing(true);
      
      // Check if save exists
      const { data: existing } = await supabase
        .from('game_saves')
        .select('id')
        .eq('user_id', user.id)
        .eq('slot_id', slot.id)
        .maybeSingle();

      const progressJson = JSON.parse(JSON.stringify(slot.progress));

      let error;
      if (existing) {
        const result = await supabase
          .from('game_saves')
          .update({
            slot_name: slot.name,
            progress: progressJson,
            timestamp: slot.timestamp,
            playtime: slot.playtime,
            completion_percentage: slot.completionPercentage,
          })
          .eq('user_id', user.id)
          .eq('slot_id', slot.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('game_saves')
          .insert({
            user_id: user.id,
            slot_id: slot.id,
            slot_name: slot.name,
            progress: progressJson,
            timestamp: slot.timestamp,
            playtime: slot.playtime,
            completion_percentage: slot.completionPercentage,
          });
        error = result.error;
      }

      if (error) {
        console.error('Failed to save to cloud:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  // Delete from cloud
  const deleteFromCloud = useCallback(async (slotId: number): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('game_saves')
        .delete()
        .eq('user_id', user.id)
        .eq('slot_id', slotId);

      if (error) {
        console.error('Failed to delete from cloud:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to delete from cloud:', error);
      return false;
    }
  }, [user]);

  // Sync local saves with cloud (merge strategy: cloud wins if newer)
  const syncWithCloud = useCallback(async () => {
    if (!user) return;
    
    setIsSyncing(true);
    try {
      const cloudSaves = await loadCloudSaves();
      const localData = loadLocalSaveData();

      // Merge strategy: use whichever is newer
      const mergedSlots: SaveSlot[] = [];
      const allSlotIds = new Set([
        ...cloudSaves.map(s => s.id),
        ...localData.slots.map(s => s.id)
      ]);

      for (const slotId of allSlotIds) {
        const cloudSlot = cloudSaves.find(s => s.id === slotId);
        const localSlot = localData.slots.find(s => s.id === slotId);

        if (cloudSlot && localSlot) {
          // Both exist, use newer
          const cloudTime = new Date(cloudSlot.timestamp).getTime();
          const localTime = new Date(localSlot.timestamp).getTime();
          mergedSlots.push(cloudTime >= localTime ? cloudSlot : localSlot);
        } else {
          // Only one exists
          mergedSlots.push(cloudSlot || localSlot!);
        }
      }

      // Update local storage with merged data
      const mergedData: SaveData = {
        slots: mergedSlots,
        lastPlayedSlot: localData.lastPlayedSlot,
      };
      persistLocalSaveData(mergedData);
      setSaveSlots(mergedSlots);

      // Push any local-only or newer saves to cloud
      for (const slot of mergedSlots) {
        const cloudSlot = cloudSaves.find(s => s.id === slot.id);
        if (!cloudSlot || new Date(slot.timestamp) > new Date(cloudSlot.timestamp)) {
          await saveToCloud(slot);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  }, [user, loadCloudSaves, loadLocalSaveData, persistLocalSaveData, saveToCloud]);

  // Initialize save slots on mount and sync with cloud when authenticated
  useEffect(() => {
    const data = loadLocalSaveData();
    setSaveSlots(data.slots);
    setLastPlayedSlot(data.lastPlayedSlot);
  }, [loadLocalSaveData]);

  useEffect(() => {
    if (user) {
      syncWithCloud();
    }
  }, [user, syncWithCloud]);

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
    const abilityProgress = (progress.unlockedAbilities.length / 10) * 20;
    return Math.round(Math.min(100, missionProgress + achievementProgress + abilityProgress));
  };

  // Create a new save slot
  const createSave = useCallback(async (
    slotId: number,
    slotName: string,
    progress: GameProgress,
    totalMissions: number
  ): Promise<SaveSlot> => {
    const slot: SaveSlot = {
      id: slotId,
      name: slotName,
      progress: { ...progress, lastPlayed: new Date() },
      timestamp: new Date().toISOString(),
      playtime: formatPlaytime(progress.totalPlayTime),
      completionPercentage: calculateCompletion(progress, totalMissions)
    };

    const data = loadLocalSaveData();
    const existingIndex = data.slots.findIndex(s => s.id === slotId);
    
    if (existingIndex >= 0) {
      data.slots[existingIndex] = slot;
    } else {
      data.slots.push(slot);
    }
    
    data.lastPlayedSlot = slotId;
    persistLocalSaveData(data);
    setSaveSlots(data.slots);
    setLastPlayedSlot(slotId);
    setCurrentSlotId(slotId);
    setLastSaveTime(new Date());

    // Sync to cloud if authenticated
    if (user) {
      await saveToCloud(slot);
    }
    
    return slot;
  }, [loadLocalSaveData, persistLocalSaveData, user, saveToCloud]);

  // Quick save to current slot
  const quickSave = useCallback(async (
    progress: GameProgress,
    totalMissions: number
  ): Promise<boolean> => {
    if (currentSlotId === null) {
      const data = loadLocalSaveData();
      const newSlotId = data.slots.length > 0 
        ? Math.max(...data.slots.map(s => s.id)) + 1 
        : 1;
      await createSave(newSlotId, `Save ${newSlotId}`, progress, totalMissions);
      return true;
    }
    
    const data = loadLocalSaveData();
    const slot = data.slots.find(s => s.id === currentSlotId);
    if (slot) {
      await createSave(currentSlotId, slot.name, progress, totalMissions);
      return true;
    }
    return false;
  }, [currentSlotId, loadLocalSaveData, createSave]);

  // Load a save slot
  const loadSave = useCallback((slotId: number): GameProgress | null => {
    const data = loadLocalSaveData();
    const slot = data.slots.find(s => s.id === slotId);
    
    if (slot) {
      data.lastPlayedSlot = slotId;
      persistLocalSaveData(data);
      setLastPlayedSlot(slotId);
      setCurrentSlotId(slotId);
      return slot.progress;
    }
    return null;
  }, [loadLocalSaveData, persistLocalSaveData]);

  // Delete a save slot
  const deleteSave = useCallback(async (slotId: number): Promise<boolean> => {
    const data = loadLocalSaveData();
    const index = data.slots.findIndex(s => s.id === slotId);
    
    if (index >= 0) {
      data.slots.splice(index, 1);
      if (data.lastPlayedSlot === slotId) {
        data.lastPlayedSlot = data.slots.length > 0 ? data.slots[0].id : null;
      }
      persistLocalSaveData(data);
      setSaveSlots(data.slots);
      setLastPlayedSlot(data.lastPlayedSlot);
      if (currentSlotId === slotId) {
        setCurrentSlotId(null);
      }

      // Delete from cloud if authenticated
      if (user) {
        await deleteFromCloud(slotId);
      }
      
      return true;
    }
    return false;
  }, [loadLocalSaveData, persistLocalSaveData, currentSlotId, user, deleteFromCloud]);

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
    const data = loadLocalSaveData();
    return JSON.stringify(data, null, 2);
  }, [loadLocalSaveData]);

  // Import save data from JSON string
  const importSaves = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as SaveData;
      if (data.slots && Array.isArray(data.slots)) {
        persistLocalSaveData(data);
        setSaveSlots(data.slots);
        setLastPlayedSlot(data.lastPlayedSlot);
        
        // Sync imported saves to cloud
        if (user) {
          data.slots.forEach(slot => saveToCloud(slot));
        }
        
        return true;
      }
    } catch (error) {
      console.error('Failed to import saves:', error);
    }
    return false;
  }, [persistLocalSaveData, user, saveToCloud]);

  return {
    saveSlots,
    currentSlotId,
    lastSaveTime,
    isSyncing,
    isAuthenticated: !!user,
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
    syncWithCloud,
    AUTO_SAVE_INTERVAL
  };
}
