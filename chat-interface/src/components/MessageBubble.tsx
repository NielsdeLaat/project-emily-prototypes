import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PERSONA_AVATARS } from "@/config/avatars";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  personaName?: string;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } items-end space-x-2`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={
              message.personaName
                ? PERSONA_AVATARS[message.personaName]
                : "/placeholder.svg"
            }
            alt="AI"
          />
          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
            AI
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isUser
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-white text-gray-800 shadow-sm"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? "text-purple-100" : "text-gray-500"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/user.jpg" alt="You" />
          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
            YU
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
