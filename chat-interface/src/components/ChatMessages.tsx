import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PERSONA_AVATARS } from "@/config/avatars";
import { ANIMATION_DELAYS } from "@/config/constants";
import MessageBubble from "./MessageBubble";
import type { Message } from "@/types/chat";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  personaName: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages = ({
  messages,
  isTyping,
  personaName,
  messagesEndRef,
}: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping && (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={PERSONA_AVATARS[personaName]} alt={personaName} />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
              {personaName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: ANIMATION_DELAYS.TYPING_DOT_2 }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: ANIMATION_DELAYS.TYPING_DOT_3 }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
