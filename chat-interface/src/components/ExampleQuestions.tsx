import { Lightbulb } from "lucide-react";
import {
  ANIMATION_DELAYS,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
  UI,
} from "@/config/constants";

interface ExampleQuestionsProps {
  showExampleQuestions: boolean;
  isClosing: boolean;
  isLoadingQuestions: boolean;
  questionsError: boolean;
  exampleQuestions: string[];
  onQuestionClick: (question: string) => void;
}

const ExampleQuestions = ({
  showExampleQuestions,
  isClosing,
  isLoadingQuestions,
  questionsError,
  exampleQuestions,
  onQuestionClick,
}: ExampleQuestionsProps) => {
  if (!showExampleQuestions) return null;

  return (
    <div
      className={`border-t border-gray-200 bg-white z-20 ${
        isClosing ? "closing-animation" : ""
      }`}
      style={{
        animation: isClosing
          ? "slideUpFadeOut 0.3s ease-in forwards"
          : "slideDownFadeIn 0.3s ease-out forwards",
      }}
    >
      <div className="p-4 pb-6">
        <div className="flex flex-col gap-2 w-full">
          <p className="text-sm text-gray-600 mb-2 font-medium flex items-center">
            <Lightbulb className="h-4 w-4 mr-1 text-gray-500" />
            Voorbeeld vragen:
          </p>
          {isLoadingQuestions ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <span className="text-sm">
                {LOADING_MESSAGES.QUESTIONS_LOADING}
              </span>
            </div>
          ) : questionsError ? (
            <div className="text-gray-500 text-sm">
              {ERROR_MESSAGES.EXAMPLE_QUESTIONS_UNAVAILABLE}
            </div>
          ) : (
            exampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => onQuestionClick(question)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200 text-gray-700 break-words text-balance w-full shadow-sm"
                style={{
                  animation: isClosing
                    ? `slideOutToRight 0.3s ease-in ${
                        (exampleQuestions.length - 1 - index) *
                        ANIMATION_DELAYS.EXAMPLE_QUESTION_STAGGER
                      }s forwards`
                    : `slideInFromLeft 0.4s ease-out ${
                        index * ANIMATION_DELAYS.EXAMPLE_QUESTION_STAGGER
                      }s forwards`,
                  opacity: isClosing ? 1 : 0,
                  transform: isClosing ? "translateX(0)" : "translateX(-10px)",
                }}
              >
                {question}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExampleQuestions;
