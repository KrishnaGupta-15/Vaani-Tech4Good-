import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

(async () => {
  console.log("Available models:\n");

  const models = await genAI.models.list();

  for await (const model of models) {
    console.log(
      model.name,
      "→ supports:",
      model.supportedGenerationMethods
    );
  }
})();
