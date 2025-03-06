import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-normal pb-1"
        >
          Ramilletes Espirituales
        </motion.h1>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Un ramillete espiritual es una colección de oraciones, sacrificios y
          buenas obras ofrecidas por una intención especial o por una persona.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="text-5xl mb-4">🌸</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Crear un nuevo ramillete
            </h3>
            <p className="text-gray-600 mb-4">
              Crea un ramillete espiritual para una intención especial o para
              una persona.
            </p>
            <p className="text-gray-600 mb-6">
              Una vez creado, podrás compartir el enlace para que otros se unan
              y contribuyan con sus oraciones.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/create')}
              className="w-full px-5 py-2.5 rounded-lg font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
            >
              Crear ramillete
            </motion.button>
          </div>

          <div className="bg-rose-50 p-6 rounded-xl">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              ¿Qué es un ramillete espiritual?
            </h3>
            <p className="text-gray-600 mb-4">
              Es una forma hermosa de unir nuestros esfuerzos espirituales para
              apoyar a alguien que lo necesita o agradecer por alguna bendición
              recibida.
            </p>
            <p className="text-gray-600">
              Puede incluir misas, rosarios, ayunos, horas santas, y cualquier
              otro tipo de ofrenda espiritual.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center text-gray-700 text-xs">
              <motion.div
                initial={{ scale: 0.9, rotateZ: -5 }}
                animate={{ scale: 1, rotateZ: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
              con
              <motion.div
                initial={{ scale: 0.9, y: 5 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.4,
                }}
                className="mx-2 text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
              en Colombia
              <motion.div
                initial={{ scale: 0.9, y: 5 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.6,
                }}
                className="flex ml-2"
              >
                <div className="w-6 h-4 rounded-sm overflow-hidden shadow-sm">
                  <div className="w-full h-1/3 bg-yellow-400"></div>
                  <div className="w-full h-1/3 bg-blue-600"></div>
                  <div className="w-full h-1/3 bg-red-600"></div>
                </div>
              </motion.div>
            </div>

            <p className="text-sm text-gray-600">
              Este es un proyecto de código abierto que puede ser usado y
              modificado por cualquiera.
            </p>

            <div className="flex justify-center space-x-4 mt-1">
              <a
                href="https://github.com/zejiran/spiritual-bouquet-tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            <div className="text-xs text-gray-500 mt-1">
              <p>MIT License © {currentYear} - Juan Alegría</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
