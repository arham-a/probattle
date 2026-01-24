"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Tabs, Tab } from "@heroui/tabs";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { useDisclosure } from "@heroui/modal";
import NextLink from "next/link";
import { CalendarIcon, LocationIcon, MessageIcon, StarIcon } from "@/components/icons";
import { mockUsers, mockBookings, mockServices } from "@/data/mockData";
import CreateServiceModal from "@/components/modals/create-service-modal";

export default function ManageBookingsPage() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get('userId') || "1";
  const currentUser = mockUsers.find(user => user.id === userIdFromUrl);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">Access Denied</h1>
          <p className="text-default-600 mt-2">Please log in to manage bookings.</p>
        </div>
      </div>
    );
  }

  // Only show this page for providers and dual role users
  if (currentUser.role === 'seeker') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-warning">Page Not Available</h1>
          <p className="text-default-600 mt-2">This page is only available for service providers.</p>
          <Button as={NextLink} href={`/dashboard?userId=${currentUser.id}`} color="primary" className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Get user's services
  const userServices = mockServices.filter(service => service.providerId === currentUser.id);
  
  // Filter bookings for this provider's services
  const providerBookings = mockBookings.filter(booking => 
    userServices.some(service => service.id === booking.serviceId)
  );

  const pendingRequests = providerBookings.filter(booking => booking.status === 'pending');
  const acceptedBookings = providerBookings.filter(booking => booking.status === 'accepted');
  const completedBookings = providerBookings.filter(booking => booking.status === 'completed');
  const upcomingBookings = acceptedBookings.filter(booking => 
    new Date(booking.requestedDate) >= new Date()
  );

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

  const BookingRequestCard = ({ booking }: { booking: any }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-4">
            <Avatar
              src={booking.seeker.avatar}
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
                    {booking.seeker.rating}
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
                <strong>Duration:</strong> {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
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
              <strong>Booking ID:</strong> #{booking.id}
            </div>
          </div>
        </div>
        
        {booking.message && (
          <>
            <Divider className="my-3" />
            <div>
              <p className="text-sm font-semibold mb-1">Client Message:</p>
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
              Message Client
            </Button>
            <Button variant="flat" size="sm">
              View Profile
            </Button>
          </div>
          
          <div className="flex gap-2">
            {booking.status === 'pending' && (
              <>
                <Button color="success" size="sm">
                  Accept Request
                </Button>
                <Button color="danger" variant="flat" size="sm">
                  Decline
                </Button>
              </>
            )}
            {booking.status === 'accepted' && (
              <>
                <Button color="primary" size="sm">
                  Mark Complete
                </Button>
                <Button color="warning" variant="flat" size="sm">
                  Reschedule
                </Button>
              </>
            )}
            {booking.status === 'completed' && (
              <Button color="primary" variant="flat" size="sm">
                View Review
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Bookings</h1>
        <p className="text-default-600">
          Handle booking requests and manage your appointments
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-warning">{pendingRequests.length}</div>
            <div className="text-sm text-default-600">Pending Requests</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-success">{upcomingBookings.length}</div>
            <div className="text-sm text-default-600">Upcoming Bookings</div>
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
            <div className="text-2xl font-bold text-default-700">
              ${providerBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}
            </div>
            <div className="text-sm text-default-600">Total Earnings</div>
          </CardBody>
        </Card>
      </div>

      {providerBookings.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Booking Requests Yet</h3>
            <p className="text-default-600 mb-6">
              Once clients start booking your services, you'll see their requests here.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                as={NextLink}
                href={`/my-services?userId=${currentUser.id}`}
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
      ) : (
        <Tabs aria-label="Booking status" className="w-full">
          <Tab key="pending" title={`Pending Requests (${pendingRequests.length})`}>
            <div className="mt-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((booking) => (
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
                      Your confirmed appointments will appear here.
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
        </Tabs>
      )}

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <Button
              as={NextLink}
              href={`/my-services?userId=${currentUser.id}`}
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
              href={`/account?userId=${currentUser.id}`}
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
          // Refresh the page or update the services list
          window.location.reload();
        }}
      />
    </div>
  );
}