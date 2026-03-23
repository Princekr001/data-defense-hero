import { useState } from "react";
import CipherCity from "@/components/CipherCity";
import EnhancedInteractiveCyberGame from "@/components/EnhancedInteractiveCyberGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAuthButton } from "@/components/UserAuthButton";
import LandingPage from "@/components/LandingPage";

const Index = () => {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <button onClick={() => setStarted(false)} className="text-lg font-bold text-primary hover:opacity-80 transition-opacity">
            ← Data Defense Hero
          </button>
        </div>
        <UserAuthButton />
      </div>
      
      <Tabs defaultValue="cipher-city" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 p-2 relative z-[60]">
          <TabsTrigger value="cipher-city">Story Mode</TabsTrigger>
          <TabsTrigger value="enhanced-game">Quiz Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="cipher-city" className="mt-0">
          <CipherCity />
        </TabsContent>

        <TabsContent value="enhanced-game" className="mt-0">
          <EnhancedInteractiveCyberGame />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
