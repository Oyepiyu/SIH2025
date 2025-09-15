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

// Identify location from uploaded image
export const identifyLocationFromImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No image file provided');
    }

    const imagePath = req.file.path;
    
    // Mock image recognition - replace with actual AI service (Google Vision API, AWS Rekognition, etc.)
    const recognizedLocation = await mockImageRecognition(imagePath);
    
    if (!recognizedLocation) {
      return res.status(404).json(new ApiResponse(404, null, 'Could not identify location from image'));
    }

    // Find audio guide for recognized location
    const audioGuide = await AudioGuide.findOne({
      monastery: recognizedLocation.monasteryId,
      isActive: true
    }).populate('monastery', 'name location shortDescription images');

    if (!audioGuide) {
      // Create a mock audio guide response for demonstration
      const mockAudioResponse = {
        title: `Discover ${recognizedLocation.name}`,
        audioUrl: '/audio/rumtek-sample.mp3', // Use the sample audio file
        duration: 120, // 2 minutes
        description: `Learn about the rich history and cultural significance of ${recognizedLocation.name}, one of Sikkim's most important monasteries.`,
        language: 'en',
        monastery: {
          name: recognizedLocation.name,
          description: `A beautiful monastery in Sikkim with deep spiritual significance.`
        },
        recognizedLocation: recognizedLocation.name,
        confidence: recognizedLocation.confidence,
        isMockData: true
      };

      return res.status(200).json(new ApiResponse(200, mockAudioResponse, 'Location identified - sample audio provided'));
    }

    // Increment play count
    await AudioGuide.findByIdAndUpdate(audioGuide._id, { $inc: { playCount: 1 } });

    const responseData = {
      title: audioGuide.title,
      audioUrl: audioGuide.audioUrl,
      duration: audioGuide.duration,
      description: audioGuide.description,
      language: audioGuide.language,
      monastery: {
        name: audioGuide.monastery.name,
        description: audioGuide.monastery.shortDescription
      },
      recognizedLocation: recognizedLocation.name,
      confidence: recognizedLocation.confidence
    };

    res.status(200).json(new ApiResponse(200, responseData, 'Location identified and audio guide found'));
  } catch (error) {
    next(error);
  }
};

// Get audio guides by user location
export const getAudioGuidesByLocation = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000, language = 'en' } = req.query;

    if (!lat || !lng) {
      throw new ApiError(400, 'Latitude and longitude are required');
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new ApiError(400, 'Invalid latitude or longitude format');
    }

    // Find nearby monasteries using geospatial query
    const nearbyMonasteries = await Monastery.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: parseInt(radius)
        }
      }
    });

    if (nearbyMonasteries.length === 0) {
      return res.status(404).json(new ApiResponse(404, null, 'No monasteries found nearby'));
    }

    // Find audio guides for nearby monasteries
    const audioGuides = await AudioGuide.find({
      monastery: { $in: nearbyMonasteries.map(m => m._id) },
      language,
      isActive: true
    }).populate('monastery', 'name location shortDescription images');

    if (audioGuides.length === 0) {
      // Create a mock audio guide response for demonstration
      const nearestMonastery = nearbyMonasteries[0];
      const mockAudioResponse = {
        title: `Discover ${nearestMonastery.name}`,
        audioUrl: '/audio/rumtek-sample.mp3', // Use the sample audio file
        duration: 120, // 2 minutes
        description: `Learn about the rich history and cultural significance of ${nearestMonastery.name}, a beautiful monastery near your location.`,
        language: language,
        monastery: {
          name: nearestMonastery.name,
          description: nearestMonastery.shortDescription || `A beautiful monastery in Sikkim with deep spiritual significance.`,
          coordinates: nearestMonastery.location.coordinates
        },
        distance: Math.round(calculateDistance(latitude, longitude, nearestMonastery.location.coordinates[1], nearestMonastery.location.coordinates[0])),
        allNearbyGuides: 1,
        isMockData: true
      };

      return res.status(200).json(new ApiResponse(200, mockAudioResponse, 'Nearby monastery found - sample audio provided'));
    }

    // Get the closest audio guide
    const closestGuide = audioGuides[0];
    const monasteryCoords = closestGuide.monastery.location.coordinates;
    const distance = calculateDistance(latitude, longitude, monasteryCoords[1], monasteryCoords[0]);

    // Increment play count
    await AudioGuide.findByIdAndUpdate(closestGuide._id, { $inc: { playCount: 1 } });

    const responseData = {
      title: closestGuide.title,
      audioUrl: closestGuide.audioUrl,
      duration: closestGuide.duration,
      description: closestGuide.description,
      language: closestGuide.language,
      monastery: {
        name: closestGuide.monastery.name,
        description: closestGuide.monastery.shortDescription,
        coordinates: monasteryCoords
      },
      distance: Math.round(distance),
      allNearbyGuides: audioGuides.length
    };

    res.status(200).json(new ApiResponse(200, responseData, 'Location-based audio guide found'));
  } catch (error) {
    next(error);
  }
};

// Mock image recognition function - replace with actual AI service
const mockImageRecognition = async (imagePath) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Try to find a matching monastery in database
  const monasteries = await Monastery.find({});
  
  if (monasteries.length > 0) {
    const randomMonastery = monasteries[Math.floor(Math.random() * monasteries.length)];
    return {
      name: randomMonastery.name,
      monasteryId: randomMonastery._id,
      confidence: 0.85 + Math.random() * 0.1 // Random confidence between 0.85-0.95
    };
  }

  // Fallback mock results
  const mockResults = [
    { 
      name: 'Rumtek Monastery', 
      monasteryId: '507f1f77bcf86cd799439011',
      confidence: 0.89
    },
    { 
      name: 'Enchey Monastery', 
      monasteryId: '507f1f77bcf86cd799439012',
      confidence: 0.82
    },
    { 
      name: 'Tashiding Monastery', 
      monasteryId: '507f1f77bcf86cd799439013',
      confidence: 0.75
    }
  ];

  return mockResults[Math.floor(Math.random() * mockResults.length)];
};

// Distance calculation helper using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// Process image for audio guide (AI integration placeholder) - DEPRECATED, use identifyLocationFromImage instead
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