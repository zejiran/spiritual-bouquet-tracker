import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      setIsMobileView(isMobile);
      return isMobile;
    };

    checkMobileView();

    const mediaQueryList = window.matchMedia('(max-width: 767px)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobileView(e.matches);
    };

    mediaQueryList.addEventListener('change', handleMediaChange);

    if (!checkMobileView()) {
      return () => {
        mediaQueryList.removeEventListener('change', handleMediaChange);
      };
    }

    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      setIsInstalled(true);
      return () => {
        mediaQueryList.removeEventListener('change', handleMediaChange);
      };
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);

      const dismissedTime = localStorage.getItem('installPromptDismissed');
      if (
        !dismissedTime ||
        Date.now() - parseInt(dismissedTime) > 1000 * 60 * 60 * 24 * 3
      ) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      mediaQueryList.removeEventListener('change', handleMediaChange);
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    setShowBanner(false);

    try {
      await installPrompt.prompt();

      const choiceResult = await installPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('installPromptDismissed', Date.now().toString());
      }
    } catch (err) {
      console.error('Error showing install prompt:', err);
    }

    setInstallPrompt(null);
  };

  const dismissPrompt = () => {
    setShowBanner(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (isInstalled || !showBanner || !isMobileView) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200 z-50"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          <div className="bg-primary-100 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            Instalar aplicación
          </p>
          <p className="text-xs text-gray-500">
            Añade este app a tu pantalla de inicio para acceso rápido
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={dismissPrompt}
            className="text-gray-500 hover:text-gray-700 text-xs px-3 py-1.5"
          >
            Después
          </button>
          <button
            onClick={handleInstall}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs px-3 py-1.5"
          >
            Instalar
          </button>
        </div>
      </div>
    </motion.div>
  );
};
