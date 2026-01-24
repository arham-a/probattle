"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Tabs, Tab } from "@heroui/tabs";
import { Badge } from "@heroui/badge";
import { CalendarIcon, LocationIcon, MessageIcon, StarIcon } from "@/components/icons";
import { mockBookings } from "@/data/mockData";
import { BookingRequest } from "@/types";
import { useState } from "react";

export default function BookingsPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const getStatusColor = (status: BookingRequest['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      case 'completed': return 'primary';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: BookingRequest['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredBookings = mockBookings.filter(booking => {
    if (selectedTab === 'all') return true;
    return booking.status === selectedTab;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
        <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto">
          Manage your service bookings and track their status. Stay connected with your service providers.
        </p>
      </section>

      {/* Tabs for filtering */}
      <section>
        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
          }}
        >
          <Tab key="all" title="All Bookings" />
          <Tab key="pending" title="Pending" />
          <Tab key="accepted" title="Accepted" />
          <Tab key="completed" title="Completed" />
        </Tabs>
      </section>

      {/* Bookings List */}
      <section>
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-default-600 mb-4">
              {selectedTab === 'all' 
                ? "You haven't made any bookings yet. Browse services to get started!"
                : `No ${selectedTab} bookings at the moment.`
              }
            </p>
            <Button color="primary" href="/services">
              Browse Services
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex gap-4">
                      <Avatar
                        src={booking.service.provider.avatar}
                        name={booking.service.provider.name}
                        size="md"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{booking.service.title}</h3>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-default-600">
                            Provider: {booking.service.provider.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-3 h-3 text-warning fill-current" />
                            <span className="text-xs text-default-600">
                              {booking.service.provider.rating}
                            </span>
                            {booking.service.provider.verified && (
                              <Badge color="success" size="sm">
                                ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <LocationIcon className="w-4 h-4 text-default-400" />
                          <span className="text-sm text-default-600">
                            {booking.service.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Chip
                      color={getStatusColor(booking.status)}
                      variant="flat"
                      size="sm"
                    >
                      {getStatusText(booking.status)}
                    </Chip>
                  </div>
                </CardHeader>
                
                <CardBody className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-default-400" />
                        <span className="text-sm">
                          <strong>Date:</strong> {formatDate(booking.requestedDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 text-center text-default-400">🕐</span>
                        <span className="text-sm">
                          <strong>Time:</strong> {formatTime(booking.requestedTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 text-center text-default-400">⏱️</span>
                        <span className="text-sm">
                          <strong>Duration:</strong> {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Total Price:</strong> 
                        <span className="text-lg font-bold text-primary ml-2">
                          ${booking.totalPrice}
                        </span>
                      </div>
                      <div className="text-sm">
                        <strong>Booked:</strong> {formatDate(booking.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {booking.message && (
                    <>
                      <Divider className="my-3" />
                      <div>
                        <p className="text-sm font-semibold mb-1">Your Message:</p>
                        <p className="text-sm text-default-600 bg-default-50 p-3 rounded-lg">
                          "{booking.message}"
                        </p>
                      </div>
                    </>
                  )}
                  
                  <Divider className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="flat"
                        size="sm"
                        startContent={<MessageIcon />}
                      >
                        Message Provider
                      </Button>
                      <Button variant="flat" size="sm">
                        View Service
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <Button color="danger" variant="flat" size="sm">
                          Cancel
                        </Button>
                      )}
                      {booking.status === 'accepted' && (
                        <Button color="success" size="sm">
                          Mark Complete
                        </Button>
                      )}
                      {booking.status === 'completed' && (
                        <Button color="primary" variant="flat" size="sm">
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Need More Services?</h2>
        <p className="text-default-600 mb-6 max-w-xl mx-auto">
          Explore our marketplace to find more amazing services from your neighbors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button color="primary" size="lg" href="/services">
            Browse All Services
          </Button>
          <Button variant="bordered" color="primary" size="lg" href="/post-service">
            Offer Your Services
          </Button>
        </div>
      </section>
    </div>
  );
}