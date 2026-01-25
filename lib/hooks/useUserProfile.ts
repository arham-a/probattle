import { useState, useEffect } from 'react';
import { userService, UserProfile } from '@/lib/api/user';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.getProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setError(null);
      const updatedProfile = await userService.updateProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      setError(null);
      const updatedProfile = await userService.updateAvatar(file);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateAvatar,
    updateProfile,
  };
};