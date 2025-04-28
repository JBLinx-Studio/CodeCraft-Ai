
import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        isUser ? "bg-secondary/50" : "bg-muted/50"
      )}
    >
      <Avatar className={cn("h-8 w-8", isUser ? "" : "bg-primary/20")}>
        <AvatarFallback className={isUser ? "bg-primary" : "bg-accent"}>
          {isUser ? "U" : "AI"}
        </AvatarFallback>
        {!isUser && (
          <AvatarImage src="/assets/assistant-avatar.png" alt="Assistant" />
        )}
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">
            {isUser ? "You" : "WebCraft AI"}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
