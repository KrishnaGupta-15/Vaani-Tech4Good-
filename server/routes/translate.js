
import express from "express";
import { runGemini } from "../utils/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: "Missing text or targetLang" });
    }

    const prompt = `
Translate the following text to ${targetLang}.
Return ONLY the translated text. No explanation.

Text:
"${text}"
`;

    const translatedText = await runGemini(prompt);

    res.json({ translatedText });
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
