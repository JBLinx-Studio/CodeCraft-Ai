
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

interface ChatPanelProps {
  onCodeGenerated: (html: string, css: string, js: string) => void;
}

export default function ChatPanel({ onCodeGenerated }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      role: "assistant",
      content: "Hello! I'm WebCraft AI. Describe the web application you want to create and I'll help you build it. You can ask for specific features, layouts, or functionality.",
      timestamp: Date.now(),
    },
  ]);
  
  const { generateCode, isProcessing } = useAI();
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
    
    try {
      const response = await generateCode(content);
      
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
      onCodeGenerated(html, css, js);
      
      let responseMessage = "I've created a web app based on your description.";
      if (response.explanation) {
        responseMessage += `\n\n${response.explanation}`;
      }
      
      addMessage("assistant", responseMessage);
    } catch (error) {
      console.error("Error generating code:", error);
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-2">
        <h2 className="text-lg font-medium">Chat</h2>
        <Button variant="ghost" size="sm" onClick={clearChat}>
          Clear
        </Button>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <ChatInput onSendMessage={handleSendMessage} isProcessing={isProcessing} />
      </div>
    </div>
  );
}
