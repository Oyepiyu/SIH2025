import { Router } from 'express';
import { listManuscripts, getManuscript, uploadManuscriptImage, requestTranslation, getTranslationJob } from '../controllers/manuscriptsController.js';

const router = Router();

router.get('/', listManuscripts); // GET /api/manuscripts
router.get('/:id', getManuscript); // GET /api/manuscripts/:id
router.post('/upload', uploadManuscriptImage); // POST /api/manuscripts/upload
router.post('/translate', requestTranslation); // POST /api/manuscripts/translate
router.get('/translate/job/:jobId', getTranslationJob); // GET /api/manuscripts/translate/job/:jobId

export default router;
