// ==============================================
// API Response Types
// ==============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ==============================================
// User & Auth Types
// ==============================================

export type UserRole = 'ADMIN' | 'EDITOR' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

// ==============================================
// Novel Types
// ==============================================

export type NovelStatus = 'ONGOING' | 'COMPLETED' | 'HIATUS';

export interface Novel {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre: string;
  status: NovelStatus;
  totalChapters: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
}

export interface NovelStats {
  totalViews: number;
  totalChapters: number;
  avgRating: number;
  totalReviews: number;
}

export interface NovelQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: NovelStatus | '';
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface CreateNovelPayload {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre: string;
  status: NovelStatus;
}

export interface UpdateNovelPayload extends Partial<CreateNovelPayload> {}

// ==============================================
// Chapter Types
// ==============================================

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  content: string;
  chapterNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterNavigation {
  previous: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

export interface ChapterQueryParams {
  novelId?: string;
  page?: number;
  limit?: number;
}

export interface CreateChapterPayload {
  novelId: string;
  title: string;
  content: string;
  chapterNumber: number;
}

export interface UpdateChapterPayload extends Partial<Omit<CreateChapterPayload, 'novelId'>> {}

// ==============================================
// Dashboard Stats Types
// ==============================================

export interface DashboardStats {
  totalNovels: number;
  totalChapters: number;
  totalUsers: number;
  totalViews: number;
}
