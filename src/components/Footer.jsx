// components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="footer-container" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo e Información */}
        <div className="lg:col-span-2">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-ship text-white text-lg"></i>
            </div>
            <h3 className="text-xl font-bold">SGTM Buenaventura</h3>
          </div>
          <p className="text-gray-400 mb-4 leading-relaxed">
            Sistema de Gestión de Transporte Marítimo especializado en la
            optimización de operaciones portuarias y logística marítima en el puerto
            de Buenaventura.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <i className="fas fa-map-marker-alt"></i>
            <span>Puerto de Buenaventura, Valle del Cauca, Colombia</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
            <i className="fas fa-phone"></i>
            <span>+57 (2) 244 44 44</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
            <i className="fas fa-envelope"></i>
            <span>info@sgtm-buenaventura.com</span>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
            Enlaces Rápidos
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
              >
                <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/tareas"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
              >
                <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                Gestión de Tareas
              </Link>
            </li>
            <li>
              <Link
                to="/embarques"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
              >
                <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                Control de Embarques
              </Link>
            </li>
            <li>
              <Link
                to="/estadisticas"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
              >
                <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                Reportes y Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/exportar-datos"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
              >
                <i className="fas fa-chevron-right text-xs mr-2 group-hover:translate-x-1 transition-transform"></i>
                Documentación
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto y soporte */}
        <div>
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
            Soporte
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                to="/estadisticas"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
              >
                <i className="fas fa-life-ring mr-3 text-blue-500"></i>
                <span>Centro de ayuda</span>
              </Link>
            </li>
            <li>
              <a
                href="mailto:info@sgtm-buenaventura.com"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
              >
                <i className="fas fa-headset mr-3 text-green-500"></i>
                <span>Soporte 24/7</span>
              </a>
            </li>
            <li>
              <Link
                to="/exportar-datos"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
              >
                <i className="fas fa-book mr-3 text-purple-500"></i>
                <span>Manual de usuario</span>
              </Link>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
              >
                <i className="fas fa-sync-alt mr-3 text-yellow-500"></i>
                <span>Últimas actualizaciones</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-gray-400 text-sm">
              &copy; 2025 SGTM Buenaventura. Todos los derechos reservados.
            </div>

            <div className="flex space-x-6 text-gray-400 text-sm">
              <a
                href="https://www.sic.gov.co/politica-de-privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Política de privacidad
              </a>
              <a
                href="https://www.sic.gov.co/terminos-y-condiciones"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Términos de servicio
              </a>
              <Link to="/" className="hover:text-white transition-colors">
                Política de cookies
              </Link>
            </div>

            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <i className="fas fa-shield-alt text-green-500"></i>
              <span>Sistema seguro • v2.4.1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
