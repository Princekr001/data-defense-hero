import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Zap, Shield, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { gameEras, type Era, type TimelineEvent } from "@/data/eras";

interface EraMapProps {
  currentEra: string | null;
  timelineEvents: TimelineEvent[];
  onEraSelect: (era: Era) => void;
  firewallEnergy: { current: number; max: number };
}

export default function EraMap({ currentEra, timelineEvents, onEraSelect, firewallEnergy }: EraMapProps) {
  const getEraStatus = (eraId: string) => {
    const event = timelineEvents.find(e => e.eraId === eraId);
    if (!event) return 'locked';
    if (event.isRepaired) return 'completed';
    if (event.dataLeaks > 0) return 'corrupted';
    return 'available';
  };

  const isEraUnlocked = (era: Era, index: number) => {
    if (index === 0) return true;
    const previousEra = gameEras[index - 1];
    const previousEvent = timelineEvents.find(e => e.eraId === previousEra.id);
    return previousEvent?.isRepaired || false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🕐 Cyber Timeline Portal
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Travel through digital history to prevent cyber catastrophes
          </p>
          
          {/* Firewall Energy Status */}
          <Card className="inline-block p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-sm font-medium">Firewall Energy</p>
                <Progress 
                  value={(firewallEnergy.current / firewallEnergy.max) * 100} 
                  className="w-32 h-2 mt-1"
                />
                <p className="text-xs text-muted-foreground">
                  {firewallEnergy.current}/{firewallEnergy.max}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary/50 via-secondary/50 to-accent/50 rounded-full"></div>
          
          {/* Era Cards */}
          <div className="space-y-12">
            {gameEras.map((era, index) => {
              const status = getEraStatus(era.id);
              const unlocked = isEraUnlocked(era, index);
              const event = timelineEvents.find(e => e.eraId === era.id);
              
              return (
                <div 
                  key={era.id}
                  className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <Card 
                    className={`w-80 p-6 relative transition-all duration-300 hover:scale-105 ${
                      currentEra === era.id ? 'ring-2 ring-primary shadow-xl' : ''
                    } ${
                      !unlocked ? 'opacity-50 grayscale' : ''
                    } bg-gradient-to-br ${era.backgroundColor} border-${era.theme}`}
                  >
                    <CardContent className="p-0">
                      {/* Era Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{era.icon}</div>
                          <div>
                            <h3 className={`text-xl font-bold ${era.textColor}`}>
                              {era.year}
                            </h3>
                            <p className="text-sm font-medium">{era.name}</p>
                          </div>
                        </div>
                        
                        {/* Status Icon */}
                        <div className="flex items-center gap-2">
                          {status === 'completed' && <CheckCircle className="h-6 w-6 text-green-500" />}
                          {status === 'corrupted' && <AlertTriangle className="h-6 w-6 text-red-500" />}
                          {status === 'locked' && <Lock className="h-6 w-6 text-gray-400" />}
                          {status === 'available' && <Shield className="h-6 w-6 text-blue-500" />}
                        </div>
                      </div>

                      {/* Era Description */}
                      <p className="text-sm text-muted-foreground mb-4">
                        {era.description}
                      </p>

                      {/* Threats & Technologies */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-xs font-medium text-red-400 mb-1">Major Threats:</p>
                          <div className="flex flex-wrap gap-1">
                            {era.threats.slice(0, 2).map((threat, i) => (
                              <Badge key={i} variant="destructive" className="text-xs">
                                {threat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-green-400 mb-1">Key Tech:</p>
                          <div className="flex flex-wrap gap-1">
                            {era.technologies.slice(0, 2).map((tech, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Era Stats */}
                      {event && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs">
                            <span>Data Leaks:</span>
                            <span className={event.dataLeaks > 0 ? 'text-red-400' : 'text-green-400'}>
                              {event.dataLeaks}
                            </span>
                          </div>
                          {event.completionTime > 0 && (
                            <div className="flex justify-between text-xs">
                              <span>Completion Time:</span>
                              <span className="text-blue-400">{event.completionTime}s</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        onClick={() => unlocked && onEraSelect(era)}
                        disabled={!unlocked}
                        className="w-full"
                        variant={currentEra === era.id ? "default" : "outline"}
                      >
                        {!unlocked ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Locked
                          </>
                        ) : status === 'completed' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Revisit Era
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 mr-2" />
                            Enter Timeline
                          </>
                        )}
                      </Button>
                    </CardContent>

                    {/* Timeline Connector */}
                    <div className={`absolute top-1/2 ${
                      index % 2 === 0 ? '-right-4' : '-left-4'
                    } w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full border-4 border-background flex items-center justify-center transform -translate-y-1/2`}>
                      <div className="w-2 h-2 bg-background rounded-full"></div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Timeline Legend */}
        <div className="mt-12 text-center">
          <Card className="inline-block p-4 bg-muted/30">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Timeline Repaired</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Data Corruption</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-400" />
                <span>Locked</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}