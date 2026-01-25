import { useState, useEffect } from 'react';
import { bookingsService, MyBookingsResponse, Booking, BookingStatus } from '@/lib/api/bookings';

export const useBookings = () => {
  const [data, setData] = useState<MyBookingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await bookingsService.getMyBookings();
      setData(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptBooking = async (bookingId: string) => {
    try {
      await bookingsService.acceptBooking(bookingId);
      // Refresh bookings after successful action
      await fetchBookings();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const rejectBooking = async (bookingId: string) => {
    try {
      await bookingsService.rejectBooking(bookingId);
      // Refresh bookings after successful action
      await fetchBookings();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const completeBooking = async (bookingId: string) => {
    try {
      await bookingsService.completeBooking(bookingId);
      // Refresh bookings after successful action
      await fetchBookings();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Separate bookings by status
  const bookings = data?.bookings || [];
  const pendingBookings = bookings.filter(booking => booking.status === BookingStatus.PENDING);
  const acceptedBookings = bookings.filter(booking => booking.status === BookingStatus.ACCEPTED);
  const completedBookings = bookings.filter(booking => booking.status === BookingStatus.COMPLETED);
  const cancelledBookings = bookings.filter(booking => booking.status === BookingStatus.CANCELLED);
  
  // Combined accepted and completed for "Active Bookings"
  const activeBookings = [...acceptedBookings, ...completedBookings];

  return {
    bookings,
    pendingBookings,
    acceptedBookings,
    completedBookings,
    cancelledBookings,
    activeBookings,
    isLoading,
    error,
    refetch: fetchBookings,
    acceptBooking,
    rejectBooking,
    completeBooking,
  };
};