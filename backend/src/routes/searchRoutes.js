import express from 'express';
import {
  searchAll,
  getSearchSuggestions,
  getPopularSearches,
  advancedSearch
} from '../controllers/searchController.js';

const router = express.Router();

// Search routes
router.get('/', searchAll);
router.get('/suggestions', getSearchSuggestions);
router.get('/popular', getPopularSearches);
router.get('/advanced', advancedSearch);

export default router;