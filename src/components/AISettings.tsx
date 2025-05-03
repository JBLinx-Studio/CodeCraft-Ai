
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AIProvider } from "@/types";

export interface AISettingsProps {
  onClose: () => void;
  apiKey: string | null;
  usingFreeAPI: boolean;
  onApiKeyChange: (key: string | null, useFreeAPI: boolean) => void;
}

const AISettings = ({ onClose, apiKey, usingFreeAPI, onApiKeyChange }: AISettingsProps) => {
  const [keyInput, setKeyInput] = useState(apiKey || "");
  const [useFreeTier, setUseFreeTier] = useState(usingFreeAPI);

  const handleSaveSettings = () => {
    const trimmedKey = keyInput.trim();
    
    // If using free tier, just save that setting
    if (useFreeTier) {
      onApiKeyChange(null, true);
      toast.success("Using free API tier", {
        description: "Limited features but no API key required"
      });
    } 
    // If not using free tier, validate the API key
    else if (trimmedKey.length < 10) {
      toast.error("Invalid API Key", {
        description: "Please provide a valid API key or switch to free tier"
      });
      return;
    } else {
      onApiKeyChange(trimmedKey, false);
      toast.success("API key saved", {
        description: "Your API key has been saved for this session"
      });
    }
    
    onClose();
  };

  return (
    <div className="p-4 border-b bg-card mb-2">
      <h2 className="text-lg font-semibold mb-4">AI Settings</h2>
      
      <RadioGroup 
        value={useFreeTier ? "free" : "api"} 
        className="mb-4"
        onValueChange={(value) => setUseFreeTier(value === "free")}
      >
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="free" id="free-tier" />
          <Label htmlFor="free-tier">Use Free Tier (Limited features)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="api" id="api-key" />
          <Label htmlFor="api-key">Use Your API Key (Full features)</Label>
        </div>
      </RadioGroup>
      
      {!useFreeTier && (
        <div className="mb-4">
          <Label htmlFor="api-key-input">Perplexity API Key</Label>
          <Input 
            id="api-key-input"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="mt-1"
            placeholder="Enter your API key"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your API key is stored locally in your browser and never sent to our servers
          </p>
        </div>
      )}
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};

export default AISettings;
