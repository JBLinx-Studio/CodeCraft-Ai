
import React, { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, Sparkles, Loader2 } from "lucide-react";
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
            "min-h-[100px] pr-14 resize-none overflow-auto rounded-xl border-muted focus-visible:ring-1 focus-visible:ring-primary/50",
            isProcessing && "bg-muted/30 text-muted-foreground"
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
            "absolute bottom-3 right-3 rounded-full h-8 w-8 flex items-center justify-center transition-all",
            isProcessing 
              ? "bg-muted cursor-not-allowed" 
              : message.trim() 
                ? "bg-primary hover:bg-primary/90" 
                : "bg-primary/60 cursor-not-allowed"
          )}
          disabled={isProcessing || !message.trim()}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="text-xs text-muted-foreground flex justify-between items-center">
        <span className="flex items-center">
          {isProcessing ? 
            <span className="text-amber-600 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              AI is thinking<span className="thinking-dots"></span>
            </span> : 
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> 
              Powered by AI • Ready
            </span>
          }
        </span>
        <span className="text-xs">
          {message.length > 0 ? `${message.length} characters` : ""}
        </span>
      </div>
    </form>
  );
}
