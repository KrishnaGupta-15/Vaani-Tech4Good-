import express from 'express';
import {firestore,verifyToken} from '../config/firebase.js';

const router = express.Router();
router.delete('/:conversationId',verifyToken,async(req,res)=>{
    try{
        const userId=req.user;
        const {conversationId}=req.params;

        if(!userId){
            return res.status(401).json({error:'Unauthorized'});
        }
        if(!conversationId){
            return res.status(400).json({error:'Conversation ID is required'});
        }
        const messagesRef=firestore.collection("users").doc(userId)
        .collection("conversations").doc(conversationId)
        .collection("messages");

        const messagesSnapshot=await messagesRef.get();

        const batch=firestore.batch();
        messagesSnapshot.docs.forEach(doc=>{
            batch.delete(doc.ref);
        }
        );

        await batch.commit();
        res.status(200).json({message:'All messages deleted successfully'});
    }catch(error){
        console.error("Error deleting messages:",error);
        res.status(500).json({error:"Internal Server Error"});
    }
});
export default router;