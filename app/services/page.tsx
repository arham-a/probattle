"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Pagination } from "@heroui/pagination";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";
import { SearchIcon, LocationIcon } from "@/components/icons";
import { serviceCategories } from "@/data/mockData";
import CreateServiceModal from "@/components/modals/create-service-modal";
import { useServices } from "@/lib/hooks/useServices";
import { useAuth } from "@/contexts/AuthContext";
import { Slider } from "@/components/ui/slider";
import { SearchServicesParams, Service } from "@/lib/api/services";
import { myServicesService, CreateServiceRequest } from "@/lib/api/my-services";
import BookingModal from "@/components/modals/booking-modal";
import { AdminRouteGuard } from "@/components/admin-route-guard";

function ServicesContent() {
  const { user } = useAuth();
  const { services, pagination, isLoading, error, searchServices } = useServices();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isBookingOpen, onOpen: onBookingOpen, onClose: onBookingClose } = useDisclosure();

  // Selected service for booking
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [distance, setDistance] = useState(10); // Default 10km
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState<'newest' | 'nearest' | 'rating' | 'price_low' | 'price_high'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          // Set a default location if geolocation fails (you can customize this)
          setUserLocation({
            lat: 24.8607, // Default to Karachi coordinates
            lng: 67.0011
          });
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      // Set a default location if geolocation is not supported
      setUserLocation({
        lat: 24.8607, // Default to Karachi coordinates
        lng: 67.0011
      });
    }
  };

  // Search services with current filters
  const performSearch = async () => {
    // Don't search if we don't have user location yet
    if (!userLocation) {
      return;
    }

    const params: SearchServicesParams = {
      page: currentPage,
      limit: 6,
      sortBy,
      radius: distance,
      lat: userLocation.lat,
      lng: userLocation.lng,
    };

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    if (selectedCategory) {
      params.category = selectedCategory;
    }

    if (minPrice > 0) {
      params.minPrice = minPrice;
    }

    if (maxPrice < 1000) {
      params.maxPrice = maxPrice;
    }

    try {
      await searchServices(params);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Initial load and search when filters change
  useEffect(() => {
    // Get user location on component mount if not already set
    if (!userLocation) {
      getCurrentLocation();
    } else {
      performSearch();
    }
  }, [currentPage, selectedCategory, sortBy, distance, minPrice, maxPrice]);

  // Perform search when user location is set
  useEffect(() => {
    if (userLocation) {
      performSearch();
    }
  }, [userLocation]);

  // Search when user clicks search or presses enter
  const handleSearch = () => {
    setCurrentPage(1);
    performSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setDistance(10);
    setMinPrice(0);
    setMaxPrice(1000);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const formatPrice = (price: string, priceType: string) => {
    const numPrice = parseFloat(price);
    return `$${numPrice}${priceType === 'hourly' ? '/hr' : priceType === 'daily' ? '/day' : ''}`;
  };

  const handleCreateService = async (serviceData: CreateServiceRequest) => {
    try {
      await myServicesService.createService(serviceData);
      performSearch(); // Refresh services list
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    onBookingOpen();
  };

  const handleBookingSuccess = () => {
    // Show success message and optionally redirect
    alert('Booking request sent successfully! You can view your bookings in the My Bookings section.');
  };

  const sortOptions = [
    { key: 'newest', label: 'Newest First' },
    { key: 'nearest', label: 'Nearest First' },
    { key: 'rating', label: 'Highest Rated' },
    { key: 'price_low', label: 'Price: Low to High' },
    { key: 'price_high', label: 'Price: High to Low' },
  ];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">Access Denied</h1>
          <p className="text-default-600 mt-2">Please log in to browse services.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
        <p className="text-default-600">
          Discover services in your area
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Search & Filter</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* Search and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  startContent={<SearchIcon className="text-default-400" />}
                  endContent={
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={handleSearch}
                      isLoading={isLoading}
                    >
                      Search
                    </Button>
                  }
                />
              </div>
              <Button
                variant="flat"
                startContent={<LocationIcon className="w-4 h-4" />}
                onPress={getCurrentLocation}
                isLoading={locationLoading}
                color="success"
                isDisabled={true}
              >
                Location: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Getting...'}
              </Button>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                placeholder="Category"
                selectedKeys={selectedCategory ? [selectedCategory] : []}
                onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string || "")}
              >
                {serviceCategories.map((category) => (
                  <SelectItem key={category.key}>
                    {category.icon} {category.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                placeholder="Sort By"
                selectedKeys={[sortBy]}
                onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as any)}
              >
                {sortOptions.map((option) => (
                  <SelectItem key={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              <div className="flex items-center gap-2">
                <span className="text-sm text-default-600 whitespace-nowrap">Radius:</span>
                <Slider
                  min={1}
                  max={15}
                  value={distance}
                  onChange={setDistance}
                  formatValue={(value) => `${value}km`}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Price Range Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Slider
                min={0}
                max={500}
                value={minPrice}
                onChange={setMinPrice}
                label="Min Price"
                formatValue={(value) => `$${value}`}
              />
              <Slider
                min={0}
                max={1000}
                value={maxPrice}
                onChange={setMaxPrice}
                label="Max Price"
                formatValue={(value) => `$${value}`}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-default-600">
                {userLocation ? (
                  <>
                    {pagination?.total || 0} service{(pagination?.total || 0) !== 1 ? 's' : ''} found
                    {` within ${distance}km radius`}
                  </>
                ) : (
                  'Location required to search services'
                )}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={clearFilters}
                >
                  Clear Filters
                </Button>
                {(user.role === 'provider' || user.role === 'both') && (
                  <Button
                    onPress={onOpen}
                    color="success"
                    size="sm"
                  >
                    Create Service
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Loading State for Location */}
      {!userLocation && locationLoading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Getting your location...</p>
          </div>
        </div>
      )}

      {/* Location Required Message */}
      {!userLocation && !locationLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Location Required</h3>
          <p className="text-default-600 mb-4">
            We need your location to show nearby services.
          </p>
          <Button color="primary" onPress={getCurrentLocation}>
            Enable Location
          </Button>
        </div>
      )}

      {/* Loading State for Services */}
      {userLocation && isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {userLocation && error && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2 text-danger">Error Loading Services</h3>
          <p className="text-default-600 mb-4">{error}</p>
          <Button color="primary" onPress={performSearch}>
            Try Again
          </Button>
        </div>
      )}

      {/* Services Grid */}
      {userLocation && !isLoading && !error && (
        <>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No services found</h3>
              <p className="text-default-600 mb-4">
                Try adjusting your search criteria or expanding your search area.
              </p>
              <Button color="primary" onPress={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {services.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex gap-3">
                          <Avatar
                            src={service.provider.avatar || undefined}
                            name={service.provider.name}
                            size="sm"
                          />
                          <div>
                            <h4 className="font-semibold text-sm">{service.provider.name}</h4>
                            <div className="flex items-center gap-1">
                              {service.provider.verified && (
                                <Badge color="success" size="sm">
                                  ✓
                                </Badge>
                              )}
                              {service.distance && (
                                <span className="text-xs text-default-500">
                                  {service.distance.toFixed(1)}km away
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Chip
                          size="sm"
                          variant="flat"
                          color="primary"
                        >
                          {serviceCategories.find(cat => cat.key === service.category)?.icon} {serviceCategories.find(cat => cat.key === service.category)?.label}
                        </Chip>
                      </div>
                    </CardHeader>
                    
                    <CardBody className="pt-0">
                      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                      <p className="text-default-600 text-sm mb-3 line-clamp-3">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <LocationIcon className="w-4 h-4 text-default-400" />
                        <span className="text-sm text-default-600">{service.location}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {service.availability.slice(0, 3).map((day) => (
                          <Chip key={day} size="sm" variant="flat" color="default">
                            {day}
                          </Chip>
                        ))}
                        {service.availability.length > 3 && (
                          <Chip size="sm" variant="flat" color="default">
                            +{service.availability.length - 3}
                          </Chip>
                        )}
                      </div>
                      
                      <Divider className="my-3" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(service.price, service.priceType)}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            as={NextLink}
                            href={`/service/${service.id}`}
                            variant="flat" 
                            size="sm"
                          >
                            View Details
                          </Button>
                          {(user.role === 'seeker' || user.role === 'both') && (
                            <Button 
                              color="primary" 
                              size="sm"
                              onPress={() => handleBookService(service)}
                            >
                              Book Now
                            </Button>
                          )}
                        </div>
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

      {/* Create Service Modal */}
      <CreateServiceModal 
        isOpen={isOpen} 
        onClose={onClose}
        onSuccess={() => {
          performSearch(); // Refresh services list
        }}
        onCreateService={handleCreateService}
      />

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={onBookingClose}
          service={selectedService}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <AdminRouteGuard>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading services...</p>
          </div>
        </div>
      }>
        <ServicesContent />
      </Suspense>
    </AdminRouteGuard>
  );
}