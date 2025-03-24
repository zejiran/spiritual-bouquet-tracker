import { motion } from 'framer-motion';

export const Offline: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto card p-8 text-center mt-12"
    >
      <div className="text-5xl mb-6">📶</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Sin conexión a internet
      </h2>
      <p className="text-gray-600 mb-8">
        Parece que no tienes conexión a internet. Para usar la aplicación de
        Ramilletes Espirituales necesitas estar conectado.
      </p>
      <div className="space-y-3">
        <button
          onClick={handleRetry}
          className="w-full px-6 py-3 rounded-lg font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
        >
          Reintentar conexión
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Si el problema persiste, verifica tu conexión a internet y vuelve a
          intentarlo.
        </p>
      </div>
    </motion.div>
  );
};
