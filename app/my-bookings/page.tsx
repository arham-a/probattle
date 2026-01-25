"use client";

import { Suspense, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Tabs, Tab } from "@heroui/tabs";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { useDisclosure } from "@heroui/modal";
import NextLink from "next/link";
import { CalendarIcon, LocationIcon, MessageIcon, StarIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBookings } from "@/lib/hooks/useBookings";
import { Booking, BookingStatus } from "@/lib/api/bookings";
import { ratingsService, CreateRatingRequest } from "@/lib/api/ratings";
import ReviewModal from "@/components/modals/review-modal";

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

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  // Filter bookings for this seeker (where user is the seeker)
  const seekerBookings = bookings.filter(booking => booking.seekerId === user.id);
  const seekerPendingBookings = pendingBookings.filter(booking => booking.seekerId === user.id);
  const seekerAcceptedBookings = acceptedBookings.filter(booking => booking.seekerId === user.id);
  const seekerCompletedBookings = completedBookings.filter(booking => booking.seekerId === user.id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-danger mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2 text-danger">Failed to Load Bookings</h3>
            <p className="text-default-600 mb-4">{error}</p>
            <Button color="primary" variant="flat" onPress={() => refetch()}>
              Try Again
            </Button>
          </CardBody>
        </Card>
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      // Refresh bookings to get updated data with the new rating
      await refetch();
    } catch (error) {
      console.error('Failed to submit review:', error);
      setNotification({ message: 'Failed to submit review. Please try again.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="mb-4">
      <CardBody className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Service Image */}
          <div className="flex-shrink-0">
            {booking.service.images && booking.service.images.length > 0 ? (
              <img
                src={booking.service.images[0]}
                alt={booking.service.title}
                className="w-full lg:w-32 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 text-2xl">
                  {booking.service.category === 'tutoring' ? '📚' : 
                   booking.service.category === 'repair' ? '🔧' : 
                   booking.service.category === 'cleaning' ? '🧹' : '🔧'}
                </span>
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-semibold">{booking.service.title}</h3>
                <p className="text-sm text-default-600 capitalize">{booking.service.category}</p>
              </div>
              <Chip
                size="sm"
                color={getStatusColor(booking.status)}
                variant="flat"
              >
                {getStatusText(booking.status)}
              </Chip>
            </div>

            {/* Provider Info */}
            <div className="flex items-center gap-3 mb-3">
              <Badge
                content={booking.provider.verified ? "✓" : ""}
                color="success"
                placement="bottom-right"
                size="sm"
              >
                <Avatar
                  src={booking.provider.avatar || undefined}
                  name={booking.provider.name}
                  size="sm"
                />
              </Badge>
              <div>
                <p className="font-medium text-sm">{booking.provider.name}</p>
                <p className="text-xs text-default-500">Service Provider</p>
              </div>
            </div>

            {/* Booking Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-default-400" />
                <span>{formatDate(booking.requestedDate)} at {formatTime(booking.requestedTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-default-400">💰</span>
                <span className="font-medium">${booking.totalPrice}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-default-400">⏱️</span>
                <span>{booking.duration} hour{parseFloat(booking.duration) !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <LocationIcon className="w-4 h-4 text-default-400" />
                <span>{booking.service.location}</span>
              </div>
            </div>

            {/* Rating Display */}
            {booking.rating && (
              <div className="mb-3 p-3 bg-default-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-4 h-4 ${i < booking.rating!.score ? 'text-warning fill-current' : 'text-default-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{booking.rating.score}/5</span>
                </div>
                <p className="text-sm text-default-600">"{booking.rating.review}"</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {booking.status === BookingStatus.PENDING && (
                <>
                  <Button size="sm" color="danger" variant="flat">
                    Cancel Request
                  </Button>
                  <Button size="sm" variant="flat">
                    Contact Provider
                  </Button>
                </>
              )}
              {booking.status === BookingStatus.ACCEPTED && (
                <>
                  <Button size="sm" color="primary" variant="flat">
                    Contact Provider
                  </Button>
                  <Button size="sm" variant="flat">
                    View Details
                  </Button>
                </>
              )}
              {booking.status === BookingStatus.COMPLETED && (
                <>
                  {!booking.rating ? (
                    <Button 
                      size="sm" 
                      color="warning" 
                      variant="flat"
                      onPress={() => handleReviewClick(booking)}
                      isLoading={actionLoading === booking.id}
                    >
                      {actionLoading === booking.id ? "Loading..." : "Leave Review"}
                    </Button>
                  ) : (
                    <Button size="sm" variant="flat" isDisabled>
                      Review Submitted
                    </Button>
                  )}
                  <Button size="sm" variant="flat">
                    Book Again
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-success text-success-foreground' 
            : 'bg-danger text-danger-foreground'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-default-600">
          Track and manage all your service bookings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-warning">{seekerPendingBookings.length}</div>
            <div className="text-sm text-default-600">Pending</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-success">{seekerAcceptedBookings.length}</div>
            <div className="text-sm text-default-600">Confirmed</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-primary">{seekerCompletedBookings.length}</div>
            <div className="text-sm text-default-600">Completed</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-default">{seekerBookings.length}</div>
            <div className="text-sm text-default-600">Total</div>
          </CardBody>
        </Card>
      </div>

      {/* Bookings Tabs */}
      {seekerBookings.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-default-600 mb-6">
              Start exploring services and make your first booking!
            </p>
            <Button
              as={NextLink}
              href="/services"
              color="primary"
              size="lg"
            >
              Browse Services
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Tabs aria-label="Booking status" className="w-full">
          <Tab key="all" title={`All Bookings (${seekerBookings.length})`}>
            <div className="mt-4">
              {seekerBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </Tab>

          <Tab key="pending" title={`Pending (${seekerPendingBookings.length})`}>
            <div className="mt-4">
              {seekerPendingBookings.length > 0 ? (
                seekerPendingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card>
                  <CardBody className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No Pending Bookings</h3>
                    <p className="text-default-600">
                      Your pending booking requests will appear here.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>

          <Tab key="confirmed" title={`Confirmed (${seekerAcceptedBookings.length})`}>
            <div className="mt-4">
              {seekerAcceptedBookings.length > 0 ? (
                seekerAcceptedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card>
                  <CardBody className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No Confirmed Bookings</h3>
                    <p className="text-default-600">
                      Your confirmed appointments will appear here.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>

          <Tab key="completed" title={`Completed (${seekerCompletedBookings.length})`}>
            <div className="mt-4">
              {seekerCompletedBookings.length > 0 ? (
                seekerCompletedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card>
                  <CardBody className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No Completed Bookings</h3>
                    <p className="text-default-600">
                      Your completed services will appear here.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>
        </Tabs>
      )}

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardBody className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Need More Services?</h2>
          <p className="text-default-600 mb-6 max-w-xl mx-auto">
            Explore our marketplace to find more amazing services from your neighbors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              as={NextLink} 
              href="/services"
              color="primary" 
              size="lg"
            >
              Browse All Services
            </Button>
            {user.role === 'both' && (
              <Button 
                as={NextLink} 
                href="/create-service"
                variant="bordered" 
                color="primary" 
                size="lg"
              >
                Offer Your Services
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading your bookings...</p>
          </div>
        </div>
      }>
        <MyBookingsContent />
      </Suspense>
    </ProtectedRoute>
  );
}