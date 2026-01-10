import express from 'express';
import {GoogleGenAI} from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

import {firestore,verifyToken} from '../config/firebase.js';

const router = express.Router();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



router.post('/', verifyToken, async (req, res) => {
    try{
        console.log("Gemini request received");

        const {text,conversationId="default",lang="en"} =req.body;
        const userId = req.user;
        const conversationIdSafe = conversationId && conversationId.trim() ? conversationId : firestore.collection('dummy').doc().id;

        if(!text){
            return res.status(400).json({error: 'Text is required' });
        }
        if(!userId){
            return res.status(401).json({error: 'Unauthorized' });
        }
        if(!conversationId){
            return res.status(400).json({error: 'Conversation ID is required' });
        }
        const prompt =`
        
        Your tasks:
        1. Correct spelling and grammar
        2. Normalize Indian-English or informal phrases into standard , neutral english.
        
        Strict rules:
        -Preserve the original meaning exactly
        - Do not add new information
        -Do not remove information
        -Do not rephrase beyond what is neccessary for correctness
        -Do not change tone unless required for clarity
        -if a sentence is unclear, keep it as it as close to the original as possible
        - Do not change sentence structure unless grammatically incorrect
        - Do not replace words unless they are incorrect or informal
        Return only the refined response text.
        No explanations.No commentary.
        User input:
        "${text}"
        `;

        const response = await genAI.models.generateContent({
            model: "models/gemini-flash-latest",
            contents: [{role:"user",parts:[{text:prompt}]}],
        });

        const refinedText=
        response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        response?.text?.trim() ||
        "";

        console.log("userId:", userId);
        console.log("conversationIdSafe:", conversationIdSafe);
        console.log("text:", text);


        await firestore.collection("users").doc(userId)
        .collection("conversations").doc(conversationIdSafe)
        .collection("messages").add({
            originalText: text,
            refinedText,
            lang,
            timestamp: new Date(),
        });

        console.log("Message saved to Firestore:", userId);
        res.status(200).json({
            refinedText,
            conversationId
        });

        
    }catch(error){
        console.error("Gemini failed:", error.message);
        return res.status(500).json({
            error:"Gemini processing failed",
            fallbackText:text
        });
    }
});
export default router;