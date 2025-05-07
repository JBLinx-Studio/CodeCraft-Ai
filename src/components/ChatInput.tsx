
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

const ChatInput = ({ onSendMessage, disabled, isProcessing }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the web app you want to build..."
          className="min-h-[60px] flex-1 resize-none"
          disabled={disabled}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled}
          className="self-end"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};

export default ChatInput;
