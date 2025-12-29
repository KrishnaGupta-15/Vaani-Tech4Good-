import express from 'express';
import {firestore,verifyToken} from '../config/firebase.js';

const router = express.Router();

router.delete('/:conversationId/:messageId',verifyToken,async(req,res)=>{
    try{
        const userId=req.user;
        const {conversationId,messageId}=req.params;

        if(!userId){
            return res.status(401).json({error:'Unauthorized'});
        } 
        if(!conversationId){
            return res.status(400).json({error:'Conversation ID is required'});
        }
        if(!messageId){
            return res.status(400).json({error:'Message ID is required'});
        }

        const messageRef=firestore.collection("users").doc(userId)
        .collection("conversations").doc(conversationId)
        .collection("messages").doc(messageId);

        const messageDoc=await messageRef.get();

        if(!messageDoc.exists){
            return res.status(404).json({error:'Message not found'});
        }
        await messageRef.delete();
        res.status(200).json({message:'Message deleted successfully'});
    }catch(error){
        console.error("Error deleting message:",error);
        res.status(500).json({error:"Internal Server Error"});
    } 
});
export default router;