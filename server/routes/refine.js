// import express from "express";
// import { verifyToken } from "../config/firebase.js";

// import { redactAndHash } from "../ai/safety/redactSensitive.js";
// import { refineText } from "../ai/refinement/refineText.js";

// const router = express.Router();

// router.post("/", verifyToken, async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ error: "text is required" });
//     }

//     const {uiText,aiText} = redactAndHash(text);
//     const refinedText = await refineText(aiText);

//     res.status(200).json({ 
//       displayedText:uiText,
//       refinedText });

//   } catch (error) {
//     console.error("Refine error:", error);
//     res.status(500).json({ error: "Refinement failed safely" });
//   }
// });

// export default router;



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
