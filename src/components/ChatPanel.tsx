
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Message } from "@/types";
import { useAI } from "@/hooks/use-ai";
import { toast } from "sonner";
import { ChatHeader, ChatMessages, ChatFooter } from "./chat";
import { useMessageHandler } from "@/hooks/use-message-handler";

export interface ChatPanelProps {
  onCodeGenerated: (html: string, css: string, js: string) => void;
}

export const ChatPanel = ({ onCodeGenerated }: ChatPanelProps) => {
  const { generateCode, isProcessing } = useAI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasAuthError, setHasAuthError] = useState(false);
  const { addMessage, handleMessageGeneration } = useMessageHandler(setMessages, generateCode, setHasAuthError, onCodeGenerated);

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

  const handleSendMessage = async (content: string) => {
    addMessage("user", content);
    
    if (isProcessing) {
      return;
    }
    
    // Check for API authentication issues before attempting to generate
    if (hasAuthError) {
      toast.error("API Authentication Error", {
        description: "Please configure your API key in settings to continue.",
        duration: 5000,
      });
      return;
    }
    
    await handleMessageGeneration(content);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatHeader />
      <ChatMessages messages={messages} />
      <ChatFooter onSendMessage={handleSendMessage} isProcessing={isProcessing} />
    </div>
  );
};

export default ChatPanel;
