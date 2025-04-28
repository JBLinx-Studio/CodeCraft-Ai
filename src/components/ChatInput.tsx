
import { useState, FormEvent } from "react";
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <Textarea
          placeholder="Describe the web app you want to create..."
          className="min-h-[100px] pr-10 resize-none overflow-auto"
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
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
          disabled={isProcessing || !message.trim()}
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Powered by Hugging Face Inference API • Free to use
      </div>
    </form>
  );
}
