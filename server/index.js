import express from 'express';
import cors from 'cors';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}));



import dbConnect from './config/database.js';
dbConnect();

//Mount routes
import protectedRoutes from './routes/protected.js';
app.use('/api/protected', protectedRoutes);

import geminiRoutes from './routes/gemini.js';
app.use('/api/gemini', geminiRoutes);

import translateRoutes from './routes/translate.js';
app.use('/api/translate',translateRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Vaani API');
});