import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  tier: 1 | 2 | 3;
  onSuccess: () => void;
  onFail: () => void;
}

const POOLS: Record<number, string[][]> = {
  1: [
    ["password1", "Tr0ub4dor&3", "qwerty", "X9!mPq#Lz2", "summer2024"],
    ["123456", "C0rrect-H0rse!", "letmein", "iloveyou", "g7$Vn!p9Qx"],
  ],
  2: [
    ["P@ssw0rd2024", "h7K!9mZx@Lp", "Welcome1!", "Spring#2025", "Cv8&nQ2!rW9*"],
    ["Acme!2024", "9zP$bN4!kQ7@xL", "Manager@1", "Summer#01", "Lp2#vQ9!rN7$"],
  ],
  3: [
    ["Operator!2024", "X9$kP@n7Lq!vR2#W", "Grid#2025", "K8!mB3$nQ7&vL2@", "Sat-Uplink#1"],
    ["Vault@2024", "Z2$kQ9!nP7@bL4#vR8&", "Bunker#1", "M9!kQ2$nB7@vL4#rW8", "Admin#2025"],
  ],
};

const expectedWeakest = (set: string[]) =>
  // weakest = shortest + lowest character class diversity
  set
    .map((s) => ({ s, score: s.length * 2 + new Set(s).size }))
    .sort((a, b) => a.score - b.score)[0].s;

export default function PasswordCracker({ tier, onSuccess, onFail }: Props) {
  const set = useMemo(() => {
    const pool = POOLS[tier];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [tier]);
  const correct = useMemo(() => expectedWeakest(set), [set]);
  const [picked, setPicked] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(tier === 1 ? 20 : tier === 2 ? 15 : 12);

  useEffect(() => {
    if (picked) return;
    if (timeLeft <= 0) {
      onFail();
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, picked, onFail]);

  const handlePick = (p: string) => {
    setPicked(p);
    setTimeout(() => (p === correct ? onSuccess() : onFail()), 700);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Pick the weakest credential</span>
        <span className="font-mono text-primary">{timeLeft}s</span>
      </div>
      <div className="grid gap-2">
        {set.map((s) => {
          const isPicked = picked === s;
          const isCorrect = picked && s === correct;
          return (
            <Button
              key={s}
              variant="outline"
              disabled={!!picked}
              onClick={() => handlePick(s)}
              className={`justify-between font-mono text-sm h-auto py-3 ${
                isPicked && s !== correct ? "border-destructive text-destructive" : ""
              } ${isCorrect ? "border-accent text-accent" : ""}`}
            >
              <span>{s}</span>
              <span className="text-xs opacity-60">{s.length} chars</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
