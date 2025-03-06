import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { OFFERING_TYPES } from '../constants/offerings';
import { useApi } from '../hooks/useApi';
import { OfferingType } from '../types';
import { ImageUpload } from './ImageUpload';
import { RecipientHeader } from './RecipientHeader';

export const AddOffering: React.FC = () => {
  const navigate = useNavigate();
  const { recipientId } = useParams<{ recipientId: string }>();
  const { addOffering, getRecipient, isLoading } = useApi();
  const [userName, setUserName] = useState<string>('');
  const [offeringType, setOfferingType] = useState<OfferingType>('eucaristia');
  const [comment, setComment] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [isLoadingRecipient, setIsLoadingRecipient] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);

    const fetchRecipient = async () => {
      setIsLoadingRecipient(true);
      try {
        const recipient = await getRecipient(recipientId ?? '');
        setRecipientName(recipient.name);
      } catch (error) {
        console.error('Error fetching recipient:', error);
        toast.error('No se pudo encontrar el destinatario');
        navigate('/');
      } finally {
        setIsLoadingRecipient(false);
      }
    };

    fetchRecipient();
  }, [recipientId, getRecipient, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) {
      toast.error('Por favor ingresa tu nombre');
      return;
    }

    try {
      localStorage.setItem('userName', userName);
      await addOffering(recipientId ?? '', {
        type: offeringType,
        userName,
        comment,
        imageUrl,
        timestamp: new Date().toISOString(),
      });
      setComment('');
      setImageUrl('');
      toast.success('¡Ofrenda añadida exitosamente!');

      setTimeout(() => {
        navigate(`/${recipientId}/view`);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la ofrenda');
    }
  };

  if (isLoadingRecipient) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <RecipientHeader recipientName={recipientName} />

      <div className="card max-w-lg mx-auto p-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Formulario de ofrenda
          </h2>
          <p className="text-sm text-gray-600">
            Complete los campos y presione "Enviar ofrenda" al final del
            formulario para registrar su contribución.
          </p>
        </div>

        {!localStorage.getItem('userName') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 animate-fade-up"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu nombre
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
              Tipo de ofrenda
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

          <ImageUpload onImageUploaded={setImageUrl} />

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
            whileHover={{
              scale: 1.04,
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-3 rounded-xl font-medium text-white
                        ${isLoading ? 'bg-primary-400' : 'bg-primary-500'}
                        transition-all duration-200 shadow-soft hover:shadow-lg disabled:opacity-70`}
          >
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center"
              >
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Enviando...
              </motion.div>
            ) : (
              'Enviar ofrenda'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
