import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function translateWithTone(
  text,
  sourceLang,
  targetLang,
  retries = 2
) {
  const prompt = `
You are a multilingual translator.

Tasks:
1. Detect the tone of the input text.
2. Translate the text from ${sourceLang} to ${targetLang} while preserving the detected tone exactly.

Tone rules:
- If sarcastic, keep sarcasm (do not intensify or soften)
- If humorous, keep humor (do not intensify or soften)
- If neutral, stay neutral
- Do not add aggression or violence
- Do not moralize or lecture

Strict rules:
- Preserve original meaning exactly
- Do not add or remove information
- Do not explain anything

Return ONLY valid JSON (no markdown, no extra text):

{
  "tone": "neutral | sarcasm | humor | anger | sadness",
  "translation": "translated text",
  "tone_preserved": true
}

Text:
"${text}"
`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const raw =
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!raw) {
      throw new Error("Empty response from translation model");
    }

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    if (err?.status === 503 && retries > 0) {
      await sleep(800);
      return translateWithTone(text, sourceLang, targetLang, retries - 1);
    }

    return {
      tone: "neutral",
      translation: text,
      tone_preserved: false,
      fallback: true,
    };
  }
}
