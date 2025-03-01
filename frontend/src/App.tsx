import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AddOffering } from './components/AddOffering';
import { ViewRamillete } from './components/ViewRamillete';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => {
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Toaster position="top-center" />
        <main className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="relative w-fit mx-auto text-4xl sm:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-normal pb-1"
            >
              Ramillete espiritual para Jorge 🙏
            </motion.h1>

            <nav className="mb-12 flex justify-center gap-6">
              <NavLink to="/">Formulario de ofrenda</NavLink>
              <NavLink to="/view">Ver ramillete</NavLink>
            </nav>

            <div className="container mx-auto px-4 animate-fade-in">
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
