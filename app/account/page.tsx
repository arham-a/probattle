"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip";
import { Input, Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { UserProfile } from "@/lib/api/user";

function AccountContent() {
  const { user, refreshUser } = useAuth();
  const { profile, isLoading, error, refetch, updateAvatar, updateProfile } = useUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  if (!user) return null;

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile(formData);
      refreshUser?.();
      setIsEditing(false);
      showNotification("Profile updated successfully", "success");
    } catch (err: any) {
      showNotification(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return showNotification("Please select an image", "error");

    try {
      setAvatarUploading(true);
      await updateAvatar(file);
      refreshUser?.();
      showNotification("Avatar updated", "success");
    } catch (err) {
      showNotification("Upload failed", "error");
    } finally {
      setAvatarUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      {notification && (
        <div className={`fixed top-10 right-10 z-[100] p-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest border border-white/10 backdrop-blur-xl ${notification.type === 'success' ? 'bg-success/90 text-white' : 'bg-danger/90 text-white'
          }`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Side: Identity Card */}
        <div className="w-full lg:w-1/3">
          <Card className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md shadow-2xl overflow-hidden" radius="lg">
            <div className="h-24 bg-gradient-to-r from-primary to-secondary opacity-20" />
            <CardBody className="p-8 -mt-12 flex flex-col items-center text-center">
              <Badge
                content={profile.verified ? "✓" : "!"}
                color={profile.verified ? "success" : "warning"}
                placement="bottom-right"
                size="lg"
                className="p-1"
              >
                <div
                  className="relative cursor-pointer group rounded-full p-1 bg-background shadow-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Avatar
                    src={profile.avatar || undefined}
                    name={profile.name}
                    className="w-32 h-32 text-3xl font-black border-4 border-transparent bg-default-100"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px] font-black uppercase tracking-tighter">Modify</span>
                  </div>
                  {avatarUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                      <Spinner color="white" size="sm" />
                    </div>
                  )}
                </div>
              </Badge>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              <div className="mt-6 space-y-2">
                <h1 className="text-2xl font-black tracking-tight text-default-900">{profile.name}</h1>
                <p className="text-sm font-bold text-default-500 uppercase tracking-widest opacity-60">{profile.email}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Chip size="sm" variant="flat" color="primary" className="font-black text-[10px] uppercase">{profile.role}</Chip>
                {profile.verified && <Chip size="sm" variant="flat" color="success" className="font-black text-[10px] uppercase">Verified</Chip>}
              </div>

              <Divider className="my-8 opacity-50" />

              <div className="grid grid-cols-2 gap-6 w-full">
                <div>
                  <p className="text-[10px] font-black text-default-400 uppercase tracking-widest mb-1">Success</p>
                  <p className="text-xl font-black text-primary">98%</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-default-400 uppercase tracking-widest mb-1">Joined</p>
                  <p className="text-xl font-black text-default-700">{new Date(profile.createdAt).getFullYear()}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Side: Settings */}
        <div className="flex-1">
          <Card className="border-none bg-background/60 dark:bg-default-100/30 backdrop-blur-md shadow-xl" radius="lg">
            <CardHeader className="px-10 py-8 flex justify-between items-center bg-default-50/5">
              <div>
                <h3 className="text-xl font-black text-default-900 tracking-tight">Profile Settings</h3>
                <p className="text-xs font-bold text-default-500 uppercase tracking-widest opacity-70 mt-1">Personal Identity Hub</p>
              </div>
              {!isEditing && (
                <Button
                  variant="flat"
                  color="primary"
                  radius="lg"
                  className="font-black px-8"
                  onPress={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <Divider />
            <CardBody className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  label="Display Name"
                  labelPlacement="outside"
                  variant="flat"
                  radius="lg"
                  className="font-bold"
                  readOnly={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  classNames={{ label: "text-[10px] font-black uppercase tracking-widest text-default-400 mb-2" }}
                />
                <Input
                  label="Contact Phone"
                  labelPlacement="outside"
                  variant="flat"
                  radius="lg"
                  className="font-bold"
                  readOnly={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  classNames={{ label: "text-[10px] font-black uppercase tracking-widest text-default-400 mb-2" }}
                />
              </div>

              <Textarea
                label="Professional Bio"
                labelPlacement="outside"
                variant="flat"
                radius="lg"
                minRows={6}
                className="font-medium"
                readOnly={!isEditing}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell the community about yourself..."
                classNames={{ label: "text-[10px] font-black uppercase tracking-widest text-default-400 mb-2" }}
              />

              <div className="p-6 rounded-2xl bg-default-100/50 border border-divider/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-default-400">Account Preferences</h4>
                  <Chip size="sm" variant="dot" color="default" className="text-[10px] font-black uppercase border-none">System Default</Chip>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-default-700">Login Security</p>
                    <p className="text-xs text-default-500 font-medium">Standard Email/Password AUTH</p>
                  </div>
                  <div className="space-y-1 sm:text-right">
                    <p className="text-xs font-black text-default-700">Account Type</p>
                    <p className="text-xs text-primary font-black uppercase tracking-wider">{profile.role}</p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-6">
                  <Button
                    variant="flat"
                    color="default"
                    radius="lg"
                    className="font-bold px-10"
                    onPress={() => setIsEditing(false)}
                    isDisabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    radius="lg"
                    className="font-black px-12 shadow-xl shadow-primary/20"
                    onPress={handleSave}
                    isLoading={saving}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" color="primary" />
        </div>
      }>
        <AccountContent />
      </Suspense>
    </ProtectedRoute>
  );
}