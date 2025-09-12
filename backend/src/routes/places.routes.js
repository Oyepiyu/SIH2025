import { Router } from 'express';
import { listPlaces, getPlace, createPlace } from '../controllers/placesController.js';

const router = Router();

router.get('/', listPlaces); // GET /api/places
router.post('/', createPlace); // POST /api/places
router.get('/:id', getPlace); // GET /api/places/:id

export default router;

