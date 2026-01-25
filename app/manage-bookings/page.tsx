"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Tabs, Tab } from "@heroui/tabs";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";
import { CalendarIcon, LocationIcon, MessageIcon, StarIcon } from "@/components/icons";
import CreateServiceModal from "@/components/modals/create-service-modal";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ProviderStatistics from "@/components/provider-statistics";
import { useBookings } from "@/lib/hooks/useBookings";
import { Booking, BookingStatus } from "@/lib/api/bookings";
import { useMyServices } from "@/lib/hooks/useMyServices";
import { CreateServiceRequest } from "@/lib/api/my-services";

function ManageBookingsContent() {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    bookings,
    pendingBookings, 
    activeBookings,
    acceptedBookings,
    completedBookings,
    isLoading, 
    error, 
    refetch,
    acceptBooking,
    rejectBooking,
    completeBooking
  } = useBookings();
  
  const { createService } = useMyServices();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  // Only show this page for providers and dual role users
  if (user.role === 'seeker') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-warning">Page Not Available</h1>
          <p className="text-default-600 mt-2">This page is only available for service providers.</p>
          <Button as={NextLink} href="/dashboard" color="primary" className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Filter bookings for this provider (where user is the provider)
  const providerBookings = bookings.filter(booking => booking.providerId === user.id);
  const providerPendingRequests = pendingBookings.filter(booking => booking.providerId === user.id);
  const providerActiveBookings = activeBookings.filter(booking => booking.providerId === user.id);
  const providerAcceptedBookings = acceptedBookings.filter(booking => booking.providerId === user.id);
  const providerCompletedBookings = completedBookings.filter(booking => booking.providerId === user.id);
  
  // Calculate upcoming bookings (accepted bookings with future dates)
  const upcomingBookings = providerAcceptedBookings.filter(booking => {
    const bookingDate = new Date(booking.requestedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    return bookingDate >= today;
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACCEPTED: return 'success';
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.COMPLETED: return 'primary';
      case BookingStatus.CANCELLED: return 'danger';
      default: return 'default';
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

  const BookingRequestCard = ({ booking }: { booking: Booking }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-4">
            <Avatar
              src={booking.seeker.avatar || undefined}
              name={booking.seeker.name}
              size="md"
            />
            <div>
              <h3 className="font-bold text-lg">{booking.service.title}</h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-default-600">
                  Client: {booking.seeker.name}
                </span>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-3 h-3 text-warning fill-current" />
                  <span className="text-xs text-default-600">
                    {booking.seeker.verified ? '5.0' : 'New'}
                  </span>
                  {booking.seeker.verified && (
                    <Badge color="success" size="sm">
                      ✓
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LocationIcon className="w-4 h-4 text-default-400" />
                <span className="text-sm text-default-600">
                  {booking.service.location}
                </span>
              </div>
            </div>
          </div>
          <Chip
            color={getStatusColor(booking.status)}
            variant="flat"
            size="sm"
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Chip>
        </div>
      </CardHeader>
      
      <CardBody className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-default-400" />
              <span className="text-sm">
                <strong>Date:</strong> {formatDate(booking.requestedDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 text-center text-default-400">🕐</span>
              <span className="text-sm">
                <strong>Time:</strong> {formatTime(booking.requestedTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 text-center text-default-400">⏱️</span>
              <span className="text-sm">
                <strong>Duration:</strong> {booking.duration} hour{parseFloat(booking.duration) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Total Earnings:</strong> 
              <span className="text-lg font-bold text-success ml-2">
                ${booking.totalPrice}
              </span>
            </div>
            <div className="text-sm">
              <strong>Requested:</strong> {formatDate(booking.createdAt)}
            </div>
            <div className="text-sm">
              <strong>Booking ID:</strong> #{booking.id.slice(0, 8)}
            </div>
          </div>
        </div>
        
        {/* Rating and Review Section for Completed Bookings */}
        {booking.status === BookingStatus.COMPLETED && booking.rating && (
          <>
            <Divider className="my-4" />
            <div className="bg-default-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm">Client Review</h4>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < booking.rating!.score 
                          ? 'text-warning fill-current' 
                          : 'text-default-300'
                      }`} 
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">
                    {booking.rating.score}/5
                  </span>
                </div>
              </div>
              {booking.rating.review && (
                <p className="text-sm text-default-700 italic">
                  "{booking.rating.review}"
                </p>
              )}
              <p className="text-xs text-default-500 mt-2">
                Reviewed on {formatDate(booking.rating.createdAt)}
              </p>
            </div>
          </>
        )}
        
        <Divider className="my-4" />
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="flat"
              size="sm"
              startContent={<MessageIcon />}
            >
              Message Client
            </Button>
            <Button variant="flat" size="sm">
              View Profile
            </Button>
          </div>
          
          <div className="flex gap-2">
            {booking.status === BookingStatus.PENDING && (
              <>
                <Button 
                  color="success" 
                  size="sm"
                  isLoading={actionLoading === booking.id}
                  isDisabled={actionLoading === booking.id}
                  onPress={() => handleAcceptBooking(booking.id)}
                >
                  {actionLoading === booking.id ? "Accepting..." : "Accept Request"}
                </Button>
                <Button 
                  color="danger" 
                  variant="flat" 
                  size="sm"
                  isLoading={actionLoading === booking.id}
                  isDisabled={actionLoading === booking.id}
                  onPress={() => handleRejectBooking(booking.id)}
                >
                  {actionLoading === booking.id ? "Rejecting..." : "Decline"}
                </Button>
              </>
            )}
            {booking.status === BookingStatus.ACCEPTED && (
              <Button 
                color="primary" 
                size="sm"
                isLoading={actionLoading === booking.id}
                isDisabled={actionLoading === booking.id}
                onPress={() => handleCompleteBooking(booking.id)}
              >
                {actionLoading === booking.id ? "Completing..." : "Mark Complete"}
              </Button>
            )}
            {booking.status === BookingStatus.COMPLETED && (
              <>
                {booking.rating ? (
                  <Button color="primary" variant="flat" size="sm">
                    View Review ({booking.rating.score}/5 ⭐)
                  </Button>
                ) : (
                  <Button color="primary" variant="flat" size="sm" isDisabled>
                    No Review Yet
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading bookings...</p>
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

  const handleCreateService = async (serviceData: CreateServiceRequest) => {
    try {
      await createService(serviceData);
    } catch (error) {
      console.error('Failed to create service:', error);
      throw error;
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      await acceptBooking(bookingId);
      setNotification({ message: 'Booking request accepted successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Failed to accept booking:', error);
      setNotification({ message: 'Failed to accept booking. Please try again.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to reject this booking request? This action cannot be undone.')) {
      try {
        setActionLoading(bookingId);
        await rejectBooking(bookingId);
        setNotification({ message: 'Booking request rejected.', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        console.error('Failed to reject booking:', error);
        setNotification({ message: 'Failed to reject booking. Please try again.', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to mark this booking as complete? This action cannot be undone.')) {
      try {
        setActionLoading(bookingId);
        await completeBooking(bookingId);
        setNotification({ message: 'Booking marked as complete successfully!', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        console.error('Failed to complete booking:', error);
        setNotification({ message: 'Failed to complete booking. Please try again.', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
      } finally {
        setActionLoading(null);
      }
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">Manage Bookings</h1>
        <p className="text-default-600">
          Handle booking requests and manage your appointments
        </p>
      </div>

      {/* Tabs - Always show Statistics, conditionally show booking tabs */}
      <Tabs aria-label="Booking management" className="w-full">
        <Tab key="statistics" title="Statistics">
          <div className="mt-4">
            <ProviderStatistics />
          </div>
        </Tab>
        
        {providerBookings.length > 0 ? (
          <>
            <Tab key="requests" title={`Requests (${providerPendingRequests.length})`}>
              <div className="mt-4">
                {providerPendingRequests.length > 0 ? (
                  providerPendingRequests.map((booking) => (
                    <BookingRequestCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card>
                    <CardBody className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                      <p className="text-default-600">
                        New booking requests will appear here.
                      </p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            <Tab key="active" title={`Active Bookings (${providerActiveBookings.length})`}>
              <div className="mt-4">
                {providerActiveBookings.length > 0 ? (
                  providerActiveBookings.map((booking) => (
                    <BookingRequestCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card>
                    <CardBody className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">No Active Bookings</h3>
                      <p className="text-default-600">
                        Your accepted and completed bookings will appear here.
                      </p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            <Tab key="upcoming" title={`Upcoming (${upcomingBookings.length})`}>
              <div className="mt-4">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <BookingRequestCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card>
                    <CardBody className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">No Upcoming Bookings</h3>
                      <p className="text-default-600">
                        Your confirmed future appointments will appear here.
                      </p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            <Tab key="completed" title={`Completed (${providerCompletedBookings.length})`}>
              <div className="mt-4">
                {providerCompletedBookings.length > 0 ? (
                  providerCompletedBookings.map((booking) => (
                    <BookingRequestCard key={booking.id} booking={booking} />
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

            <Tab key="all" title={`All Bookings (${providerBookings.length})`}>
              <div className="mt-4">
                {providerBookings.map((booking) => (
                  <BookingRequestCard key={booking.id} booking={booking} />
                ))}
              </div>
            </Tab>

            {/* Add seeker bookings tab for users with role "both" */}
            {user.role === 'both' && (
              <Tab key="my-bookings" title="My Bookings as Seeker">
                <div className="mt-4">
                  <Card>
                    <CardBody className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">Your Bookings as a Seeker</h3>
                      <p className="text-default-600 mb-4">
                        View and manage services you've booked from other providers.
                      </p>
                      <Button
                        as={NextLink}
                        href="/my-bookings"
                        color="primary"
                        variant="flat"
                      >
                        View My Bookings
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              </Tab>
            )}
          </>
        ) : (
          <Tab key="getting-started" title="Getting Started">
            <div className="mt-4">
              <Card>
                <CardBody className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No Booking Requests Yet</h3>
                  <p className="text-default-600 mb-6">
                    Once clients start booking your services, you'll see their requests here.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      as={NextLink}
                      href="/my-services"
                      color="primary"
                    >
                      Manage My Services
                    </Button>
                    <Button
                      onPress={onOpen}
                      variant="flat"
                    >
                      Create New Service
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        )}
      </Tabs>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <Button
              as={NextLink}
              href="/my-services"
              color="primary"
              variant="flat"
            >
              Manage Services
            </Button>
            <Button
              onPress={onOpen}
              color="success"
              variant="flat"
            >
              Create New Service
            </Button>
            <Button
              as={NextLink}
              href="/account"
              variant="flat"
            >
              Profile Settings
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Create Service Modal */}
      <CreateServiceModal 
        isOpen={isOpen} 
        onClose={onClose}
        onSuccess={() => {
          // Services will be refreshed automatically
        }}
        onCreateService={handleCreateService}
      />
    </div>
  );
}
export default function ManageBookingsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading bookings...</p>
          </div>
        </div>
      }>
        <ManageBookingsContent />
      </Suspense>
    </ProtectedRoute>
  );
}