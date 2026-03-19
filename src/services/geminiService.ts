import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateQuestions = async (
  count: number = 5,
  difficulty: string = "Intermediate"
): Promise<Question[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} English grammar multiple-choice questions for ${difficulty} level. 
    Each question should have 4 options, a correct answer, and a brief explanation.
    Categories can include Tenses, Articles, Prepositions, Subject-Verb Agreement, etc.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.STRING },
          },
          required: ["id", "text", "options", "correctAnswer", "explanation", "category", "difficulty"],
        },
      },
    },
  });

  try {
    const questions = JSON.parse(response.text || "[]");
    return questions;
  } catch (error) {
    console.error("Failed to parse questions:", error);
    return [];
  }
};
