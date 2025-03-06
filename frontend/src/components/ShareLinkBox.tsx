import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ShareLinkBoxProps {
  shareUrl: string;
}

export const ShareLinkBox: React.FC<ShareLinkBoxProps> = ({ shareUrl }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('No se pudo copiar el enlace');
    }
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Ramillete Espiritual',
          text: 'Contribuye a este ramillete espiritual con tus oraciones',
          url: shareUrl,
        })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-2">
      {/* Input field and copy button - hidden on mobile, visible on md and up */}
      <div className="hidden md:flex items-stretch">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="flex-1 py-3 px-4 rounded-l-lg bg-gray-50 border border-gray-200 focus:outline-none"
        />
        <button
          onClick={copyToClipboard}
          className="px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-r-lg transition-colors flex items-center justify-center"
        >
          {copied ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={copyToClipboard}
        className="md:hidden w-full py-2.5 px-4 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      >
        <ClipboardIcon className="h-5 w-5" />
        Copiar enlace
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={shareLink}
        className="w-full py-2.5 px-4 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        Compartir enlace
      </motion.button>
    </div>
  );
};
