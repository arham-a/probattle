import { apiClient } from './config';

export interface ServiceProvider {
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

export interface Service {
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
  createdAt: string;
  updatedAt: string;
  provider: ServiceProvider;
  distance?: number; // Distance in km from user location
}

export interface ServicesResponse {
  services: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchServicesParams {
  lat?: number;
  lng?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'nearest' | 'rating' | 'price_low' | 'price_high';
  page?: number;
  limit?: number;
  radius?: number; // Max radius in km
}

class ServicesService {
  async searchServices(params: SearchServicesParams = {}): Promise<ServicesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.lat !== undefined) queryParams.append('lat', params.lat.toString());
      if (params.lng !== undefined) queryParams.append('lng', params.lng.toString());
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.radius) queryParams.append('radius', params.radius.toString());

      const url = `/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<ServicesResponse>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch services');
    }
  }
}

export const servicesService = new ServicesService();