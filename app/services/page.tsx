"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Pagination } from "@heroui/pagination";
import { SearchIcon, LocationIcon, StarIcon } from "@/components/icons";
import { mockServices, serviceCategories } from "@/data/mockData";
import { ServiceListing } from "@/types";
import { useState, useMemo } from "react";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredServices = useMemo(() => {
    let filtered = mockServices;
    
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
    
    return filtered;
  }, [searchQuery, selectedCategory]);

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredServices.slice(start, end);
  }, [filteredServices, currentPage]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const formatPrice = (price: number, priceType: string) => {
    return `$${price}${priceType === 'hourly' ? '/hr' : priceType === 'daily' ? '/day' : ''}`;
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Browse Services</h1>
        <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto">
          Discover amazing services offered by your neighbors. From tutoring to tech support, 
          find exactly what you need in your local community.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="bg-content1 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Search services, skills, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<SearchIcon className="text-default-400" />}
            className="flex-1"
            size="lg"
          />
          <Select
            placeholder="All Categories"
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setSelectedCategory(selectedKey || "");
            }}
            className="md:w-64"
            size="lg"
          >
            {[
              { key: "", label: "All Categories", icon: "" },
              ...serviceCategories
            ].map((category) => (
              <SelectItem key={category.key} textValue={category.label}>
                {category.icon} {category.label}
              </SelectItem>
            ))}
          </Select>
          <Button 
            color="primary" 
            size="lg"
            onClick={handleSearch}
            className="md:w-32"
          >
            Search
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-default-600">
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
          </p>
          <Button variant="flat" color="primary" size="sm">
            Post Your Service
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section>
        {paginatedServices.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-default-600 mb-4">
              Try adjusting your search criteria or browse all categories.
            </p>
            <Button 
              color="primary" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
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
                        <Button variant="flat" size="sm">
                          View Details
                        </Button>
                        <Button color="primary" size="sm">
                          Book Now
                        </Button>
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
      </section>
    </div>
  );
}