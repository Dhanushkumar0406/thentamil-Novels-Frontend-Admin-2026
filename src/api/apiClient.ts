// ==============================================
// Central API Client with Interceptors
// ==============================================

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { tokenManager } from '../utils/tokenManager';
import { ApiResponse } from '../types/api.types';

class ApiClient {
  private client: AxiosInstance;
  private abortControllers: Map<string, AbortController>;

  constructor() {
    this.abortControllers = new Map();

    this.client = axios.create({
      baseURL: ENV.API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log API requests in development
        if (ENV.IS_DEVELOPMENT) {
          const timestamp = new Date().toISOString();
          console.log(`📤 [${timestamp}] API Request:`, {
            method: config.method?.toUpperCase(),
            endpoint: config.url,
            fullUrl: `${config.baseURL}${config.url}`,
            hasAuth: !!config.headers.Authorization,
            params: config.params,
            dataSize: config.data ? JSON.stringify(config.data).length : 0,
          });
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        // Log successful responses in development
        if (ENV.IS_DEVELOPMENT && response.config) {
          const timestamp = new Date().toISOString();
          console.log(`📥 [${timestamp}] API Response:`, {
            method: response.config.method?.toUpperCase(),
            endpoint: response.config.url,
            status: response.status,
            statusText: response.statusText,
            dataSize: response.data ? JSON.stringify(response.data).length : 0,
          });
        }

        return response;
      },
      (error: AxiosError<ApiResponse>) => {
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 401:
              tokenManager.clearAuth();
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
              break;

            case 403:
              if (window.location.pathname !== '/403') {
                window.location.href = '/403';
              }
              break;

            case 404:
              break;

            case 500:
              if (!ENV.IS_PRODUCTION) {
                console.error('Server Error:', data);
              }
              break;

            default:
              break;
          }

          return Promise.reject({
            status,
            message: data?.message || 'An error occurred',
            errors: data?.errors,
          });
        }

        if (error.code === 'ECONNABORTED') {
          return Promise.reject({
            status: 408,
            message: 'Request timeout. Please try again.',
          });
        }

        if (!error.response) {
          // Enhanced network error logging
          console.error('\n' + '❌'.repeat(30));
          console.error('🚨 NETWORK ERROR DETECTED');
          console.error('❌'.repeat(30));
          console.error('Error Details:', {
            timestamp: new Date().toISOString(),
            message: error.message,
            code: error.code,
            errno: (error as any).errno,
            syscall: (error as any).syscall,
          });
          console.error('Request Details:', {
            method: error.config?.method?.toUpperCase(),
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            fullURL: (error.config?.baseURL || '') + (error.config?.url || ''),
            timeout: error.config?.timeout,
          });
          console.error('Backend Configuration:', {
            expectedBackend: ENV.API_BASE_URL,
            backendPort: new URL(ENV.API_BASE_URL).port,
            frontendPort: window.location.port || '80',
          });
          console.error('Troubleshooting:');
          console.error('  1. Verify backend is running: http://localhost:4000/health');
          console.error('  2. Check backend console for startup messages');
          console.error('  3. Verify CORS configuration matches frontend origin');
          console.error('  4. Check firewall/antivirus settings');
          console.error('❌'.repeat(30) + '\n');

          // Determine specific error type
          let errorMessage = 'Network error. Please check your connection.';
          let errorStatus = 0;

          if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Connection refused. Backend server may not be running.';
            errorStatus = 503;
          } else if (error.code === 'ENOTFOUND') {
            errorMessage = 'Host not found. Check API base URL configuration.';
            errorStatus = 503;
          } else if (error.code === 'ERR_NETWORK') {
            errorMessage = 'Network error. Check if backend server is running and accessible.';
            errorStatus = 503;
          } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout. Backend server may be slow or unresponsive.';
            errorStatus = 408;
          }

          return Promise.reject({
            status: errorStatus,
            message: errorMessage,
            code: error.code,
            details: {
              originalMessage: error.message,
              apiBaseUrl: ENV.API_BASE_URL,
              requestedUrl: error.config?.url,
            },
          });
        }

        return Promise.reject(error);
      }
    );
  }

  public abortRequest(key: string): void {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(key);
    }
  }

  public abortAllRequests(): void {
    this.abortControllers.forEach((controller) => controller.abort());
    this.abortControllers.clear();
  }

  private getAbortSignal(key?: string): AbortSignal | undefined {
    if (!key) return undefined;

    this.abortRequest(key);

    const controller = new AbortController();
    this.abortControllers.set(key, controller);

    return controller.signal;
  }

  public async get<T>(url: string, params?: unknown, abortKey?: string): Promise<T> {
    const response = await this.client.get<T>(url, {
      params,
      signal: this.getAbortSignal(abortKey),
    });

    if (abortKey) {
      this.abortControllers.delete(abortKey);
    }

    // Validate response exists
    if (!response.data || typeof response.data !== 'object') {
      if (ENV.IS_DEVELOPMENT) {
        console.error('Invalid API response structure:', {
          status: response.status,
          data: response.data,
          url,
        });
      }
      throw {
        status: response.status || 500,
        message: 'Invalid response format from server',
      };
    }

    return response.data as T;
  }

  public async post<T>(url: string, data?: unknown, abortKey?: string): Promise<T> {
    const response = await this.client.post<T>(url, data, {
      signal: this.getAbortSignal(abortKey),
    });

    if (abortKey) {
      this.abortControllers.delete(abortKey);
    }

    if (!response.data || typeof response.data !== 'object') {
      throw {
        status: response.status || 500,
        message: 'Invalid response format from server',
      };
    }

    return response.data as T;
  }

  public async patch<T>(url: string, data?: unknown, abortKey?: string): Promise<T> {
    const response = await this.client.patch<T>(url, data, {
      signal: this.getAbortSignal(abortKey),
    });

    if (abortKey) {
      this.abortControllers.delete(abortKey);
    }

    if (!response.data || typeof response.data !== 'object') {
      throw {
        status: response.status || 500,
        message: 'Invalid response format from server',
      };
    }

    return response.data as T;
  }

  public async delete<T>(url: string, abortKey?: string): Promise<T> {
    const response = await this.client.delete<T>(url, {
      signal: this.getAbortSignal(abortKey),
    });

    if (abortKey) {
      this.abortControllers.delete(abortKey);
    }

    if (!response.data || typeof response.data !== 'object') {
      throw {
        status: response.status || 500,
        message: 'Invalid response format from server',
      };
    }

    return response.data as T;
  }
}

export const apiClient = new ApiClient();
