import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OFFERING_TYPES } from '../constants/offerings';
import { OfferingType } from '../types';
import { useApi } from './../hooks/useApi';

export const AddOffering: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [offeringType, setOfferingType] = useState<OfferingType>('eucaristia');
  const [comment, setComment] = useState<string>('');
  const { addOffering, isLoading } = useApi();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName) {
      return alert('Por favor ingresa tu nombre');
    }

    localStorage.setItem('userName', userName);

    try {
      await addOffering({
        type: offeringType,
        userName,
        comment,
        timestamp: new Date().toISOString(),
      });

      setComment('');
      alert('¡Ofrenda añadida exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la ofrenda');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl"
    >
      {!localStorage.getItem('userName') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium mb-2">Tu nombre:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de Ofrenda
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {OFFERING_TYPES.map((type) => (
              <motion.button
                key={type.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOfferingType(type.value)}
                type="button"
                className={`p-4 rounded-lg text-center ${
                  offeringType === type.value
                    ? `${type.bgColor} ${type.textColor} shadow-lg`
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Comentario (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Añadiendo...' : 'Añadir Ofrenda'}
        </motion.button>
      </form>
    </motion.div>
  );
};
