"use client";

import { Suspense } from "react";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
import { SearchIcon, LocationIcon, StarIcon } from "@/components/icons";
import { mockServices, mockUsers, serviceCategories } from "@/data/mockData";
import CreateServiceModal from "@/components/modals/create-service-modal";

function ServicesContent() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get('userId') || "1";
  const currentUser = mockUsers.find(user => user.id === userIdFromUrl);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [distance, setDistance] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">Access Denied</h1>
          <p className="text-default-600 mt-2">Please log in to browse services.</p>
        </div>
      </div>
    );
  }

  const neighborhoods = Array.from(new Set(mockServices.map(service => service.location)));

  const filteredServices = useMemo(() => {
    let filtered = mockServices.filter(service => service.isActive);
    
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (selectedNeighborhood) {
      filtered = filtered.filter(service => service.location.includes(selectedNeighborhood));
    }
    
    return filtered;
  }, [searchQuery, selectedCategory, selectedNeighborhood]);

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredServices.slice(start, end);
  }, [filteredServices, currentPage]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const formatPrice = (price: number, priceType: string) => {
    return `$${price}${priceType === 'hourly' ? '/hr' : priceType === 'daily' ? '/day' : ''}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
        <p className="text-default-600">
          Discover services in your neighborhood
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Search & Filter</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<SearchIcon className="text-default-400" />}
              className="lg:col-span-2"
            />
            
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
              placeholder="Neighborhood"
              selectedKeys={selectedNeighborhood ? [selectedNeighborhood] : []}
              onSelectionChange={(keys) => setSelectedNeighborhood(Array.from(keys)[0] as string || "")}
            >
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </Select>

            <Select
              placeholder="Distance"
              selectedKeys={distance ? [distance] : []}
              onSelectionChange={(keys) => setDistance(Array.from(keys)[0] as string || "")}
            >
              <SelectItem key="5km">Within 5km</SelectItem>
              <SelectItem key="10km">Within 10km</SelectItem>
              <SelectItem key="25km">Within 25km</SelectItem>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-default-600">
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex gap-2">
              {(searchQuery || selectedCategory || selectedNeighborhood || distance) && (
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSelectedNeighborhood("");
                    setDistance("");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              )}
              {(currentUser.role === 'provider' || currentUser.role === 'both') && (
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
        </CardBody>
      </Card>

      {/* Services Grid */}
      {paginatedServices.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No services found</h3>
          <p className="text-default-600 mb-4">
            Try adjusting your search criteria or browse all categories.
          </p>
          <Button 
            color="primary" 
            onPress={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setSelectedNeighborhood("");
              setDistance("");
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex gap-3">
                      <Avatar
                        src={service.provider.avatar}
                        name={service.provider.name}
                        size="sm"
                      />
                      <div>
                        <h4 className="font-semibold text-sm">{service.provider.name}</h4>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3 h-3 text-warning fill-current" />
                          <span className="text-xs text-default-600">
                            {service.provider.rating} ({service.provider.reviewCount})
                          </span>
                          {service.provider.verified && (
                            <Badge color="success" size="sm">
                              ✓
                            </Badge>
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
                    {service.tags.slice(0, 3).map((tag) => (
                      <Chip key={tag} size="sm" variant="flat" color="default">
                        {tag}
                      </Chip>
                    ))}
                    {service.tags.length > 3 && (
                      <Chip size="sm" variant="flat" color="default">
                        +{service.tags.length - 3}
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
                        href={`/service/${service.id}?userId=${currentUser.id}`}
                        variant="flat" 
                        size="sm"
                      >
                        View Details
                      </Button>
                      {(currentUser.role === 'seeker' || currentUser.role === 'both') && (
                        <Button 
                          as={NextLink}
                          href={`/service/${service.id}/book?userId=${currentUser.id}`}
                          color="primary" 
                          size="sm"
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
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                total={totalPages}
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
export default function ServicesPage() {
  return (
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
  );
}