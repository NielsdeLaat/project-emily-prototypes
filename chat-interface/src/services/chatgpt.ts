import OpenAI from "openai";
import { PERSONA_PROMPTS } from "./personaPrompts";
import { API, ERROR_MESSAGES, UI } from "@/config/constants";
import type { ChatMessage } from "@/types/chat";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only use this in development
});

// Helper function to create system message
const createSystemMessage = (persona: string, isExampleQuestions = false) => {
  if (isExampleQuestions) {
    return {
      role: "system" as const,
      content: `You are an AI assistant helping to generate contextual follow-up questions for a conversation with ${persona}. 

Based on the conversation history, generate EXACTLY 3 relevant follow-up questions that would naturally continue the discussion. The questions should:

1. Be contextually relevant to what has been discussed
2. Show genuine interest and curiosity
3. Be in Dutch (since the conversation is in Dutch)
4. Be concise and conversational (keep each question under ${UI.MAX_QUESTION_LENGTH} characters)
5. Help deepen the conversation or explore new aspects

If this is the beginning of the conversation (only 1-2 messages), generate general questions that would help start a meaningful conversation with ${persona}.

IMPORTANT: Return exactly ${UI.MAX_EXAMPLE_QUESTIONS} questions, each on a separate line. Do not include any numbering, bullet points, or additional text. Just the ${UI.MAX_EXAMPLE_QUESTIONS} questions, one per line. NOT ONE QUESTION LESS

Example format:
Kun je me meer vertellen over je ervaringen?
Hoe voelde je je in die situatie?
Wat heeft je geholpen om door te gaan?`,
    };
  }

  return {
    role: "system" as const,
    content:
      PERSONA_PROMPTS[persona] ||
      `You are ${persona}, a character with a unique story and perspective. Respond in a way that reflects your character's personality and background. Keep responses concise and engaging.`,
  };
};

// Helper function to make API calls
const makeApiCall = async (
  messages: ChatMessage[],
  persona: string,
  isExampleQuestions = false
) => {
  const systemMessage = createSystemMessage(persona, isExampleQuestions);
  const config = isExampleQuestions
    ? {
        temperature: API.EXAMPLE_QUESTIONS_TEMPERATURE,
        max_tokens: API.EXAMPLE_QUESTIONS_MAX_TOKENS,
      }
    : {
        temperature: API.TEMPERATURE,
        max_tokens: API.MAX_TOKENS,
      };

  const response = await openai.chat.completions.create({
    model: API.MODEL,
    messages: [systemMessage, ...messages],
    ...config,
  });

  return response.choices[0]?.message?.content;
};

// Helper function to parse example questions
const parseExampleQuestions = (content: string): string[] => {
  if (!content) return [];

  // First attempt: split by newlines
  let questions = content
    .split("\n")
    .map((q) => q.trim())
    .filter((q) => q.length > 0 && !q.match(/^\d+\./) && !q.match(/^[-*•]/))
    .filter((q) => q.includes("?"))
    .slice(0, UI.MAX_EXAMPLE_QUESTIONS);

  // If we don't have enough questions, try splitting by other delimiters
  if (questions.length < UI.MAX_EXAMPLE_QUESTIONS) {
    const alternativeQuestions = content
      .split(/[.;]/)
      .map((q) => q.trim())
      .filter((q) => q.length > 0 && q.includes("?"))
      .slice(0, UI.MAX_EXAMPLE_QUESTIONS);

    if (alternativeQuestions.length > questions.length) {
      questions = alternativeQuestions;
    }
  }

  // If still not enough questions, try to extract questions more aggressively
  if (questions.length < UI.MAX_EXAMPLE_QUESTIONS) {
    const questionMatches = content.match(/[^.!?]*\?/g);
    if (questionMatches) {
      const extractedQuestions = questionMatches
        .map((q) => q.trim())
        .filter((q) => q.length > 0 && !q.match(/^\d+\./) && !q.match(/^[-*•]/))
        .slice(0, UI.MAX_EXAMPLE_QUESTIONS);

      if (extractedQuestions.length > questions.length) {
        questions = extractedQuestions;
      }
    }
  }

  return questions;
};

export async function generateChatGPTResponse(
  messages: ChatMessage[],
  persona: string
): Promise<string> {
  console.log(`[ChatGPT] Starting conversation with ${persona}`);

  try {
    const startTime = performance.now();
    const content = await makeApiCall(messages, persona, false);
    const endTime = performance.now();

    console.log(
      `[ChatGPT] Response received in ${(endTime - startTime).toFixed(2)}ms`
    );

    if (!content) {
      console.warn(`[ChatGPT] No content in response`);
      return ERROR_MESSAGES.NO_RESPONSE;
    }

    console.log(`[ChatGPT] Generated response:`, content);
    return content;
  } catch (error) {
    console.error("[ChatGPT] Error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return ERROR_MESSAGES.API_ERROR;
  }
}

export async function generateExampleQuestions(
  messages: ChatMessage[],
  persona: string
): Promise<string[]> {
  console.log(`[ChatGPT] Generating example questions for ${persona}`);

  try {
    const startTime = performance.now();
    const content = await makeApiCall(messages, persona, true);
    const endTime = performance.now();

    console.log(
      `[ChatGPT] Example questions received in ${(endTime - startTime).toFixed(
        2
      )}ms`
    );

    if (!content) {
      console.warn(`[ChatGPT] No content in example questions response`);
      return [];
    }

    const questions = parseExampleQuestions(content);
    console.log(`[ChatGPT] Generated example questions:`, questions);
    return questions;
  } catch (error) {
    console.error("[ChatGPT] Error generating example questions:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}
