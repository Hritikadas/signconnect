import express from 'express';
import { createRoom, getRoomHistory, getRoomMessages } from '../controllers/roomController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/create', protect, createRoom);
router.get('/history', protect, getRoomHistory);
router.get('/:roomId/messages', protect, getRoomMessages);

export default router;
