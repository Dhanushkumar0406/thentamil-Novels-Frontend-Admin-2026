// ==============================================
// Admin API Module (Auth Required)
// ==============================================

import { apiClient } from '../apiClient';
import {
  Novel,
  NovelStats,
  Chapter,
  PaginatedResponse,
  NovelQueryParams,
  ChapterQueryParams,
  CreateNovelPayload,
  UpdateNovelPayload,
  CreateChapterPayload,
  UpdateChapterPayload,
  DashboardStats,
} from '../../types/api.types';

export const adminApi = {
  dashboard: {
    async getStats(): Promise<DashboardStats> {
      return apiClient.get<DashboardStats>('/admin/stats', undefined, 'dashboard-stats');
    },
  },

  novels: {
    async getAll(params?: NovelQueryParams): Promise<PaginatedResponse<Novel>> {
      return apiClient.get<PaginatedResponse<Novel>>('/novels', params, 'admin-novels');
    },

    async getById(id: string): Promise<Novel> {
      return apiClient.get<Novel>(`/novels/${id}`, undefined, `admin-novel-${id}`);
    },

    async getStats(id: string): Promise<NovelStats> {
      return apiClient.get<NovelStats>(`/novels/${id}/stats`, undefined, `novel-stats-${id}`);
    },

    async create(payload: CreateNovelPayload): Promise<Novel> {
      return apiClient.post<Novel>('/novels', payload);
    },

    async update(id: string, payload: UpdateNovelPayload): Promise<Novel> {
      return apiClient.patch<Novel>(`/novels/${id}`, payload);
    },

    async delete(id: string): Promise<{ message: string }> {
      return apiClient.delete<{ message: string }>(`/novels/${id}`);
    },
  },

  chapters: {
    async getAll(params?: ChapterQueryParams): Promise<PaginatedResponse<Chapter>> {
      return apiClient.get<PaginatedResponse<Chapter>>('/chapters', params, 'admin-chapters');
    },

    async getById(id: string): Promise<Chapter> {
      return apiClient.get<Chapter>(`/chapters/${id}`, undefined, `admin-chapter-${id}`);
    },

    async create(payload: CreateChapterPayload): Promise<Chapter> {
      return apiClient.post<Chapter>('/chapters', payload);
    },

    async update(id: string, payload: UpdateChapterPayload): Promise<Chapter> {
      return apiClient.patch<Chapter>(`/chapters/${id}`, payload);
    },

    async delete(id: string): Promise<{ message: string }> {
      return apiClient.delete<{ message: string }>(`/chapters/${id}`);
    },
  },
};
