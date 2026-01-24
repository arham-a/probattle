"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { SearchIcon, LocationIcon, StarIcon } from "@/components/icons";
import { mockServices, serviceCategories } from "@/data/mockData";
import { ServiceListing } from "@/types";
import { useState } from "react";
import NextLink from "next/link";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredServices, setFilteredServices] = useState<ServiceListing[]>(mockServices);

  const handleSearch = () => {
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
    
    setFilteredServices(filtered);
  };

  const formatPrice = (price: number, priceType: string) => {
    return `$${price}${priceType === 'hourly' ? '/hr' : priceType === 'daily' ? '/day' : ''}`;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to Neighbourly
        </h1>
        <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto">
          Connect with your community. Share skills, tools, and services locally.
          Build trust, save money, and strengthen neighborhood bonds.
        </p>
        
        {/* Search Section */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-8">
          <Input
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<SearchIcon className="text-default-400" />}
            className="flex-1"
            size="lg"
          />
          <Select
            placeholder="Category"
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              setSelectedCategory(selectedKey || "");
            }}
            className="md:w-48"
            size="lg"
          >
            {serviceCategories.map((category) => (
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
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <CardBody>
            <h3 className="text-2xl font-bold text-primary">50+</h3>
            <p className="text-default-600">Active Services</p>
          </CardBody>
        </Card>
        <Card className="text-center">
          <CardBody>
            <h3 className="text-2xl font-bold text-secondary">25+</h3>
            <p className="text-default-600">Trusted Providers</p>
          </CardBody>
        </Card>
        <Card className="text-center">
          <CardBody>
            <h3 className="text-2xl font-bold text-success">100+</h3>
            <p className="text-default-600">Completed Bookings</p>
          </CardBody>
        </Card>
      </section>

      {/* Featured Services */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Available Services</h2>
          <Button variant="flat" color="primary" as={NextLink} href="/post-service">
            Post a Service
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
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
                <p className="text-default-600 text-sm mb-3 line-clamp-2">
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
                </div>
                
                <Divider className="my-3" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(service.price, service.priceType)}
                  </span>
                  <Button color="primary" size="sm">
                    Book Now
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Join Neighbourly?</h2>
        <p className="text-default-600 mb-6 max-w-xl mx-auto">
          Whether you're looking for services or want to offer your skills, 
          Neighbourly makes it easy to connect with your community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button color="primary" size="lg" as={NextLink} href="/services">
            Find Services
          </Button>
          <Button variant="bordered" color="primary" size="lg" as={NextLink} href="/register">
            Become a Provider
          </Button>
        </div>
      </section>
    </div>
  );
}
