// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  AUTHENTICATE: '/auth/authenticate', // Unified login/signup endpoint
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_TOKEN: '/auth/verify',

  // User
  GET_USER: '/user/profile',
  UPDATE_USER: '/user/profile',

  // Novels
  GET_NOVELS: '/novels',
  GET_NOVEL: '/novels/:id',
  GET_NOVEL_BY_SLUG: '/novels/slug',
  GET_NOVELS_BY_GENRE: '/novels/genre',
  GET_NOVELS_BY_AUTHOR: '/novels/author',
  SEARCH_NOVELS: '/novels/search',

  // Specific Novel - ராட்சசனே எனை வதைப்பதேனடா!
  GET_RATSASANE_NOVEL: '/novels/ratsasane-enai-vathaippathena',

  // Chapters
  GET_NOVEL_CHAPTERS: '/novels/:id/chapters',
  GET_CHAPTER: '/novels/:novelId/chapters/:chapterId',

  // Novel Interactions
  BOOKMARK_NOVEL: '/novels/bookmark',
  REMOVE_BOOKMARK: '/novels/bookmark',
  LIKE_NOVEL: '/novels/like',

  // Download
  DOWNLOAD_NOVEL_PDF: '/novels/:id/download/pdf',

  // Reading Progress
  GET_READING_PROGRESS: '/reading/progress',
  UPDATE_READING_PROGRESS: '/reading/progress',
  DELETE_READING_PROGRESS: '/reading/progress/:novelId',
  START_READING: '/reading/start',
  COMPLETE_NOVEL: '/reading/complete',
};

export default API_BASE_URL;
