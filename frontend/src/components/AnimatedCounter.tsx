import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  label: string;
  bgColor: string;
  textColor: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  label,
  bgColor,
  textColor,
}) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => setCount(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${bgColor} p-6 rounded-xl text-center shadow-soft animate-scale`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-4xl font-bold ${textColor} mb-1`}
      >
        {count}
      </motion.div>
      <div className={`text-sm font-medium ${textColor}`}>{label}</div>
    </motion.div>
  );
};
