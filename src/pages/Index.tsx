import CipherCity from "@/components/CipherCity";
import EnhancedInteractiveCyberGame from "@/components/EnhancedInteractiveCyberGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAuthButton } from "@/components/UserAuthButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">Cipher City</span>
        </div>
        <UserAuthButton />
      </div>
      
      <Tabs defaultValue="cipher-city" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 p-2">
          <TabsTrigger value="cipher-city">Cipher City (New Story Game)</TabsTrigger>
          <TabsTrigger value="enhanced-game">Enhanced Game (Quiz Mode)</TabsTrigger>
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
