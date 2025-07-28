import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { gameScenarios } from "@/data/scenarios";
import type { Era } from "@/data/eras";

interface Character {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  facing: 'left' | 'right';
}

interface ScenarioElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scenario: any;
  collected: boolean;
  type: 'threat' | 'tool' | 'checkpoint';
}

interface SideScrollingGameProps {
  era: Era;
  playerName: string;
  onGameComplete: (score: number) => void;
  onBackToMap: () => void;
}

export default function SideScrollingGame({ era, playerName, onGameComplete, onBackToMap }: SideScrollingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  // Game state
  const [character, setCharacter] = useState<Character>({
    x: 100,
    y: 400,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 'right'
  });

  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'playing' | 'scenario' | 'paused' | 'complete'>('playing');
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [scenarioElements] = useState<ScenarioElement[]>(() => {
    // Generate scenario elements across the level
    const elements: ScenarioElement[] = [];
    const scenarios = gameScenarios.slice(0, 8); // Use first 8 scenarios
    
    scenarios.forEach((scenario, index) => {
      elements.push({
        id: `scenario-${index}`,
        x: 300 + index * 400, // Space them out across the level
        y: 350,
        width: 60,
        height: 60,
        scenario,
        collected: false,
        type: index % 3 === 0 ? 'threat' : index % 3 === 1 ? 'tool' : 'checkpoint'
      });
    });
    
    return elements;
  });

  const [collectedElements, setCollectedElements] = useState<Set<string>>(new Set());

  // Game constants
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const MOVE_SPEED = 5;
  const GROUND_Y = 450;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const LEVEL_WIDTH = 3200; // 4 screen widths

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game physics and movement
  const updateCharacter = useCallback(() => {
    setCharacter(prev => {
      let newChar = { ...prev };
      
      // Horizontal movement
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
        newChar.vx = -MOVE_SPEED;
        newChar.facing = 'left';
      } else if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
        newChar.vx = MOVE_SPEED;
        newChar.facing = 'right';
      } else {
        newChar.vx *= 0.8; // Friction
      }

      // Jumping
      if ((keysRef.current[' '] || keysRef.current['ArrowUp'] || keysRef.current['w']) && newChar.onGround) {
        newChar.vy = JUMP_FORCE;
        newChar.onGround = false;
      }

      // Apply gravity
      newChar.vy += GRAVITY;

      // Update position
      newChar.x += newChar.vx;
      newChar.y += newChar.vy;

      // Ground collision
      if (newChar.y >= GROUND_Y) {
        newChar.y = GROUND_Y;
        newChar.vy = 0;
        newChar.onGround = true;
      }

      // Boundary checking
      if (newChar.x < 0) newChar.x = 0;
      if (newChar.x > LEVEL_WIDTH - 40) newChar.x = LEVEL_WIDTH - 40;

      return newChar;
    });
  }, []);

  // Camera following
  useEffect(() => {
    setCamera(prev => ({
      x: Math.max(0, Math.min(character.x - CANVAS_WIDTH / 2, LEVEL_WIDTH - CANVAS_WIDTH)),
      y: 0
    }));
  }, [character.x]);

  // Collision detection with scenario elements
  const checkCollisions = useCallback(() => {
    scenarioElements.forEach(element => {
      if (collectedElements.has(element.id)) return;

      const charRect = { x: character.x, y: character.y, width: 40, height: 50 };
      const elemRect = { x: element.x, y: element.y, width: element.width, height: element.height };

      if (charRect.x < elemRect.x + elemRect.width &&
          charRect.x + charRect.width > elemRect.x &&
          charRect.y < elemRect.y + elemRect.height &&
          charRect.y + charRect.height > elemRect.y) {
        
        // Collision detected
        setCollectedElements(prev => new Set([...prev, element.id]));
        setCurrentScenario(element.scenario);
        setGameState('scenario');
        
        if (element.type === 'threat') {
          toast({
            title: "Cyber Threat Detected! ⚠️",
            description: "Choose your response carefully.",
          });
        } else {
          toast({
            title: "Security Tool Found! 🛡️",
            description: "Learn how to use this cybersecurity tool.",
          });
        }
      }
    });
  }, [character, collectedElements, toast]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      updateCharacter();
      checkCollisions();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, updateCharacter, checkCollisions]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#4a5568');
    gradient.addColorStop(1, '#2d3748');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = '#2f855a';
    ctx.fillRect(0, GROUND_Y + 50, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y - 50);

    // Draw scenario elements
    scenarioElements.forEach(element => {
      if (collectedElements.has(element.id)) return;

      const screenX = element.x - camera.x;
      const screenY = element.y - camera.y;

      if (screenX > -element.width && screenX < CANVAS_WIDTH) {
        // Draw element based on type
        if (element.type === 'threat') {
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(screenX, screenY, element.width, element.height);
          ctx.fillStyle = 'white';
          ctx.font = '30px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('⚠️', screenX + element.width/2, screenY + element.height/2 + 10);
        } else if (element.type === 'tool') {
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(screenX, screenY, element.width, element.height);
          ctx.fillStyle = 'white';
          ctx.font = '30px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🛡️', screenX + element.width/2, screenY + element.height/2 + 10);
        } else {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(screenX, screenY, element.width, element.height);
          ctx.fillStyle = 'white';
          ctx.font = '30px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('✓', screenX + element.width/2, screenY + element.height/2 + 10);
        }
      }
    });

    // Draw character
    const charScreenX = character.x - camera.x;
    const charScreenY = character.y - camera.y;
    
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(charScreenX, charScreenY, 40, 50);
    
    // Character face
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(character.facing === 'right' ? '🚀' : '🚁', charScreenX + 20, charScreenY + 30);

  }, [character, camera, scenarioElements, collectedElements]);

  // Handle scenario response
  const handleScenarioResponse = (actionKey: string, isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct! 🛡️",
        description: "Great cyber awareness!",
        duration: 2000,
      });
    } else {
      setLives(prev => prev - 1);
      toast({
        title: "Learning Opportunity! 💡",
        description: "Every mistake helps you learn!",
        duration: 2000,
      });
    }

    setGameState('playing');
    setCurrentScenario(null);

    // Check win condition
    if (collectedElements.size >= scenarioElements.length - 1) {
      setGameState('complete');
      onGameComplete(score);
    }

    // Check lose condition
    if (lives <= 1 && !isCorrect) {
      setGameState('complete');
      onGameComplete(score);
    }
  };

  const progress = (collectedElements.size / scenarioElements.length) * 100;

  if (gameState === 'scenario' && currentScenario) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{currentScenario.title}</h2>
              <p className="text-muted-foreground mb-4">{currentScenario.description}</p>
              <div className="bg-muted p-4 rounded-lg mb-6">
                <p className="font-medium">{currentScenario.situation}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {Object.entries(currentScenario.actions).map(([key, action]: [string, any]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="p-4 h-auto text-left justify-start"
                  onClick={() => handleScenarioResponse(key, action.type === 'safe')}
                >
                  <div>
                    <div className="font-medium">{action.text}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        {/* Game Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBackToMap}>
              ← Back to Timeline
            </Button>
            <div className="text-lg font-bold">{era.name} Mission</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">Player:</span> {playerName}
            </div>
            <div className="text-sm">
              <span className="font-medium">Score:</span> {score}
            </div>
            <div className="text-sm">
              <span className="font-medium">Lives:</span> {'❤️'.repeat(lives)}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Mission Progress</span>
            <span className="text-sm">{collectedElements.size}/{scenarioElements.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Game Canvas */}
        <Card className="mb-4">
          <CardContent className="p-0">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full border rounded-lg"
              style={{ imageRendering: 'pixelated' }}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              <p><strong>Controls:</strong> Arrow Keys or WASD to move • Space/Up Arrow to jump</p>
              <p>Collect cybersecurity scenarios and respond correctly to protect the digital world!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}