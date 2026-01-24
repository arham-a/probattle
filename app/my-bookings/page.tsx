"use client";

import { Suspense } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function MyBookingsContent() {
  const { user } = useAuth();

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  // Mock data - in real app, fetch from API using bookingsService.getMyBookingsAsSeeker()
  const mockBookings = [
    {
      id: "1",
      serviceId: "s1",
      status: "confirmed" as const,
      scheduledDate: "2024-02-15",
      scheduledTime: "10:00 AM",
      totalAmount: 75,
      notes: "Please bring your own cleaning supplies",
      createdAt: "2024-02-10",
      service: {
        id: "s1",
        title: "House Cleaning Service",
        category: "Cleaning",
        price: 75,
        priceType: "fixed",
        images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"],
      },
      provider: {
        id: "p1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatar: "https://i.pravatar.cc/150?img=1",
        verified: true,
      },
    },
    {
      id: "2",
      serviceId: "s2",
      status: "pending" as const,
      scheduledDate: "2024-02-20",
      scheduledTime: "2:00 PM",
      totalAmount: 120,
      notes: "Need help with moving furniture",
      createdAt: "2024-02-12",
      service: {
        id: "s2",
        title: "Furniture Assembly & Moving",
        category: "Home Improvement",
        price: 40,
        priceType: "hourly",
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
      },
      provider: {
        id: "p2",
        name: "Mike Chen",
        email: "mike@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        verified: true,
      },
    },
    {
      id: "3",
      serviceId: "s3",
      status: "completed" as const,
      scheduledDate: "2024-02-05",
      scheduledTime: "9:00 AM",
      totalAmount: 90,
      notes: "Great service, very professional",
      createdAt: "2024-02-01",
      service: {
        id: "s3",
        title: "Garden Maintenance",
        category: "Gardening",
        price: 30,
        priceType: "hourly",
        images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"],
      },
      provider: {
        id: "p3",
        name: "Emma Wilson",
        email: "emma@example.com",
        avatar: "https://i.pravatar.cc/150?img=3",
        verified: true,
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      case 'in_progress': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'in_progress': return 'In Progress';
      default: return status;
    }
  };

  const BookingCard = ({ booking }: { booking: typeof mockBookings[0] }) => (
    <Card className="mb-4">
      <CardBody className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Service Image */}
          <div className="flex-shrink-0">
            <img
              src={booking.service.images?.[0] || "/placeholder-service.jpg"}
              alt={booking.service.title}
              className="w-full lg:w-32 h-32 object-cover rounded-lg"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-semibold">{booking.service.title}</h3>
                <p className="text-sm text-default-600">{booking.service.category}</p>
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
                  src={booking.provider.avatar}
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
                <span>{booking.scheduledDate} at {booking.scheduledTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-default-400">💰</span>
                <span className="font-medium">${booking.totalAmount}</span>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="mb-3">
                <div className="flex items-start gap-2 text-sm">
                  <MessageIcon className="w-4 h-4 text-default-400 mt-0.5" />
                  <p className="text-default-600">{booking.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {booking.status === 'pending' && (
                <>
                  <Button size="sm" color="danger" variant="flat">
                    Cancel Request
                  </Button>
                  <Button size="sm" variant="flat">
                    Edit Request
                  </Button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <>
                  <Button size="sm" color="primary" variant="flat">
                    Contact Provider
                  </Button>
                  <Button size="sm" variant="flat">
                    View Details
                  </Button>
                </>
              )}
              {booking.status === 'completed' && (
                <>
                  <Button size="sm" color="warning" variant="flat">
                    Leave Review
                  </Button>
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

  // Filter bookings by status
  const pendingBookings = mockBookings.filter(b => b.status === 'pending');
  const confirmedBookings = mockBookings.filter(b => b.status === 'confirmed');
  const completedBookings = mockBookings.filter(b => b.status === 'completed');
  const allBookings = mockBookings;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <div className="text-2xl font-bold text-warning">{pendingBookings.length}</div>
            <div className="text-sm text-default-600">Pending</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-success">{confirmedBookings.length}</div>
            <div className="text-sm text-default-600">Confirmed</div>
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
            <div className="text-2xl font-bold text-default">{allBookings.length}</div>
            <div className="text-sm text-default-600">Total</div>
          </CardBody>
        </Card>
      </div>

      {/* Bookings Tabs */}
      {allBookings.length === 0 ? (
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
          <Tab key="all" title={`All Bookings (${allBookings.length})`}>
            <div className="mt-4">
              {allBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </Tab>

          <Tab key="pending" title={`Pending (${pendingBookings.length})`}>
            <div className="mt-4">
              {pendingBookings.length > 0 ? (
                pendingBookings.map((booking) => (
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

          <Tab key="confirmed" title={`Confirmed (${confirmedBookings.length})`}>
            <div className="mt-4">
              {confirmedBookings.length > 0 ? (
                confirmedBookings.map((booking) => (
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