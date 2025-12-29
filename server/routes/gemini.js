import express from 'express';
import {GoogleGenAI} from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

import {verifyToken} from '../config/firebase.js';

const router = express.Router();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



router.post('/', verifyToken, async (req, res) => {
    try{
        console.log("Gemini request received");

        const {text} =req.body;
        if(!text){
            return res.status(400).json({error: 'Text is required' });
        }

        const prompt =`
        
        Your tasks:
        1. Correct spelling and grammar
        2. Normalize Indian-English or informal phrases

        Return only the refined response text without additional commentary.
        User input:
        "${text}"
        `;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.status(200).json({
            refinedText: response.text
        });
    }catch(error){
        console.error('Error generating text:', error);
        res.status(500).json({ error: 'IFailed to generate text using Gemini AI'
        });
    }
});
export default router;