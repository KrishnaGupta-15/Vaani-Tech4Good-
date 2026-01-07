import {genAI,baseConfig} from "../clients/geminiClient.js";



export async function refineText(text){
    const systemPrompt =`
    You are a text refinement assistant.

    Your tasks:
    1. Correct spelling and grammar.
    2. Normalize informal or Indian-English phrases into standard, neutral English.

    STRICT rules:
    - Preserve original meaning EXACTLY
    - Preserve original tone (including sarcasm or humor)
    - Do NOT add or remove information
    - Do NOT rephrase unless grammatically required
    - Do NOT simplify sarcasm or jokes
    - If unclear, keep as close to original as possible

    Return ONLY the refined text.
    No explanations.

    Text:
    "${text}"
    `;

   const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  const output =
    response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!output) {
    throw new Error("Empty Gemini response in refineText");
  }

  return output;
}   