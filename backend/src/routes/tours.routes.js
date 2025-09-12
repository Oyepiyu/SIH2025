import { Router } from 'express';
import { listVirtualTours, getVirtualTour } from '../controllers/toursController.js';

const router = Router();

router.get('/', listVirtualTours); // GET /api/tours
router.get('/:id', getVirtualTour); // GET /api/tours/:id

export default router;
