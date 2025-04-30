
import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAI } from "@/hooks/use-ai";
import { useToast } from "@/components/ui/use-toast";
import AISettings from "./AISettings";
import { Settings } from "lucide-react";

interface ChatPanelProps {
  onCodeGenerated: (html: string, css: string, js: string) => void;
}

export default function ChatPanel({ onCodeGenerated }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      role: "assistant",
      content: "Hello! I'm WebCraft AI. I can help you build amazing web applications. Describe what you want to create, and I'll generate the code for you. You can request specific features, layouts, or functionality.",
      timestamp: Date.now(),
    },
  ]);
  
  const [showSettings, setShowSettings] = useState(false);
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
  const { toast } = useToast();
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

  const handleSendMessage = async (content: string) => {
    addMessage("user", content);
    
    if (isProcessing) {
      return;
    }
    
    // For simple greetings, show a thinking message
    const simplifiedContent = content.toLowerCase().trim();
    const isSimpleGreeting = ["hello", "hi", "hey", "greetings"].includes(simplifiedContent);
    
    if (!isSimpleGreeting) {
      // Add a "thinking" message for more complex requests
      const thinkingId = nanoid();
      setMessages((prev) => [...prev, {
        id: thinkingId,
        role: "assistant",
        content: "I'm thinking about how to implement this...",
        timestamp: Date.now(),
      }]);
    }
    
    try {
      const response = await generateCode(content);
      
      // Remove the thinking message if it exists
      if (!isSimpleGreeting) {
        setMessages(prev => prev.filter(msg => msg.content !== "I'm thinking about how to implement this..."));
      }
      
      if (response.error) {
        addMessage("assistant", `I encountered an error: ${response.error}. Please try again with a different request.`);
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      
      const { html = "", css = "", js = "" } = response.code;
      
      // Only update the preview if code was actually generated
      if (html || css || js) {
        onCodeGenerated(html, css, js);
      }
      
      // Add the AI's response message
      let responseMessage = response.explanation || "I've created a web app based on your description.";
      addMessage("assistant", responseMessage);
    } catch (error) {
      console.error("Error generating code:", error);
      
      // Remove the thinking message if it exists
      setMessages(prev => prev.filter(msg => msg.content !== "I'm thinking about how to implement this..."));
      
      addMessage("assistant", "I'm having trouble generating code right now. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to generate code. Using fallback mode.",
        variant: "destructive",
      });
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
        content: "Chat cleared. What would you like to create now?",
        timestamp: Date.now(),
      },
    ]);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-2">
        <h2 className="text-lg font-medium flex items-center">
          Chat
          {usingFreeAPI && (
            <span className="ml-2 text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Free API Mode</span>
          )}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSettings}
            title="AI Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clearChat}>
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
          onSave={saveApiKey}
          onClear={clearApiKey}
          onClose={toggleSettings}
          onSetFreeAPI={setFreeAPI}
        />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            <ChatInput onSendMessage={handleSendMessage} isProcessing={isProcessing} />
          </div>
        </>
      )}
    </div>
  );
}
