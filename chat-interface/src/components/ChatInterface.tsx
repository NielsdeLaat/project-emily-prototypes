import { useRef } from "react";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ExampleQuestions from "./ExampleQuestions";
import CallInterface from "./CallInterface";
import type { Persona } from "@/types/chat";

interface ChatInterfaceProps {
  persona: Persona;
  onBack: () => void;
}

const ChatInterface = ({ persona, onBack }: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    // State
    messages,
    inputValue,
    isTyping,
    isInCall,
    showExampleQuestions,
    isClosing,
    exampleQuestions,
    isLoadingQuestions,
    questionsError,
    // Actions
    sendMessage,
    setInputValue,
    toggleExampleQuestions,
    selectExampleQuestion,
    startCall,
    endCall,
  } = useChat(persona);

  const handleSendMessage = () => {
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Show call interface if in call
  if (isInCall) {
    return <CallInterface onEndCall={endCall} />;
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <ChatHeader persona={persona} onBack={onBack} onCall={startCall} />

      <ChatMessages
        messages={messages}
        isTyping={isTyping}
        personaName={persona.name}
        messagesEndRef={messagesEndRef}
      />

      <ExampleQuestions
        showExampleQuestions={showExampleQuestions}
        isClosing={isClosing}
        isLoadingQuestions={isLoadingQuestions}
        questionsError={questionsError}
        exampleQuestions={exampleQuestions}
        onQuestionClick={selectExampleQuestion}
      />

      <ChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onToggleExampleQuestions={toggleExampleQuestions}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatInterface;
