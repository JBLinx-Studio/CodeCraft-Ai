
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Info, Key, X, ZapIcon, Brain, Sparkles } from "lucide-react";
import { AIProvider } from "@/types";
import { PERPLEXITY_MODELS } from "@/lib/ai-clients";
import { FREE_API_KEY } from "@/lib/ai-clients/base-client";

interface AISettingsProps {
  apiKey: string | null;
  apiProvider: AIProvider;
  modelType?: string;
  usingFreeAPI?: boolean;
  onSave: (key: string, provider: AIProvider, modelType?: string) => boolean;
  onClear: () => boolean;
  onClose: () => void;
  onSetFreeAPI?: () => boolean;
}

export default function AISettings({
  apiKey,
  apiProvider,
  modelType = "gpt-4o-mini",
  usingFreeAPI = true,
  onSave,
  onClear,
  onClose,
  onSetFreeAPI,
}: AISettingsProps) {
  const [key, setKey] = useState(apiKey || "");
  const [provider, setProvider] = useState<AIProvider>(apiProvider);
  const [selectedModel, setSelectedModel] = useState(modelType);
  const { toast } = useToast();

  const handleSave = () => {
    if (provider !== "FREE" && !key.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    let finalKey = key;
    if (provider === "FREE") {
      finalKey = FREE_API_KEY;
    }

    const success = onSave(finalKey, provider, provider === "PERPLEXITY" ? selectedModel : selectedModel);
    if (success) {
      toast({
        title: "Success",
        description: "AI settings saved successfully",
      });
      onClose();
    }
  };

  const handleClear = () => {
    const success = onClear();
    if (success) {
      setKey("");
      toast({
        title: "Success",
        description: "API key removed, switched to free mode",
      });
    }
  };

  const handleSetFreeAPI = () => {
    if (onSetFreeAPI && onSetFreeAPI()) {
      setProvider("FREE");
      setSelectedModel("gpt-4o-mini");
      toast({
        title: "Free Puter.js AI Enabled",
        description: "Now using free GPT-4o mini via Puter.js",
      });
      onClose();
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-400" />
              AI Settings
            </CardTitle>
            <CardDescription>
              Configure your AI service provider and model
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-4 mb-6 border border-cyan-200 dark:border-cyan-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <Sparkles className="h-5 w-5 text-cyan-500" aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-cyan-700 dark:text-cyan-300">
                  <Button 
                    variant="link" 
                    className="p-0 text-cyan-700 dark:text-cyan-300 font-semibold hover:text-cyan-800 dark:hover:text-cyan-200"
                    onClick={handleSetFreeAPI}
                  >
                    🚀 Use Free Puter.js AI (Recommended)
                  </Button>
                </p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                  Free GPT-4o mini with cloud storage, auth, and database - no API key required!
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-provider">AI Provider</Label>
            <RadioGroup
              value={provider}
              onValueChange={(value) => setProvider(value as AIProvider)}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="FREE" id="free" />
                <div className="flex-1">
                  <Label htmlFor="free" className="font-medium">
                    🆓 Puter.js AI (Free Forever)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    GPT-4o mini + cloud storage + auth + database
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="PERPLEXITY" id="perplexity" />
                <div className="flex-1">
                  <Label htmlFor="perplexity" className="font-medium">
                    🧠 Perplexity AI (Recommended for Advanced)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Llama 3.1 Sonar models with web search
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="OPENAI" id="openai" />
                <div className="flex-1">
                  <Label htmlFor="openai" className="font-medium">
                    🤖 OpenAI
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    GPT-3.5 Turbo
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="HUGGINGFACE" id="huggingface" />
                <div className="flex-1">
                  <Label htmlFor="huggingface" className="font-medium">
                    🤗 Hugging Face
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Zephyr 7B Beta
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {provider === "PERPLEXITY" && (
            <div className="space-y-2">
              <Label htmlFor="model-type">Perplexity Model</Label>
              <Select 
                value={selectedModel} 
                onValueChange={setSelectedModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMALL">Llama 3.1 Sonar Small (8B) - Free</SelectItem>
                  <SelectItem value="LARGE">Llama 3.1 Sonar Large (70B) - Paid</SelectItem>
                  <SelectItem value="HUGE">Llama 3.1 Sonar Huge (405B) - Paid</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Small model is free, larger models may incur costs.
              </p>
            </div>
          )}

          {provider === "FREE" && (
            <div className="space-y-2">
              <Label htmlFor="free-model">Puter.js Model</Label>
              <Select 
                value={selectedModel} 
                onValueChange={setSelectedModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini (Free)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Free GPT-4o mini with unlimited usage.
              </p>
            </div>
          )}

          {provider !== "FREE" && (
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
                <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}

          {provider !== "FREE" && (
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your API key is stored locally in your browser and never sent to our servers.
                    {provider === "OPENAI" ? (
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue-700 dark:text-blue-300 underline hover:text-blue-600 dark:hover:text-blue-200"
                      >
                        {" "}
                        Get an OpenAI API key
                      </a>
                    ) : provider === "HUGGINGFACE" ? (
                      <a
                        href="https://huggingface.co/settings/tokens"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue-700 dark:text-blue-300 underline hover:text-blue-600 dark:hover:text-blue-200"
                      >
                        {" "}
                        Get a Hugging Face API key
                      </a>
                    ) : (
                      <a
                        href="https://docs.perplexity.ai/docs/getting-started"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue-700 dark:text-blue-300 underline hover:text-blue-600 dark:hover:text-blue-200"
                      >
                        {" "}
                        Get a Perplexity API key
                      </a>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear} disabled={!apiKey}>
            Switch to Free Mode
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
