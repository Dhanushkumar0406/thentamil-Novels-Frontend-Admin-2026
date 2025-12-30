import { ENV } from '../config/env';

export class NetworkDiagnostics {
  /**
   * Test if backend is reachable at specified URL
   */
  static async testConnection(url: string): Promise<{
    success: boolean;
    status?: number;
    error?: string;
    duration: number;
  }> {
    const startTime = Date.now();

    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });

      return {
        success: response.ok,
        status: response.status,
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Run full network diagnostics
   */
  static async runDiagnostics(): Promise<void> {
    console.log('\n🔬 Running Network Diagnostics...\n');

    const tests = [
      { name: 'Backend Health', url: `${ENV.API_BASE_URL.replace('/api', '')}/health` },
      { name: 'Novels Endpoint', url: `${ENV.API_BASE_URL}/novels` },
      { name: 'Auth Endpoint', url: `${ENV.API_BASE_URL}/auth/verify` },
    ];

    for (const test of tests) {
      const result = await this.testConnection(test.url);
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${test.name}:`, {
        url: test.url,
        success: result.success,
        status: result.status,
        duration: `${result.duration}ms`,
        error: result.error,
      });
    }

    console.log('\n📊 Configuration:');
    console.log('   API Base URL:', ENV.API_BASE_URL);
    console.log('   Environment:', ENV.APP_ENV);
    console.log('   Is Development:', ENV.IS_DEVELOPMENT);
    console.log('\n');
  }
}

// Expose to browser console for debugging
if (ENV.IS_DEVELOPMENT) {
  (window as any).networkDiagnostics = NetworkDiagnostics;
  console.log('💡 Run window.networkDiagnostics.runDiagnostics() to test API connectivity');
}
