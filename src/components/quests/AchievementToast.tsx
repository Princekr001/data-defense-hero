import { useEffect } from "react";
import { Trophy } from "lucide-react";

interface Props {
  icon: string;
  name: string;
  tagline: string;
  onDone: () => void;
}

export default function AchievementToast({ icon, name, tagline, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] pointer-events-none animate-[push-drop_0.5s_ease-out]">
      <div className="flex items-center gap-3 rounded-full border-2 border-yellow-400/70 bg-card/95 backdrop-blur pl-2 pr-5 py-2 shadow-[0_0_40px_hsl(45_95%_55%/0.5)]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-inner">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-yellow-400 font-black">
            <Trophy className="w-3 h-3" /> Achievement Unlocked
          </div>
          <div className="text-sm font-black leading-tight">{name}</div>
          <div className="text-[10px] text-muted-foreground">{tagline}</div>
        </div>
      </div>
    </div>
  );
}
