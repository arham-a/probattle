import { apiClient } from './config';

export interface AdminServiceData {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: string;
  priceType: string;
  availability: string[];
  location: string;
  city: string;
  isActive: boolean;
  latitude: string;
  longitude: string;
  h3Index: string;
  images: string[];
  approvalStatus: string;
  approvedBy: string | null;
  approvedAt: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  provider: {
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
  };
  reviewCount: number;
  avgRating: number;
  reviews: {
    id: string;
    score: number;
    review: string;
    createdAt: string;
    seeker: {
      id: string;
      name: string;
      avatar: string | null;
    };
  }[];
}

export interface AdminServicesResponse {
  services: AdminServiceData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  sorting: {
    sortBy: string;
    availableSorts: string[];
  };
}

export interface AdminServicesParams {
  page?: number;
  limit?: number;
  sortBy?: 'lowest_rating' | 'highest_rating' | 'most_views' | 'least_views' | 'newest' | 'oldest';
}

class AdminService {
  async getServices(params: AdminServicesParams = {}): Promise<AdminServicesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);

      const url = `/admin/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<AdminServicesResponse>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch admin services');
    }
  }

  async disableService(serviceId: string): Promise<AdminServiceData> {
    try {
      const response = await apiClient.patch<AdminServiceData>(`/admin/services/${serviceId}/disable`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to disable service');
    }
  }

  async enableService(serviceId: string): Promise<AdminServiceData> {
    try {
      const response = await apiClient.patch<AdminServiceData>(`/admin/services/${serviceId}/enable`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to enable service');
    }
  }
}

export const adminService = new AdminService();