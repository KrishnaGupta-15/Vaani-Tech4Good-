
import express from "express";
import { runGemini } from "../utils/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
Fix grammar, spelling, and clarity.
Keep meaning unchanged.
Use simple Indian English.

Text:
"${text}"
`;

    const refinedText = await runGemini(prompt);
    res.json({ refinedText });
  } catch (err) {
    res.status(500).json({ error: "Refinement failed" });
  }
});

export default router;
