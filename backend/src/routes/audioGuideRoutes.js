import express from 'express';
import {
  getAudioGuides,
  getAudioGuideById,
  getAudioGuidesByMonastery,
  getLocationBasedGuides,
  createAudioGuide,
  updateAudioGuide,
  deleteAudioGuide,
  processImageForAudio,
  rateAudioGuide
} from '../controllers/audioGuideController.js';

const router = express.Router();

// Public routes
router.get('/', getAudioGuides);
router.get('/location-based', getLocationBasedGuides);
router.get('/:id', getAudioGuideById);
router.get('/monastery/:monasteryId', getAudioGuidesByMonastery);
router.post('/process-image', processImageForAudio);
router.post('/:id/rate', rateAudioGuide);

// Admin routes (would need auth middleware in production)
router.post('/', createAudioGuide);
router.put('/:id', updateAudioGuide);
router.delete('/:id', deleteAudioGuide);

export default router;