import express from "express";
import axios from "axios";
import { verifyToken } from "../config/firebase.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
    const { text, targetLang } = req.body;

    const response = await axios.post(
       "https://libretranslate.de/translate",
       {
         q: text,
         source: "auto",
         target: targetLang,
         format: "text"
       }
     );

     res.json({ translatedText: response.data.translatedText });
});

export default router;
