import express from 'express';
import Contact from '../models/Contact.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validateContact } from '../utils/validation.js';

const router = express.Router();

// Submit contact form
const submitContact = async (req, res, next) => {
  try {
    const { error } = validateContact(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const contact = new Contact({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await contact.save();

    res.status(201).json(new ApiResponse(201, {
      id: contact._id,
      status: contact.status,
      message: 'Thank you for contacting us. We will get back to you soon.'
    }, 'Contact form submitted successfully'));

  } catch (error) {
    next(error);
  }
};

// Get all contacts (Admin only)
const getContacts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category,
      priority 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Contact.countDocuments(query);

    res.status(200).json(new ApiResponse(200, {
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    }, 'Contacts retrieved successfully'));

  } catch (error) {
    next(error);
  }
};

// Get contact by ID (Admin only)
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('response.respondedBy', 'name email')
      .select('-__v');

    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }

    res.status(200).json(new ApiResponse(200, contact, 'Contact retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Update contact status (Admin only)
const updateContactStatus = async (req, res, next) => {
  try {
    const { status, priority, response } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (response) {
      updateData.response = {
        message: response,
        respondedBy: req.user?._id, // Would come from auth middleware
        respondedAt: new Date()
      };
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }

    res.status(200).json(new ApiResponse(200, contact, 'Contact updated successfully'));
  } catch (error) {
    next(error);
  }
};

// Routes
router.post('/', submitContact);
router.get('/', getContacts); // Admin only in production
router.get('/:id', getContactById); // Admin only in production
router.put('/:id', updateContactStatus); // Admin only in production

export default router;