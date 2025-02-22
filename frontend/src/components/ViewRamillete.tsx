import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { OFFERING_TYPES } from '../constants/offerings';
import { useApi } from '../hooks/useApi';
import { Offering, OfferingSummary } from '../types';

export const ViewRamillete: React.FC = () => {
  const { getOfferings, isLoading } = useApi();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [summary, setSummary] = useState<OfferingSummary>({
    eucaristia: 0,
    rosario: 0,
    ayuno: 0,
    horaSanta: 0,
    otro: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOfferings();
      setOfferings(data);

      const newSummary = data.reduce((acc: OfferingSummary, offering: Offering) => {
        acc[offering.type] = (acc[offering.type] || 0) + 1;
        return acc;
      }, {
        eucaristia: 0,
        rosario: 0,
        ayuno: 0,
        horaSanta: 0,
        otro: 0,
      });

      setSummary(newSummary);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [getOfferings]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Resumen del Ramillete
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {OFFERING_TYPES.map(type => (
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
        className="bg-white p-8 rounded-2xl shadow-xl"
      >
        <h3 className="text-xl font-bold mb-6">Registro de Ofrendas</h3>
        {isLoading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <div className="space-y-4">
            {offerings.map((offering: Offering, index: number) => (
              <motion.div
                key={offering.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-lg">{offering.userName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(offering.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-blue-600 font-medium">
                  {OFFERING_TYPES.find(t => t.value === offering.type)?.label}
                </div>
                {offering.comment && (
                  <div className="mt-2 text-gray-700">{offering.comment}</div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
