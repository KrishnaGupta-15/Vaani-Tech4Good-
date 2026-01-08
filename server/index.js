import express from 'express';
import cors from 'cors';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4000;

app.use(express.json({limit:"10kb"}));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));



// import dbConnect from './config/database.js';
// dbConnect();

//Mount routes
import protectedRoutes from './routes/protected.js';
app.use('/api/protected', protectedRoutes);

import geminiRoutes from './routes/gemini.js';
app.use('/api/gemini', geminiRoutes);

import translateRoutes from './routes/translate.js';
app.use('/api/translate', translateRoutes);

import refineRoutes from './routes/refine.js';
app.use('/api/refine',refineRoutes);

import historyRoutes from './routes/history.js';
app.use('/api/history', historyRoutes);

import deleteAllHistoryRoutes from './routes/deleteAll.js';
app.use('/api/deleteAllHistory', deleteAllHistoryRoutes);

import deleteMessageRoutes from './routes/deleteMessage.js';
app.use('/api/deleteMessage', deleteMessageRoutes);

app.use((err,req,res,next)=>{
  console.error("Unhandled error:", err);
  res.status(500).json({error:"Internal server error"});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Vaani API');
});