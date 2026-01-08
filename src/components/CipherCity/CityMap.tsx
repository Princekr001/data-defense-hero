import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  Smartphone, 
  Database, 
  Eye,
  Lock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { districts, missions } from '@/data/cipherCity';
import type { Mission } from '@/data/cipherCity';

interface CityMapProps {
  completedMissions: number[];
  onSelectMission: (mission: Mission) => void;
  hoveredDistrict: string | null;
  setHoveredDistrict: (district: string | null) => void;
}

export default function CityMap({ 
  completedMissions, 
  onSelectMission, 
  hoveredDistrict, 
  setHoveredDistrict 
}: CityMapProps) {
  const getDistrictIcon = (district: string) => {
    switch(district) {
      case 'social': return <Users className="h-6 w-6" />;
      case 'app': return <Smartphone className="h-6 w-6" />;
      case 'memory': return <Database className="h-6 w-6" />;
      case 'guardian': return <Shield className="h-6 w-6" />;
      case 'shadow': return <Eye className="h-6 w-6" />;
      default: return <Sparkles className="h-6 w-6" />;
    }
  };

  const getDistrictMissions = (districtKey: string) => {
    return missions.filter(m => m.district === districtKey);
  };

  const getDistrictProgress = (districtKey: string) => {
    const districtMissions = getDistrictMissions(districtKey);
    const completed = districtMissions.filter(m => completedMissions.includes(m.id)).length;
    return { completed, total: districtMissions.length };
  };

  const isDistrictUnlocked = (districtKey: string) => {
    const districtMissions = getDistrictMissions(districtKey);
    return districtMissions.some(m => {
      if (m.id === 1) return true;
      return completedMissions.includes(m.id - 1);
    });
  };

  return (
    <div className="relative w-full aspect-[16/10] max-w-4xl mx-auto">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Animated connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Connection paths between districts */}
          <path 
            d="M 20% 40% Q 35% 35% 50% 25%" 
            fill="none" 
            stroke="url(#lineGradient)" 
            strokeWidth="2"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
          <path 
            d="M 50% 25% Q 65% 35% 80% 40%" 
            fill="none" 
            stroke="url(#lineGradient)" 
            strokeWidth="2"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
          <path 
            d="M 30% 75% Q 50% 60% 70% 75%" 
            fill="none" 
            stroke="url(#lineGradient)" 
            strokeWidth="2"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* District nodes */}
      {Object.entries(districts).map(([key, district], index) => {
        const positions = [
          { left: '15%', top: '35%' },  // guardian
          { left: '50%', top: '15%' },  // social
          { left: '80%', top: '35%' },  // app
          { left: '30%', top: '70%' },  // memory
          { left: '70%', top: '70%' },  // shadow
        ];
        
        const districtOrder = ['guardian', 'social', 'app', 'memory', 'shadow'];
        const posIndex = districtOrder.indexOf(key);
        const pos = positions[posIndex] || positions[0];
        
        const isUnlocked = isDistrictUnlocked(key);
        const progress = getDistrictProgress(key);
        const isHovered = hoveredDistrict === key;
        const isComplete = progress.completed === progress.total && progress.total > 0;

        return (
          <div
            key={key}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2 
              transition-all duration-500 cursor-pointer z-10
              ${isHovered ? 'scale-125 z-20' : 'scale-100'}
              ${!isUnlocked ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            style={{ left: pos.left, top: pos.top }}
            onMouseEnter={() => isUnlocked && setHoveredDistrict(key)}
            onMouseLeave={() => setHoveredDistrict(null)}
            onClick={() => {
              if (!isUnlocked) return;
              const availableMission = getDistrictMissions(key).find(m => !completedMissions.includes(m.id));
              if (availableMission) onSelectMission(availableMission);
            }}
          >
            {/* Glow effect */}
            <div className={`
              absolute inset-0 rounded-full blur-xl transition-all duration-500
              ${isComplete ? 'bg-green-500/50' : `bg-gradient-to-r ${district.color}`}
              ${isHovered ? 'opacity-80 scale-150' : 'opacity-40'}
            `} />
            
            {/* Main node */}
            <div className={`
              relative w-20 h-20 rounded-full border-3 flex items-center justify-center
              transition-all duration-300 shadow-lg
              ${isComplete 
                ? 'bg-green-500/30 border-green-400' 
                : `bg-gradient-to-br ${district.color} border-white/30`
              }
              ${isHovered ? 'shadow-2xl' : ''}
            `}>
              {!isUnlocked ? (
                <Lock className="h-8 w-8 text-white/50" />
              ) : (
                <div className="text-white">
                  {getDistrictIcon(key)}
                </div>
              )}
              
              {/* Progress ring */}
              {isUnlocked && progress.total > 0 && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke={isComplete ? '#22c55e' : 'white'}
                    strokeWidth="3"
                    strokeDasharray={`${(progress.completed / progress.total) * 283} 283`}
                    className="transition-all duration-500"
                  />
                </svg>
              )}
              
              {/* Completion badge */}
              {isComplete && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-xs">✓</span>
                </div>
              )}
            </div>
            
            {/* Label */}
            <div className={`
              absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center
              transition-all duration-300 whitespace-nowrap
              ${isHovered ? 'opacity-100' : 'opacity-70'}
            `}>
              <p className="text-sm font-bold text-white">{district.name}</p>
              <p className="text-xs text-white/60">{progress.completed}/{progress.total}</p>
            </div>
            
            {/* Danger indicator */}
            {district.dangerLevel >= 4 && isUnlocked && (
              <div className="absolute -bottom-1 -left-1">
                <AlertTriangle className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>
        );
      })}

      {/* Center hub */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-2 border-white/50">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <p className="text-center text-xs text-white/80 mt-1 font-medium">HQ</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-black/50 rounded-lg p-2 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-white/70">Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-white/70">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-3 w-3 text-white/50" />
          <span className="text-white/70">Locked</span>
        </div>
      </div>
    </div>
  );
}
