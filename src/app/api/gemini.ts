import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "./prompts";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    candidateCount: 1,
    maxOutputTokens: 8192,
    temperature: 0.2,
  },
  systemInstruction: getSystemPrompt(),
});

export const codeIdentifierModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    candidateCount: 1,
    maxOutputTokens: 100,
    temperature: 0,
  },
  systemInstruction:
    "Return what framework you think the prompt is asking the project to be. Return in a single word in lower case. Do not return anything extra like blank spaces '\n'. dont write js for javascript libraries- nodejs should is returned as 'node' similar for other libraries.",
});
