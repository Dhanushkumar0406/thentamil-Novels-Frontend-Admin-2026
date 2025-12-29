// ==============================================
// Public API Module (No Auth Required)
// ==============================================

import { apiClient } from '../apiClient';
import {
  Novel,
  Chapter,
  ChapterNavigation,
  PaginatedResponse,
  NovelQueryParams,
  ChapterQueryParams,
} from '../../types/api.types';

export const publicApi = {
  novels: {
    async getAll(params?: NovelQueryParams): Promise<PaginatedResponse<Novel>> {
      return apiClient.get<PaginatedResponse<Novel>>('/novels', params, 'get-novels');
    },

    async getById(id: string): Promise<Novel> {
      return apiClient.get<Novel>(`/novels/${id}`, undefined, `get-novel-${id}`);
    },
  },

  chapters: {
    async getAll(params?: ChapterQueryParams): Promise<PaginatedResponse<Chapter>> {
      return apiClient.get<PaginatedResponse<Chapter>>('/chapters', params, 'get-chapters');
    },

    async getById(id: string): Promise<Chapter> {
      return apiClient.get<Chapter>(`/chapters/${id}`, undefined, `get-chapter-${id}`);
    },

    async getNavigation(id: string): Promise<ChapterNavigation> {
      return apiClient.get<ChapterNavigation>(`/chapters/${id}/navigation`, undefined, `get-nav-${id}`);
    },
  },
};
