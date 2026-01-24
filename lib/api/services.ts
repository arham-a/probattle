import { apiClient } from './config';

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  location: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  availability: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  provider: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    verified: boolean;
  };
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  location: string;
  latitude?: number;
  longitude?: number;
  availability: string;
  images?: File[];
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  isActive?: boolean;
}

export interface ServiceSearchParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

class ServicesService {
  async getServices(params?: ServiceSearchParams): Promise<{
    services: Service[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get('/services', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch services');
    }
  }

  async getService(id: string): Promise<Service> {
    try {
      const response = await apiClient.get(`/services/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch service');
    }
  }

  async createService(serviceData: CreateServiceRequest): Promise<Service> {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(serviceData).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Add images if provided
      if (serviceData.images) {
        serviceData.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await apiClient.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create service');
    }
  }

  async updateService(id: string, serviceData: UpdateServiceRequest): Promise<Service> {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.entries(serviceData).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Add images if provided
      if (serviceData.images) {
        serviceData.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await apiClient.put(`/services/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update service');
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      await apiClient.delete(`/services/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete service');
    }
  }

  async getMyServices(): Promise<Service[]> {
    try {
      const response = await apiClient.get('/services/my-services');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch your services');
    }
  }

  async searchServices(query: string, params?: Omit<ServiceSearchParams, 'search'>): Promise<{
    services: Service[];
    total: number;
  }> {
    try {
      const response = await apiClient.get('/services/search', {
        params: { search: query, ...params }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to search services');
    }
  }
}

export const servicesService = new ServicesService();