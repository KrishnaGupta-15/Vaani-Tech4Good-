import express from "express";
import { verifyToken } from "../config/firebase.js";

import { shouldBlock } from "../ai/safety/safetyFilter.js";
import { redactSensitive } from "../ai/safety/redactSensitive.js";
import { refineText } from "../ai/refinement/refineText.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "text is required" });
    }

    if (shouldBlock(text)) {
      return res.status(400).json({
        error: "Sensitive or restricted data cannot be refined",
      });
    }

    const safeText = redactSensitive(text);
    const refinedText = await refineText(safeText);

    res.status(200).json({ refinedText });

  } catch (error) {
    console.error("Refine error:", error);
    res.status(500).json({ error: "Refinement failed safely" });
  }
});

export default router;
