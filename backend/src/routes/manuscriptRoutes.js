import express from 'express';
import Manuscript from '../models/Manuscript.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/manuscripts/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
    }
  }
});

// Get all manuscripts
const getManuscripts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      language, 
      category,
      monastery 
    } = req.query;
    
    const query = { isPublic: true };
    
    if (language) query.availableLanguages = language;
    if (category) query.category = category;
    if (monastery) query.monastery = monastery;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const manuscripts = await Manuscript.find(query)
      .populate('monastery', 'name shortDescription')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Manuscript.countDocuments(query);

    res.status(200).json(new ApiResponse(200, {
      manuscripts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    }, 'Manuscripts retrieved successfully'));

  } catch (error) {
    next(error);
  }
};

// Get manuscript by ID
const getManuscriptById = async (req, res, next) => {
  try {
    const manuscript = await Manuscript.findById(req.params.id)
      .populate('monastery', 'name location shortDescription')
      .select('-__v');

    if (!manuscript) {
      throw new ApiError(404, 'Manuscript not found');
    }

    // Increment view count
    await Manuscript.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.status(200).json(new ApiResponse(200, manuscript, 'Manuscript retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Upload manuscript images
const uploadManuscriptImages = async (req, res, next) => {
  try {
    const { title, description, originalLanguage, monastery, category } = req.body;
    
    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, 'At least one image is required');
    }

    const images = req.files.map((file, index) => ({
      url: `/uploads/manuscripts/${file.filename}`,
      page: index + 1,
      caption: `Page ${index + 1}`
    }));

    const manuscript = new Manuscript({
      title,
      description,
      originalLanguage,
      monastery: monastery || null,
      category: category || 'religious',
      images,
      availableLanguages: [originalLanguage],
      digitization: {
        scanDate: new Date(),
        scannedBy: 'System',
        fileFormat: 'JPEG'
      }
    });

    await manuscript.save();

    const populatedManuscript = await Manuscript.findById(manuscript._id)
      .populate('monastery', 'name shortDescription');

    res.status(201).json(new ApiResponse(201, populatedManuscript, 'Manuscript uploaded successfully'));
  } catch (error) {
    next(error);
  }
};

// Request translation
const requestTranslation = async (req, res, next) => {
  try {
    const { manuscriptId, targetLanguage, sourceText } = req.body;
    
    // Mock translation service - in production, this would call an AI service
    const mockTranslation = {
      id: Date.now().toString(),
      status: 'processing',
      sourceLanguage: 'bo', // Tibetan
      targetLanguage,
      estimatedTime: '5-10 minutes',
      progress: 0
    };

    // Simulate processing delay
    setTimeout(async () => {
      try {
        const manuscript = await Manuscript.findById(manuscriptId);
        if (manuscript) {
          manuscript.translations.push({
            language: targetLanguage,
            text: `[Mock Translation] This is a translated version of the manuscript in ${targetLanguage}`,
            translatedBy: 'AI Translation Service',
            translationDate: new Date(),
            confidence: 0.85
          });
          
          if (!manuscript.availableLanguages.includes(targetLanguage)) {
            manuscript.availableLanguages.push(targetLanguage);
          }
          
          await manuscript.save();
        }
      } catch (error) {
        console.error('Translation processing error:', error);
      }
    }, 5000);

    res.status(202).json(new ApiResponse(202, mockTranslation, 'Translation request submitted'));
  } catch (error) {
    next(error);
  }
};

// Get translation status
const getTranslationStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    // Mock status response
    const status = {
      id: jobId,
      status: 'completed',
      progress: 100,
      result: 'Translation completed successfully'
    };

    res.status(200).json(new ApiResponse(200, status, 'Translation status retrieved'));
  } catch (error) {
    next(error);
  }
};

// Routes
router.get('/', getManuscripts);
router.get('/:id', getManuscriptById);
router.post('/upload', upload.array('images', 10), uploadManuscriptImages);
router.post('/translate', requestTranslation);
router.get('/translate/:jobId/status', getTranslationStatus);

export default router;