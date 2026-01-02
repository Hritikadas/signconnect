import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
