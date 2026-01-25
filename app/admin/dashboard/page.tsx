"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { StarIcon, LocationIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminServices } from "@/lib/hooks/useAdminServices";
import { AdminServicesParams } from "@/lib/api/admin";
import { serviceCategories } from "@/data/mockData";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { services, pagination, sorting, isLoading, error, fetchServices, disableService, enableService } = useAdminServices();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'lowest_rating' | 'highest_rating' | 'most_views' | 'least_views' | 'newest' | 'oldest'>('lowest_rating');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch services when filters change
  useEffect(() => {
    if (user?.role === 'admin') {
      performFetch();
    }
  }, [currentPage, sortBy, user]);

  const performFetch = async () => {
    const params: AdminServicesParams = {
      page: currentPage,
      limit: 10,
      sortBy,
    };

    try {
      await fetchServices(params);
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  const handleDisableService = async (serviceId: string) => {
    setActionLoading(serviceId);
    try {
      await disableService(serviceId);
      alert('Service disabled successfully');
    } catch (error: any) {
      alert(`Failed to disable service: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEnableService = async (serviceId: string) => {
    setActionLoading(serviceId);
    try {
      await enableService(serviceId);
      alert('Service enabled successfully');
    } catch (error: any) {
      alert(`Failed to enable service: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (price: string, priceType: string) => {
    const numPrice = parseFloat(price);
    return `$${numPrice}${priceType === 'hourly' ? '/hr' : priceType === 'daily' ? '/day' : ''}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-warning fill-current' : 'text-default-300'}`}
      />
    ));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-default-600">
          Manage services and reviews across the platform
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Filters & Sorting</h3>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <Select
                placeholder="Sort By"
                selectedKeys={[sortBy]}
                onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as any)}
                className="w-48"
              >
                {sorting?.availableSorts.map((sort) => (
                  <SelectItem key={sort}>
                    {sort.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                )) || [
                  <SelectItem key="lowest_rating">Lowest Rating</SelectItem>,
                  <SelectItem key="highest_rating">Highest Rating</SelectItem>,
                  <SelectItem key="most_views">Most Views</SelectItem>,
                  <SelectItem key="least_views">Least Views</SelectItem>,
                  <SelectItem key="newest">Newest</SelectItem>,
                  <SelectItem key="oldest">Oldest</SelectItem>
                ]}
              </Select>
            </div>
            
            <p className="text-default-600">
              {pagination?.total || 0} service{(pagination?.total || 0) !== 1 ? 's' : ''} found
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2 text-danger">Error Loading Services</h3>
          <p className="text-default-600 mb-4">{error}</p>
          <Button color="primary" onPress={performFetch}>
            Try Again
          </Button>
        </div>
      )}

      {/* Services List */}
      {!isLoading && !error && (
        <>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No services found</h3>
              <p className="text-default-600">No services match the current criteria.</p>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-8">
                {services.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex gap-4">
                          <Avatar
                            src={service.provider.avatar || undefined}
                            name={service.provider.name}
                            size="md"
                          />
                          <div>
                            <h4 className="font-semibold text-lg">{service.title}</h4>
                            <p className="text-sm text-default-600">by {service.provider.name}</p>
                            <div className="flex items-center gap-2 mt-1">
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
                              {service.provider.verified && (
                                <Badge color="success" size="sm">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary mb-1">
                            {formatPrice(service.price, service.priceType)}
                          </div>
                          <div className="text-sm text-default-600">
                            {service.views} views
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardBody className="pt-0">
                      <p className="text-default-600 mb-4">{service.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <LocationIcon className="w-4 h-4 text-default-400" />
                            <span className="text-sm">{service.location}, {service.city}</span>
                          </div>
                          <div className="text-sm text-default-600">
                            Available: {service.availability.join(', ')}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {renderStars(service.avgRating)}
                              <span className="text-sm font-medium ml-1">
                                {service.avgRating.toFixed(1)} ({service.reviewCount} review{service.reviewCount !== 1 ? 's' : ''})
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-default-600">
                            Created: {new Date(service.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Reviews Section */}
                      {service.reviews.length > 0 && (
                        <>
                          <Divider className="my-4" />
                          <div>
                            <h5 className="font-semibold mb-3">Recent Reviews</h5>
                            <div className="space-y-3">
                              {service.reviews.slice(0, 2).map((review) => (
                                <div key={review.id} className="bg-default-50 p-3 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Avatar
                                      src={review.seeker.avatar || undefined}
                                      name={review.seeker.name}
                                      size="sm"
                                    />
                                    <div>
                                      <p className="text-sm font-medium">{review.seeker.name}</p>
                                      <div className="flex items-center gap-1">
                                        {renderStars(review.score)}
                                        <span className="text-xs text-default-600 ml-1">
                                          {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-default-700">{review.review}</p>
                                </div>
                              ))}
                              {service.reviews.length > 2 && (
                                <p className="text-sm text-default-600">
                                  +{service.reviews.length - 2} more review{service.reviews.length - 2 !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      <Divider className="my-4" />
                      
                      {/* Admin Actions */}
                      <div className="flex gap-2 justify-end">
                        {service.isActive ? (
                          <Button
                            color="danger"
                            variant="flat"
                            size="sm"
                            onPress={() => handleDisableService(service.id)}
                            isLoading={actionLoading === service.id}
                          >
                            Disable Service
                          </Button>
                        ) : (
                          <Button
                            color="success"
                            variant="flat"
                            size="sm"
                            onPress={() => handleEnableService(service.id)}
                            isLoading={actionLoading === service.id}
                          >
                            Enable Service
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    total={pagination.totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                    showControls
                    showShadow
                    color="primary"
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}