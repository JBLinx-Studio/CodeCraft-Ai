
import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied to your clipboard.",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl message-appear",
        isUser 
          ? "bg-primary/5 border border-primary/10 hover:border-primary/20 transition-all" 
          : "bg-card shadow-sm hover:shadow-md transition-all"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 rounded-full overflow-hidden border-2",
        isUser 
          ? "border-primary/30 bg-primary/5" 
          : "border-accent/30 bg-gradient-animation"
      )}>
        <AvatarFallback className={cn(
          "text-xs font-medium",
          isUser ? "text-primary" : "text-white"
        )}>
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </AvatarFallback>
        {!isUser && (
          <AvatarImage src="/assets/assistant-avatar.png" alt="Assistant" />
        )}
      </Avatar>
      <div className="flex-1 space-y-1.5 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-medium text-sm flex items-center gap-2",
            isUser ? "text-primary-foreground" : "text-foreground"
          )}>
            {isUser ? "You" : (
              <>
                <span>WebCraft AI</span>
                <div className="tag tag-purple text-[10px] py-0">Assistant</div>
              </>
            )}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-background hover:text-primary transition-opacity"
              onClick={copyText}
            >
              {copied ? (
                <CheckCheck className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
