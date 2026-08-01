import BossFight from "@/components/hack/BossFight";
import { hackBosses } from "@/data/hackBosses";

export default function BossTest() {
  return (
    <div className="relative w-full h-[100dvh] bg-[#05060d]">
      <BossFight boss={hackBosses[8]} accent="#f472b6" onDefeat={() => {}} onOverrun={() => {}} onAbort={() => {}} />
    </div>
  );
}
