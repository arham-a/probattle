import { useState, useCallback } from 'react';
import { 
  dashboardService, 
  SeekerDashboardResponse, 
  ProviderDashboardResponse, 
  BothDashboardResponse 
} from '@/lib/api/dashboard';

type DashboardData = SeekerDashboardResponse | ProviderDashboardResponse | BothDashboardResponse | null;

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeekerDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dashboardService.getSeekerDashboard();
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProviderDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dashboardService.getProviderDashboard();
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBothDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dashboardService.getBothDashboard();
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchSeekerDashboard,
    fetchProviderDashboard,
    fetchBothDashboard,
  };
};