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

import {verifyToken} from './config/firebase.js';

app.get("/api/protected",verifyToken,(req,res)=>{
  res.json(
    {
      message:"Access granted",
      user:req.user
    }
  );
});

app.post("/api/gemini",verifyToken,(req,res)=>{
  res.json(
    {
      message:"Access granted",
      user:req.user.email
    }
  );
});

import dbConnect from './config/database.js';
dbConnect();
//Mount routes
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Vaani API');
});