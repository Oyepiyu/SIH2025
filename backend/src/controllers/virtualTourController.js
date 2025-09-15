import VirtualTour from '../models/VirtualTour.js';
import Monastery from '../models/Monastery.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// Get all virtual tours
export const getVirtualTours = async (req, res, next) => {
  try {
    const { monastery, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    if (monastery) query.monastery = monastery;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tours = await VirtualTour.find(query)
      .populate('monastery', 'name shortDescription mainImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await VirtualTour.countDocuments(query);

    res.status(200).json(new ApiResponse(200, {
      tours,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    }, 'Virtual tours retrieved successfully'));

  } catch (error) {
    next(error);
  }
};

// Get virtual tour by ID
export const getVirtualTourById = async (req, res, next) => {
  try {
    const tour = await VirtualTour.findById(req.params.id)
      .populate('monastery', 'name location shortDescription images')
      .select('-__v');

    if (!tour) {
      throw new ApiError(404, 'Virtual tour not found');
    }

    // Increment view count
    await VirtualTour.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json(new ApiResponse(200, tour, 'Virtual tour retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Get virtual tour by monastery ID
export const getVirtualTourByMonastery = async (req, res, next) => {
  try {
    const tour = await VirtualTour.findOne({ 
      monastery: req.params.monasteryId, 
      isActive: true 
    })
    .populate('monastery', 'name location shortDescription images')
    .select('-__v');

    if (!tour) {
      throw new ApiError(404, 'Virtual tour not found for this monastery');
    }

    // Increment view count
    await VirtualTour.findByIdAndUpdate(tour._id, { $inc: { views: 1 } });

    res.status(200).json(new ApiResponse(200, tour, 'Virtual tour retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Create virtual tour (Admin only)
export const createVirtualTour = async (req, res, next) => {
  try {
    const { monastery: monasteryId } = req.body;

    // Check if monastery exists
    const monastery = await Monastery.findById(monasteryId);
    if (!monastery) {
      throw new ApiError(404, 'Monastery not found');
    }

    // Check if virtual tour already exists for this monastery
    const existingTour = await VirtualTour.findOne({ monastery: monasteryId, isActive: true });
    if (existingTour) {
      throw new ApiError(400, 'Virtual tour already exists for this monastery');
    }

    const tour = new VirtualTour(req.body);
    await tour.save();

    // Update monastery to indicate virtual tour is available
    await Monastery.findByIdAndUpdate(monasteryId, { virtualTourAvailable: true });

    const populatedTour = await VirtualTour.findById(tour._id)
      .populate('monastery', 'name shortDescription')
      .select('-__v');

    res.status(201).json(new ApiResponse(201, populatedTour, 'Virtual tour created successfully'));
  } catch (error) {
    next(error);
  }
};

// Update virtual tour (Admin only)
export const updateVirtualTour = async (req, res, next) => {
  try {
    const tour = await VirtualTour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('monastery', 'name shortDescription')
    .select('-__v');

    if (!tour) {
      throw new ApiError(404, 'Virtual tour not found');
    }

    res.status(200).json(new ApiResponse(200, tour, 'Virtual tour updated successfully'));
  } catch (error) {
    next(error);
  }
};

// Delete virtual tour (Admin only)
export const deleteVirtualTour = async (req, res, next) => {
  try {
    const tour = await VirtualTour.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!tour) {
      throw new ApiError(404, 'Virtual tour not found');
    }

    // Update monastery to indicate virtual tour is no longer available
    await Monastery.findByIdAndUpdate(tour.monastery, { virtualTourAvailable: false });

    res.status(200).json(new ApiResponse(200, null, 'Virtual tour deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// Get virtual tour scenes
export const getTourScenes = async (req, res, next) => {
  try {
    const tour = await VirtualTour.findById(req.params.id).select('scenes defaultScene');
    
    if (!tour) {
      throw new ApiError(404, 'Virtual tour not found');
    }

    res.status(200).json(new ApiResponse(200, {
      scenes: tour.scenes,
      defaultScene: tour.defaultScene
    }, 'Tour scenes retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Update tour scene
export const updateTourScene = async (req, res, next) => {
  try {
    const { sceneId } = req.params;
    const tour = await VirtualTour.findById(req.params.id);

    if (!tour) {
      throw new ApiError(404, 'Virtual tour not found');
    }

    const sceneIndex = tour.scenes.findIndex(scene => scene.id === sceneId);
    if (sceneIndex === -1) {
      throw new ApiError(404, 'Scene not found');
    }

    tour.scenes[sceneIndex] = { ...tour.scenes[sceneIndex], ...req.body };
    await tour.save();

    res.status(200).json(new ApiResponse(200, tour.scenes[sceneIndex], 'Scene updated successfully'));
  } catch (error) {
    next(error);
  }
};