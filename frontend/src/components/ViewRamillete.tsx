import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { OFFERING_TYPES } from '../constants/offerings';
import { useApi } from '../hooks/useApi';
import { Offering, OfferingSummary } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { RecipientHeader } from './RecipientHeader';
import { ShareLinkBox } from './ShareLinkBox';

export const ViewRamillete: React.FC = () => {
  const navigate = useNavigate();
  const { recipientId } = useParams<{ recipientId: string }>();
  const { getOfferings, getRecipient, isLoading } = useApi();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string>('');
  const [isLoadingRecipient, setIsLoadingRecipient] = useState(false);
  const [summary, setSummary] = useState<OfferingSummary>({
    eucaristia: 0,
    rosario: 0,
    ayuno: 0,
    horaSanta: 0,
    otro: 0,
  });

  const fetchData = useCallback(async () => {
    setIsLoadingRecipient(true);
    try {
      const recipient = await getRecipient(recipientId ?? '');
      setRecipientName(recipient.name);

      const data = await getOfferings(recipientId ?? '');
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

      if (err instanceof Error && err.message.includes('not found')) {
        toast.error('No se encontró el destinatario');
        navigate('/');
      }
    } finally {
      setIsLoadingRecipient(false);
    }
  }, [getOfferings, getRecipient, recipientId, navigate]);

  const isMounted = useRef(true);
  useEffect(() => {
    if (isMounted.current) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchData]);

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${recipientId}`;
  };

  if (isLoadingRecipient) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
      <RecipientHeader recipientName={recipientName} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
          Resumen del ramillete
        </h2>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {OFFERING_TYPES.map((type, index) => (
            <motion.div
              key={type.value}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: 'spring',
                    bounce: 0.7,
                    duration: 3,
                  },
                },
              }}
              custom={index}
            >
              <AnimatedCounter
                value={summary[type.value]}
                label={type.label}
                bgColor={type.bgColor}
                textColor={type.textColor}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8">
          <ShareLinkBox shareUrl={getShareUrl()} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-8"
      >
        <h3 className="text-xl font-bold mb-6 gradient-text">
          Registro de ofrendas
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
              <p>No hay ofrendas registradas aún</p>
              <button
                onClick={() => navigate(`/${recipientId}/add`)}
                className="mt-4 px-6 py-2 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
              >
                Añadir la primera ofrenda
              </button>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: 'easeOut',
                  }}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row">
                    {offering.imageUrl && (
                      <div className="md:w-1/4 h-48 md:h-auto relative">
                        <motion.img
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          src={offering.imageUrl}
                          alt="Ofrenda"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="space-y-2">
                          <h4 className="font-bold text-lg text-gray-900">
                            {offering.userName}
                          </h4>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              OFFERING_TYPES.find(
                                (t) => t.value === offering.type
                              )?.bgColor
                            } ${
                              OFFERING_TYPES.find(
                                (t) => t.value === offering.type
                              )?.textColor
                            }`}
                          >
                            {
                              OFFERING_TYPES.find(
                                (t) => t.value === offering.type
                              )?.label
                            }
                          </span>
                        </div>
                        <time className="text-sm text-gray-500">
                          {new Date(offering.timestamp).toLocaleString(
                            'es-ES',
                            {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            }
                          )}
                        </time>
                      </div>

                      {offering.comment && (
                        <p className="text-gray-600 mt-4">{offering.comment}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
