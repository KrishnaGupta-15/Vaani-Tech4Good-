import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function runGemini(prompt) {
  const response = await genAI.models.generateContent({
    model: "models/gemini-flash-latest",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  return (
    response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
  );
}
