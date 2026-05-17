import { useState } from "react";
import HackGame from "@/components/HackGame";
import { UserAuthButton } from "@/components/UserAuthButton";
import LandingPage from "@/components/LandingPage";

const Index = () => {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <button
          onClick={() => setStarted(false)}
          className="pointer-events-auto text-xs font-bold tracking-wider text-white/80 hover:text-white bg-black/40 backdrop-blur border border-white/10 rounded-full px-4 py-1.5 transition"
        >
          ← DATA DEFENSE HERO
        </button>
      </div>
      <div className="absolute top-3 right-3 z-50">
        <UserAuthButton />
      </div>
      <HackGame />
    </div>
  );
};

export default Index;
