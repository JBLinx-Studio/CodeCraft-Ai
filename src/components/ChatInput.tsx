
import React, { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export default function ChatInput({ onSendMessage, isProcessing }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [typingIndicator, setTypingIndicator] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Simulate the AI thinking with a typing indicator when processing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isProcessing) {
      const thinkingStates = ["", ".", "..", "..."];
      let i = 0;
      interval = setInterval(() => {
        setTypingIndicator(thinkingStates[i]);
        i = (i + 1) % thinkingStates.length;
      }, 400);
    } else {
      setTypingIndicator("");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <Textarea
          placeholder={isProcessing ? "AI is thinking" + typingIndicator : "Ask me anything about web development..."}
          className={cn(
            "min-h-[100px] pr-10 resize-none overflow-auto",
            isProcessing && "bg-gray-50"
          )}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
        />
        <Button
          type="submit"
          size="icon"
          className={cn(
            "absolute bottom-2 right-2 rounded-full h-8 w-8",
            isProcessing ? "opacity-50 cursor-not-allowed bg-gray-400" : ""
          )}
          disabled={isProcessing || !message.trim()}
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground flex justify-between items-center">
        <span>{isProcessing ? 
          <span className="text-amber-600">AI is thinking{typingIndicator}</span> : 
          "Powered by AI • Ready"}</span>
        <span className="text-xs">
          {message.length > 0 ? `${message.length} characters` : ""}
        </span>
      </div>
    </form>
  );
}
