import { apiClient } from './config';

export interface UserProfile {
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

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  bio?: string;
  latitude?: number;
  longitude?: number;
  avatar?: File;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class UsersService {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(profileData).forEach(([key, value]) => {
        if (key !== 'avatar' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Add avatar if provided
      if (profileData.avatar) {
        formData.append('avatar', profileData.avatar);
      }

      const response = await apiClient.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.put('/users/change-password', passwordData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await apiClient.delete('/users/profile');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete account');
    }
  }

  async getUserById(id: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user');
    }
  }
}

export const usersService = new UsersService();