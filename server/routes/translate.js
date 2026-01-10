// // import express from "express";
// // import { verifyToken } from "../config/firebase.js";

// // import { shouldBlock } from "../ai/safety/safetyFilter.js";
// // import { redactSensitive } from "../ai/safety/redactSensitive.js";

// // import { translateWithTone } from "../ai/translation/translateWithTone.js";
// // import { literalTranslate } from "../ai/translation/literalTranslate.js";

// // const router = express.Router();

// // router.post("/", verifyToken, async (req, res) => {
// //   const { text, sourceLang = "auto", targetLang } = req.body;

// //   if (!text || !targetLang) {
// //     return res.status(400).json({
// //       error: "Text and targetLang required",
// //     });
// //   }

// //   // Safety block
// //   if (shouldBlock(text)) {
// //     return res.status(400).json({
// //       error: "Sensitive or inappropriate content detected.",
// //     });
// //   }

// //   const safeText = redactSensitive(text);

// //   try {
// //     // Primary attempt (single Gemini call)
// //     const result = await translateWithTone(
// //       safeText,
// //       sourceLang,
// //       targetLang
// //     );

// //     // If model behaved correctly
// //     if (result?.translation) {
// //       return res.status(200).json({
// //         translatedText: result.translation,
// //         detectedTone: result.tone ?? "neutral",
// //         tonePreserved: result.tone_preserved ?? false,
// //       });
// //     }

// //     throw new Error("Invalid translation response");
// //   } catch (err) {
// //     console.error("Tone translation failed:", err.message);

// //     // Fallback: literal translation (only if needed)
// //     try {
// //       const fallback = await literalTranslate(
// //         safeText,
// //         sourceLang,
// //         targetLang
// //       );

// //       return res.status(200).json({
// //         translatedText: fallback,
// //         fallback: true,
// //       });
// //     } catch (fallbackErr) {
// //       console.error("Fallback translation failed:", fallbackErr.message);

// //       // Absolute fallback: return original text
// //       return res.status(200).json({
// //         translatedText: safeText,
// //         fallback: true,
// //         untranslated: true,
// //       });
// //     }
// //   }
// // });

// // export default router;

// import express from "express";
// import { verifyToken } from "../config/firebase.js";
// import { redactAndHash } from "../ai/safety/redactSensitive.js";
// import { translateWithTone } from "../ai/translation/translateWithTone.js";
// import { literalTranslate } from "../ai/translation/literalTranslate.js";

// const router = express.Router();

// router.post("/", verifyToken, async (req, res) => {
//   const { text, sourceLang = "auto", targetLang } = req.body;

//   if (!text || !targetLang) {
//     return res.status(400).json({ error: "Text and targetLang required" });
//   }

//   // ✅ Redact + hash sensitive info
//   const { uiText, aiText } = redactAndHash(text);

//   try {
//     // 🔹 Send hashed text to AI
//     const result = await translateWithTone(aiText, sourceLang, targetLang);

//     if (result?.translation) {
//       return res.status(200).json({
//         // 🔹 UI sees REDACTED text
//         displayText: uiText,
//         // 🔹 AI result
//         translatedText: result.translation,
//         detectedTone: result.tone ?? "neutral",
//         tonePreserved: result.tone_preserved ?? false,
//       });
//     }

//     throw new Error("Invalid translation response");
//   } catch (err) {
//     console.error("Tone translation failed:", err.message);

//     // Fallback
//     try {
//       const fallback = await literalTranslate(aiText, sourceLang, targetLang);

//       return res.status(200).json({
//         displayText: uiText,
//         translatedText: fallback,
//         fallback: true,
//       });
//     } catch (fallbackErr) {
//       console.error("Fallback translation failed:", fallbackErr.message);

//       return res.status(200).json({
//         displayText: uiText,
//         translatedText: uiText, // original redacted text
//         fallback: true,
//         untranslated: true,
//       });
//     }
//   }
// });

// export default router;

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
