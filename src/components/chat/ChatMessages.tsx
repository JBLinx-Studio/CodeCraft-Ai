
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import ChatMessage from "../ChatMessage";
import { Message } from "@/types";

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <ScrollArea
      className={cn(
        "flex-1 p-4",
        "bg-gradient-to-b from-slate-50/80 to-white/80 dark:from-slate-950/80 dark:to-slate-900/80"
      )}
    >
      <div className="space-y-4 mb-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
