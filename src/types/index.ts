// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
  avatar?: string;
  profile?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  email?: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  name?: string;
  profile?: string;
}

export interface AuthCredentials {
  username?: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

// Novel Types
export interface Novel {
  _id?: string;
  id: string;
  title: string | { [key: string]: string };
  description: string | { [key: string]: string };
  author: string;
  authorEnglish?: string;
  coverImage: string;
  language: 'tamil' | 'english';
  category?: string;
  genre?: string;
  tags?: string[];
  totalChapters: number;
  status?: 'ongoing' | 'completed';
  stats?: {
    views: number;
    likes: number;
    bookmarks: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Chapter Types
export interface Chapter {
  _id?: string;
  id: string;
  novelId: string;
  chapterNumber: number;
  title: string | { [key: string]: string };
  content: string;
  language: 'tamil' | 'english';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Reading Progress Types
export interface ReadingProgress {
  novelId: string;
  chapterId: string;
  progress: number;
  lastRead: string;
}

export interface OngoingNovel {
  novelId: string;
  novelTitle: string;
  coverImage: string;
  author: string;
  lastChapter: number;
  startedAt: string;
  updatedAt?: string;
}

export interface CompletedNovel {
  novelId: string;
  novelTitle: string;
  coverImage: string;
  author: string;
  completedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiResponse>;
  signup: (userData: SignupData) => Promise<ApiResponse>;
  authenticate: (credentials: AuthCredentials) => Promise<ApiResponse & { action?: 'login' | 'signup' }>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

export interface ReadingProgressContextType {
  ongoingNovels: OngoingNovel[];
  completedNovels: CompletedNovel[];
  startReading: (novelId: string, novelTitle: string, coverImage: string, author: string) => Promise<void>;
  updateProgress: (novelId: string, chapterId: number) => Promise<void>;
  completeNovel: (novelId: string, novelTitle: string, coverImage: string, author: string) => Promise<void>;
  isOngoing: (novelId: string) => boolean;
  isCompleted: (novelId: string) => boolean;
  getLastChapter: (novelId: string) => number;
}

export interface LanguageContextType {
  language: 'tamil' | 'english';
  setLanguage: (lang: 'tamil' | 'english') => void;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Component Prop Types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

// Admin Types
export interface DashboardStats {
  totalNovels: number;
  totalChapters: number;
  totalUsers: number;
  totalSubscriptions: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  action: string;
  timestamp: string;
}

export interface DataTableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableAction {
  label: string;
  onClick: (row: any) => void;
  variant?: string;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  actions?: DataTableAction[] | ((row: any) => React.ReactNode);
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Language Types
export type Language = 'tamil' | 'english';

// Comment Types
export interface Comment {
  id: string;
  userName: string;
  comment: string;
  postedAt: string;
  replies?: Comment[];
}

// DataTable Types
export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}