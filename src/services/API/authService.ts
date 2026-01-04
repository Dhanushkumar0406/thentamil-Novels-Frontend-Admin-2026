import apiClient from './client';
import { API_ENDPOINTS } from './config';

// ============================================
// MOCK USERS FOR TESTING (Remove in production)
// ============================================
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@theantamil.com',
    password: 'password123',
    role: 'ADMIN',
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
    name: 'Admin User'
  },
  {
    id: 3,
    email: 'editor@example.com',
    password: 'editor123',
    role: 'EDITOR',
    name: 'Editor User'
  },
  {
    id: 4,
    email: 'user@example.com',
    password: 'user123',
    role: 'USER',
    name: 'Regular User'
  }
];

// Mock login function (for development only)
const mockLogin = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = MOCK_USERS.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password'
    };
  }

  const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;
  const mockRefreshToken = `mock-refresh-token-${user.id}`;

  const userData = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  // Store in localStorage
  localStorage.setItem('authToken', mockToken);
  localStorage.setItem('refreshToken', mockRefreshToken);
  localStorage.setItem('user', JSON.stringify(userData));

  return {
    success: true,
    data: {
      token: mockToken,
      refreshToken: mockRefreshToken,
      user: userData
    }
  };
};

// Helper function to decode JWT and extract user info
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const authService = {
  // Login
  login: async (credentials) => {
    // Try real API first
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);

      // Backend returns { access_token: "..." }
      const { access_token } = response.data;

      if (!access_token) {
        throw new Error('No access token received from server');
      }

      // Decode JWT to get user information
      const decodedToken = decodeJWT(access_token);

      if (!decodedToken) {
        throw new Error('Failed to decode token');
      }

      // Extract user data from JWT payload
      const user = {
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
        name: decodedToken.full_name || decodedToken.email.split('@')[0]
      };

      // Store token and user data
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        data: {
          token: access_token,
          user: user
        }
      };
    } catch (error) {
      // If backend is not available, use mock login
      console.log('Backend not available, using mock authentication');
      return mockLogin(credentials);
    }
  },

  // Signup
  signup: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SIGNUP, userData);
      const { token, refreshToken, user } = response.data;

      // Store tokens and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  },

  // Unified Authentication (Login/Signup)
  authenticate: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTHENTICATE, credentials);
      const { token, refreshToken, user, action } = response.data;

      // Store tokens and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        data: response.data,
        action: action // 'login' or 'signup'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Authentication failed',
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Silently handle logout errors
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VERIFY_TOKEN);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false };
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default authService;
