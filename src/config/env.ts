export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  IS_PRODUCTION: import.meta.env.VITE_APP_ENV === 'production',
  IS_DEVELOPMENT: import.meta.env.VITE_APP_ENV === 'development',
} as const;

// Log environment configuration in development
if (ENV.IS_DEVELOPMENT) {
  console.log('Environment Configuration:', {
    API_BASE_URL: ENV.API_BASE_URL,
    APP_ENV: ENV.APP_ENV,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  });
}
