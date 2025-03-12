import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AddOffering } from './components/AddOffering';
import { CreateRecipient } from './components/CreateRecipient';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { InstallPrompt } from './components/InstallPrompt';
import { NotFound } from './components/NotFound';
import { ViewRamillete } from './components/ViewRamillete';
import { registerServiceWorker } from './registerSW';

const App: React.FC = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Toaster position="top-center" />
        <InstallPrompt />
        <main className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="container mx-auto px-4 animate-fade-in">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateRecipient />} />

                <Route path="/:recipientId" element={<ViewRamillete />} />
                <Route path="/:recipientId/add" element={<AddOffering />} />

                <Route path="*" element={<NotFound />} />
              </Routes>

              <Footer />
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
