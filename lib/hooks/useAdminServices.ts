import { useState, useCallback } from 'react';
import { adminService, AdminServicesResponse, AdminServicesParams } from '@/lib/api/admin';

export const useAdminServices = () => {
  const [data, setData] = useState<AdminServicesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async (params: AdminServicesParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getServices(params);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableService = useCallback(async (serviceId: string) => {
    try {
      await adminService.disableService(serviceId);
      // Refresh the services list
      if (data) {
        const updatedServices = data.services.map(service => 
          service.id === serviceId ? { ...service, isActive: false } : service
        );
        setData({ ...data, services: updatedServices });
      }
    } catch (err: any) {
      throw err;
    }
  }, [data]);

  const enableService = useCallback(async (serviceId: string) => {
    try {
      await adminService.enableService(serviceId);
      // Refresh the services list
      if (data) {
        const updatedServices = data.services.map(service => 
          service.id === serviceId ? { ...service, isActive: true } : service
        );
        setData({ ...data, services: updatedServices });
      }
    } catch (err: any) {
      throw err;
    }
  }, [data]);

  return {
    services: data?.services || [],
    pagination: data?.pagination,
    sorting: data?.sorting,
    isLoading,
    error,
    fetchServices,
    disableService,
    enableService,
  };
};