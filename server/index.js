import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import setupSocket from './socket.js';

const app = express();
const server = createServer(app);

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

// Configure CORS for both Express and Socket.io
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow any localhost origin (5173, 5174, etc.)
    if (origin.startsWith('http://localhost')) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST"]
};

app.use(cors(corsOptions));

// Initialize Socket.io
const io = new Server(server, {
  cors: corsOptions
});

// Setup Socket Logic
setupSocket(io);

app.use(express.json({ limit: "10kb" }));

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
app.use('/api/refine', refineRoutes);

import historyRoutes from './routes/history.js';
app.use('/api/history', historyRoutes);

import deleteAllHistoryRoutes from './routes/deleteAll.js';
app.use('/api/deleteAllHistory', deleteAllHistoryRoutes);

import deleteMessageRoutes from './routes/deleteMessage.js';
app.use('/api/deleteMessage', deleteMessageRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Vaani API');
});