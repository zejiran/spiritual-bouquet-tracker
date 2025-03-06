import { useState, useCallback } from 'react';
import axios from 'axios';
import { Offering, Recipient } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createRecipient = useCallback(
    async (name: string): Promise<Recipient> => {
      setIsLoading(true);
      try {
        const response = await axios.post<{ recipient: Recipient }>(
          `${API_BASE_URL}/recipients`,
          { name }
        );
        return response.data.recipient;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || 'Error al crear el destinatario'
          );
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getRecipient = useCallback(
    async (recipientId: string): Promise<Recipient> => {
      setIsLoading(true);
      try {
        const response = await axios.get<Recipient>(
          `${API_BASE_URL}/recipients/${recipientId}`
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || 'Error al cargar el destinatario'
          );
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const addOffering = useCallback(
    async (
      recipientId: string,
      offering: Omit<Offering, 'id' | 'recipientId'>
    ): Promise<Offering> => {
      setIsLoading(true);
      try {
        const response = await axios.post<{ offering: Offering }>(
          `${API_BASE_URL}/recipients/${recipientId}/offerings`,
          offering
        );
        return response.data.offering;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || 'Error al guardar la ofrenda'
          );
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getOfferings = useCallback(
    async (recipientId: string): Promise<Offering[]> => {
      setIsLoading(true);
      try {
        const response = await axios.get<Offering[]>(
          `${API_BASE_URL}/recipients/${recipientId}/offerings`
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || 'Error al cargar las ofrendas'
          );
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createRecipient,
    getRecipient,
    addOffering,
    getOfferings,
    isLoading,
  };
};
