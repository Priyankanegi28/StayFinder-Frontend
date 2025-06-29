// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  GET_USER: `${API_BASE_URL}/api/auth/user`,
  
  // Listings endpoints
  GET_LISTINGS: `${API_BASE_URL}/api/listings`,
  GET_LISTING: (id) => `${API_BASE_URL}/api/listings/${id}`,
  CREATE_LISTING: `${API_BASE_URL}/api/listings`,
  UPDATE_LISTING: (id) => `${API_BASE_URL}/api/listings/${id}`,
  DELETE_LISTING: (id) => `${API_BASE_URL}/api/listings/${id}`,
  
  // Bookings endpoints
  GET_BOOKINGS: `${API_BASE_URL}/api/bookings`,
  CREATE_BOOKING: `${API_BASE_URL}/api/bookings`,
  GET_LISTING_BOOKINGS: (id) => `${API_BASE_URL}/api/bookings/listing/${id}`,
  UPDATE_BOOKING_STATUS: (id) => `${API_BASE_URL}/api/bookings/${id}/status`,
  
  // Uploads
  UPLOADS: `${API_BASE_URL}/uploads`
};

export default API_BASE_URL; 