import express from 'express';
import { verifyToken } from '../config/firebase.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.json({ 
    message: 'Access Granted',
    user: req.user
  });
});

export default router;