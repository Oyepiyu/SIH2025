import express from 'express';
import {
  getVirtualTours,
  getVirtualTourById,
  getVirtualTourByMonastery,
  createVirtualTour,
  updateVirtualTour,
  deleteVirtualTour,
  getTourScenes,
  updateTourScene
} from '../controllers/virtualTourController.js';

const router = express.Router();

// Public routes
router.get('/', getVirtualTours);
router.get('/:id', getVirtualTourById);
router.get('/:id/scenes', getTourScenes);
router.get('/monastery/:monasteryId', getVirtualTourByMonastery);

// Admin routes (would need auth middleware in production)
router.post('/', createVirtualTour);
router.put('/:id', updateVirtualTour);
router.put('/:id/scenes/:sceneId', updateTourScene);
router.delete('/:id', deleteVirtualTour);

export default router;