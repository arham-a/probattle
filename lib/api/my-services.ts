import { apiClient } from './config';

export enum ServiceCategory {
  TUTORING = 'tutoring',
  REPAIR = 'repair',
  CLEANING = 'cleaning',
  GARDENING = 'gardening',
  TECH_SUPPORT = 'tech-support',
  PET_CARE = 'pet-care',
  DELIVERY = 'delivery',
  HANDYMAN = 'handyman',
  COOKING = 'cooking',
  FITNESS = 'fitness',
  OTHER = 'other'
}

export enum PriceType {
  HOURLY = 'hourly',
  FIXED = 'fixed',
  DAILY = 'daily'
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
}

export interface MyServicesResponse {
  services: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  category: ServiceCategory;
  price: string;
  priceType: PriceType;
  availability: string[];
  latitude: string;
  longitude: string;
}

export interface MyServicesParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'all';
  category?: string;
}

class MyServicesService {
  async getMyServices(params: MyServicesParams = {}): Promise<MyServicesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Always include inactive services
      queryParams.append('includeInactive', 'true');
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.category) queryParams.append('category', params.category);

      const url = `/services/my-services?${queryParams.toString()}`;
      const response = await apiClient.get<MyServicesResponse>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch services');
    }
  }

  async toggleServiceStatus(serviceId: string, isActive: boolean): Promise<Service> {
    try {
      const endpoint = isActive ? `/services/${serviceId}/activate` : `/services/${serviceId}/deactivate`;
      const response = await apiClient.put<Service>(endpoint);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update service status');
    }
  }

  async activateService(serviceId: string): Promise<Service> {
    try {
      const response = await apiClient.patch<Service>(`/services/${serviceId}/activate`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to activate service');
    }
  }

  async deactivateService(serviceId: string): Promise<Service> {
    try {
      const response = await apiClient.patch<Service>(`/services/${serviceId}/deactivate`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to deactivate service');
    }
  }

  async createService(serviceData: CreateServiceRequest): Promise<Service> {
    try {
      const response = await apiClient.post<Service>('/services', serviceData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create service');
    }
  }

  async deleteService(serviceId: string): Promise<void> {
    try {
      await apiClient.delete(`/services/${serviceId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete service');
    }
  }
}

export const myServicesService = new MyServicesService();