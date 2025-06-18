import OpenAI from "openai";
import { PERSONA_PROMPTS } from "./personaPrompts";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only use this in development
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatGPTResponse(
  messages: ChatMessage[],
  persona: string
): Promise<string> {
  console.log(`[ChatGPT] Starting conversation with ${persona}`);
  console.log(`[ChatGPT] Message history:`, messages);

  try {
    const systemMessage = {
      role: "system" as const,
      content:
        PERSONA_PROMPTS[persona] ||
        `You are ${persona}, a character with a unique story and perspective. Respond in a way that reflects your character's personality and background. Keep responses concise and engaging.`,
    };

    console.log(`[ChatGPT] System message:`, systemMessage);

    console.log(`[ChatGPT] Sending request to OpenAI API...`);
    const startTime = performance.now();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 150,
    });

    const endTime = performance.now();
    console.log(
      `[ChatGPT] Response received in ${(endTime - startTime).toFixed(2)}ms`
    );
    console.log(`[ChatGPT] Raw response:`, response);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.warn(`[ChatGPT] No content in response:`, response);
      return "I'm not sure how to respond to that.";
    }

    console.log(`[ChatGPT] Generated response:`, content);
    return content;
  } catch (error) {
    console.error("[ChatGPT] Error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return "I'm having trouble connecting right now. Please try again later.";
  }
}

export async function generateExampleQuestions(
  messages: ChatMessage[],
  persona: string
): Promise<string[]> {
  console.log(`[ChatGPT] Generating example questions for ${persona}`);
  console.log(`[ChatGPT] Message history:`, messages);

  try {
    const systemMessage = {
      role: "system" as const,
      content: `You are an AI assistant helping to generate contextual follow-up questions for a conversation with ${persona}. 

Based on the conversation history, generate EXACTLY 3 relevant follow-up questions that would naturally continue the discussion. The questions should:

1. Be contextually relevant to what has been discussed
2. Show genuine interest and curiosity
3. Be in Dutch (since the conversation is in Dutch)
4. Be concise and conversational (keep each question under 40 characters)
5. Help deepen the conversation or explore new aspects

If this is the beginning of the conversation (only 1-2 messages), generate general questions that would help start a meaningful conversation with ${persona}.

IMPORTANT: Return exactly 3 questions, each on a separate line. Do not include any numbering, bullet points, or additional text. Just the 3 questions, one per line. NOT ONE QUESTION LESS

Example format:
Kun je me meer vertellen over je ervaringen?
Hoe voelde je je in die situatie?
Wat heeft je geholpen om door te gaan?`,
    };

    console.log(`[ChatGPT] Sending request for example questions...`);
    const startTime = performance.now();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...messages],
      temperature: 0.8,
      max_tokens: 300,
    });

    const endTime = performance.now();
    console.log(
      `[ChatGPT] Example questions received in ${(endTime - startTime).toFixed(
        2
      )}ms`
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.warn(
        `[ChatGPT] No content in example questions response:`,
        response
      );
      return [];
    }

    // Parse the questions from the response
    let questions = content
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0 && !q.match(/^\d+\./) && !q.match(/^[-*•]/)) // Remove numbering and bullet points
      .filter((q) => q.includes("?")) // Keep lines that contain question marks (more flexible)
      .slice(0, 3); // Take only first 3 questions

    // If we don't have 3 questions, try splitting by other delimiters
    if (questions.length < 3) {
      const alternativeQuestions = content
        .split(/[.;]/)
        .map((q) => q.trim())
        .filter((q) => q.length > 0 && q.includes("?"))
        .slice(0, 3);

      if (alternativeQuestions.length > questions.length) {
        questions = alternativeQuestions;
      }
    }

    // If still not enough questions, try to extract questions from the content more aggressively
    if (questions.length < 3) {
      const questionMatches = content.match(/[^.!?]*\?/g);
      if (questionMatches) {
        const extractedQuestions = questionMatches
          .map((q) => q.trim())
          .filter(
            (q) => q.length > 0 && !q.match(/^\d+\./) && !q.match(/^[-*•]/)
          )
          .slice(0, 3);

        if (extractedQuestions.length > questions.length) {
          questions = extractedQuestions;
        }
      }
    }

    console.log(`[ChatGPT] Generated example questions:`, questions);
    console.log(`[ChatGPT] Raw content:`, content);
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
