import express from 'express';
import multer from 'multer';
import {
  getAudioGuides,
  getAudioGuideById,
  getAudioGuidesByMonastery,
  getLocationBasedGuides,
  createAudioGuide,
  updateAudioGuide,
  deleteAudioGuide,
  processImageForAudio,
  rateAudioGuide,
  identifyLocationFromImage,
  getAudioGuidesByLocation
} from '../controllers/audioGuideController.js';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-guide-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();

// Public routes
router.get('/', getAudioGuides);
router.get('/location-based', getLocationBasedGuides);
router.get('/nearby', getAudioGuidesByLocation); // New location-based route
router.get('/:id', getAudioGuideById);
router.get('/monastery/:monasteryId', getAudioGuidesByMonastery);
router.post('/identify', upload.single('image'), identifyLocationFromImage); // New image recognition route
router.post('/process-image', processImageForAudio); // Deprecated - use /identify instead
router.post('/:id/rate', rateAudioGuide);

// Admin routes (would need auth middleware in production)
router.post('/', createAudioGuide);
router.put('/:id', updateAudioGuide);
router.delete('/:id', deleteAudioGuide);

export default router;