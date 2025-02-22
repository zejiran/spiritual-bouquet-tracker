import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OFFERING_TYPES } from '../constants/offerings';
import { OfferingType } from '../types';
import { useApi } from '../hooks/useApi';

export const AddOffering: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [offeringType, setOfferingType] = useState<OfferingType>('eucaristia');
  const [comment, setComment] = useState<string>('');
  const { addOffering, isLoading } = useApi();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) return alert('Por favor ingresa tu nombre');

    try {
      localStorage.setItem('userName', userName);
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
      className="card max-w-lg mx-auto p-8"
    >
      {!localStorage.getItem('userName') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 animate-fade-up"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu nombre:
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input-field"
            placeholder="Ingresa tu nombre"
          />
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Ofrenda
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {OFFERING_TYPES.map((type) => (
              <motion.button
                key={type.value}
                onClick={() => setOfferingType(type.value)}
                type="button"
                className={`offering-button ${
                  offeringType === type.value
                    ? `${type.bgColor} ${type.textColor} offering-button-active`
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentario (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input-field"
            rows={3}
            placeholder="Añade un comentario personal..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`w-full px-6 py-3 rounded-xl font-medium text-white
            ${isLoading ? 'bg-primary-400' : 'bg-primary-500 hover:bg-primary-600'}
            transition-all duration-200 shadow-soft hover:shadow-lg disabled:opacity-70`}
        >
          {isLoading ? 'Añadiendo...' : 'Añadir Ofrenda'}
        </motion.button>
      </form>
    </motion.div>
  );
};
