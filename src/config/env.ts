export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  IS_PRODUCTION: import.meta.env.VITE_APP_ENV === 'production',
  IS_DEVELOPMENT: import.meta.env.VITE_APP_ENV === 'development',
} as const;

// Validate API URL configuration
if (ENV.IS_DEVELOPMENT && !import.meta.env.VITE_API_BASE_URL) {
  console.warn('⚠️ VITE_API_BASE_URL not set! Using fallback: http://localhost:4000/api');
  console.warn('⚠️ Ensure .env.development file exists and is being loaded by Vite');
}

if (ENV.IS_DEVELOPMENT) {
  const expectedPort = '4000';
  const actualPort = new URL(ENV.API_BASE_URL).port || '80';
  if (actualPort !== expectedPort) {
    console.error(`❌ PORT MISMATCH: API configured for port ${actualPort}, expected ${expectedPort}`);
    console.error(`❌ Backend server must be running on http://localhost:${expectedPort}`);
  }
}

// Log environment configuration in development
if (ENV.IS_DEVELOPMENT) {
  console.log('Environment Configuration:', {
    API_BASE_URL: ENV.API_BASE_URL,
    APP_ENV: ENV.APP_ENV,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  });
}
