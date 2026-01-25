import { useState, useEffect, useCallback } from 'react';
import { myServicesService, MyServicesResponse, MyServicesParams, Service, CreateServiceRequest } from '@/lib/api/my-services';

export const useMyServices = (initialParams: MyServicesParams = {}) => {
  const [data, setData] = useState<MyServicesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<MyServicesParams>(initialParams);

  const fetchServices = useCallback(async (newParams?: MyServicesParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentParams = newParams || params;
      const response = await myServicesService.getMyServices(currentParams);
      setData(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      await myServicesService.toggleServiceStatus(serviceId, isActive);
      // Refresh the services list
      await fetchServices();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const activateService = async (serviceId: string) => {
    try {
      await myServicesService.activateService(serviceId);
      // Refresh the services list
      await fetchServices();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deactivateService = async (serviceId: string) => {
    try {
      await myServicesService.deactivateService(serviceId);
      // Refresh the services list
      await fetchServices();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const createService = async (serviceData: CreateServiceRequest) => {
    try {
      const newService = await myServicesService.createService(serviceData);
      // Refresh the services list
      await fetchServices();
      return newService;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      await myServicesService.deleteService(serviceId);
      // Refresh the services list
      await fetchServices();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateParams = (newParams: MyServicesParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services: data?.services || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: fetchServices,
    createService,
    toggleServiceStatus,
    activateService,
    deactivateService,
    deleteService,
    updateParams,
    params,
  };
};