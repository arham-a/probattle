"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Tabs, Tab } from "@heroui/tabs";
import { useDisclosure } from "@heroui/modal";
import NextLink from "next/link";
import { mockUsers, mockBookings, mockServices } from "@/data/mockData";
import CreateServiceModal from "@/components/modals/create-service-modal";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get('userId') || "1";
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const currentUser = mockUsers.find(user => user.id === userIdFromUrl);
  
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">User not found</h1>
          <p className="text-default-600 mt-2">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // Get user data based on role
  const userServices = mockServices.filter(service => service.providerId === currentUser.id);
  const userBookings = mockBookings.filter(booking => booking.seekerId === currentUser.id);
  const incomingRequests = mockBookings.filter(booking => 
    userServices.some(service => service.id === booking.serviceId) && booking.status === 'pending'
  );
  const activeBookings = userBookings.filter(booking => 
    booking.status === 'accepted' && new Date(booking.requestedDate) >= new Date()
  );
  const pendingRequests = userBookings.filter(booking => booking.status === 'pending');
  const completedBookings = mockBookings.filter(booking => 
    userServices.some(service => service.id === booking.serviceId) && booking.status === 'completed'
  );

  const completionRate = completedBookings.length > 0 ? 
    Math.round((completedBookings.length / (completedBookings.length + incomingRequests.length)) * 100) : 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  // Role-based stats
  const getStats = () => {
    switch (currentUser.role) {
      case 'seeker':
        return [
          { label: 'Total Bookings', value: userBookings.length, color: 'primary' },
          { label: 'Active Bookings', value: activeBookings.length, color: 'success' },
          { label: 'Pending Requests', value: pendingRequests.length, color: 'warning' },
          { label: 'Reviews Given', value: currentUser.reviewCount, color: 'default' },
        ];
      case 'provider':
        return [
          { label: 'Active Services', value: userServices.filter(s => s.isActive).length, color: 'primary' },
          { label: 'Pending Requests', value: incomingRequests.length, color: 'warning' },
          { label: 'Completion Rate', value: `${completionRate}%`, color: 'success' },
          { label: 'Avg Rating', value: currentUser.rating.toFixed(1), color: 'default' },
        ];
      case 'both':
        return [
          { label: 'Services Offered', value: userServices.length, color: 'success' },
          { label: 'Services Booked', value: userBookings.length, color: 'primary' },
          { label: 'Completion Rate', value: `${completionRate}%`, color: 'warning' },
          { label: 'Total Activities', value: userServices.length + userBookings.length, color: 'default' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Badge
            content={currentUser.verified ? "✓" : "!"}
            color={currentUser.verified ? "success" : "warning"}
            placement="bottom-right"
          >
            <Avatar
              src={currentUser.avatar}
              className="w-16 h-16"
              name={currentUser.name}
            />
          </Badge>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
            <p className="text-default-600">
              {currentUser.role === 'seeker' && 'Service Seeker Dashboard'}
              {currentUser.role === 'provider' && 'Service Provider Dashboard'}
              {currentUser.role === 'both' && 'Provider & Seeker Dashboard'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {getStats().map((stat, index) => (
          <Card key={index}>
            <CardBody className="text-center p-4">
              <div className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-default-600">{stat.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Role-based Content */}
      {currentUser.role === 'seeker' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Bookings */}
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              <Button as={NextLink} href={`/my-bookings?userId=${currentUser.id}`} size="sm" variant="flat">
                View All
              </Button>
            </CardHeader>
            <CardBody>
              {activeBookings.length > 0 ? (
                <div className="space-y-3">
                  {activeBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{booking.service.title}</h4>
                        <Chip size="sm" color={getStatusColor(booking.status)} variant="flat">
                          {booking.status}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 mb-2">
                        With {booking.service.provider.name}
                      </p>
                      <div className="flex justify-between items-center text-xs text-default-500">
                        <span>{booking.requestedDate} at {booking.requestedTime}</span>
                        <span>${booking.totalPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-default-500 mb-4">No upcoming appointments</p>
                  <Button as={NextLink} href={`/services?userId=${currentUser.id}`} color="primary" variant="flat">
                    Browse Services
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Pending Requests</h3>
            </CardHeader>
            <CardBody>
              {pendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingRequests.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{booking.service.title}</h4>
                        <Chip size="sm" color="warning" variant="flat">
                          Pending
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 mb-2">
                        Waiting for {booking.service.provider.name}
                      </p>
                      <div className="flex justify-between items-center text-xs text-default-500">
                        <span>Requested: {booking.createdAt}</span>
                        <span>${booking.totalPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-default-500">No pending requests</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {currentUser.role === 'provider' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Active Services */}
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold">My Active Services</h3>
              <Button as={NextLink} href={`/my-services?userId=${currentUser.id}`} size="sm" variant="flat">
                Manage All
              </Button>
            </CardHeader>
            <CardBody>
              {userServices.filter(s => s.isActive).length > 0 ? (
                <div className="space-y-3">
                  {userServices.filter(s => s.isActive).slice(0, 3).map((service) => (
                    <div key={service.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{service.title}</h4>
                        <Chip size="sm" color="success" variant="flat">
                          Active
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 mb-2">
                        {service.category} • {service.location}
                      </p>
                      <div className="flex justify-between items-center text-xs text-default-500">
                        <span>Created: {service.createdAt}</span>
                        <span>${service.price}/{service.priceType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-default-500 mb-4">No active services</p>
                  <Button onPress={onOpen} color="primary" variant="flat">
                    Create Service
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Incoming Requests */}
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold">Incoming Requests</h3>
              <Button as={NextLink} href={`/manage-bookings?userId=${currentUser.id}`} size="sm" variant="flat">
                View All
              </Button>
            </CardHeader>
            <CardBody>
              {incomingRequests.length > 0 ? (
                <div className="space-y-3">
                  {incomingRequests.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{booking.service.title}</h4>
                        <Chip size="sm" color="warning" variant="flat">
                          Pending
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 mb-2">
                        From {booking.seeker.name}
                      </p>
                      <div className="flex justify-between items-center text-xs text-default-500">
                        <span>{booking.requestedDate} at {booking.requestedTime}</span>
                        <span>${booking.totalPrice}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" color="success" variant="flat">Accept</Button>
                        <Button size="sm" color="danger" variant="flat">Decline</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-default-500">No pending requests</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {currentUser.role === 'both' && (
        <Tabs aria-label="Dashboard sections" className="w-full">
          <Tab key="provider" title="As Provider">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between">
                  <h3 className="text-lg font-semibold">My Services</h3>
                  <Button as={NextLink} href={`/my-services?userId=${currentUser.id}`} size="sm" variant="flat">
                    Manage All
                  </Button>
                </CardHeader>
                <CardBody>
                  {userServices.length > 0 ? (
                    <div className="space-y-3">
                      {userServices.slice(0, 3).map((service) => (
                        <div key={service.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{service.title}</h4>
                            <Chip size="sm" color="success" variant="flat">Active</Chip>
                          </div>
                          <p className="text-sm text-default-600">{service.category}</p>
                          <p className="text-xs text-default-500 mt-1">${service.price}/{service.priceType}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-default-500 mb-4">No services yet</p>
                      <Button onPress={onOpen} color="primary" variant="flat">
                        Create Service
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Incoming Requests</h3>
                </CardHeader>
                <CardBody>
                  {incomingRequests.length > 0 ? (
                    <div className="space-y-3">
                      {incomingRequests.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{booking.service.title}</h4>
                            <Chip size="sm" color="warning" variant="flat">Pending</Chip>
                          </div>
                          <p className="text-sm text-default-600">From {booking.seeker.name}</p>
                          <p className="text-xs text-default-500 mt-1">${booking.totalPrice}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-default-500">No pending requests</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="seeker" title="As Seeker">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between">
                  <h3 className="text-lg font-semibold">My Active Bookings</h3>
                  <Button as={NextLink} href={`/my-bookings?userId=${currentUser.id}`} size="sm" variant="flat">
                    View All
                  </Button>
                </CardHeader>
                <CardBody>
                  {activeBookings.length > 0 ? (
                    <div className="space-y-3">
                      {activeBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{booking.service.title}</h4>
                            <Chip size="sm" color="success" variant="flat">Confirmed</Chip>
                          </div>
                          <p className="text-sm text-default-600">With {booking.service.provider.name}</p>
                          <p className="text-xs text-default-500 mt-1">
                            {booking.requestedDate} at {booking.requestedTime}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-default-500 mb-4">No active bookings</p>
                      <Button as={NextLink} href={`/services?userId=${currentUser.id}`} color="primary" variant="flat">
                        Browse Services
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">My Pending Requests</h3>
                </CardHeader>
                <CardBody>
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-3">
                      {pendingRequests.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{booking.service.title}</h4>
                            <Chip size="sm" color="warning" variant="flat">Pending</Chip>
                          </div>
                          <p className="text-sm text-default-600">Waiting for {booking.service.provider.name}</p>
                          <p className="text-xs text-default-500 mt-1">${booking.totalPrice}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-default-500">No pending requests</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      )}

      {/* Quick Actions - Role Based */}
      <Card className="mt-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            {/* Seeker Actions */}
            {(currentUser.role === 'seeker' || currentUser.role === 'both') && (
              <>
                <Button as={NextLink} href={`/services?userId=${currentUser.id}`} color="primary">
                  Browse Services
                </Button>
                <Button as={NextLink} href={`/my-bookings?userId=${currentUser.id}`} variant="flat">
                  My Bookings
                </Button>
              </>
            )}
            
            {/* Provider Actions */}
            {(currentUser.role === 'provider' || currentUser.role === 'both') && (
              <>
                <Button onPress={onOpen} color="success">
                  Create Service
                </Button>
                <Button as={NextLink} href={`/my-services?userId=${currentUser.id}`} variant="flat">
                  My Services
                </Button>
                <Button as={NextLink} href={`/manage-bookings?userId=${currentUser.id}`} variant="flat">
                  Manage Bookings
                </Button>
              </>
            )}
            
            <Button as={NextLink} href={`/account?userId=${currentUser.id}`} variant="flat">
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