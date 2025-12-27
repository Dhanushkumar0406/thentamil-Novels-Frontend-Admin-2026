import apiClient from './client';
import { API_ENDPOINTS } from './config';

const readingProgressService = {
  /**
   * Get user's reading progress for all novels
   * @returns {Promise} - User's reading progress data
   */
  async getReadingProgress() {
    const response = await apiClient.get(API_ENDPOINTS.GET_READING_PROGRESS);
    return response.data;
  },

  /**
   * Update reading progress for a novel
   * @param {Object} progressData - Progress data to update
   * @param {number} progressData.novelId - Novel ID
   * @param {string} progressData.novelTitle - Novel title
   * @param {string} progressData.coverImage - Cover image path
   * @param {string} progressData.author - Author name
   * @param {number} progressData.lastChapter - Last chapter read
   * @param {boolean} progressData.isCompleted - Completion status
   * @returns {Promise} - Updated progress data
   */
  async updateProgress(progressData) {
    const response = await apiClient.post(API_ENDPOINTS.UPDATE_READING_PROGRESS, progressData);
    return response.data;
  },

  /**
   * Mark a novel as started (ongoing)
   * @param {number} novelId - Novel ID
   * @param {string} novelTitle - Novel title
   * @param {string} coverImage - Cover image path
   * @param {string} author - Author name
   * @returns {Promise} - Updated progress data
   */
  async startReading(novelId, novelTitle, coverImage, author) {
    return this.updateProgress({
      novelId,
      novelTitle,
      coverImage,
      author,
      lastChapter: 1,
      isCompleted: false,
      startedAt: new Date().toISOString()
    });
  },

  /**
   * Update current chapter for a novel
   * @param {number} novelId - Novel ID
   * @param {number} chapterId - Chapter ID
   * @returns {Promise} - Updated progress data
   */
  async updateChapter(novelId, chapterId) {
    return this.updateProgress({
      novelId,
      lastChapter: chapterId,
      isCompleted: false,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Mark a novel as completed
   * @param {number} novelId - Novel ID
   * @param {string} novelTitle - Novel title
   * @param {string} coverImage - Cover image path
   * @param {string} author - Author name
   * @returns {Promise} - Updated progress data
   */
  async completeNovel(novelId, novelTitle, coverImage, author) {
    return this.updateProgress({
      novelId,
      novelTitle,
      coverImage,
      author,
      lastChapter: 27,
      isCompleted: true,
      completedAt: new Date().toISOString()
    });
  },

  /**
   * Delete reading progress for a novel
   * @param {number} novelId - Novel ID
   * @returns {Promise} - Deletion confirmation
   */
  async deleteProgress(novelId) {
    const response = await apiClient.delete(`${API_ENDPOINTS.UPDATE_READING_PROGRESS}/${novelId}`);
    return response.data;
  }
};

export default readingProgressService;
