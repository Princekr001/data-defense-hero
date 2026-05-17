import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  tier: 1 | 2 | 3;
  onSuccess: () => void;
  onFail: () => void;
}

type Cell = "empty" | "ids" | "path" | "start" | "end";

const buildGrid = (tier: number): { grid: Cell[][]; safe: Set<string> } => {
  const size = 4 + tier; // 5 / 6 / 7
  const grid: Cell[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => "empty" as Cell));
  // generate a random monotonic path from (0,0) to (size-1,size-1)
  const safe = new Set<string>();
  let r = 0, c = 0;
  safe.add(`${r},${c}`);
  while (r < size - 1 || c < size - 1) {
    if (r === size - 1) c++;
    else if (c === size - 1) r++;
    else Math.random() < 0.5 ? r++ : c++;
    safe.add(`${r},${c}`);
  }
  // sprinkle IDS on non-safe cells
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (!safe.has(`${i},${j}`) && Math.random() < 0.35) grid[i][j] = "ids";
  grid[0][0] = "start";
  grid[size - 1][size - 1] = "end";
  return { grid, safe };
};

export default function FirewallBypass({ tier, onSuccess, onFail }: Props) {
  const { grid: initial, safe } = useMemo(() => buildGrid(tier), [tier]);
  const [grid, setGrid] = useState<Cell[][]>(initial);
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [done, setDone] = useState(false);
  const size = grid.length;

  const tryMove = (dr: number, dc: number) => {
    if (done) return;
    const [r, c] = pos;
    const nr = r + dr, nc = c + dc;
    if (nr < 0 || nc < 0 || nr >= size || nc >= size) return;
    if (grid[nr][nc] === "ids") {
      setDone(true);
      setTimeout(onFail, 600);
      return;
    }
    const next = grid.map((row) => row.slice());
    if (next[r][c] !== "start") next[r][c] = "path";
    setGrid(next);
    setPos([nr, nc]);
    if (nr === size - 1 && nc === size - 1) {
      setDone(true);
      setTimeout(onSuccess, 600);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") tryMove(-1, 0);
      if (e.key === "ArrowDown") tryMove(1, 0);
      if (e.key === "ArrowLeft") tryMove(0, -1);
      if (e.key === "ArrowRight") tryMove(0, 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, done]);

  const cellClass = (cell: Cell, r: number, c: number) => {
    const isPos = pos[0] === r && pos[1] === c;
    if (isPos) return "bg-primary text-primary-foreground border-primary";
    switch (cell) {
      case "ids": return "bg-destructive/20 border-destructive/40";
      case "path": return "bg-accent/30 border-accent/50";
      case "start": return "bg-primary/30 border-primary";
      case "end": return "bg-accent/30 border-accent";
      default: return "bg-muted/40 border-border";
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Use arrow keys or buttons. IDS cells trigger alarms.</p>
      <div
        className="grid gap-1 mx-auto"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, maxWidth: 320 }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className={`aspect-square rounded border text-[10px] flex items-center justify-center ${cellClass(cell, r, c)}`}>
              {cell === "ids" ? "⚠" : cell === "end" ? "★" : ""}
            </div>
          )),
        )}
      </div>
      <div className="grid grid-cols-3 gap-1 max-w-[180px] mx-auto">
        <div />
        <Button size="sm" variant="outline" onClick={() => tryMove(-1, 0)}>↑</Button>
        <div />
        <Button size="sm" variant="outline" onClick={() => tryMove(0, -1)}>←</Button>
        <Button size="sm" variant="outline" onClick={() => tryMove(1, 0)}>↓</Button>
        <Button size="sm" variant="outline" onClick={() => tryMove(0, 1)}>→</Button>
      </div>
    </div>
  );
}
