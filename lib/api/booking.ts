import { apiClient } from './config';

export interface CreateBookingRequest {
  serviceId: string;
  requestedDate: string; // YYYY-MM-DD format
  requestedTime: string; // HH:MM format
  duration: number; // Duration in hours
}

export interface Booking {
  id: string;
  serviceId: string;
  seekerId: string;
  providerId: string;
  requestedDate: string;
  requestedTime: string;
  duration: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
}

class BookingService {
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await apiClient.post<Booking>('/bookings', bookingData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create booking');
    }
  }
}

export const bookingService = new BookingService();