import express from 'express';
import {firestore,verifyToken} from '../config/firebase.js';

const router = express.Router();
router.get('/:conversationId',verifyToken,async(req,res)=>{
    try{
        const userId=req.user;
        const {conversationId}=req.params;

        if(!userId){
            return res.status(401).json({error:'Unauthorized'});
        }
        if(!conversationId){
            return res.status(400).json({error:'Conversation ID is required'});
        }

        const messagesSnapshot=await firestore.collection("users").doc(userId)
        .collection("conversations").doc(conversationId)
        .collection("messages")
        .orderBy("timestamp","asc")
        .get();

        const messages=messagesSnapshot.docs.map(doc=>({
            id:doc.id,...doc.data()}));
        res.status(200).json({messages});
    }catch(error){
        console.error("Error fetching conversation history:",error);
        res.status(500).json({error:"Internal Server Error"});
    }
})
export default router;