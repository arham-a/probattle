"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";
import { mockUsers, mockServices, serviceCategories } from "@/data/mockData";
import CreateServiceModal from "@/components/modals/create-service-modal";

function MyServicesContent() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get('userId') || "1";
  const currentUser = mockUsers.find(user => user.id === userIdFromUrl);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">Access Denied</h1>
          <p className="text-default-600 mt-2">Please log in to view your services.</p>
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

  // Filter services for this provider
  const userServices = mockServices.filter(service => service.providerId === currentUser.id);
  const activeServices = userServices.filter(service => service.isActive);
  const inactiveServices = userServices.filter(service => !service.isActive);

  const ServiceCard = ({ service }: { service: any }) => (
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
          {service.tags.slice(0, 4).map((tag: string) => (
            <Chip key={tag} size="sm" variant="flat" color="default">
              {tag}
            </Chip>
          ))}
          {service.tags.length > 4 && (
            <Chip size="sm" variant="flat" color="default">
              +{service.tags.length - 4}
            </Chip>
          )}
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
              <Button size="sm" variant="flat">
                More Actions
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Service actions">
              <DropdownItem key="duplicate">Duplicate Service</DropdownItem>
              <DropdownItem key="promote">Promote Service</DropdownItem>
              <DropdownItem key="analytics">View Analytics</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Delete Service
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  );

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
            <div className="text-2xl font-bold text-primary">{userServices.length}</div>
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
            <div className="text-2xl font-bold text-warning">12</div>
            <div className="text-sm text-default-600">Total Bookings</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center p-4">
            <div className="text-2xl font-bold text-default-700">${(userServices.reduce((sum, service) => sum + service.price, 0) * 0.8).toFixed(0)}</div>
            <div className="text-sm text-default-600">Monthly Earnings</div>
          </CardBody>
        </Card>
      </div>

      {userServices.length === 0 ? (
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
          <Tab key="all" title={`All Services (${userServices.length})`}>
            <div className="mt-4">
              {userServices.map((service) => (
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
          // Refresh the page or update the services list
          window.location.reload();
        }}
      />
    </div>
  );
}
export default function MyServicesPage() {
  return (
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
  );
}