"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is loaded and is an admin, redirect to admin dashboard
    if (!isLoading && user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, isLoading, router]);

  // Don't render children if user is admin (they should be redirected)
  if (!isLoading && user?.role === 'admin') {
    return null;
  }

  return <>{children}</>;
};