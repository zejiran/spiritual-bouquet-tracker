import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { OFFERING_TYPES } from '../constants/offerings';
import { useApi } from '../hooks/useApi';
import { Offering, OfferingSummary } from '../types';

export const ViewRamillete: React.FC = () => {
  const { getOfferings, isLoading } = useApi();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<OfferingSummary>({
    eucaristia: 0,
    rosario: 0,
    ayuno: 0,
    horaSanta: 0,
    otro: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const data = await getOfferings();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      setOfferings(data);
      setError(null);

      const newSummary = data.reduce(
        (acc: OfferingSummary, offering: Offering) => {
          acc[offering.type] = (acc[offering.type] || 0) + 1;
          return acc;
        },
        {
          eucaristia: 0,
          rosario: 0,
          ayuno: 0,
          horaSanta: 0,
          otro: 0,
        }
      );

      setSummary(newSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data');
      console.error('Error fetching offerings:', err);
    }
  }, [getOfferings]);

  const isMounted = useRef(true);
  useEffect(() => {
    if (isMounted.current) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchData]);

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p>Error: {error}</p>
          <button
            onClick={() => fetchData()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
          Resumen del Ramillete
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {OFFERING_TYPES.map((type) => (
            <AnimatedCounter
              key={type.value}
              value={summary[type.value]}
              label={type.label}
              bgColor={type.bgColor}
              textColor={type.textColor}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-8"
      >
        <h3 className="text-xl font-bold mb-6 gradient-text">
          Registro de Ofrendas
        </h3>

        <AnimatePresence mode="wait">
          {isLoading && offerings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Cargando ofrendas...</p>
            </motion.div>
          ) : offerings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-gray-500"
            >
              No hay ofrendas registradas aún
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {offerings.map((offering: Offering, index: number) => (
                <motion.div
                  key={offering.id ?? index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-lg text-gray-900">
                      {offering.userName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(offering.timestamp).toLocaleString('es-ES', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>
                  <div className="mt-2 text-primary-600 font-medium">
                    {OFFERING_TYPES.find((t) => t.value === offering.type)?.label}
                  </div>
                  {offering.comment && (
                    <div className="mt-2 text-gray-700">{offering.comment}</div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
