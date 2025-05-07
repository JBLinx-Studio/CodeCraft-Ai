
import React, { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAI } from "@/hooks/use-ai";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import AISettings from "./AISettings";
import { Settings, Sparkles, Zap, RefreshCcw, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatPanelProps {
  onCodeGenerated: (html: string, css: string, js: string) => void;
}

export default function ChatPanel({ onCodeGenerated }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      role: "assistant",
      content: "Hello! I'm CodeCraft AI. I can help you build amazing web applications. What would you like to create today? You can describe what you want to build or ask me questions about web development.",
      timestamp: Date.now(),
    },
  ]);
  
  const [showSettings, setShowSettings] = useState(false);
  const [hasAuthError, setHasAuthError] = useState(false);
  
  const { 
    generateCode, 
    isProcessing, 
    apiKey, 
    saveApiKey, 
    clearApiKey,
    setFreeAPI,
    apiProvider,
    modelType,
    usingFreeAPI
  } = useAI();
  const { toast: uiToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = (role: "user" | "assistant", content: string) => {
    const newMessage: Message = {
      id: nanoid(),
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Check for API errors initially
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!apiKey && usingFreeAPI) {
        // We might have auth issues with free API
        try {
          const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: "test" }),
          });
          
          if (response.status === 401) {
            setHasAuthError(true);
          }
        } catch (error) {
          console.error("Error checking API status:", error);
        }
      }
    };
    
    checkAuthStatus();
  }, [apiKey, usingFreeAPI]);

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
        uiToast({
          title: "Error",
          description: response.error,
          variant: "destructive",
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([
      {
        id: "system-1",
        role: "assistant",
        content: "Chat cleared. What would you like to create now? I'm here to help with your web development needs.",
        timestamp: Date.now(),
      },
    ]);
    
    toast.info("Chat cleared", {
      description: "All previous messages have been removed"
    });
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-3 bg-card">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            Chat
          </div>
          {usingFreeAPI && (
            <Badge variant="outline" className="text-xs font-normal text-amber-600 bg-amber-50 border-amber-200 ml-2">
              <Zap className="h-3 w-3 mr-1 text-amber-500" />
              Free API Mode
            </Badge>
          )}
          {hasAuthError && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs font-normal text-red-600 bg-red-50 border-red-200 ml-2 cursor-pointer" onClick={toggleSettings}>
                    <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                    Auth Error
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Authentication error detected. Click to configure your API key in settings.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSettings}
            title="AI Settings"
            className={`h-8 w-8 rounded-full ${hasAuthError ? 'text-red-500 animate-pulse bg-red-50' : ''}`}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="h-8 text-xs gap-1 rounded-full px-3"
          >
            <RefreshCcw className="h-3 w-3" />
            Clear
          </Button>
        </div>
      </div>
      <Separator />
      
      {showSettings ? (
        <AISettings 
          apiKey={apiKey}
          apiProvider={apiProvider}
          modelType={modelType}
          usingFreeAPI={usingFreeAPI}
          onSave={(key, provider, model) => {
            saveApiKey(key, provider, model);
            setHasAuthError(false);
            toast.success("Settings saved", {
              description: "Your AI configuration has been updated"
            });
          }}
          onClear={clearApiKey}
          onClose={toggleSettings}
          onSetFreeAPI={(usesFree) => {
            setFreeAPI(usesFree);
            if (usesFree) {
              toast.info("Using free API mode", {
                description: "Limited functionality available"
              });
            }
          }}
        />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
            
            {hasAuthError && messages.length < 3 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 text-sm text-red-800 dark:text-red-300 animate-fade-in">
                <div className="flex gap-2 items-start">
                  <Info className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">API Authentication Error</h3>
                    <p className="mt-1">To use AI features, you need to configure your API key by clicking the settings icon above.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-xs bg-white dark:bg-slate-800 border-red-300 dark:border-red-700/50 text-red-600"
                      onClick={toggleSettings}
                    >
                      Configure API Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t bg-card/50">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isProcessing={isProcessing} 
              disabled={hasAuthError && !apiKey && usingFreeAPI}
              errorMessage={hasAuthError && !apiKey && usingFreeAPI ? "Please configure API settings first" : undefined}
            />
          </div>
        </>
      )}
    </div>
  );
}
