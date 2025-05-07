
import { useState, useEffect } from "react";
import { AIResponse, AIProvider } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { AIClientFactory } from "@/lib/ai-clients";
import { smartFallbackGenerator } from "@/lib/template-generator";
import { FREE_API_KEY } from "@/lib/ai-clients/base-client";

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiProvider, setApiProvider] = useState<AIProvider>("PERPLEXITY");
  const [modelType, setModelType] = useState<string>("SMALL");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [usingFreeAPI, setUsingFreeAPI] = useState<boolean>(false);
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("webcraft_api_key");
    const storedProvider = localStorage.getItem("webcraft_api_provider") as AIProvider;
    const storedModelType = localStorage.getItem("webcraft_model_type");
    const storedUsingFree = localStorage.getItem("webcraft_using_free_api") === "true";
    
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedProvider) setApiProvider(storedProvider);
    if (storedModelType) setModelType(storedModelType);
    setUsingFreeAPI(storedUsingFree);
    
    // If using free API, make sure we have the free API key set
    if (storedUsingFree) {
      setApiKey(FREE_API_KEY);
      setApiProvider("FREE");
    }
  }, []);

  const saveApiKey = (key: string, provider: AIProvider, model?: string) => {
    localStorage.setItem("webcraft_api_key", key);
    localStorage.setItem("webcraft_api_provider", provider);
    setUsingFreeAPI(provider === "FREE");
    localStorage.setItem("webcraft_using_free_api", provider === "FREE" ? "true" : "false");
    
    if (model && provider === "PERPLEXITY") {
      localStorage.setItem("webcraft_model_type", model);
      setModelType(model);
    }
    
    setApiKey(key);
    setApiProvider(provider);
    return true;
  };

  const setFreeAPI = () => {
    localStorage.setItem("webcraft_api_key", FREE_API_KEY);
    localStorage.setItem("webcraft_api_provider", "FREE");
    localStorage.setItem("webcraft_using_free_api", "true");
    setApiKey(FREE_API_KEY);
    setApiProvider("FREE");
    setUsingFreeAPI(true);
    return true;
  };

  const clearApiKey = () => {
    localStorage.removeItem("webcraft_api_key");
    localStorage.setItem("webcraft_using_free_api", "false");
    setApiKey(null);
    setUsingFreeAPI(false);
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
      // If we have an API key (including free key), try to use it
      if (apiKey) {
        try {
          // Create an AI client based on the selected provider
          const aiClient = AIClientFactory.createClient({
            apiKey,
            provider: usingFreeAPI ? "FREE" : apiProvider,
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
            
            // Ensure we return a valid AIResponse with required code property
            return {
              code: response.data.code || { html: "", css: "", js: "" },
              explanation: explanation
            };
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
      
      return {
        code: smartFallbackResponse.code || { html: "", css: "", js: "" },
        explanation: smartFallbackResponse.explanation || ""
      };
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
      
      return {
        code: fallbackResponse.code || { html: "", css: "", js: "" },
        explanation: fallbackResponse.explanation || ""
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    apiKey,
    apiProvider,
    modelType,
    usingFreeAPI,
    chatHistory,
    generateCode,
    saveApiKey,
    clearApiKey,
    setFreeAPI,
  };
}
