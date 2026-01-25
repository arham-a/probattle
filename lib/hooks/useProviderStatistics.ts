import { useState, useEffect } from 'react';
import { providerStatisticsService, ProviderStatistics } from '@/lib/api/provider-statistics';

export const useProviderStatistics = () => {
  const [statistics, setStatistics] = useState<ProviderStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await providerStatisticsService.getProviderStatistics();
      setStatistics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics,
  };
};