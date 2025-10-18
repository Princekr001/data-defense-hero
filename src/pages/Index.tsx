import CipherCity from "@/components/CipherCity";
import EnhancedInteractiveCyberGame from "@/components/EnhancedInteractiveCyberGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
