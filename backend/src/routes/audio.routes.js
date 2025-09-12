import { Router } from 'express';
import { listAudioGuides, getAudioGuide } from '../controllers/audioController.js';

const router = Router();

router.get('/', listAudioGuides); // GET /api/audio-guides
router.get('/:id', getAudioGuide); // GET /api/audio-guides/:id

export default router;
