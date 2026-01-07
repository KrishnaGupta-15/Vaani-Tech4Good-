import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function literalTranslate(text, sourceLang, targetLang) {
  const prompt = `
Translate the following text from ${sourceLang} to ${targetLang}.
Preserve meaning exactly.
Do not add explanations.

Text:
"${text}"
`;

  const response = await genAI.models.generateContent({
    model: "gemini-12.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  return (
    response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    text
  );
}
