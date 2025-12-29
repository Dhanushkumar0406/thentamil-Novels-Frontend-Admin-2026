// ==============================================
// Authentication API Module
// ==============================================

import { apiClient } from '../apiClient';
import {
  AuthResponse,
  LoginPayload,
  SignupPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '../../types/api.types';

export const authApi = {
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/signup', payload);
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', payload);
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', payload);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/reset-password', payload);
  },
};
