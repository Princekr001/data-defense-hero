import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Save, Download, Upload, Trash2, Clock, Trophy, Star, AlertTriangle,
  ArrowLeft, Plus, FileDown, FileUp, CheckCircle2
} from 'lucide-react';
import { SaveSlot } from '@/hooks/useGameSave';
import { GameProgress } from './types';

interface SaveLoadMenuProps {
  mode: 'save' | 'load';
  saveSlots: SaveSlot[];
  currentSlotId: number | null;
  onSave: (slotId: number, slotName: string) => void;
  onLoad: (slotId: number) => void;
  onDelete: (slotId: number) => void;
  onClose: () => void;
  onExport: () => string;
  onImport: (data: string) => boolean;
  maxSlots?: number;
}

export default function SaveLoadMenu({
  mode,
  saveSlots,
  currentSlotId,
  onSave,
  onLoad,
  onDelete,
  onClose,
  onExport,
  onImport,
  maxSlots = 5
}: SaveLoadMenuProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [newSlotName, setNewSlotName] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const handleSave = (slotId: number, name?: string) => {
    onSave(slotId, name || `Save ${slotId}`);
    onClose();
  };

  const handleLoad = (slotId: number) => {
    onLoad(slotId);
    onClose();
  };

  const handleDelete = (slotId: number) => {
    onDelete(slotId);
    setShowConfirmDelete(null);
  };

  const handleExport = () => {
    const data = onExport();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cipher-city-saves-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 2000);
  };

  const handleImport = () => {
    if (onImport(importData)) {
      setShowImport(false);
      setImportData('');
      setImportError('');
    } else {
      setImportError('Invalid save file format');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportData(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextSlotId = () => {
    if (saveSlots.length === 0) return 1;
    return Math.max(...saveSlots.map(s => s.id)) + 1;
  };

  const emptySlots = Math.max(0, maxSlots - saveSlots.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 flex items-center justify-center">
      <Card className="max-w-2xl w-full bg-card/90 backdrop-blur-xl border-primary/30 animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mode === 'save' ? (
                <Save className="h-6 w-6 text-primary" />
              ) : (
                <Download className="h-6 w-6 text-primary" />
              )}
              <CardTitle className="text-2xl">
                {mode === 'save' ? 'Save Game' : 'Load Game'}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
                <FileUp className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div>
          </div>
          {showExportSuccess && (
            <Badge variant="default" className="w-fit mt-2 bg-green-600/90">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Exported successfully!
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {showImport ? (
            <div className="space-y-4 p-4 border border-dashed border-primary/30 rounded-xl">
              <h3 className="font-bold">Import Save Data</h3>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
              />
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Or paste save data JSON here..."
                className="w-full h-32 px-3 py-2 rounded-lg border border-primary/30 bg-background/50 text-sm font-mono"
              />
              {importError && (
                <p className="text-destructive text-sm">{importError}</p>
              )}
              <div className="flex gap-2">
                <Button onClick={handleImport} disabled={!importData}>
                  <Upload className="h-4 w-4 mr-1" /> Import
                </Button>
                <Button variant="outline" onClick={() => { setShowImport(false); setImportData(''); setImportError(''); }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Existing save slots */}
              <div className="space-y-3">
                {saveSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSlot === slot.id
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-primary/50'
                    } ${currentSlotId === slot.id ? 'ring-2 ring-primary/30' : ''}`}
                  >
                    {showConfirmDelete === slot.id ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="h-5 w-5" />
                          <span>Delete this save?</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(slot.id)}>
                            Delete
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowConfirmDelete(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setSelectedSlot(selectedSlot === slot.id ? null : slot.id)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg">{slot.name}</span>
                            {currentSlotId === slot.id && (
                              <Badge variant="outline" className="text-xs">Current</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {slot.playtime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3 w-3" />
                              {slot.progress.completedMissions.length} missions
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {slot.progress.achievements.filter(a => a.unlocked).length} achievements
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={slot.completionPercentage} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-10">{slot.completionPercentage}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Last saved: {formatDate(slot.timestamp)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {mode === 'save' ? (
                            <Button size="sm" onClick={() => handleSave(slot.id, slot.name)}>
                              <Save className="h-4 w-4 mr-1" /> Overwrite
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => handleLoad(slot.id)}>
                              <Download className="h-4 w-4 mr-1" /> Load
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => setShowConfirmDelete(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty slots for new saves */}
                {mode === 'save' && emptySlots > 0 && (
                  <div
                    className="p-4 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => {
                      const newId = getNextSlotId();
                      const name = newSlotName || `Save ${newId}`;
                      handleSave(newId, name);
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
                      <Plus className="h-5 w-5" />
                      <span>Create New Save ({saveSlots.length}/{maxSlots})</span>
                    </div>
                  </div>
                )}

                {saveSlots.length === 0 && mode === 'load' && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No saved games found</p>
                    <p className="text-sm mt-1">Start a new game to create a save</p>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between pt-4 border-t border-muted">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
