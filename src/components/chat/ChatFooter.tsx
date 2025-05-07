
import { cn } from "@/lib/utils";
import ChatInput from "../ChatInput";

interface ChatFooterProps {
  onSendMessage: (content: string) => void;
  isProcessing: boolean;
}

const ChatFooter = ({ onSendMessage, isProcessing }: ChatFooterProps) => {
  return (
    <div
      className={cn(
        "p-3 border-t border-slate-200/50 dark:border-slate-700/50",
        "bg-white/80 dark:bg-slate-900/90 backdrop-blur-md"
      )}
    >
      <ChatInput onSendMessage={onSendMessage} disabled={isProcessing} isProcessing={isProcessing} />
    </div>
  );
};

export default ChatFooter;
