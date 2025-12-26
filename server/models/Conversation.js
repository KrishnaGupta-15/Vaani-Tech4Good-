const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    userId:String,
    originalText:String,
    translatedText:String,
    language:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
});
module.exports = mongoose.model('Conversation',ConversationSchema);