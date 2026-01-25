"use client";

import { Suspense, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { useDisclosure } from "@heroui/modal";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBookings } from "@/lib/hooks/useBookings";
import { Booking, BookingStatus } from "@/lib/api/bookings";
import { ratingsService, CreateRatingRequest } from "@/lib/api/ratings";
import ReviewModal from "@/components/modals/review-modal";

// New Components
import { BookingStats } from "@/components/bookings/booking-stats";
import { BookingTabs } from "@/components/bookings/booking-tabs";

function MyBookingsContent() {
  const { user } = useAuth();
  const {
    bookings,
    pendingBookings,
    acceptedBookings,
    completedBookings,
    isLoading,
    error,
    refetch
  } = useBookings();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!user) return null;

  // Filter bookings for this seeker
  const seekerBookings = bookings.filter(b => b.seekerId === user.id);
  const seekerPending = pendingBookings.filter(b => b.seekerId === user.id);
  const seekerAccepted = acceptedBookings.filter(b => b.seekerId === user.id);
  const seekerCompleted = completedBookings.filter(b => b.seekerId === user.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-default-500 font-medium animate-pulse">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <div className="bg-danger/10 p-8 rounded-2xl border border-danger/20">
          <p className="text-danger font-bold text-lg mb-2">Failed to Load Bookings</p>
          <p className="text-default-500 mb-6">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-danger text-white rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACCEPTED: return 'success';
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.COMPLETED: return 'primary';
      case BookingStatus.CANCELLED: return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACCEPTED: return 'Confirmed';
      case BookingStatus.PENDING: return 'Pending';
      case BookingStatus.COMPLETED: return 'Completed';
      case BookingStatus.CANCELLED: return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleReviewClick = (booking: Booking) => {
    setSelectedBooking(booking);
    onOpen();
  };

  const handleSubmitReview = async (reviewData: CreateRatingRequest) => {
    try {
      setActionLoading(reviewData.bookingId);
      await ratingsService.createRating(reviewData);
      setNotification({ message: 'Review submitted successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
      await refetch();
    } catch (e) {
      setNotification({ message: 'Failed to submit review.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      throw e;
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-6 md:px-10 py-12 max-w-[1400px]">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-3 rounded-full shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-5 duration-300 ${notification.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'
          }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-default-900 mb-2">My Bookings</h1>
        <p className="text-default-500 font-medium">Manage and track your service requests and history.</p>
      </div>

      {/* Stats */}
      <BookingStats
        pendingCount={seekerPending.length}
        acceptedCount={seekerAccepted.length}
        completedCount={seekerCompleted.length}
        totalCount={seekerBookings.length}
      />

      {/* Tabs & List */}
      <BookingTabs
        bookings={seekerBookings}
        pendingBookings={seekerPending}
        acceptedBookings={seekerAccepted}
        completedBookings={seekerCompleted}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        formatDate={formatDate}
        formatTime={formatTime}
        onReview={handleReviewClick}
        actionLoading={actionLoading}
      />

      {/* Review Modal */}
      {selectedBooking && (
        <ReviewModal
          isOpen={isOpen}
          onClose={onClose}
          booking={selectedBooking}
          onSubmitReview={handleSubmitReview}
        />
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-default-500 font-medium">Loading your bookings...</p>
          </div>
        </div>
      }>
        <MyBookingsContent />
      </Suspense>
    </ProtectedRoute>
  );
}