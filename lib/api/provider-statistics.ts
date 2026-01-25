import { apiClient } from './config';

export interface ProviderStatistics {
  totalBookings: number;
  pendingRequests: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  avgBookingValue: number;
  totalHoursWorked: number;
  activeServices: number;
  completionRate: number;
  topServices: {
    id: string;
    title: string;
    bookingCount: number;
    earnings: number;
  }[];
}

class ProviderStatisticsService {
  async getProviderStatistics(): Promise<ProviderStatistics> {
    try {
      const response = await apiClient.get<ProviderStatistics>('/bookings/provider-statistics');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch provider statistics');
    }
  }
}

export const providerStatisticsService = new ProviderStatisticsService();