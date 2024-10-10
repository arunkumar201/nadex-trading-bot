import { BotConfigurationForm } from "@/components/BotConfigurationForm";
import { BotSettings } from "@/components/BotSettings";
import { getBotSettings } from "@/services";
import { Suspense } from "react";

export default async function HomePage() {
  const currentBotSettings = await getBotSettings(); 
  return (
    <div className="w-full mt-12 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="bg-blue-300 border-l-4 border-blue-500 text-blue-900 p-4 -mt-6 mb-3 rounded-xl">
        <p className="font-bold">Bot Configuration Notice:</p>
        <p>
          Set a maximum of <span className="font-semibold text-blue-800">100</span> for both
          <span className="font-semibold text-blue-800"> sell</span> and
          <span className="font-semibold text-blue-800"> buy</span> prices, and a maximum of
          <span className="font-semibold text-blue-800"> 20</span> for
          <span className="font-semibold text-blue-800"> contract size</span>.
        </p>
      </div>
      <div className='w-full flex flex-row gap-4 justify-center flex-wrap-reverse items-start h-full'>
        <Suspense fallback={<div>Loading...</div>}>
          <BotConfigurationForm />
        </Suspense>
        <BotSettings {...currentBotSettings} />
      </div>
    </div>
  );
}
