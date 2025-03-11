import { motion } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatRamilleteTitle } from '../utils/stringUtils';

interface RecipientHeaderProps {
  recipientName: string;
}

export const RecipientHeader: React.FC<RecipientHeaderProps> = ({
  recipientName,
}) => {
  const { recipientId } = useParams<{ recipientId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isAddPage = location.pathname.endsWith('/add');
  const isViewPage = !isAddPage;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        className="relative w-fit mx-auto text-4xl sm:text-5xl font-bold text-center mb-9 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-normal"
      >
        {formatRamilleteTitle(recipientName)} 🙏
      </motion.h1>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => navigate(`/${recipientId}/add`)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isAddPage
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Nuevas ofrendas
        </button>
        <button
          onClick={() => navigate(`/${recipientId}`)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isViewPage
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Ver ramillete
        </button>
      </div>
    </motion.div>
  );
};
