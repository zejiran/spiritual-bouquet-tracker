import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto card p-8 text-center"
    >
      <div className="text-5xl mb-6">😢</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Página no encontrada
      </h2>
      <p className="text-gray-600 mb-8">
        Lo sentimos, pero la página que buscas no existe o el ramillete no se
        encuentra disponible.
      </p>
      <div className="space-y-3">
        <button
          onClick={() => navigate('/')}
          className="w-full px-6 py-3 rounded-lg font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
        >
          Volver al inicio
        </button>
        <button
          onClick={() => navigate('/create')}
          className="w-full px-6 py-3 rounded-lg font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
        >
          Crear un nuevo ramillete
        </button>
      </div>
    </motion.div>
  );
};
