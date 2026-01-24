"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { mockUsers } from "@/data/mockData";

export default function AccountPage() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get('userId') || "1";
  const [currentUserId, setCurrentUserId] = useState(userIdFromUrl);
  
  useEffect(() => {
    setCurrentUserId(userIdFromUrl);
  }, [userIdFromUrl]);

  const currentUser = mockUsers.find(user => user.id === currentUserId);
  
  if (!currentUser) {
    return <div>User not found</div>;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'provider': return 'success';
      case 'seeker': return 'primary';
      case 'both': return 'secondary';
      default: return 'default';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'provider': return 'I offer services to my community';
      case 'seeker': return 'I look for services in my community';
      case 'both': return 'I both offer and seek services';
      default: return 'Community member';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Badge
                content={currentUser.verified ? "✓" : "!"}
                color={currentUser.verified ? "success" : "warning"}
                placement="bottom-right"
              >
                <Avatar
                  src={currentUser.avatar}
                  className="w-24 h-24"
                  name={currentUser.name}
                />
              </Badge>
              <div className="mt-4 text-center md:text-left">
                <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                <p className="text-default-600">{currentUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Chip color={getRoleColor(currentUser.role)} variant="flat" size="sm">
                    {currentUser.role.toUpperCase()}
                  </Chip>
                  {currentUser.verified && (
                    <Chip color="success" variant="flat" size="sm">
                      VERIFIED
                    </Chip>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-default-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {currentUser.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-default-600">Rating</div>
                  <div className="text-xs text-default-500">
                    {currentUser.reviewCount} reviews
                  </div>
                </div>
                
                <div className="text-center p-4 bg-default-50 rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {currentUser.role === 'seeker' ? '12' : currentUser.role === 'provider' ? '8' : '15'}
                  </div>
                  <div className="text-sm text-default-600">
                    {currentUser.role === 'seeker' ? 'Bookings' : currentUser.role === 'provider' ? 'Services' : 'Total Activities'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-default-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning">
                    {new Date(currentUser.joinedDate).getFullYear()}
                  </div>
                  <div className="text-sm text-default-600">Member Since</div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-default-700 italic">
                  "{getRoleDescription(currentUser.role)}"
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Role-specific Content */}
      <Tabs aria-label="Account sections" className="w-full">
        {/* Common tabs for all roles */}
        <Tab key="profile" title="Profile">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Profile Information</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-default-700">Role Type</label>
                  <p className="text-default-600 capitalize">{currentUser.role}</p>
                  <p className="text-xs text-default-500 mt-1">
                    {getRoleDescription(currentUser.role)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-700">Verification Status</label>
                  <p className={`text-sm ${currentUser.verified ? 'text-success' : 'text-warning'}`}>
                    {currentUser.verified ? 'Verified Account' : 'Pending Verification'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-700">Member Since</label>
                  <p className="text-default-600">
                    {new Date(currentUser.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>

        {/* Provider-specific tabs */}
        {(currentUser.role === 'provider' || currentUser.role === 'both') && (
          <Tab key="services" title="My Services">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Services I Provide</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Math & Science Tutoring</h4>
                    <p className="text-sm text-default-600 mt-1">
                      Experienced tutor offering personalized lessons
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Chip size="sm" variant="flat">$35/hour</Chip>
                      <Chip size="sm" variant="flat" color="success">Active</Chip>
                    </div>
                  </div>
                  <Button color="primary" variant="flat">
                    + Add New Service
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Tab>
        )}

        {/* Seeker-specific tabs */}
        {(currentUser.role === 'seeker' || currentUser.role === 'both') && (
          <Tab key="bookings" title="My Bookings">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">My Service Requests</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Math Tutoring Session</h4>
                    <p className="text-sm text-default-600 mt-1">
                      With Sarah Johnson • Jan 25, 2024 at 6:00 PM
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Chip size="sm" variant="flat" color="success">Confirmed</Chip>
                      <Chip size="sm" variant="flat">$70</Chip>
                    </div>
                  </div>
                  <Button color="primary" variant="flat">
                    Browse Services
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Tab>
        )}

        <Tab key="settings" title="Settings">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Account Settings</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Button color="primary" variant="flat">
                  Edit Profile
                </Button>
                <Button color="default" variant="flat">
                  Privacy Settings
                </Button>
                <Button color="default" variant="flat">
                  Notification Preferences
                </Button>
                {!currentUser.verified && (
                  <Button color="warning" variant="flat">
                    Complete Verification
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Quick Actions based on role */}
      <Card className="mt-6">
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            {(currentUser.role === 'provider' || currentUser.role === 'both') && (
              <>
                <Button color="success" variant="flat">
                  Post New Service
                </Button>
                <Button color="default" variant="flat">
                  Manage Services
                </Button>
              </>
            )}
            {(currentUser.role === 'seeker' || currentUser.role === 'both') && (
              <>
                <Button color="primary" variant="flat">
                  Find Services
                </Button>
                <Button color="default" variant="flat">
                  My Requests
                </Button>
              </>
            )}
            <Button color="default" variant="flat">
              View Messages
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}