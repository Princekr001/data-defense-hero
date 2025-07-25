import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, Shield, Eye, Clock, Award, 
  CheckCircle, XCircle, AlertTriangle,
  ArrowRight, RotateCcw, BookOpen
} from "lucide-react";
import { Mission, MissionAction } from "@/data/missions";
import EvidenceExaminer from "./EvidenceExaminer";
import CyberNexus from "./CyberNexus";

interface MissionInterfaceProps {
  mission: Mission;
  onActionSelect: (actionId: string, isCorrect: boolean, xpEarned: number) => void;
  onMissionComplete: () => void;
  playerLevel: number;
  unlockedTools: string[];
  playerPerformance: 'excellent' | 'good' | 'struggling';
}

export default function MissionInterface({ 
  mission, 
  onActionSelect, 
  onMissionComplete,
  playerLevel,
  unlockedTools,
  playerPerformance 
}: MissionInterfaceProps) {
  const [discoveredEvidence, setDiscoveredEvidence] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [investigationProgress, setInvestigationProgress] = useState(0);

  // Update investigation progress based on discovered evidence
  useEffect(() => {
    const progress = (discoveredEvidence.length / mission.evidence.length) * 100;
    setInvestigationProgress(progress);
  }, [discoveredEvidence, mission.evidence.length]);

  const handleEvidenceExamine = (evidenceId: string) => {
    if (!discoveredEvidence.includes(evidenceId)) {
      setDiscoveredEvidence(prev => [...prev, evidenceId]);
    }
  };

  const handleActionSelect = (action: MissionAction) => {
    setSelectedAction(action.id);
    setShowFeedback(true);
    
    const isCorrect = action.id === mission.correctActionId;
    const xpEarned = isCorrect ? mission.xpReward : Math.floor(mission.xpReward * 0.4);
    
    onActionSelect(action.id, isCorrect, xpEarned);
  };

  const getActionStyle = (action: MissionAction) => {
    if (!showFeedback) {
      return 'border-2 border-slate-500/30 bg-gradient-to-br from-slate-500/10 to-slate-600/5 hover:border-slate-500/50 hover:from-slate-500/20';
    }

    if (selectedAction === action.id) {
      const isCorrect = action.id === mission.correctActionId;
      return isCorrect
        ? 'border-2 border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10'
        : 'border-2 border-red-500 bg-gradient-to-br from-red-500/20 to-red-600/10';
    }

    // Show correct action after feedback
    if (action.id === mission.correctActionId) {
      return 'border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5';
    }

    return 'border-2 border-muted bg-muted/50 opacity-50';
  };

  const canSelectAction = (action: MissionAction) => {
    if (showFeedback) return false;
    
    // Check if required evidence has been discovered
    if (action.evidenceRequired) {
      return action.evidenceRequired.every(evidenceId => 
        discoveredEvidence.includes(evidenceId)
      );
    }
    
    return true;
  };

  const getThemeIcon = () => {
    const icons = {
      space: '🚀',
      pirate: '🏴‍☠️',
      detective: '🔍',
      medieval: '🏰',
      cyberpunk: '🤖'
    };
    return icons[mission.theme] || '🔍';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Mission Header */}
      <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{getThemeIcon()}</div>
              <div>
                <h1 className="text-2xl font-bold text-primary">{mission.title}</h1>
                <p className="text-muted-foreground">{mission.concept}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-sm">Investigation</span>
              </div>
              <Progress value={investigationProgress} className="h-2 w-32" />
              <p className="text-xs text-muted-foreground mt-1">
                {discoveredEvidence.length}/{mission.evidence.length} evidence
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cyber Nexus AI */}
      <CyberNexus 
        playerPerformance={playerPerformance}
        currentMission={mission.id}
        discoveredEvidence={discoveredEvidence}
      />

      {/* Evidence Investigation */}
      <Card className="border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-amber-500/5">
        <CardHeader>
          <CardTitle className="text-yellow-300 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Digital Evidence Laboratory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EvidenceExaminer
            evidence={mission.evidence}
            discoveredEvidence={discoveredEvidence}
            onEvidenceExamine={handleEvidenceExamine}
            availableTools={unlockedTools}
          />
        </CardContent>
      </Card>

      {/* Action Selection */}
      {!showFeedback && (
        <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="text-blue-300 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Choose Your Response
            </CardTitle>
            <p className="text-muted-foreground">
              Based on your investigation, what action will you take?
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {mission.actions.map((action) => {
              const canSelect = canSelectAction(action);
              
              return (
                <Card
                  key={action.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getActionStyle(action)} ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => canSelect && handleActionSelect(action)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/20">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {action.text}
                        </h3>
                        <p className="text-muted-foreground">
                          {action.description}
                        </p>
                        
                        {action.evidenceRequired && (
                          <div className="mt-3 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-amber-400" />
                            <span className="text-xs text-amber-400">
                              Requires evidence: {action.evidenceRequired.map(id => 
                                mission.evidence.find(e => e.id === id)?.name
                              ).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {canSelect && (
                        <ArrowRight className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      {showFeedback && selectedAction && (
        <div className="space-y-6">
          {/* Action Result */}
          <Card className={`border-2 ${
            selectedAction === mission.correctActionId
              ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500'
              : 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {selectedAction === mission.correctActionId ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-300">Excellent Detective Work! 🎉</h3>
                      <p className="text-emerald-400/80">You successfully thwarted the cyber threat</p>
                    </div>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-blue-300">Learning Opportunity! 💡</h3>
                      <p className="text-blue-400/80">Let's explore what happened and learn from it</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">Your Reasoning</h4>
                  <p className="text-foreground">
                    {mission.actions.find(a => a.id === selectedAction)?.reasoning}
                  </p>
                </div>
                
                {selectedAction !== mission.correctActionId && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <h4 className="font-semibold text-emerald-300 mb-2">Optimal Solution</h4>
                    <p className="text-foreground">
                      {mission.actions.find(a => a.id === mission.correctActionId)?.reasoning}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Forensic Report */}
          <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
            <CardHeader>
              <CardTitle className="text-purple-300 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Cyber Forensic Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">What Happened</h4>
                <p className="text-foreground">{mission.forensicReport.whatHappened}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Why This Works</h4>
                <p className="text-foreground">{mission.forensicReport.whyItWorked}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Real-World Impact</h4>
                <p className="text-foreground">{mission.forensicReport.realWorldImpact}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Prevention Strategies</h4>
                <div className="space-y-2">
                  {mission.forensicReport.prevention.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission Complete */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Award className="h-8 w-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold text-primary">Mission Complete!</h3>
                <p className="text-muted-foreground">You've gained valuable cyber security knowledge</p>
              </div>
            </div>
            
            <Button 
              onClick={onMissionComplete}
              size="lg"
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-6 text-lg font-bold"
            >
              Continue to Next Mission
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}