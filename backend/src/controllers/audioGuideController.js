import AudioGuide from '../models/AudioGuide.js';
import Monastery from '../models/Monastery.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// Get all audio guides
export const getAudioGuides = async (req, res, next) => {
  try {
    const { 
      monastery, 
      language = 'en', 
      category,
      page = 1, 
      limit = 10 
    } = req.query;
    
    const query = { isActive: true };
    
    if (monastery) query.monastery = monastery;
    if (language) query.language = language;
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const guides = await AudioGuide.find(query)
      .populate('monastery', 'name shortDescription images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await AudioGuide.countDocuments(query);

    res.status(200).json(new ApiResponse(200, {
      guides,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    }, 'Audio guides retrieved successfully'));

  } catch (error) {
    next(error);
  }
};

// Get audio guide by ID
export const getAudioGuideById = async (req, res, next) => {
  try {
    const guide = await AudioGuide.findById(req.params.id)
      .populate('monastery', 'name location shortDescription images')
      .select('-__v');

    if (!guide) {
      throw new ApiError(404, 'Audio guide not found');
    }

    // Increment play count
    await AudioGuide.findByIdAndUpdate(req.params.id, { $inc: { playCount: 1 } });

    res.status(200).json(new ApiResponse(200, guide, 'Audio guide retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Get audio guides by monastery
export const getAudioGuidesByMonastery = async (req, res, next) => {
  try {
    const { language = 'en' } = req.query;
    
    const guides = await AudioGuide.find({
      monastery: req.params.monasteryId,
      language,
      isActive: true
    })
    .populate('monastery', 'name shortDescription')
    .select('-__v');

    res.status(200).json(new ApiResponse(200, guides, 'Audio guides retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Get location-based audio guides
export const getLocationBasedGuides = async (req, res, next) => {
  try {
    const { longitude, latitude, radius = 100 } = req.query;

    if (!longitude || !latitude) {
      throw new ApiError(400, 'Longitude and latitude are required');
    }

    const guides = await AudioGuide.find({
      isActive: true,
      category: 'location-based',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    })
    .populate('monastery', 'name shortDescription')
    .select('-__v');

    res.status(200).json(new ApiResponse(200, guides, 'Location-based audio guides retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Create audio guide (Admin only)
export const createAudioGuide = async (req, res, next) => {
  try {
    const { monastery: monasteryId } = req.body;

    if (monasteryId) {
      // Check if monastery exists
      const monastery = await Monastery.findById(monasteryId);
      if (!monastery) {
        throw new ApiError(404, 'Monastery not found');
      }
    }

    const guide = new AudioGuide(req.body);
    await guide.save();

    // Update monastery to indicate audio guide is available
    if (monasteryId) {
      await Monastery.findByIdAndUpdate(monasteryId, { audioGuideAvailable: true });
    }

    const populatedGuide = await AudioGuide.findById(guide._id)
      .populate('monastery', 'name shortDescription')
      .select('-__v');

    res.status(201).json(new ApiResponse(201, populatedGuide, 'Audio guide created successfully'));
  } catch (error) {
    next(error);
  }
};

// Update audio guide (Admin only)
export const updateAudioGuide = async (req, res, next) => {
  try {
    const guide = await AudioGuide.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('monastery', 'name shortDescription')
    .select('-__v');

    if (!guide) {
      throw new ApiError(404, 'Audio guide not found');
    }

    res.status(200).json(new ApiResponse(200, guide, 'Audio guide updated successfully'));
  } catch (error) {
    next(error);
  }
};

// Delete audio guide (Admin only)
export const deleteAudioGuide = async (req, res, next) => {
  try {
    const guide = await AudioGuide.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!guide) {
      throw new ApiError(404, 'Audio guide not found');
    }

    res.status(200).json(new ApiResponse(200, null, 'Audio guide deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// Process image for audio guide (AI integration placeholder)
export const processImageForAudio = async (req, res, next) => {
  try {
    // This would integrate with AI service for image recognition
    // For now, return a mock response
    const mockResponse = {
      recognized: true,
      location: 'Rumtek Monastery Main Hall',
      confidence: 0.85,
      audioGuides: [
        {
          _id: '507f1f77bcf86cd799439011',
          title: 'History of Rumtek Monastery',
          duration: 180
        }
      ]
    };

    res.status(200).json(new ApiResponse(200, mockResponse, 'Image processed successfully'));
  } catch (error) {
    next(error);
  }
};

// Rate audio guide
export const rateAudioGuide = async (req, res, next) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      throw new ApiError(400, 'Rating must be between 1 and 5');
    }

    const guide = await AudioGuide.findById(req.params.id);
    if (!guide) {
      throw new ApiError(404, 'Audio guide not found');
    }

    // Calculate new average rating
    const newCount = guide.rating.count + 1;
    const newAverage = ((guide.rating.average * guide.rating.count) + rating) / newCount;

    guide.rating = {
      average: Math.round(newAverage * 10) / 10, // Round to 1 decimal place
      count: newCount
    };

    await guide.save();

    res.status(200).json(new ApiResponse(200, {
      rating: guide.rating
    }, 'Rating submitted successfully'));
  } catch (error) {
    next(error);
  }
};