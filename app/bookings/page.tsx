"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Tabs, Tab } from "@heroui/tabs";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";
import { CalendarIcon, LocationIcon, MessageIcon, StarIcon } from "@/components/icons";
import { mockUsers, mockBookings } from "@/data/mockData";

function BookingsContent() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get('userId') || "1";
  const currentUser = mockUsers.find(user => user.id === userIdFromUrl);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">Access Denied</h1>
          <p className="text-default-600 mt-2">Please log in to view your bookings.</p>
        </div>
      </div>
    );
  }

  // Only show this page for seekers and dual role users
  if (currentUser.role === 'provider') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-warning">Page Not Available</h1>
          <p className="text-default-600 mt-2">This page is only available for service seekers.</p>
          <Button as={NextLink} href={`/dashboard?userId=${currentUser.id}`} color="primary" className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Filter bookings for this seeker
  const userBookings = mockBookings.filter(booking => booking.seekerId === currentUser.id);
  const activeBookings = userBookings.filter(booking => 
    booking.status === 'accepted' && new Date(booking.requestedDate) >= new Date()
  );
  const pendingRequests = userBookings.filter(booking => booking.status === 'pending');
  const completedBookings = userBookings.filter(booking => booking.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
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

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-4">
            <Avatar
              src={booking.service.provider.avatar}
              name={booking.service.provider.name}
              size="md"
            />
            <div>
              <h3 className="font-bold text-lg">{booking.service.title}</h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-default-600">
                  Provider: {booking.service.provider.name}
                </span>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-3 h-3 text-warning fill-current" />
                  <span className="text-xs text-default-600">
                    {booking.service.provider.rating}
                  </span>
                  {booking.service.provider.verified && (
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
                <strong>Duration:</strong> {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Total Price:</strong> 
              <span className="text-lg font-bold text-primary ml-2">
                ${booking.totalPrice}
              </span>
            </div>
            <div className="text-sm">
              <strong>Booked:</strong> {formatDate(booking.createdAt)}
            </div>
            <div className="text-sm">
              <strong>Booking ID:</strong> #{booking.id}
            </div>
          </div>
        </div>
        
        {booking.message && (
          <>
            <Divider className="my-3" />
            <div>
              <p className="text-sm font-semibold mb-1">Your Message:</p>
              <p className="text-sm text-default-600 bg-default-50 p-3 rounded-lg">
                "{booking.message}"
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
              Message Provider
            </Button>
            <Button variant="flat" size="sm">
              View Service
            </Button>
          </div>
          
          <div className="flex gap-2">
            {booking.status === 'pending' && (
              <Button color="danger" variant="flat" size="sm">
                Cancel Request
              </Button>
            )}
            {booking.status === 'accepted' && (
              <Button color="primary" size="sm">
                Contact Provider
              </Button>
            )}
            {booking.status === 'completed' && (
              <Button color="warning" variant="flat" size="sm">
                Leave Review
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-default-600">
          Manage all your service bookings and requests
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-success">{activeBookings.length}</div>
            <div className="text-sm text-default-600">Active Bookings</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-warning">{pendingRequests.length}</div>
            <div className="text-sm text-default-600">Pending Requests</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-primary">{completedBookings.length}</div>
            <div className="text-sm text-default-600">Completed</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-default-700">{userBookings.length}</div>
            <div className="text-sm text-default-600">Total Bookings</div>
          </CardBody>
        </Card>
      </div>

      {/* Bookings Tabs */}
      <Tabs 
        aria-label="Booking status" 
        className="w-full"
        classNames={{
          tabList: "gap-2 w-full relative rounded-none p-0 border-b border-divider overflow-x-auto",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-4 h-12 whitespace-nowrap flex-shrink-0",
          tabContent: "group-data-[selected=true]:text-primary text-sm font-medium"
        }}
      >
        <Tab key="active" title={`Active (${activeBookings.length})`}>
          <div className="mt-4">
            {activeBookings.length > 0 ? (
              activeBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No Active Bookings</h3>
                  <p className="text-default-600 mb-4">
                    You don't have any confirmed bookings at the moment.
                  </p>
                  <Button as={NextLink} href={`/services?userId=${currentUser.id}`} color="primary">
                    Browse Services
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>

        <Tab key="pending" title={`Pending (${pendingRequests.length})`}>
          <div className="mt-4">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                  <p className="text-default-600">
                    All your booking requests have been processed.
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>

        <Tab key="completed" title={`Completed (${completedBookings.length})`}>
          <div className="mt-4">
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No Completed Bookings</h3>
                  <p className="text-default-600">
                    Your completed bookings will appear here.
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>

        <Tab key="history" title="All History">
          <div className="mt-4">
            {userBookings.length > 0 ? (
              userBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No Booking History</h3>
                  <p className="text-default-600 mb-4">
                    Start booking services to see your history here.
                  </p>
                  <Button as={NextLink} href={`/services?userId=${currentUser.id}`} color="primary">
                    Browse Services
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>
      </Tabs>

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
              href={`/services?userId=${currentUser.id}`}
              color="primary" 
              size="lg"
            >
              Browse All Services
            </Button>
            {currentUser.role === 'both' && (
              <Button 
                as={NextLink} 
                href={`/create-service?userId=${currentUser.id}`}
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
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-default-600">Loading bookings...</p>
        </div>
      </div>
    }>
      <BookingsContent />
    </Suspense>
  );
}