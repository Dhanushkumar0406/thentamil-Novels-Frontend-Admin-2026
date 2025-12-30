import { apiClient } from '../api/apiClient';
import { ENV } from '../config/env';

interface HealthStatus {
  isBackendReachable: boolean;
  backendStatus?: string;
  backendPort?: number;
  error?: string;
  timestamp: string;
}

export const healthService = {
  /**
   * Check if backend is reachable
   */
  async checkBackend(): Promise<HealthStatus> {
    try {
      // Health endpoint is at /health (not /api/health), so use direct fetch
      const baseUrl = ENV.API_BASE_URL.replace('/api', '');
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();

      return {
        isBackendReachable: true,
        backendStatus: data.status,
        backendPort: data.port,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('❌ Backend health check failed:', error);
      return {
        isBackendReachable: false,
        error: error.message || 'Backend not reachable',
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Verify backend before app initialization
   */
  async verifyBackendOnStartup(): Promise<void> {
    console.log('🔍 Verifying backend connection...');
    const health = await this.checkBackend();

    if (health.isBackendReachable) {
      console.log('✅ Backend is reachable:', health);
    } else {
      console.error('❌ Backend is NOT reachable!');
      console.error('   Expected backend:', ENV.API_BASE_URL);
      console.error('   Error:', health.error);
      console.error('\n🔧 Troubleshooting:');
      console.error('   1. Start backend: cd thentamil-novel-backend && npm run start:dev');
      console.error('   2. Verify port 4000 is not in use: netstat -ano | findstr :4000');
      console.error('   3. Check backend console for errors');
    }
  },
};
