import { apiClient } from './config';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  bio: string | null;
  role: string;
  latitude: string | null;
  longitude: string | null;
  avatar: string | null;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

class UserService {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>('/users/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user profile');
    }
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>('/users/me', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  }

  async updateAvatar(file: File): Promise<UserProfile> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.put<UserProfile>('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update avatar');
    }
  }
}

export const userService = new UserService();