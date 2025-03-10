import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { OFFERING_TYPES } from '../constants/offerings';
import { useApi } from '../hooks/useApi';
import { Offering, OfferingSummary } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { Helmet } from './Helmet';
import { RecipientHeader } from './RecipientHeader';
import { ShareLinkBox } from './ShareLinkBox';

const OfferingCard = ({
  offering,
  index,
}: {
  offering: Offering;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{
        delay: Math.min(index * 0.1, 0.5),
        duration: 0.25,
        ease: 'easeOut',
      }}
      className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row">
        {offering.imageUrl && (
          <div className="md:w-1/4 h-48 md:h-auto relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }
              }
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <img
                src={offering.imageUrl}
                alt="Ofrenda"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        )}
        <div className="p-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <div className="space-y-2 mb-2 sm:mb-0">
              <h4 className="font-bold text-lg text-gray-900 truncate">
                {offering.userName}
              </h4>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  OFFERING_TYPES.find((t) => t.value === offering.type)?.bgColor
                } ${
                  OFFERING_TYPES.find((t) => t.value === offering.type)
                    ?.textColor
                }`}
              >
                {OFFERING_TYPES.find((t) => t.value === offering.type)?.label}
              </span>
            </div>
            <time className="text-sm text-gray-500 whitespace-nowrap">
              {new Date(offering.timestamp).toLocaleString('es-ES', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </time>
          </div>

          {offering.comment && (
            <motion.div
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              className="mt-4"
            >
              <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg border-l-2 border-gray-300 overflow-hidden">
                "{offering.comment}"
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

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

  const saveToRecentRamilletes = useCallback(() => {
    if (!recipientId || !recipientName) return;

    try {
      const recentRamilletesStr =
        localStorage.getItem('recentRamilletes') || '[]';
      const recentRamilletes = JSON.parse(recentRamilletesStr);

      const newEntry = {
        id: recipientId,
        name: recipientName,
        lastVisited: new Date().toISOString(),
      };

      const filteredRamilletes = recentRamilletes.filter(
        (item: { id: string }) => item.id !== recipientId
      );
      const updatedRamilletes = [newEntry, ...filteredRamilletes].slice(0, 6);

      localStorage.setItem(
        'recentRamilletes',
        JSON.stringify(updatedRamilletes)
      );
    } catch (error) {
      console.error('Error saving to recent ramilletes:', error);
    }
  }, [recipientId, recipientName]);

  const isMounted = useRef(true);
  useEffect(() => {
    if (isMounted.current) fetchData();
    if (recipientName) saveToRecentRamilletes();

    return () => {
      isMounted.current = false;
    };
  }, [fetchData, recipientName, saveToRecentRamilletes]);

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
  const totalOfferings = offerings.length;
  const uniqueContributors = new Set(offerings.map((o) => o.userName)).size;
  const featuredImages = offerings.filter((o) => o.imageUrl).slice(0, 7);
  const notableComments = offerings
    .filter((o) => o.comment && o.comment.length > 30)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {recipientName && (
        <Helmet
          title={`Ramillete ${
            recipientName.startsWith('la ') ||
            recipientName.startsWith('el ') ||
            recipientName.startsWith('las ') ||
            recipientName.startsWith('los ') ||
            recipientName.includes('y')
              ? 'por'
              : 'para'
          } ${recipientName} | Ramillete Espiritual`}
          description={`Contribuye con tus oraciones al ramillete espiritual para ${recipientName}. Ya hay ${offerings.length} ofrendas.`}
          image={offerings.find((o) => o.imageUrl)?.imageUrl}
          url={window.location.href}
        />
      )}

      <RecipientHeader recipientName={recipientName} />

      {offerings.length > 0 && (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.01,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="card p-8 relative overflow-hidden"
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
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-sm sm:max-w-none mx-auto sm:mx-0"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-2 gap-4"
          >
            <div className="bg-violet-100 rounded-xl p-5 text-center flex flex-col justify-center items-center">
              <div className="text-4xl font-bold text-violet-600 mb-1">
                {totalOfferings}
              </div>
              <div className="text-violet-800 text-sm font-medium">
                Total de ofrendas
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-5 text-center flex flex-col justify-center items-center">
              <div className="text-4xl font-bold text-indigo-600 mb-1">
                {uniqueContributors}
              </div>
              <div className="text-indigo-900 text-sm font-medium">
                Contribuyentes
              </div>
            </div>
          </motion.div>

          {featuredImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <div className="relative h-auto sm:h-48 md:h-56 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 h-full">
                  {featuredImages.map((offering, index) => (
                    <motion.div
                      key={offering.id ?? index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { delay: index * 0.2 },
                      }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      className={`relative overflow-hidden ${
                        index === 0 ? 'col-span-2 row-span-2' : ''
                      } rounded-lg shadow-md transform transition duration-300`}
                    >
                      <img
                        src={offering.imageUrl}
                        alt={`Ofrenda de ${offering.userName}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {notableComments.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <div className="relative min-h-[120px]">
                {notableComments.map((offering, index) => (
                  <motion.div
                    key={offering.id ?? `quote-${index}`}
                    initial={{
                      opacity: 0,
                      x: [-60, -40, -20][index % 3],
                      y: [20, 40, 60][index % 3],
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      transition: {
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                        delay: index * 0.3 + 0.5,
                      },
                    }}
                    className={`bg-white p-4 rounded-xl shadow-md border-l-4 overflow-hidden ${
                      [
                        'border-green-500',
                        'border-rose-500',
                        'border-amber-500',
                      ][index % 3]
                    } mb-4`}
                  >
                    <p className="text-gray-600 italic mb-2">
                      "{offering.comment}"
                    </p>
                    <p className="text-sm font-medium text-right">
                      — {offering.userName}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Compartir ramillete
              </h3>
              <ShareLinkBox shareUrl={getShareUrl()} />
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold gradient-text">
            Registro de ofrendas
          </h3>

          {offerings.length > 0 && (
            <button
              onClick={() => navigate(`/${recipientId}/add`)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors hidden md:block"
            >
              + Nueva ofrenda
            </button>
          )}
        </div>

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
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🙏</div>
              <p className="text-gray-600 mb-6">
                No hay ofrendas registradas aún
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/${recipientId}/add`)}
                className="px-6 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-soft font-medium mb-8"
              >
                Añadir la primera ofrenda
              </motion.button>

              <div className="mt-10 max-w-sm mx-auto">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    Compartir ramillete
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Comparte este enlace para invitar a otras personas a
                    contribuir con sus oraciones
                  </p>
                  <ShareLinkBox shareUrl={getShareUrl()} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {offerings.map((offering: Offering, index: number) => (
                <OfferingCard
                  key={offering.id ?? index}
                  offering={offering}
                  index={index}
                />
              ))}

              {/* Scroll to top button */}
              {offerings.length > 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center mt-8"
                >
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    className="px-5 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Volver arriba
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile add offering button */}
      {offerings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="fixed bottom-6 right-6 md:hidden z-10"
        >
          <button
            onClick={() => navigate(`/${recipientId}/add`)}
            className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors"
            aria-label="Añadir ofrenda"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
};
