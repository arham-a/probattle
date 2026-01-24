import { apiClient } from './config';

export interface Booking {
  id: string;
  serviceId: string;
  seekerId: string;
  providerId: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  notes?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    title: string;
    category: string;
    price: number;
    priceType: string;
    images?: string[];
  };
  seeker: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  provider: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface CreateBookingRequest {
  serviceId: string;
  scheduledDate: string;
  notes?: string;
  totalAmount: number;
}

export interface UpdateBookingRequest {
  status?: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate?: string;
  notes?: string;
  totalAmount?: number;
}

export interface BookingSearchParams {
  status?: string;
  role?: 'seeker' | 'provider';
  page?: number;
  limit?: number;
}

class BookingsService {
  async getBookings(params?: BookingSearchParams): Promise<{
    bookings: Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get('/bookings', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch bookings');
    }
  }

  async getBooking(id: string): Promise<Booking> {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch booking');
    }
  }

  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create booking');
    }
  }

  async updateBooking(id: string, bookingData: UpdateBookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update booking');
    }
  }

  async cancelBooking(id: string): Promise<Booking> {
    try {
      const response = await apiClient.put(`/bookings/${id}`, { status: 'cancelled' });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to cancel booking');
    }
  }

  async confirmBooking(id: string): Promise<Booking> {
    try {
      const response = await apiClient.put(`/bookings/${id}`, { status: 'confirmed' });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to confirm booking');
    }
  }

  async completeBooking(id: string): Promise<Booking> {
    try {
      const response = await apiClient.put(`/bookings/${id}`, { status: 'completed' });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to complete booking');
    }
  }

  async getMyBookingsAsSeeker(params?: Omit<BookingSearchParams, 'role'>): Promise<{
    bookings: Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get('/bookings', { 
        params: { ...params, role: 'seeker' } 
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch your bookings');
    }
  }

  async getMyBookingsAsProvider(params?: Omit<BookingSearchParams, 'role'>): Promise<{
    bookings: Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get('/bookings', { 
        params: { ...params, role: 'provider' } 
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch your service bookings');
    }
  }
}

export const bookingsService = new BookingsService();