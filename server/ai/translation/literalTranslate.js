import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function literalTranslate(text, sourceLang, targetLang) {
  try {
    const response = await genAI.models.generateContent({
      model: "models/gemini-flash-latest",
      contents: [{
        role: "user",
        parts: [{
          text: `Translate from ${sourceLang} to ${targetLang}. Preserve meaning exactly.\n\nText:\n"${text}"`
        }],
      }],
    });

    return response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;
  } catch {
    return text;
  }
}
