import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useNetwork } from '../contexts/NetworkContext';

export const NetworkIndicator: React.FC = () => {
  const { isOnline } = useNetwork();
  const [showIndicator, setShowIndicator] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isOnline) {
      setShowIndicator(true);
    } else {
      // Show the "online" indicator briefly when connection is restored
      setShowIndicator(true);
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showIndicator) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        } text-white text-sm font-medium flex items-center gap-2`}
      >
        <span
          className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-200' : 'bg-red-200'}`}
        ></span>
        {isOnline ? 'Conectado' : 'Sin conexión'}
      </motion.div>
    </AnimatePresence>
  );
};
