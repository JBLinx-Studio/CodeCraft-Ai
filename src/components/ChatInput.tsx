
import React, { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, Sparkles, Loader2, LightbulbIcon, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

export default function ChatInput({ onSendMessage, isProcessing }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [typingIndicator, setTypingIndicator] = useState("");
  
  const suggestionPrompts = [
    "Create a landing page for a fitness app with a sign-up form",
    "Build a todo app with local storage support",
    "Design a responsive pricing table with three tiers",
    "Make an image gallery with thumbnails and a lightbox effect"
  ];
  
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
  
  const handleSuggestion = (suggestion: string) => {
    setMessage(suggestion);
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
      {!message && !isProcessing && (
        <div className="flex flex-wrap gap-2 mb-1">
          <p className="text-xs text-muted-foreground flex items-center mb-1 w-full">
            <LightbulbIcon className="h-3 w-3 mr-1 text-theme-yellow" />
            Try these example prompts:
          </p>
          {suggestionPrompts.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestion(prompt)}
              className="text-xs px-3 py-1.5 bg-glass bg-white/10 hover:bg-white/20 border border-white/30 text-primary/80 rounded-full transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      <div className="relative">
        <Textarea
          placeholder={isProcessing ? "AI is thinking" + typingIndicator : "Ask me anything about web development..."}
          className={cn(
            "min-h-[100px] pr-14 resize-none overflow-auto rounded-xl border-muted focus-visible:ring-1 focus-visible:ring-primary/50 glass",
            isProcessing && "bg-muted/30 text-muted-foreground"
          )}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className={cn(
                  "absolute bottom-3 right-3 rounded-full h-8 w-8 flex items-center justify-center transition-all",
                  isProcessing 
                    ? "bg-muted cursor-not-allowed" 
                    : message.trim() 
                      ? "bg-gradient-to-r from-theme-blue to-theme-purple hover:opacity-90 shadow-neon" 
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-xs text-muted-foreground flex justify-between items-center">
        <span className="flex items-center">
          {isProcessing ? 
            <span className="text-amber-600 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              AI is thinking<span className="thinking-dots"></span>
            </span> : 
            <span className="flex items-center gap-1">
              <Wand2 className="h-3 w-3 text-theme-purple animate-pulse-slow" /> 
              <span className="bg-gradient-to-r from-theme-purple to-theme-blue bg-clip-text text-transparent font-medium">Powered by AI</span> • Ready
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
