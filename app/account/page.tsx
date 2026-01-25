"use client";

import { Suspense, useState, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Spinner } from "@heroui/spinner";
import NextLink from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUserProfile } from "@/lib/hooks/useUserProfile";

function AccountContent() {
  const { user } = useAuth();
  const { profile, isLoading, error, refetch, updateAvatar } = useUserProfile();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading profile...</p>
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
            <h3 className="text-lg font-semibold mb-2 text-danger">Failed to Load Profile</h3>
            <p className="text-default-600 mb-4">{error}</p>
            <Button color="primary" variant="flat" onPress={() => refetch()}>
              Try Again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
            <p className="text-default-600">Unable to load your profile information.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Debug avatar URL
  console.log('Profile avatar URL:', profile.avatar);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setNotification({ message: 'Please select an image file.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({ message: 'Image size must be less than 5MB.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      setAvatarUploading(true);
      await updateAvatar(file);
      setAvatarError(false); // Reset error state on successful upload
      setNotification({ message: 'Avatar updated successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Failed to update avatar:', error);
      setNotification({ message: 'Failed to update avatar. Please try again.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setAvatarUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-success text-success-foreground' 
            : 'bg-danger text-danger-foreground'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Profile Header */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Badge
                content={profile.verified ? "✓" : "!"}
                color={profile.verified ? "success" : "warning"}
                placement="bottom-right"
              >
                <div className="relative group">
                  {profile.avatar && !avatarError ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-24 h-24 rounded-full object-cover cursor-pointer transition-opacity group-hover:opacity-80 border-2 border-default-200"
                      onClick={handleAvatarClick}
                      onError={(e) => {
                        console.error('Failed to load avatar image:', profile.avatar);
                        setAvatarError(true);
                      }}
                      onLoad={() => {
                        console.log('Avatar loaded successfully:', profile.avatar);
                        setAvatarError(false);
                      }}
                    />
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 font-semibold text-2xl cursor-pointer transition-opacity group-hover:opacity-80 border-2 border-default-200"
                      onClick={handleAvatarClick}
                    >
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {avatarUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <Spinner size="sm" color="white" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all cursor-pointer">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Change
                    </span>
                  </div>
                </div>
              </Badge>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                size="sm"
                variant="flat"
                color="primary"
                className="mt-2"
                onPress={handleAvatarClick}
                isLoading={avatarUploading}
              >
                {avatarUploading ? "Uploading..." : "Change Avatar"}
              </Button>
              
              <div className="mt-4 text-center md:text-left">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-default-600">{profile.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Chip color={getRoleColor(profile.role)} variant="flat" size="sm">
                    {profile.role.toUpperCase()}
                  </Chip>
                  {profile.verified && (
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
                    {profile.verified ? '5.0' : 'New'}
                  </div>
                  <div className="text-sm text-default-600">Rating</div>
                  <div className="text-xs text-default-500">
                    {profile.verified ? 'Verified User' : 'No reviews yet'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-default-50 rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {profile.role === 'seeker' ? '0' : profile.role === 'provider' ? '0' : '0'}
                  </div>
                  <div className="text-sm text-default-600">
                    {profile.role === 'seeker' ? 'Bookings' : profile.role === 'provider' ? 'Services' : 'Activities'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-default-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning">
                    {new Date(profile.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-default-600">Member Since</div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-default-700 italic">
                  "{getRoleDescription(profile.role)}"
                </p>
                {profile.bio && (
                  <p className="text-default-600 mt-2">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Role-specific Content */}
      <Tabs aria-label="Account sections" className="w-full">
        <Tab key="profile" title="Profile">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Profile Information</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-default-700">Full Name</label>
                  <p className="text-default-600">{profile.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-700">Email</label>
                  <p className="text-default-600">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-700">Phone</label>
                  <p className="text-default-600">{profile.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-700">Role Type</label>
                  <p className="text-default-600 capitalize">{profile.role}</p>
                  <p className="text-xs text-default-500 mt-1">
                    {getRoleDescription(profile.role)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-700">Bio</label>
                  <p className="text-default-600">{profile.bio || 'No bio provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-700">Verification Status</label>
                  <p className={`text-sm ${profile.verified ? 'text-success' : 'text-warning'}`}>
                    {profile.verified ? 'Verified Account' : 'Pending Verification'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-default-700">Member Since</label>
                  <p className="text-default-600">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
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
        {(profile.role === 'provider' || profile.role === 'both') && (
          <Tab key="services" title="My Services">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Services I Provide</h3>
              </CardHeader>
              <CardBody>
                <div className="text-center py-8">
                  <p className="text-default-600 mb-4">
                    Manage your services from the dedicated services page.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button as={NextLink} href="/my-services" color="primary">
                      Manage My Services
                    </Button>
                    <Button as={NextLink} href="/create-service" variant="flat">
                      Create New Service
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
        )}

        {/* Seeker-specific tabs */}
        {(profile.role === 'seeker' || profile.role === 'both') && (
          <Tab key="bookings" title="My Bookings">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">My Service Requests</h3>
              </CardHeader>
              <CardBody>
                <div className="text-center py-8">
                  <p className="text-default-600 mb-4">
                    View and manage your bookings from the dedicated bookings page.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button as={NextLink} href="/my-bookings" color="primary">
                      View My Bookings
                    </Button>
                    <Button as={NextLink} href="/services" variant="flat">
                      Browse Services
                    </Button>
                  </div>
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
                {!profile.verified && (
                  <Button color="warning" variant="flat">
                    Complete Verification
                  </Button>
                )}
                <Button color="danger" variant="flat">
                  Change Password
                </Button>
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
            {(profile.role === 'provider' || profile.role === 'both') && (
              <>
                <Button as={NextLink} href="/create-service" color="success" variant="flat">
                  Create New Service
                </Button>
                <Button as={NextLink} href="/my-services" color="default" variant="flat">
                  Manage Services
                </Button>
                <Button as={NextLink} href="/manage-bookings" color="default" variant="flat">
                  Manage Bookings
                </Button>
              </>
            )}
            {(profile.role === 'seeker' || profile.role === 'both') && (
              <>
                <Button as={NextLink} href="/services" color="primary" variant="flat">
                  Find Services
                </Button>
                <Button as={NextLink} href="/my-bookings" color="default" variant="flat">
                  My Bookings
                </Button>
              </>
            )}
            <Button as={NextLink} href="/dashboard" color="default" variant="flat">
              Dashboard
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-default-600">Loading account...</p>
          </div>
        </div>
      }>
        <AccountContent />
      </Suspense>
    </ProtectedRoute>
  );
}