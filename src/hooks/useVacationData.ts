import { useState, useEffect } from 'react';
import { vacationService } from '../services/vacationService';
import type { VacationModel } from '../schemas/VacationModel';

export const useVacationData = () => {
  const [data, setData] = useState<VacationModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vacationService.getVacationData();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vacation data');
      console.error('Error fetching vacation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch
  };
};
