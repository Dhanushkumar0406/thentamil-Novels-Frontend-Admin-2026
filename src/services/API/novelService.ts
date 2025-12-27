import apiClient from './client';
import { API_ENDPOINTS } from './config';
import mockNovels from './mockData';

/**
 * Novel Service
 * Handles all API calls related to novels
 * Integrates with backend API and falls back to mock data when needed
 */

const novelService = {
  /**
   * Get all novels
   * @returns {Promise} Array of novels
   */
  getAllNovels: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_NOVELS);
      return response.data;
    } catch (error) {
      // Fallback to mock data - ALWAYS return data, never throw
      return { novels: mockNovels };
    }
  },

  /**
   * Get a specific novel by ID
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Novel details
   */
  getNovelById: async (novelId) => {
    try {
      const endpoint = API_ENDPOINTS.GET_NOVEL.replace(':id', novelId);
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      // Fallback to mock data
      const novel = mockNovels.find(n => n.id === parseInt(novelId));
      return novel || {};
    }
  },

  /**
   * Get novel by slug or title
   * @param {string} slug - The slug or title of the novel
   * @returns {Promise} Novel details
   */
  getNovelBySlug: async (slug) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_NOVEL_BY_SLUG, {
        params: { slug }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get specific novel "ராட்சசனே எனை வதைப்பதேனடா!" by Thenmozhi
   * This is a dedicated endpoint for this specific novel
   * @returns {Promise} Novel details with all chapters
   */
  getRatsasaneEnaiVathaippathenaNovel: async () => {
    const response = await apiClient.get(API_ENDPOINTS.GET_RATSASANE_NOVEL);
    return response.data;
  },

  /**
   * Get chapters for a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Array of chapters
   */
  getNovelChapters: async (novelId) => {
    try {
      const endpoint = API_ENDPOINTS.GET_NOVEL_CHAPTERS.replace(':id', novelId);
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      // Fallback: return empty chapters array for now
      // In production, you would fetch from mock data
      return { chapters: [] };
    }
  },

  /**
   * Get a specific chapter
   * @param {string|number} novelId - The ID of the novel
   * @param {string|number} chapterId - The ID of the chapter
   * @param {string} language - The language ('tamil' or 'english')
   * @returns {Promise} Chapter details with content
   */
  getChapter: async (novelId, chapterId, language = 'tamil') => {
    const endpoint = API_ENDPOINTS.GET_CHAPTER
      .replace(':novelId', novelId)
      .replace(':chapterId', chapterId);

    // Add language query parameter
    const response = await apiClient.get(endpoint, {
      params: { language }
    });

    return response.data;
  },

  /**
   * Bookmark a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Bookmark status
   */
  bookmarkNovel: async (novelId) => {
    const response = await apiClient.post(API_ENDPOINTS.BOOKMARK_NOVEL, {
      novelId
    });
    return response.data;
  },

  /**
   * Remove bookmark from a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Bookmark status
   */
  removeBookmark: async (novelId) => {
    const response = await apiClient.delete(API_ENDPOINTS.REMOVE_BOOKMARK, {
      data: { novelId }
    });
    return response.data;
  },

  /**
   * Like a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Like status
   */
  likeNovel: async (novelId) => {
    const response = await apiClient.post(API_ENDPOINTS.LIKE_NOVEL, {
      novelId
    });
    return response.data;
  },

  /**
   * Update reading progress
   * @param {string|number} novelId - The ID of the novel
   * @param {string|number} chapterId - The current chapter ID
   * @param {number} progress - Reading progress percentage (0-100)
   * @returns {Promise} Progress update status
   */
  updateReadingProgress: async (novelId, chapterId, progress = 0) => {
    const response = await apiClient.post(API_ENDPOINTS.UPDATE_READING_PROGRESS, {
      novelId,
      chapterId,
      progress
    });
    return response.data;
  },

  /**
   * Get user's reading progress for a novel
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} Reading progress data
   */
  getReadingProgress: async (novelId) => {
    const response = await apiClient.get(API_ENDPOINTS.GET_READING_PROGRESS, {
      params: { novelId }
    });
    return response.data;
  },

  /**
   * Download novel as PDF
   * @param {string|number} novelId - The ID of the novel
   * @returns {Promise} PDF file blob
   */
  downloadNovelPDF: async (novelId) => {
    const endpoint = API_ENDPOINTS.DOWNLOAD_NOVEL_PDF.replace(':id', novelId);
    const response = await apiClient.get(endpoint, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Search novels
   * @param {string} query - Search query
   * @param {Object} filters - Optional filters (genre, author, etc.)
   * @returns {Promise} Array of matching novels
   */
  searchNovels: async (query, filters = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.SEARCH_NOVELS, {
      params: { query, ...filters }
    });
    return response.data;
  },

  /**
   * Get novels by genre
   * @param {string} genre - Genre name
   * @returns {Promise} Array of novels
   */
  getNovelsByGenre: async (genre) => {
    const response = await apiClient.get(API_ENDPOINTS.GET_NOVELS_BY_GENRE, {
      params: { genre }
    });
    return response.data;
  },

  /**
   * Get novels by author
   * @param {string} author - Author name
   * @returns {Promise} Array of novels
   */
  getNovelsByAuthor: async (author) => {
    const response = await apiClient.get(API_ENDPOINTS.GET_NOVELS_BY_AUTHOR, {
      params: { author }
    });
    return response.data;
  }
};

export default novelService;
