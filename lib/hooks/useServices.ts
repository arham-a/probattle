import { useState, useCallback } from 'react';
import { servicesService, ServicesResponse, SearchServicesParams } from '@/lib/api/services';

export const useServices = () => {
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchServices = useCallback(async (params: SearchServicesParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await servicesService.searchServices(params);
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
    services: data?.services || [],
    pagination: data?.pagination,
    isLoading,
    error,
    searchServices,
  };
};