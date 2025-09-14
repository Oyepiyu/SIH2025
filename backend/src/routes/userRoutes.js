import express from 'express';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validateUser } from '../utils/validation.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Register user
const registerUser = async (req, res, next) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'User already exists with this email');
    }

    // Create user
    const user = new User({ name, email, password, role });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json(new ApiResponse(201, {
      user,
      token
    }, 'User registered successfully'));

  } catch (error) {
    next(error);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid credentials or account deactivated');
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(200).json(new ApiResponse(200, {
      user,
      token
    }, 'Login successful'));

  } catch (error) {
    next(error);
  }
};

// Get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'name shortDescription mainImage')
      .populate('visitHistory.monastery', 'name shortDescription mainImage');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, user, 'Profile retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'preferences', 'avatar'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

// Add monastery to favorites
const addToFavorites = async (req, res, next) => {
  try {
    const { monasteryId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (user.favorites.includes(monasteryId)) {
      throw new ApiError(400, 'Monastery already in favorites');
    }

    user.favorites.push(monasteryId);
    await user.save();

    res.status(200).json(new ApiResponse(200, null, 'Added to favorites'));
  } catch (error) {
    next(error);
  }
};

// Remove from favorites
const removeFromFavorites = async (req, res, next) => {
  try {
    const { monasteryId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id.toString() !== monasteryId);
    await user.save();

    res.status(200).json(new ApiResponse(200, null, 'Removed from favorites'));
  } catch (error) {
    next(error);
  }
};

// Add visit history
const addVisitHistory = async (req, res, next) => {
  try {
    const { monasteryId, rating, review } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Check if already visited
    const existingVisit = user.visitHistory.find(
      visit => visit.monastery.toString() === monasteryId
    );

    if (existingVisit) {
      // Update existing visit
      existingVisit.visitDate = new Date();
      if (rating) existingVisit.rating = rating;
      if (review) existingVisit.review = review;
    } else {
      // Add new visit
      user.visitHistory.push({
        monastery: monasteryId,
        visitDate: new Date(),
        rating,
        review
      });
    }

    await user.save();

    res.status(200).json(new ApiResponse(200, null, 'Visit history updated'));
  } catch (error) {
    next(error);
  }
};

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes would need auth middleware in production
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/favorites', addToFavorites);
router.delete('/favorites/:monasteryId', removeFromFavorites);
router.post('/visit-history', addVisitHistory);

export default router;