"use client";

import { Suspense, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";
import { serviceCategories } from "@/data/mockData";
import CreateServiceModal from "@/components/modals/create-service-modal";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useMyServices } from "@/lib/hooks/useMyServices";
import { Service, CreateServiceRequest } from "@/lib/api/my-services";

function MyServicesContent() {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    services, 
    pagination, 
    isLoading, 
    error, 
    refetch, 
    createService,
    activateService,
    deactivateService,
    deleteService 
  } = useMyServices();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const activeServices = services.filter(service => service.isActive);
  const inactiveServices = services.filter(service => !service.isActive);

  const handleToggleStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      setActionLoading(serviceId);
      // If currently active, deactivate it. If currently inactive, activate it.
      if (currentStatus) {
        await deactivateService(serviceId);
      } else {
        await activateService(serviceId);
      }
    } catch (error) {
      console.error('Failed to toggle service status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateService = async (serviceData: CreateServiceRequest) => {
    try {
      await createService(serviceData);
    } catch (error) {
      console.error('Failed to create service:', error);
      throw error; // Re-throw to let the modal handle the error display
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        setActionLoading(serviceId);
        await deleteService(serviceId);
      } catch (error) {
        console.error('Failed to delete service:', error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start w-full">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{service.title}</h3>
              <div className="flex items-center gap-2">
                <Switch
                  size="sm"
                  isSelected={service.isActive}
                  color="success"
                  aria-label="Service status"
                  isDisabled={actionLoading === service.id}
                  onValueChange={() => handleToggleStatus(service.id, service.isActive)}
                />
                <Chip
                  size="sm"
                  color={service.isActive ? "success" : "default"}
                  variant="flat"
                >
                  {service.isActive ? "Active" : "Inactive"}
                </Chip>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Chip size="sm" variant="flat" color="primary">
                {serviceCategories.find(cat => cat.key === service.category)?.icon} {service.category}
              </Chip>
              <span className="text-sm text-default-600">📍 {service.location}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="pt-0">
        <p className="text-sm text-default-600 mb-3 line-clamp-2">
          {service.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-default-500">Price</p>
            <p className="font-semibold text-primary">${service.price}/{service.priceType}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">Created</p>
            <p className="font-medium">{new Date(service.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-default-500">Last Updated</p>
            <p className="font-medium">{new Date(service.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <Chip size="sm" variant="flat" color="default">
            {service.city}
          </Chip>
          <Chip size="sm" variant="flat" color="primary">
            {service.approvalStatus}
          </Chip>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button size="sm" variant="flat">
              View Details
            </Button>
            <Button size="sm" color="primary" variant="flat">
              Edit Service
            </Button>
          </div>
          
          <Dropdown>
            <DropdownTrigger>
              <Button 
                size="sm" 
                variant="flat"
                isDisabled={actionLoading === service.id}
              >
                {actionLoading === service.id ? <Spinner size="sm" /> : "More Actions"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Service actions">
              <DropdownItem key="duplicate">Duplicate Service</DropdownItem>
              <DropdownItem key="promote">Promote Service</DropdownItem>
              <DropdownItem key="analytics">View Analytics</DropdownItem>
              <DropdownItem 
                key="delete" 
                className="text-danger" 
                color="danger"
                onPress={() => handleDeleteService(service.id)}
              >
                Delete Service
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
            <p className="mt-4 text-default-600">Loading your services...</p>
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
            <h3 className="text-lg font-semibold mb-2 text-danger">Failed to Load Services</h3>
            <p className="text-default-600 mb-4">{error}</p>
            <Button color="primary" variant="flat" onPress={() => refetch()}>
              Try Again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Services</h1>
            <p className="text-default-600">
              Manage your service listings and track their performance
            </p>
          </div>
          <Button
            onPress={onOpen}
            color="primary"
            size="lg"
          >
            Create New Service
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-primary">{pagination?.total || 0}</div>
            <div className="text-sm text-default-600">Total Services</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-success">{activeServices.length}</div>
            <div className="text-sm text-default-600">Active Services</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-warning">{inactiveServices.length}</div>
            <div className="text-sm text-default-600">Inactive Services</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-default-700">
              ${services.reduce((sum, service) => sum + parseFloat(service.price), 0).toFixed(0)}
            </div>
            <div className="text-sm text-default-600">Total Value</div>
          </CardBody>
        </Card>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Services Yet</h3>
            <p className="text-default-600 mb-6">
              Start sharing your skills with the community by creating your first service.
            </p>
            <Button
              onPress={onOpen}
              color="primary"
              size="lg"
            >
              Create Your First Service
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Tabs aria-label="Service status" className="w-full">
          <Tab key="all" title={`All Services (${services.length})`}>
            <div className="mt-4">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </Tab>

          <Tab key="active" title={`Active (${activeServices.length})`}>
            <div className="mt-4">
              {activeServices.length > 0 ? (
                activeServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              ) : (
                <Card>
                  <CardBody className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No Active Services</h3>
                    <p className="text-default-600 mb-4">
                      Activate your services to start receiving bookings.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>

          <Tab key="inactive" title={`Inactive (${inactiveServices.length})`}>
            <div className="mt-4">
              {inactiveServices.length > 0 ? (
                inactiveServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              ) : (
                <Card>
                  <CardBody className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No Inactive Services</h3>
                    <p className="text-default-600">
                      All your services are currently active.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>
        </Tabs>
      )}

      {/* Tips Card */}
      <Card className="mt-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">💡 Tips for Better Service Performance</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Optimize Your Listings</h4>
              <ul className="space-y-1 text-default-600">
                <li>• Use clear, descriptive titles</li>
                <li>• Add detailed descriptions</li>
                <li>• Include relevant tags</li>
                <li>• Set competitive pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Increase Bookings</h4>
              <ul className="space-y-1 text-default-600">
                <li>• Respond quickly to requests</li>
                <li>• Maintain high service quality</li>
                <li>• Ask for reviews from clients</li>
                <li>• Update availability regularly</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Create Service Modal */}
      <CreateServiceModal 
        isOpen={isOpen} 
        onClose={onClose}
        onSuccess={() => {
          // Services list will be refreshed automatically by the hook
        }}
        onCreateService={handleCreateService}
      />
    </div>
  );
}
export default function MyServicesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading your services...</p>
          </div>
        </div>
      }>
        <MyServicesContent />
      </Suspense>
    </ProtectedRoute>
  );
}