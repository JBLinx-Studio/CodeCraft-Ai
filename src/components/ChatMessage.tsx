
import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl message-appear",
        isUser ? "bg-primary/5 border border-primary/10" : "bg-card shadow-sm"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 rounded-full overflow-hidden border-2",
        isUser ? "border-primary/30 bg-primary/5" : "border-accent/30 bg-accent/5"
      )}>
        <AvatarFallback className={cn(
          "text-xs font-medium",
          isUser ? "text-primary" : "text-accent"
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
            "font-medium text-sm",
            isUser ? "text-primary-foreground" : "text-foreground"
          )}>
            {isUser ? "You" : "WebCraft AI"}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
