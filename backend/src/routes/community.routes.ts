import { Router } from 'express';
import { CommunityController } from '../controllers/community.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public community routes
router.get('/leaderboard', CommunityController.getLeaderboard);
router.get('/feed', CommunityController.getCommunityFeed);
router.get('/stats', CommunityController.getCommunityStats);
router.get('/insights', CommunityController.getTraderInsights);

// Protected community routes
router.post('/posts', authMiddleware, CommunityController.createPost);

export default router;
