import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, FileText, Activity, Image, Shield, 
  Eye, EyeOff, Lightbulb, AlertTriangle,
  Search, Wrench 
} from "lucide-react";
import { Evidence } from "@/data/missions";

interface EvidenceExaminerProps {
  evidence: Evidence[];
  discoveredEvidence: string[];
  onEvidenceExamine: (evidenceId: string) => void;
  availableTools: string[];
}

export default function EvidenceExaminer({ 
  evidence, 
  discoveredEvidence, 
  onEvidenceExamine,
  availableTools 
}: EvidenceExaminerProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [showClues, setShowClues] = useState<Record<string, boolean>>({});

  const getEvidenceIcon = (type: string) => {
    const icons = {
      email: Mail,
      file: FileText,
      log: Activity,
      metadata: Search,
      screenshot: Image,
      certificate: Shield
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getEvidenceStyle = (evidence: Evidence, isDiscovered: boolean) => {
    if (!isDiscovered) {
      return 'bg-muted/30 border-muted text-muted-foreground opacity-60';
    }
    
    if (evidence.suspicious) {
      return 'bg-gradient-to-br from-red-500/10 to-orange-500/5 border-red-500/30 text-red-300 hover:border-red-500/50';
    }
    
    return 'bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/30 text-blue-300 hover:border-blue-500/50';
  };

  const handleEvidenceClick = (evidenceItem: Evidence) => {
    const isDiscovered = discoveredEvidence.includes(evidenceItem.id);
    
    if (!isDiscovered) {
      onEvidenceExamine(evidenceItem.id);
    }
    
    setSelectedEvidence(evidenceItem);
  };

  const toggleClues = (evidenceId: string) => {
    setShowClues(prev => ({
      ...prev,
      [evidenceId]: !prev[evidenceId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidence.map((evidenceItem) => {
          const isDiscovered = discoveredEvidence.includes(evidenceItem.id);
          const EvidenceIcon = getEvidenceIcon(evidenceItem.type);
          
          return (
            <Card
              key={evidenceItem.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${getEvidenceStyle(evidenceItem, isDiscovered)}`}
              onClick={() => handleEvidenceClick(evidenceItem)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-background/20">
                    <EvidenceIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">
                      {isDiscovered ? evidenceItem.name : 'Hidden Evidence'}
                    </h3>
                    <p className="text-xs opacity-70 capitalize">
                      {evidenceItem.type}
                    </p>
                  </div>
                  {evidenceItem.suspicious && isDiscovered && (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                </div>
                
                {!isDiscovered && (
                  <div className="flex items-center gap-2 text-xs">
                    <EyeOff className="h-3 w-3" />
                    <span>Click to examine</span>
                  </div>
                )}
                
                {isDiscovered && (
                  <div className="space-y-2">
                    <p className="text-xs opacity-80 line-clamp-3">
                      {evidenceItem.content.substring(0, 100)}...
                    </p>
                    {evidenceItem.clues && evidenceItem.clues.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {evidenceItem.clues.length} clues available
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Evidence Detail Modal */}
      {selectedEvidence && discoveredEvidence.includes(selectedEvidence.id) && (
        <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                {(() => {
                  const Icon = getEvidenceIcon(selectedEvidence.type);
                  return <Icon className="h-6 w-6" />;
                })()}
                {selectedEvidence.name}
                {selectedEvidence.suspicious && (
                  <Badge variant="destructive" className="ml-2">
                    SUSPICIOUS
                  </Badge>
                )}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedEvidence(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Evidence Content */}
            <div className="p-4 bg-background/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-2 text-primary">Evidence Content</h4>
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono bg-background/30 p-3 rounded border">
                {selectedEvidence.content}
              </pre>
            </div>

            {/* Clues Section */}
            {selectedEvidence.clues && selectedEvidence.clues.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Investigation Clues
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleClues(selectedEvidence.id)}
                    className="text-xs"
                  >
                    {showClues[selectedEvidence.id] ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                    {showClues[selectedEvidence.id] ? 'Hide' : 'Reveal'} Clues
                  </Button>
                </div>
                
                {showClues[selectedEvidence.id] && (
                  <div className="space-y-2">
                    {selectedEvidence.clues.map((clue, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-foreground">{clue}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tool Usage Hints */}
            {availableTools.length > 0 && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Available Cyber Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {availableTools.slice(0, 3).map((tool, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tool.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-blue-300/80 mt-2">
                  Use your tools to analyze evidence more effectively
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}