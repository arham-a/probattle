"use client";

import { useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Tabs, Tab } from "@heroui/tabs";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRouteGuard } from "@/components/admin-route-guard";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { 
  SeekerDashboardResponse, 
  ProviderDashboardResponse, 
  BothDashboardResponse 
} from "@/lib/api/dashboard";
import { serviceCategories } from "@/data/mockData";
import { LocationIcon } from "@/components/icons";

function DashboardContent() {
  const { user } = useAuth();
  const { data, isLoading, error, fetchSeekerDashboard, fetchProviderDashboard, fetchBothDashboard } = useDashboard();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'seeker':
          fetchSeekerDashboard();
          break;
        case 'provider':
          fetchProviderDashboard();
          break;
        case 'both':
          fetchBothDashboard();
          break;
      }
    }
  }, [user, fetchSeekerDashboard, fetchProviderDashboard, fetchBothDashboard]);

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-default-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger mb-4">Error Loading Dashboard</h1>
          <p className="text-default-600 mb-4">{error}</p>
          <Button 
            color="primary" 
            onPress={() => {
              switch (user.role) {
                case 'seeker':
                  fetchSeekerDashboard();
                  break;
                case 'provider':
                  fetchProviderDashboard();
                  break;
                case 'both':
                  fetchBothDashboard();
                  break;
              }
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string, priceType: string) => {
    const numPrice = parseFloat(price);
    return `$${numPrice}${priceType === 'hourly' ? '/hr' : priceType === 'daily' ? '/day' : ''}`;
  };

  const renderSeekerDashboard = (dashboardData: SeekerDashboardResponse) => {
    const stats = [
      { label: 'Total Bookings', value: dashboardData.stats.totalBookings, color: 'primary' as const },
      { label: 'Active Bookings', value: dashboardData.stats.activeBookings, color: 'success' as const },
      { label: 'Pending Requests', value: dashboardData.stats.pendingRequests, color: 'warning' as const },
      { label: 'Reviews Given', value: dashboardData.stats.reviewsGiven, color: 'default' as const },
    ];

    return (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardBody className="text-center">
                <div className={`text-3xl font-bold mb-2 text-${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-default-600">{stat.label}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              <Button as={NextLink} href="/my-bookings" size="sm" variant="flat">
                View All
              </Button>
            </CardHeader>
            <CardBody>
              {dashboardData.upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-default-500">No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      {/* Render appointment details */}
                      <p>Appointment {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Pending Requests</h3>
            </CardHeader>
            <CardBody>
              {dashboardData.pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-default-500">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.pendingRequests.map((request, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      {/* Render request details */}
                      <p>Request {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </>
    );
  };

  const renderProviderDashboard = (dashboardData: ProviderDashboardResponse) => {
    const stats = [
      { label: 'Active Services', value: dashboardData.stats.activeServices, color: 'primary' as const },
      { label: 'Pending Requests', value: dashboardData.stats.pendingRequests, color: 'warning' as const },
      { label: 'Completion Rate', value: `${dashboardData.stats.completionRate}%`, color: 'success' as const },
      { label: 'Average Rating', value: dashboardData.stats.avgRating.toFixed(1), color: 'default' as const },
    ];

    return (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardBody className="text-center">
                <div className={`text-3xl font-bold mb-2 text-${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-default-600">{stat.label}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold">Active Services</h3>
              <Button as={NextLink} href="/my-services" size="sm" variant="flat">
                View All
              </Button>
            </CardHeader>
            <CardBody>
              {dashboardData.activeServices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-default-500">No active services</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.activeServices.slice(0, 3).map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{service.title}</h4>
                        <Chip
                          size="sm"
                          variant="flat"
                          color="primary"
                        >
                          {serviceCategories.find(cat => cat.key === service.category)?.icon} {serviceCategories.find(cat => cat.key === service.category)?.label}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 mb-2">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <LocationIcon className="w-4 h-4 text-default-400" />
                          <span className="text-sm">{service.location}</span>
                        </div>
                        <span className="font-semibold text-primary">
                          {formatPrice(service.price, service.priceType)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Incoming Requests</h3>
            </CardHeader>
            <CardBody>
              {dashboardData.incomingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-default-500">No incoming requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.incomingRequests.map((request, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      {/* Render request details */}
                      <p>Request {index + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </>
    );
  };

  const renderBothDashboard = (dashboardData: BothDashboardResponse) => {
    const stats = [
      { label: 'Services Offered', value: dashboardData.stats.servicesOffered, color: 'primary' as const },
      { label: 'Services Booked', value: dashboardData.stats.servicesBooked, color: 'success' as const },
      { label: 'Completion Rate', value: `${dashboardData.stats.completionRate}%`, color: 'warning' as const },
      { label: 'Total Activities', value: dashboardData.stats.totalActivities, color: 'default' as const },
    ];

    return (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardBody className="text-center">
                <div className={`text-3xl font-bold mb-2 text-${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-default-600">{stat.label}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Tabs for Both Role */}
        <Tabs aria-label="Dashboard sections" className="w-full">
          <Tab key="provider" title="As Provider">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between">
                  <h3 className="text-lg font-semibold">My Services</h3>
                  <Button as={NextLink} href="/my-services" size="sm" variant="flat">
                    View All
                  </Button>
                </CardHeader>
                <CardBody>
                  {dashboardData.myServices.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-default-500">No services created</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dashboardData.myServices.slice(0, 3).map((service) => (
                        <div key={service.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{service.title}</h4>
                            <div className="flex gap-2">
                              <Chip
                                size="sm"
                                variant="flat"
                                color="primary"
                              >
                                {serviceCategories.find(cat => cat.key === service.category)?.icon} {serviceCategories.find(cat => cat.key === service.category)?.label}
                              </Chip>
                              <Badge color={service.isActive ? "success" : "danger"} size="sm">
                                {service.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-default-600 mb-2">{service.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <LocationIcon className="w-4 h-4 text-default-400" />
                              <span className="text-sm">{service.location}</span>
                            </div>
                            <span className="font-semibold text-primary">
                              {formatPrice(service.price, service.priceType)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Incoming Requests</h3>
                </CardHeader>
                <CardBody>
                  {dashboardData.incomingRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-default-500">No incoming requests</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dashboardData.incomingRequests.map((request, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          {/* Render request details */}
                          <p>Request {index + 1}</p>
                        </div>
                      ))}
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
                  <h3 className="text-lg font-semibold">My Bookings</h3>
                  <Button as={NextLink} href="/my-bookings" size="sm" variant="flat">
                    View All
                  </Button>
                </CardHeader>
                <CardBody>
                  <div className="text-center py-8">
                    <p className="text-default-500">No recent bookings</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Browse Services</h3>
                </CardHeader>
                <CardBody>
                  <div className="text-center py-8">
                    <p className="text-default-500 mb-4">Discover services in your area</p>
                    <Button as={NextLink} href="/services" color="primary">
                      Browse Services
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-default-600">
          Here's what's happening with your {user.role === 'both' ? 'services and bookings' : user.role === 'provider' ? 'services' : 'bookings'}
        </p>
      </div>

      {/* Dashboard Content Based on Role */}
      {data && (
        <>
          {user.role === 'seeker' && renderSeekerDashboard(data as SeekerDashboardResponse)}
          {user.role === 'provider' && renderProviderDashboard(data as ProviderDashboardResponse)}
          {user.role === 'both' && renderBothDashboard(data as BothDashboardResponse)}
        </>
      )}

      {/* Quick Actions - Role Based */}
      <Card className="mt-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            {/* Seeker Actions */}
            {(user.role === 'seeker' || user.role === 'both') && (
              <>
                <Button as={NextLink} href="/services" color="primary">
                  Browse Services
                </Button>
                <Button as={NextLink} href="/my-bookings" variant="flat">
                  My Bookings
                </Button>
              </>
            )}
            
            {/* Provider Actions */}
            {(user.role === 'provider' || user.role === 'both') && (
              <>
                <Button as={NextLink} href="/create-service" color="success">
                  Create Service
                </Button>
                <Button as={NextLink} href="/my-services" variant="flat">
                  My Services
                </Button>
                <Button as={NextLink} href="/manage-bookings" variant="flat">
                  Manage Bookings
                </Button>
              </>
            )}
            
            <Button as={NextLink} href="/account" variant="flat">
              Profile Settings
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AdminRouteGuard>
        <DashboardContent />
      </AdminRouteGuard>
    </ProtectedRoute>
  );
}