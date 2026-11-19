import { Router } from 'express';
import { getFeed } from '../controllers/feedController.js';
import { handleSwipe } from '../controllers/swipeController.js';
import { getMatches, resetDemoState } from '../controllers/matchController.js';
import { getMessages, sendMessage } from '../controllers/chatController.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'coy-discover-api',
    demoUser: 'demo-user-1'
  });
});

// Core application endpoints
router.get('/feed', getFeed);
router.post('/swipe', handleSwipe);
router.get('/matches', getMatches);

// Chat & AI Bot endpoints
router.get('/matches/:matchId/messages', getMessages);
router.post('/matches/:matchId/messages', sendMessage);

// Evaluator demo reset endpoint
router.post('/reset', resetDemoState);

export default router;
