import { getChatHistory, sendMessage } from '../controllers/chat';
import express from 'express';

const router = express.Router();

router.get('/history', getChatHistory);
router.post('/send', sendMessage);

export default router;
