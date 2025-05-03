
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message } from "@/types";
import AISettings from "./AISettings";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useAI } from "@/hooks/use-ai";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import { extractCodeBlocks } from "@/lib/utils";

export interface ChatPanelProps {
  onCodeGenerated: (html: string, css: string, js: string) => void;
}

export const ChatPanel = ({ onCodeGenerated }: ChatPanelProps) => {
  const { generateCode, isProcessing, apiKey, usingFreeAPI, saveApiKey } = useAI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [hasAuthError, setHasAuthError] = useState(false);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: nanoid(),
          role: "assistant",
          content: "Hello! I'm your AI assistant. Describe the web app you'd like me to build for you.",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [messages.length]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: nanoid(),
        role,
        content,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSendMessage = async (content: string) => {
    addMessage("user", content);
    
    if (isProcessing) {
      return;
    }
    
    // Check for API authentication issues before attempting to generate
    if (hasAuthError && usingFreeAPI && !apiKey) {
      toast.error("API Authentication Error", {
        description: "Please configure your API key in settings to continue.",
        duration: 5000,
      });
      
      setShowSettings(true);
      return;
    }
    
    // Add a thinking message
    const thinkingId = nanoid();
    const thinkingMessages = [
      "Analyzing your request...",
      "Thinking about the best approach...",
      "Processing your question...",
      "Considering different solutions..."
    ];
    const thinkingMessage = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
    
    setMessages((prev) => [...prev, {
      id: thinkingId,
      role: "assistant",
      content: thinkingMessage,
      timestamp: Date.now(),
    }]);
    
    try {
      const response = await generateCode(content);
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingId));
      
      if (response.error) {
        if (response.error.includes("401") || response.error.includes("Authentication")) {
          setHasAuthError(true);
          addMessage("assistant", `I'm having trouble connecting to the AI service. Please check your API settings by clicking the settings icon.`);
          
          toast.error("Authentication Error", {
            description: "Please check your API settings",
          });
          
          return;
        }
        
        addMessage("assistant", `I encountered an error: ${response.error}. Please try again with a different request.`);
        toast.error("Error", {
          description: response.error,
        });
        return;
      }
      
      const { html = "", css = "", js = "" } = response.code || {};
      
      // Only update the preview if code was actually generated
      if (html || css || js) {
        onCodeGenerated(html, css, js);
      }
      
      // Add the AI's response message
      let responseMessage = response.explanation || "I've created a web app based on your description.";
      addMessage("assistant", responseMessage);
      
      // Success notification
      if (html || css || js) {
        toast.success("Code generated successfully!", {
          description: "Check the preview panel to see your application",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error generating code:", error);
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingId));
      
      // Check if it's an authentication error
      if (error instanceof Error && 
          (error.message.includes("401") || 
           error.message.includes("authentication") || 
           error.message.includes("Unauthorized"))) {
        setHasAuthError(true);
        addMessage("assistant", "I'm having trouble authenticating with the AI service. Please check your API settings by clicking the settings icon above.");
        
        toast.error("Authentication Error", {
          description: "Please configure your API key in settings"
        });
      } else {
        addMessage("assistant", "I'm having trouble generating code right now. Please try again later.");
        
        toast.error("Generation Error", {
          description: "Failed to generate code. Using fallback mode.",
        });
      }
    }
  };

  const handleApiKeyChange = (key: string | null, useFreeApi: boolean) => {
    saveApiKey(key || "", useFreeApi ? "FREE" : "PERPLEXITY", "SMALL");
    setHasAuthError(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3 border-b bg-secondary/20">
        <h2 className="font-medium text-sm">AI Assistant</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
          title="AI Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {showSettings && (
        <AISettings 
          onClose={() => setShowSettings(false)}
          apiKey={apiKey}
          usingFreeAPI={usingFreeAPI}
          onApiKeyChange={handleApiKeyChange}
        />
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 border-t bg-background/50 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} disabled={isProcessing} isProcessing={isProcessing} />
      </div>
    </div>
  );
};

export default ChatPanel;
