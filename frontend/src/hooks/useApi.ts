import { useState } from 'react';
import axios from 'axios';
import { Offering } from '../types';

const API_BASE_URL = 'https://spiritual-bouquet-api.juanszalegria.workers.dev';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addOffering = async (offering: Omit<Offering, 'id'>): Promise<Offering> => {
    setIsLoading(true);
    try {
      const response = await axios.post<Offering>(`${API_BASE_URL}/offerings`, offering);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const getOfferings = async (): Promise<Offering[]> => {
    setIsLoading(true);
    try {
      const response = await axios.get<Offering[]>(`${API_BASE_URL}/offerings`);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addOffering,
    getOfferings,
    isLoading,
  };
};
