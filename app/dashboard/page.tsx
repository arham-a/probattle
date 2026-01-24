"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Tabs, Tab } from "@heroui/tabs";
import NextLink from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  // Mock data for demonstration - in real app, fetch from API
  const getStats = () => {
    switch (user.role) {
      case 'seeker':
        return [
          { label: 'Total Bookings', value: 0, color: 'primary' },
          { label: 'Active Bookings', value: 0, color: 'success' },
          { label: 'Pending Requests', value: 0, color: 'warning' },
          { label: 'Reviews Given', value: 0, color: 'default' },
        ];
      case 'provider':
        return [
          { label: 'Active Services', value: 0, color: 'primary' },
          { label: 'Pending Requests', value: 0, color: 'warning' },
          { label: 'Completion Rate', value: '100%', color: 'success' },
          { label: 'Avg Rating', value: '5.0', color: 'default' },
        ];
      case 'both':
        return [
          { label: 'Services Offered', value: 0, color: 'success' },
          { label: 'Services Booked', value: 0, color: 'primary' },
          { label: 'Completion Rate', value: '100%', color: 'warning' },
          { label: 'Total Activities', value: 0, color: 'default' },
        ];
      default:
        return [];
    }
  };

  const DashboardContent = () => (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Badge
            content={user.verified ? "✓" : "!"}
            color={user.verified ? "success" : "warning"}
            placement="bottom-right"
          >
            <Avatar
              src={user.avatar}
              className="w-16 h-16"
              name={user.name}
            />
          </Badge>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-default-600">
              {user.role === 'seeker' && 'Service Seeker Dashboard'}
              {user.role === 'provider' && 'Service Provider Dashboard'}
              {user.role === 'both' && 'Provider & Seeker Dashboard'}
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
      {user.role === 'seeker' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Bookings */}
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              <Button as={NextLink} href="/bookings" size="sm" variant="flat">
                View All
              </Button>
            </CardHeader>
            <CardBody>
              <div className="text-center py-8">
                <p className="text-default-500 mb-4">No upcoming appointments</p>
                <Button as={NextLink} href="/services" color="primary" variant="flat">
                  Browse Services
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Pending Requests</h3>
            </CardHeader>
            <CardBody>
              <div className="text-center py-8">
                <p className="text-default-500">No pending requests</p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {user.role === 'provider' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Active Services */}
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold">My Active Services</h3>
              <Button as={NextLink} href="/my-services" size="sm" variant="flat">
                Manage All
              </Button>
            </CardHeader>
            <CardBody>
              <div className="text-center py-8">
                <p className="text-default-500 mb-4">No active services</p>
                <Button as={NextLink} href="/create-service" color="primary" variant="flat">
                  Create Service
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Incoming Requests */}
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold">Incoming Requests</h3>
              <Button as={NextLink} href="/manage-bookings" size="sm" variant="flat">
                View All
              </Button>
            </CardHeader>
            <CardBody>
              <div className="text-center py-8">
                <p className="text-default-500">No pending requests</p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {user.role === 'both' && (
        <Tabs aria-label="Dashboard sections" className="w-full">
          <Tab key="provider" title="As Provider">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between">
                  <h3 className="text-lg font-semibold">My Services</h3>
                  <Button as={NextLink} href="/my-services" size="sm" variant="flat">
                    Manage All
                  </Button>
                </CardHeader>
                <CardBody>
                  <div className="text-center py-8">
                    <p className="text-default-500 mb-4">No services yet</p>
                    <Button as={NextLink} href="/create-service" color="primary" variant="flat">
                      Create Service
                    </Button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Incoming Requests</h3>
                </CardHeader>
                <CardBody>
                  <div className="text-center py-8">
                    <p className="text-default-500">No pending requests</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="seeker" title="As Seeker">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between">
                  <h3 className="text-lg font-semibold">My Active Bookings</h3>
                  <Button as={NextLink} href="/bookings" size="sm" variant="flat">
                    View All
                  </Button>
                </CardHeader>
                <CardBody>
                  <div className="text-center py-8">
                    <p className="text-default-500 mb-4">No active bookings</p>
                    <Button as={NextLink} href="/services" color="primary" variant="flat">
                      Browse Services
                    </Button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">My Pending Requests</h3>
                </CardHeader>
                <CardBody>
                  <div className="text-center py-8">
                    <p className="text-default-500">No pending requests</p>
                  </div>
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
            {(user.role === 'seeker' || user.role === 'both') && (
              <>
                <Button as={NextLink} href="/services" color="primary">
                  Browse Services
                </Button>
                <Button as={NextLink} href="/bookings" variant="flat">
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

  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}