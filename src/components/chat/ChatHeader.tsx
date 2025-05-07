
import { Settings, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import AISettings from "../AISettings";
import { useAI } from "@/hooks/use-ai";
import { cn } from "@/lib/utils";
import { AIProvider } from "@/types";

const ChatHeader = () => {
  const { apiKey, usingFreeAPI, apiProvider, modelType, clearApiKey, saveApiKey, setFreeAPI } = useAI();

  // Fix the handler to match AISettings props signature
  const handleApiSettingsChange = (key: string, provider: AIProvider, modelType?: string) => {
    if (provider === "FREE") {
      setFreeAPI();
      return true;
    } else if (key) {
      saveApiKey(key, provider, modelType);
      return true;
    } else {
      clearApiKey();
      return true;
    }
    return true;
  };

  const handleClearSettings = () => {
    clearApiKey();
    return true;
  };

  return (
    <div
      className={cn(
        "flex justify-between items-center p-3 border-b",
        "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-950/90 dark:to-purple-950/90",
        "backdrop-filter backdrop-blur-md"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-glow-sm cyber-pulse">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <h2 className="font-medium text-base text-gradient-primary">AI Assistant</h2>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hover:bg-blue-500/10 dark:hover:bg-purple-500/20 h-8 w-8 rounded-full",
              "transition-all duration-200"
            )}
            title="AI Settings"
          >
            <Settings className="h-4 w-4 text-blue-500 dark:text-purple-400" />
          </Button>
        </SheetTrigger>
        <SheetContent className="light-panel dark:dark-panel border-l border-blue-500/30 dark:border-purple-500/30 w-[350px] sm:w-[500px] backdrop-blur-xl">
          <AISettings
            onClose={() => {}}
            onClear={handleClearSettings}
            apiKey={apiKey || ""}
            usingFreeAPI={usingFreeAPI}
            onSave={handleApiSettingsChange}
            apiProvider={apiProvider}
            modelType={modelType}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatHeader;
