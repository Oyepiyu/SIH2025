import { Router } from 'express';
import { getMapPoints } from '../controllers/mapsController.js';

const router = Router();

router.get('/points', getMapPoints); // GET /api/maps/points

export default router;
