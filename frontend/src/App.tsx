import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AddOffering } from './components/AddOffering';
import { ViewRamillete } from './components/ViewRamillete';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-6 py-3 rounded-lg transition-all font-medium ${
        isActive
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md hover:shadow-lg'
      }`}
    >
      {children}
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-center mb-8 text-blue-600"
            >
              Ramillete Espiritual para Jorge 🙏
            </motion.h1>

            <nav className="mb-12 flex justify-center gap-4">
              <NavLink to="/">Añadir Ofrenda</NavLink>
              <NavLink to="/view">Ver Ramillete</NavLink>
            </nav>

            <div className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<AddOffering />} />
                <Route path="/view" element={<ViewRamillete />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
