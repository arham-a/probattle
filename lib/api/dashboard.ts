import { apiClient } from './config';

// Seeker Dashboard Types
export interface SeekerStats {
  totalBookings: number;
  activeBookings: number;
  pendingRequests: number;
  reviewsGiven: number;
}

export interface SeekerDashboardResponse {
  stats: SeekerStats;
  upcomingAppointments: any[]; // You can define a proper type based on your booking structure
  pendingRequests: any[];
}

// Provider Dashboard Types
export interface ProviderStats {
  activeServices: number;
  pendingRequests: number;
  completionRate: number;
  avgRating: number;
}

export interface DashboardServiceData {
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
}

export interface ProviderDashboardResponse {
  stats: ProviderStats;
  activeServices: DashboardServiceData[];
  incomingRequests: any[];
}

// Both Role Dashboard Types
export interface BothStats {
  servicesOffered: number;
  servicesBooked: number;
  completionRate: number;
  totalActivities: number;
}

export interface BothDashboardResponse {
  stats: BothStats;
  myServices: DashboardServiceData[];
  incomingRequests: any[];
}

class DashboardService {
  async getSeekerDashboard(): Promise<SeekerDashboardResponse> {
    try {
      const response = await apiClient.get<SeekerDashboardResponse>('/dashboard/seeker');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch seeker dashboard');
    }
  }

  async getProviderDashboard(): Promise<ProviderDashboardResponse> {
    try {
      const response = await apiClient.get<ProviderDashboardResponse>('/dashboard/provider');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch provider dashboard');
    }
  }

  async getBothDashboard(): Promise<BothDashboardResponse> {
    try {
      const response = await apiClient.get<BothDashboardResponse>('/dashboard/both');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch both dashboard');
    }
  }
}

export const dashboardService = new DashboardService();