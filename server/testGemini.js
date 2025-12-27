
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateText() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",  // example
    contents: "why gemini is the best ai model in 3 words?",
  });
  console.log(response.text);
}

generateText();
