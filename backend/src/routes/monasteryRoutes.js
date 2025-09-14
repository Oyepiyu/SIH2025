import express from 'express';
import {
  getMonasteries,
  getMonasteryById,
  createMonastery,
  updateMonastery,
  deleteMonastery,
  getNearbyMonasteries,
  getMonasteryStats
} from '../controllers/monasteryController.js';

const router = express.Router();

// Public routes
router.get('/', getMonasteries);
router.get('/stats', getMonasteryStats);
router.get('/nearby', getNearbyMonasteries);
router.get('/:id', getMonasteryById);

// Admin routes (would need auth middleware in production)
router.post('/', createMonastery);
router.put('/:id', updateMonastery);
router.delete('/:id', deleteMonastery);

export default router;