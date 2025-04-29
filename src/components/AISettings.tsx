
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
import { Info, Key, X } from "lucide-react";
import { AIProvider } from "@/types";
import { PERPLEXITY_MODELS } from "@/lib/ai-clients";

interface AISettingsProps {
  apiKey: string | null;
  apiProvider: AIProvider;
  modelType?: string;
  onSave: (key: string, provider: AIProvider, modelType?: string) => boolean;
  onClear: () => boolean;
  onClose: () => void;
}

export default function AISettings({
  apiKey,
  apiProvider,
  modelType = "SMALL",
  onSave,
  onClear,
  onClose,
}: AISettingsProps) {
  const [key, setKey] = useState(apiKey || "");
  const [provider, setProvider] = useState<"OPENAI" | "HUGGINGFACE" | "PERPLEXITY">(apiProvider);
  const [selectedModel, setSelectedModel] = useState(modelType);
  const { toast } = useToast();

  const handleSave = () => {
    if (!key.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    const success = onSave(key, provider, provider === "PERPLEXITY" ? selectedModel : undefined);
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
        description: "API key removed",
      });
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>AI Settings</CardTitle>
            <CardDescription>
              Configure your AI service provider
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-provider">AI Provider</Label>
            <RadioGroup
              value={provider}
              onValueChange={(value) => setProvider(value as "OPENAI" | "HUGGINGFACE" | "PERPLEXITY")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PERPLEXITY" id="perplexity" />
                <Label htmlFor="perplexity">Perplexity AI (Recommended)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="OPENAI" id="openai" />
                <Label htmlFor="openai">OpenAI (GPT-3.5 Turbo)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="HUGGINGFACE" id="huggingface" />
                <Label htmlFor="huggingface">Hugging Face (Zephyr)</Label>
              </div>
            </RadioGroup>
          </div>

          {provider === "PERPLEXITY" && (
            <div className="space-y-2">
              <Label htmlFor="model-type">Model</Label>
              <Select 
                value={selectedModel} 
                onValueChange={setSelectedModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMALL">Llama 3.1 Sonar Small (8B)</SelectItem>
                  <SelectItem value="LARGE">Llama 3.1 Sonar Large (70B)</SelectItem>
                  <SelectItem value="HUGE">Llama 3.1 Sonar Huge (405B)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Small is free, larger models may incur costs.
              </p>
            </div>
          )}

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

          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-700">
                  Your API key is stored locally in your browser and never sent to our servers.
                  {provider === "OPENAI" ? (
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-700 underline hover:text-blue-600"
                    >
                      {" "}
                      Get an OpenAI API key
                    </a>
                  ) : provider === "HUGGINGFACE" ? (
                    <a
                      href="https://huggingface.co/settings/tokens"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-700 underline hover:text-blue-600"
                    >
                      {" "}
                      Get a Hugging Face API key
                    </a>
                  ) : (
                    <a
                      href="https://docs.perplexity.ai/docs/getting-started"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-700 underline hover:text-blue-600"
                    >
                      {" "}
                      Get a Perplexity API key
                    </a>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear} disabled={!apiKey}>
            Remove Key
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
