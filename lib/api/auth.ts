import { apiClient, tokenManager } from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'seeker' | 'provider' | 'both';
  bio?: string;
  latitude?: number;
  longitude?: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    bio?: string;
    role: string;
    latitude?: number;
    longitude?: number;
    avatar?: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  role: string;
  latitude?: number;
  longitude?: number;
  avatar?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens and user data
      tokenManager.setTokens(accessToken, refreshToken);
      tokenManager.setUser(user);
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens and user data
      tokenManager.setTokens(accessToken, refreshToken);
      tokenManager.setUser(user);
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  }

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      tokenManager.setTokens(accessToken, newRefreshToken);
      
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      tokenManager.clearTokens();
      throw new Error(error.response?.data?.error || 'Token refresh failed');
    }
  }

  getCurrentUser(): User | null {
    return tokenManager.getUser();
  }

  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  }

  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  }
}

export const authService = new AuthService();