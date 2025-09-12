import { Router } from 'express';
import placesRouter from './places.routes.js';
import toursRouter from './tours.routes.js';
import audioRouter from './audio.routes.js';
import mapsRouter from './maps.routes.js';
import manuscriptsRouter from './manuscripts.routes.js';
import { searchAll } from '../controllers/searchController.js';

const router = Router();

router.use('/places', placesRouter);
router.use('/tours', toursRouter);
router.use('/audio-guides', audioRouter);
router.use('/maps', mapsRouter);
router.use('/manuscripts', manuscriptsRouter);

router.get('/search', searchAll); // GET /api/search?type=places|tours|all&q=rumtek

export default router;
