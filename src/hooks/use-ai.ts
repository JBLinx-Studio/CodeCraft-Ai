
import { useState, useEffect } from "react";
import { AIResponse, AIProvider } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { AIClientFactory } from "@/lib/ai-clients";
import { smartFallbackGenerator } from "@/lib/template-generator";
import { FREE_API_KEY } from "@/lib/ai-clients/base-client";
import { puterService } from "@/services/puter-service";

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(FREE_API_KEY); // Default to free
  const [apiProvider, setApiProvider] = useState<AIProvider>("FREE"); // Default to free
  const [modelType, setModelType] = useState<string>("gpt-4o-mini");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [usingFreeAPI, setUsingFreeAPI] = useState<boolean>(true); // Default to true
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("webcraft_api_key");
    const storedProvider = localStorage.getItem("webcraft_api_provider") as AIProvider;
    const storedModelType = localStorage.getItem("webcraft_model_type");
    const storedUsingFree = localStorage.getItem("webcraft_using_free_api");
    
    // If no stored preferences, use Puter.js free AI by default
    if (!storedApiKey && !storedProvider) {
      setApiKey(FREE_API_KEY);
      setApiProvider("FREE");
      setUsingFreeAPI(true);
      setModelType("gpt-4o-mini");
      localStorage.setItem("webcraft_api_key", FREE_API_KEY);
      localStorage.setItem("webcraft_api_provider", "FREE");
      localStorage.setItem("webcraft_using_free_api", "true");
      localStorage.setItem("webcraft_model_type", "gpt-4o-mini");
    } else {
      if (storedApiKey) setApiKey(storedApiKey);
      if (storedProvider) setApiProvider(storedProvider);
      if (storedModelType) setModelType(storedModelType);
      setUsingFreeAPI(storedUsingFree === "true");
    }
  }, []);

  const saveApiKey = (key: string, provider: AIProvider, model?: string): boolean => {
    localStorage.setItem("webcraft_api_key", key);
    localStorage.setItem("webcraft_api_provider", provider);
    const isFree = provider === "FREE";
    setUsingFreeAPI(isFree);
    localStorage.setItem("webcraft_using_free_api", isFree ? "true" : "false");
    
    if (model && (provider === "PERPLEXITY" || provider === "FREE")) {
      localStorage.setItem("webcraft_model_type", model);
      setModelType(model);
    }
    
    setApiKey(key);
    setApiProvider(provider);
    return true;
  };

  const setFreeAPI = (): boolean => {
    localStorage.setItem("webcraft_api_key", FREE_API_KEY);
    localStorage.setItem("webcraft_api_provider", "FREE");
    localStorage.setItem("webcraft_using_free_api", "true");
    localStorage.setItem("webcraft_model_type", "gpt-4o-mini");
    setApiKey(FREE_API_KEY);
    setApiProvider("FREE");
    setUsingFreeAPI(true);
    setModelType("gpt-4o-mini");
    return true;
  };

  const clearApiKey = (): boolean => {
    // When clearing, fall back to free Puter.js AI
    localStorage.setItem("webcraft_api_key", FREE_API_KEY);
    localStorage.setItem("webcraft_api_provider", "FREE");
    localStorage.setItem("webcraft_using_free_api", "true");
    setApiKey(FREE_API_KEY);
    setApiProvider("FREE");
    setUsingFreeAPI(true);
    return true;
  };

  const addToChatHistory = (message: {role: string, content: string}) => {
    setChatHistory(prev => [...prev, message]);
  };

  const saveCurrentProject = async (code: {html: string, css: string, js: string}) => {
    try {
      const projectName = `project_${Date.now()}`;
      const saved = await puterService.saveProject(projectName, code);
      if (saved) {
        toast({
          title: "Project Saved",
          description: `Project saved to cloud as ${projectName}`,
        });
      }
    } catch (error) {
      console.log("Cloud save unavailable:", error);
    }
  };

  const generateCode = async (prompt: string): Promise<AIResponse> => {
    setIsProcessing(true);
    
    // Add user message to chat history
    addToChatHistory({role: "user", content: prompt});
    
    try {
      // Always try to use the configured AI client first
      const aiClient = AIClientFactory.createClient({
        apiKey: apiKey || FREE_API_KEY,
        provider: apiProvider,
        modelType
      });
      
      console.log(`Generating code using ${apiProvider} (free: ${usingFreeAPI})`);
      
      const response = await aiClient.generateResponse({
        prompt,
        chatHistory
      });
      
      if (response.success && response.data) {
        // Add assistant response to chat history
        const explanation = response.data.explanation || "Code generated successfully with AI";
        addToChatHistory({role: "assistant", content: explanation});
        
        const generatedCode = response.data.code || { html: "", css: "", js: "" };
        
        // Auto-save project to cloud if using Puter.js
        if (usingFreeAPI && (generatedCode.html || generatedCode.css || generatedCode.js)) {
          await saveCurrentProject(generatedCode);
        }
        
        return {
          code: generatedCode,
          explanation: explanation
        };
      } else {
        console.error("AI generation failed:", response.error);
        
        // Fall back to smart template selection
        const fallbackResponse = await smartFallbackGenerator(prompt, chatHistory);
        addToChatHistory({
          role: "assistant", 
          content: "Used template-based generation as fallback: " + (fallbackResponse.explanation || "")
        });
        
        return {
          code: fallbackResponse.code || { html: "", css: "", js: "" },
          explanation: fallbackResponse.explanation || "Generated using template fallback",
          error: response.error
        };
      }
    } catch (error) {
      console.error("Error in generateCode:", error);
      
      // Fall back to smart template selection
      const fallbackResponse = await smartFallbackGenerator(prompt, chatHistory);
      addToChatHistory({
        role: "assistant", 
        content: "Generated with fallback mode due to error: " + (fallbackResponse.explanation || "")
      });
      
      return {
        code: fallbackResponse.code || { html: "", css: "", js: "" },
        explanation: fallbackResponse.explanation || "Generated with fallback mode",
        error: error instanceof Error ? error.message : "Unknown error"
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
    saveCurrentProject,
  };
}
