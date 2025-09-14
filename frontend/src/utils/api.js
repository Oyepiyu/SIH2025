import { useState } from 'react';

// API configuration and helper functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Monastery API functions
export const monasteryAPI = {
  // Get all monasteries with optional filters
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/monasteries${queryString ? `?${queryString}` : ''}`);
  },

  // Get specific monastery by ID
  getById: (id) => apiRequest(`/monasteries/${id}`),

  // Search monasteries by location
  searchByLocation: (lat, lng, radius = 10) => 
    apiRequest(`/monasteries/search?lat=${lat}&lng=${lng}&radius=${radius}`),

  // Search monasteries by text
  searchByText: (query) => 
    apiRequest(`/monasteries/search?q=${encodeURIComponent(query)}`),
};

// Virtual Tour API functions
export const virtualTourAPI = {
  // Get all virtual tours
  getAll: () => apiRequest('/virtual-tours'),

  // Get specific virtual tour by ID
  getById: (id) => apiRequest(`/virtual-tours/${id}`),

  // Get virtual tours for a specific monastery
  getByMonastery: (monasteryId) => apiRequest(`/virtual-tours/monastery/${monasteryId}`),
};

// Audio Guide API functions  
export const audioGuideAPI = {
  // Get all audio guides
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/audio-guides${queryString ? `?${queryString}` : ''}`);
  },

  // Get specific audio guide by ID
  getById: (id) => apiRequest(`/audio-guides/${id}`),

  // Get audio guides for a specific monastery
  getByMonastery: (monasteryId) => apiRequest(`/audio-guides/monastery/${monasteryId}`),

  // Get audio guides by language
  getByLanguage: (language) => apiRequest(`/audio-guides?language=${language}`),
};

// Manuscript API functions
export const manuscriptAPI = {
  // Get all manuscripts
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/manuscripts${queryString ? `?${queryString}` : ''}`);
  },

  // Get specific manuscript by ID
  getById: (id) => apiRequest(`/manuscripts/${id}`),

  // Get manuscripts for a specific monastery
  getByMonastery: (monasteryId) => apiRequest(`/manuscripts/monastery/${monasteryId}`),

  // Upload manuscript (requires FormData)
  upload: (formData) => apiRequest('/manuscripts', {
    method: 'POST',
    headers: {}, // Let browser set Content-Type for FormData
    body: formData,
  }),
};

// Search API functions
export const searchAPI = {
  // Global search across all content
  global: (query) => apiRequest(`/search?q=${encodeURIComponent(query)}`),

  // Get search suggestions
  suggestions: (query) => apiRequest(`/search/suggestions?q=${encodeURIComponent(query)}`),
};

// User API functions (for authentication)
export const userAPI = {
  // Register new user
  register: (userData) => apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Login user
  login: (credentials) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Get user profile (requires token)
  getProfile: (token) => apiRequest('/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
};

// Contact API functions
export const contactAPI = {
  // Submit contact form
  submit: (contactData) => apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
};

// Error handling utility
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  // Return user-friendly error messages
  if (error.message.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  }
  
  if (error.message.includes('500')) {
    return 'Internal server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

// Loading state utility for React components
export const useAPIState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const executeAPI = async (apiFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, executeAPI };
};

export default {
  monasteryAPI,
  virtualTourAPI,
  audioGuideAPI,
  manuscriptAPI,
  searchAPI,
  userAPI,
  contactAPI,
  handleAPIError,
  useAPIState,
};