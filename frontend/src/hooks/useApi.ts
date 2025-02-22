import { useState, useCallback } from 'react';
import axios from 'axios';
import { Offering } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addOffering = useCallback(async (offering: Omit<Offering, 'id'>): Promise<Offering> => {
    setIsLoading(true);
    try {
      const response = await axios.post<Offering>(`${API_BASE_URL}/offerings`, offering);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al guardar la ofrenda');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOfferings = useCallback(async (): Promise<Offering[]> => {
    setIsLoading(true);
    try {
      const response = await axios.get<Offering[]>(`${API_BASE_URL}/offerings`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al cargar las ofrendas');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    addOffering,
    getOfferings,
    isLoading,
  };
};
