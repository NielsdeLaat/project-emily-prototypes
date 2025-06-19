import { Send, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleExampleQuestions: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onToggleExampleQuestions,
  onKeyPress,
}: ChatInputProps) => {
  return (
    <div className="pr-4 pl-4 bg-white border-t border-gray-200">
      <div className="flex space-x-2 p-4">
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type a message..."
          className="flex-1 rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
        />
        <Button
          onClick={onToggleExampleQuestions}
          variant="outline"
          size="icon"
          className="rounded-full border-gray-300 hover:bg-gray-50"
          title="Show example questions"
        >
          <Lightbulb className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          onClick={onSendMessage}
          className="rounded-full bg-emilyBlue hover:opacity-90 transition-all duration-200"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
