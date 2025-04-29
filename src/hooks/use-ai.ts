
import { useState, useEffect } from "react";
import { AIResponse, AIProvider } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { AIClientFactory } from "@/lib/ai-clients";
import { smartFallbackGenerator } from "@/lib/template-generator";

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiProvider, setApiProvider] = useState<AIProvider>("PERPLEXITY");
  const [modelType, setModelType] = useState<string>("SMALL");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("webcraft_api_key");
    const storedProvider = localStorage.getItem("webcraft_api_provider") as AIProvider;
    const storedModelType = localStorage.getItem("webcraft_model_type");
    
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedProvider) setApiProvider(storedProvider);
    if (storedModelType) setModelType(storedModelType);
  }, []);

  const saveApiKey = (key: string, provider: AIProvider, model?: string) => {
    localStorage.setItem("webcraft_api_key", key);
    localStorage.setItem("webcraft_api_provider", provider);
    if (model && provider === "PERPLEXITY") {
      localStorage.setItem("webcraft_model_type", model);
      setModelType(model);
    }
    setApiKey(key);
    setApiProvider(provider);
    return true;
  };

  const clearApiKey = () => {
    localStorage.removeItem("webcraft_api_key");
    setApiKey(null);
    return true;
  };

  const addToChatHistory = (message: {role: string, content: string}) => {
    setChatHistory(prev => [...prev, message]);
  };

  const generateCode = async (prompt: string): Promise<AIResponse> => {
    setIsProcessing(true);
    
    // Add user message to chat history
    addToChatHistory({role: "user", content: prompt});
    
    try {
      // If we have an API key, try to use it
      if (apiKey) {
        try {
          // Create an AI client based on the selected provider
          const aiClient = AIClientFactory.createClient({
            apiKey,
            provider: apiProvider,
            modelType
          });
          
          const response = await aiClient.generateResponse({
            prompt,
            chatHistory
          });
          
          if (response.success && response.data) {
            // Add assistant response to chat history
            const explanation = response.data.explanation || "Code generated successfully";
            addToChatHistory({role: "assistant", content: explanation});
            return response.data;
          } else {
            // If API call fails, log the error and fall back
            console.error("API call failed:", response.error);
            toast({
              title: "API Error",
              description: response.error || "Error connecting to AI service",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error calling AI service:", error);
          toast({
            title: "API Error",
            description: error instanceof Error ? error.message : "Error connecting to AI service",
            variant: "destructive",
          });
        }
      }
      
      // Fall back to smart template selection
      const smartFallbackResponse = await smartFallbackGenerator(prompt, chatHistory);
      
      // Add fallback response to chat history
      addToChatHistory({
        role: "assistant", 
        content: smartFallbackResponse.explanation || "Generated based on your request"
      });
      
      return smartFallbackResponse;
    } catch (error) {
      console.error("Error in generateCode:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Using fallback mode.",
        variant: "destructive",
      });
      
      const fallbackResponse = await smartFallbackGenerator(prompt, chatHistory);
      addToChatHistory({
        role: "assistant", 
        content: fallbackResponse.explanation || "Generated with fallback mode"
      });
      return fallbackResponse;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    apiKey,
    apiProvider,
    modelType,
    chatHistory,
    generateCode,
    saveApiKey,
    clearApiKey,
  };
}
