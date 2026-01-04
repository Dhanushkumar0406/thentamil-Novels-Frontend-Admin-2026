// ==============================================
// Token Management - Secure Storage
// ==============================================

const TOKEN_KEY = 'authToken';  // Must match authService.ts
const USER_KEY = 'user';  // Must match authService.ts

export const tokenManager = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser(): string | null {
    return localStorage.getItem(USER_KEY);
  },

  setUser(user: string): void {
    localStorage.setItem(USER_KEY, user);
  },

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
