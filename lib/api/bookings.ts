import { apiClient } from './config';

export enum BookingStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface User {
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
  provider: User;
}

export interface Rating {
  id: string;
  score: number;
  review: string | null;
  createdAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  seekerId: string;
  providerId: string;
  requestedDate: string;
  requestedTime: string;
  duration: string;
  status: BookingStatus;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  service: Service;
  seeker: User;
  provider: User;
  rating?: Rating; // Optional rating for completed bookings
}

export interface MyBookingsResponse {
  bookings: Booking[];
}

class BookingsService {
  async getMyBookings(): Promise<MyBookingsResponse> {
    try {
      const response = await apiClient.get<MyBookingsResponse>('/bookings/my-bookings');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch bookings');
    }
  }

  async acceptBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await apiClient.put<Booking>(`/bookings/${bookingId}/accept`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to accept booking');
    }
  }

  async rejectBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await apiClient.put<Booking>(`/bookings/${bookingId}/reject`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reject booking');
    }
  }

  async completeBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await apiClient.put<Booking>(`/bookings/${bookingId}/complete`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to complete booking');
    }
  }
}

export const bookingsService = new BookingsService();