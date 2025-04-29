
import { useState, useEffect } from "react";
import { AIResponse } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { callPerplexityAPI, parsePerplexityResponse, PERPLEXITY_MODELS } from "@/lib/perplexity-api";
import { callAIService } from "@/lib/ai-service";
import { smartFallbackGenerator } from "@/lib/template-generator";

// Configuration options
const API_OPTIONS = {
  OPENAI: {
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-3.5-turbo",
  },
  HUGGINGFACE: {
    url: "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
  },
  PERPLEXITY: {
    url: "https://api.perplexity.ai/chat/completions",
  }
};

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiProvider, setApiProvider] = useState<"OPENAI" | "HUGGINGFACE" | "PERPLEXITY">("PERPLEXITY");
  const [modelType, setModelType] = useState<string>("SMALL");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("webcraft_api_key");
    const storedProvider = localStorage.getItem("webcraft_api_provider") as "OPENAI" | "HUGGINGFACE" | "PERPLEXITY";
    const storedModelType = localStorage.getItem("webcraft_model_type");
    
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedProvider) setApiProvider(storedProvider);
    if (storedModelType) setModelType(storedModelType);
  }, []);

  const saveApiKey = (key: string, provider: "OPENAI" | "HUGGINGFACE" | "PERPLEXITY", model?: string) => {
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
        let response;
        
        if (apiProvider === "PERPLEXITY") {
          const perplexityResponse = await callPerplexityAPI(
            apiKey,
            prompt,
            chatHistory,
            modelType as keyof typeof PERPLEXITY_MODELS
          );
          
          if (perplexityResponse.success && perplexityResponse.data) {
            response = parsePerplexityResponse(perplexityResponse.data);
          } else {
            response = {
              success: false,
              error: perplexityResponse.error || "Error calling Perplexity API"
            };
          }
        } else {
          response = await callAIService(prompt, apiKey, apiProvider, chatHistory);
        }
        
        if (response.success) {
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
