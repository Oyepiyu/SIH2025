import Monastery from '../models/Monastery.js';
import VirtualTour from '../models/VirtualTour.js';
import AudioGuide from '../models/AudioGuide.js';
import { validateMonastery } from '../utils/validation.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// Get all monasteries with filtering, searching, and pagination
export const getMonasteries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      district,
      sect,
      virtualTour,
      audioGuide,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const query = { status: 'active' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (district) query['location.district'] = district;
    if (sect) query['spiritualSignificance.sect'] = sect;
    if (virtualTour !== undefined) query.virtualTourAvailable = virtualTour === 'true';
    if (audioGuide !== undefined) query.audioGuideAvailable = audioGuide === 'true';

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const monasteries = await Monastery.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Monastery.countDocuments(query);

    res.status(200).json(new ApiResponse(200, {
      monasteries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        hasNext: skip + monasteries.length < total,
        hasPrev: parseInt(page) > 1
      }
    }, 'Monasteries retrieved successfully'));

  } catch (error) {
    next(error);
  }
};

// Get monastery by ID
export const getMonasteryById = async (req, res, next) => {
  try {
    const monastery = await Monastery.findById(req.params.id).select('-__v');
    
    if (!monastery) {
      throw new ApiError(404, 'Monastery not found');
    }

    res.status(200).json(new ApiResponse(200, monastery, 'Monastery retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Create new monastery (Admin only)
export const createMonastery = async (req, res, next) => {
  try {
    const { error } = validateMonastery(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const monastery = new Monastery({
      ...req.body,
      createdBy: req.user._id
    });

    await monastery.save();

    res.status(201).json(new ApiResponse(201, monastery, 'Monastery created successfully'));
  } catch (error) {
    next(error);
  }
};

// Update monastery (Admin only)
export const updateMonastery = async (req, res, next) => {
  try {
    const monastery = await Monastery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!monastery) {
      throw new ApiError(404, 'Monastery not found');
    }

    res.status(200).json(new ApiResponse(200, monastery, 'Monastery updated successfully'));
  } catch (error) {
    next(error);
  }
};

// Delete monastery (Admin only)
export const deleteMonastery = async (req, res, next) => {
  try {
    const monastery = await Monastery.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    );

    if (!monastery) {
      throw new ApiError(404, 'Monastery not found');
    }

    res.status(200).json(new ApiResponse(200, null, 'Monastery deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// Get monasteries near a location
export const getNearbyMonasteries = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      throw new ApiError(400, 'Longitude and latitude are required');
    }

    const monasteries = await Monastery.find({
      status: 'active',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance) // meters
        }
      }
    }).select('-__v');

    res.status(200).json(new ApiResponse(200, monasteries, 'Nearby monasteries retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Get monastery statistics
export const getMonasteryStats = async (req, res, next) => {
  try {
    const stats = await Monastery.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalMonasteries: { $sum: 1 },
          averageRating: { $avg: '$rating.average' },
          totalWithVirtualTour: {
            $sum: { $cond: [{ $eq: ['$virtualTourAvailable', true] }, 1, 0] }
          },
          totalWithAudioGuide: {
            $sum: { $cond: [{ $eq: ['$audioGuideAvailable', true] }, 1, 0] }
          }
        }
      }
    ]);

    const sectStats = await Monastery.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$spiritualSignificance.sect', count: { $sum: 1 } } }
    ]);

    const districtStats = await Monastery.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location.district', count: { $sum: 1 } } }
    ]);

    res.status(200).json(new ApiResponse(200, {
      general: stats[0] || {},
      bySect: sectStats,
      byDistrict: districtStats
    }, 'Monastery statistics retrieved successfully'));

  } catch (error) {
    next(error);
  }
};