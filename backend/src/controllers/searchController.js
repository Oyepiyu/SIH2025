import Monastery from '../models/Monastery.js';
import VirtualTour from '../models/VirtualTour.js';
import AudioGuide from '../models/AudioGuide.js';
import Manuscript from '../models/Manuscript.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// Unified search across all entities
export const searchAll = async (req, res, next) => {
  try {
    const { 
      q: query, 
      type = 'all',
      page = 1,
      limit = 10,
      language = 'en'
    } = req.query;

    if (!query || query.trim().length < 2) {
      throw new ApiError(400, 'Search query must be at least 2 characters long');
    }

    const searchQuery = { $text: { $search: query } };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitInt = parseInt(limit);

    let results = {};
    let totalResults = 0;

    // Search monasteries
    if (type === 'all' || type === 'monasteries') {
      const monasteries = await Monastery.find({
        ...searchQuery,
        status: 'active'
      })
      .select('name shortDescription mainImage location rating')
      .sort({ score: { $meta: 'textScore' } })
      .skip(type === 'monasteries' ? skip : 0)
      .limit(type === 'monasteries' ? limitInt : 5);

      results.monasteries = monasteries;
      
      if (type === 'monasteries') {
        totalResults = await Monastery.countDocuments({
          ...searchQuery,
          status: 'active'
        });
      }
    }

    // Search virtual tours
    if (type === 'all' || type === 'virtual-tours') {
      const virtualTours = await VirtualTour.find({
        ...searchQuery,
        isActive: true
      })
      .populate('monastery', 'name shortDescription mainImage')
      .select('title description monastery views')
      .sort({ score: { $meta: 'textScore' } })
      .skip(type === 'virtual-tours' ? skip : 0)
      .limit(type === 'virtual-tours' ? limitInt : 5);

      results.virtualTours = virtualTours;
      
      if (type === 'virtual-tours') {
        totalResults = await VirtualTour.countDocuments({
          ...searchQuery,
          isActive: true
        });
      }
    }

    // Search audio guides
    if (type === 'all' || type === 'audio-guides') {
      const audioGuides = await AudioGuide.find({
        ...searchQuery,
        isActive: true,
        language
      })
      .populate('monastery', 'name shortDescription mainImage')
      .select('title description monastery language duration')
      .sort({ score: { $meta: 'textScore' } })
      .skip(type === 'audio-guides' ? skip : 0)
      .limit(type === 'audio-guides' ? limitInt : 5);

      results.audioGuides = audioGuides;
      
      if (type === 'audio-guides') {
        totalResults = await AudioGuide.countDocuments({
          ...searchQuery,
          isActive: true,
          language
        });
      }
    }

    // Search manuscripts
    if (type === 'all' || type === 'manuscripts') {
      const manuscripts = await Manuscript.find({
        ...searchQuery,
        isPublic: true
      })
      .populate('monastery', 'name shortDescription mainImage')
      .select('title description monastery originalLanguage availableLanguages')
      .sort({ score: { $meta: 'textScore' } })
      .skip(type === 'manuscripts' ? skip : 0)
      .limit(type === 'manuscripts' ? limitInt : 5);

      results.manuscripts = manuscripts;
      
      if (type === 'manuscripts') {
        totalResults = await Manuscript.countDocuments({
          ...searchQuery,
          isPublic: true
        });
      }
    }

    // Calculate total results for 'all' type
    if (type === 'all') {
      totalResults = Object.values(results).reduce((sum, items) => sum + items.length, 0);
    }

    const responseData = {
      query,
      type,
      results,
      pagination: type !== 'all' ? {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalResults / limitInt),
        totalItems: totalResults,
        hasNext: skip + Object.values(results)[0]?.length < totalResults,
        hasPrev: parseInt(page) > 1
      } : null
    };

    res.status(200).json(new ApiResponse(200, responseData, 'Search completed successfully'));
  } catch (error) {
    next(error);
  }
};

// Search suggestions/autocomplete
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q: query, limit = 5 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(200).json(new ApiResponse(200, [], 'No suggestions'));
    }

    const regex = new RegExp(query, 'i');
    
    // Get monastery name suggestions
    const monasteries = await Monastery.find({
      name: regex,
      status: 'active'
    })
    .select('name')
    .limit(parseInt(limit));

    const suggestions = monasteries.map(m => ({
      text: m.name,
      type: 'monastery',
      id: m._id
    }));

    res.status(200).json(new ApiResponse(200, suggestions, 'Search suggestions retrieved'));
  } catch (error) {
    next(error);
  }
};

// Popular search terms
export const getPopularSearches = async (req, res, next) => {
  try {
    // This would typically be stored in a separate collection
    // For now, return static popular searches
    const popularSearches = [
      'Rumtek Monastery',
      'Pemayangtse',
      'Tibetan Buddhism',
      'Virtual Tour',
      'Audio Guide',
      'Manuscripts',
      'Gangtok',
      'Tashiding'
    ];

    res.status(200).json(new ApiResponse(200, popularSearches, 'Popular searches retrieved'));
  } catch (error) {
    next(error);
  }
};

// Advanced search with filters
export const advancedSearch = async (req, res, next) => {
  try {
    const {
      q: query,
      type = 'monasteries',
      district,
      sect,
      hasVirtualTour,
      hasAudioGuide,
      rating,
      language = 'en',
      page = 1,
      limit = 10
    } = req.query;

    let searchQuery = {};
    
    if (query && query.trim().length >= 2) {
      searchQuery.$text = { $search: query };
    }

    // Type-specific filters
    if (type === 'monasteries') {
      if (district) searchQuery['location.district'] = district;
      if (sect) searchQuery['spiritualSignificance.sect'] = sect;
      if (hasVirtualTour !== undefined) searchQuery.virtualTourAvailable = hasVirtualTour === 'true';
      if (hasAudioGuide !== undefined) searchQuery.audioGuideAvailable = hasAudioGuide === 'true';
      if (rating) searchQuery['rating.average'] = { $gte: parseFloat(rating) };
      searchQuery.status = 'active';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let results = [];
    let total = 0;

    switch (type) {
      case 'monasteries':
        results = await Monastery.find(searchQuery)
          .select('-__v')
          .sort(query ? { score: { $meta: 'textScore' } } : { name: 1 })
          .skip(skip)
          .limit(parseInt(limit));
        
        total = await Monastery.countDocuments(searchQuery);
        break;

      case 'audio-guides':
        if (language) searchQuery.language = language;
        searchQuery.isActive = true;
        
        results = await AudioGuide.find(searchQuery)
          .populate('monastery', 'name shortDescription')
          .select('-__v')
          .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
        
        total = await AudioGuide.countDocuments(searchQuery);
        break;

      default:
        throw new ApiError(400, 'Invalid search type');
    }

    const responseData = {
      query,
      type,
      results,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        hasNext: skip + results.length < total,
        hasPrev: parseInt(page) > 1
      }
    };

    res.status(200).json(new ApiResponse(200, responseData, 'Advanced search completed'));
  } catch (error) {
    next(error);
  }
};