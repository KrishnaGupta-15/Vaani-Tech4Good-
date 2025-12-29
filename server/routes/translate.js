import express from "express";
import fetch from "node-fetch";
import { verifyToken } from "../config/firebase.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: "Text and targetLang required" });
    }

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );

    const data = await response.json();

    const translatedText = data[0][0][0];

    res.status(200).json({
      translatedText,
    });
  } catch (error) {
    console.error("Translate error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
