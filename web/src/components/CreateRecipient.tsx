import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { ShareLinkBox } from './ShareLinkBox';

export const CreateRecipient: React.FC = () => {
  const [recipientName, setRecipientName] = useState('');
  const [createdRecipientId, setCreatedRecipientId] = useState<string | null>(
    null
  );
  const { createRecipient, isLoading } = useApi();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName.trim()) {
      toast.error('Por favor ingresa un nombre o intención');
      return;
    }

    try {
      const recipient = await createRecipient(recipientName);
      setCreatedRecipientId(recipient.id);
      toast.success(`Ramillete creado para "${recipient.name}"`);
    } catch (error) {
      console.error('Error creating recipient:', error);
      toast.error('Error al crear el ramillete');
    }
  };

  const getShareUrl = (recipientId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${recipientId}`;
  };

  const handleNavigateToView = () => {
    if (createdRecipientId) {
      navigate(`/${createdRecipientId}`);
    }
  };

  const handleNavigateToAdd = () => {
    if (createdRecipientId) {
      navigate(`/${createdRecipientId}/add`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="card p-8">
        {!createdRecipientId ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Crear un nuevo ramillete espiritual
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Puedes crear un ramillete para una persona especial o para una
              intención particular.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre o intención del ramillete
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="input-field"
                  placeholder="Ej: Juan, la paz en el mundo, la sanación de María..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Puede ser el nombre de una persona o una intención específica
                  por la que se ofrecerán las oraciones.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Ejemplos:</span>
                </div>
                <ul className="list-disc list-inside pl-1 space-y-1">
                  <li>Una persona: "Jorge", "el hermano", "la abuela"</li>
                  <li>
                    Una causa: "la paz mundial", "las vocaciones sacerdotales"
                  </li>
                  <li>
                    Una necesidad: "la sanación de Luis", "el fin de la guerra"
                  </li>
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-xl font-medium text-white bg-primary-500 hover:bg-primary-600 transition-all duration-200 shadow-soft hover:shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Creando...
                  </div>
                ) : (
                  'Crear ramillete'
                )}
              </motion.button>
            </form>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <span className="text-green-600 text-4xl">✓</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Ramillete creado!
              </h2>
              <p className="text-gray-600 mb-2">
                El ramillete para "{recipientName}" ha sido creado exitosamente.
              </p>
              <p className="text-gray-600">
                Comparte este enlace para que otros contribuyan con sus
                oraciones y ofrendas espirituales.
              </p>
            </div>

            <ShareLinkBox shareUrl={getShareUrl(createdRecipientId)} />

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNavigateToView}
                className="flex-1 px-5 py-3 rounded-xl font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 transition-all duration-200"
              >
                Ver ramillete
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNavigateToAdd}
                className="flex-1 px-5 py-3 rounded-xl font-medium text-white bg-primary-500 hover:bg-primary-600 transition-all duration-200"
              >
                Añadir ofrenda
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
