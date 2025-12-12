// components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  MapIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CubeIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  BuildingStorefrontIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const navigationSections = [
  {
    title: 'NAVEGACIÓN',
    items: [
      { name: 'Inicio', href: '/', icon: HomeIcon, exact: true, allowedRoles: ['admin', 'empleado', 'cliente'] },
      { name: 'Mi Espacio', href: '/mi-espacio', icon: UserCircleIcon, allowedRoles: ['admin', 'empleado', 'cliente'] }
    ]
  },
  {
    title: 'MENU PRINCIPAL',
    items: [
      { name: 'Tareas', href: '/tareas', icon: ClipboardDocumentCheckIcon, allowedRoles: ['admin', 'empleado'] },
      { name: 'Embarques', href: '/embarques', icon: TruckIcon, allowedRoles: ['admin', 'empleado', 'cliente'] },
      { name: 'Rutas', href: '/rutas', icon: MapIcon, allowedRoles: ['admin', 'empleado'] },
      { name: 'Facturas', href: '/facturas', icon: DocumentTextIcon, allowedRoles: ['admin', 'empleado', 'cliente'] }
    ]
  },
  {
    title: 'GESTIÓN',
    items: [
      { name: 'Personal', href: '/personal', icon: UserGroupIcon, allowedRoles: ['admin'] },
      { name: 'Embarcaciones', href: '/embarcaciones', icon: CubeIcon, allowedRoles: ['admin', 'empleado'] },
      { name: 'Almacenes', href: '/almacen', icon: BuildingStorefrontIcon, allowedRoles: ['admin', 'empleado'] }
    ]
  },
  {
    title: 'REPORTES',
    items: [
      { name: 'Estadísticas', href: '/estadisticas', icon: ChartBarIcon, allowedRoles: ['admin'] },
      { name: 'Exportar Datos', href: '/exportar-datos', icon: ArrowDownTrayIcon, allowedRoles: ['admin'] }
    ]
  }
];

// Helper para filtrar items por rol
const filterItemsByRole = (items, userRole) => {
  return items.filter(item => {
    if (!item.allowedRoles) return true; // Si no tiene roles definidos, mostrar a todos
    return item.allowedRoles.includes(userRole);
  });
};

// Sidebar para desktop (se puede plegar)
function DesktopSidebar({ isCollapsed }) {
  const { user } = useAuth();
  const userRole = user?.rol || 'empleado'; // Default a empleado si no hay rol

  return (
    <aside className={`hidden lg:block bg-gray-800 text-white sticky top-16 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <nav className="px-1 pt-4">
        {navigationSections.map((section) => {
          const filteredItems = filterItemsByRole(section.items, userRole);
          
          if (filteredItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-6">
              {/* Títulos de sección - se ocultan cuando está colapsado */}
              {!isCollapsed && (
                <div className="px-3 mb-2">
                  <h2 className="text-xs uppercase tracking-wide text-gray-400">
                    {section.title}
                  </h2>
                </div>
              )}
              
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => 
                      `flex items-center px-3 py-3 rounded-md mb-1 hover:bg-gray-700 transition-colors duration-200 ${
                        isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
                      } ${isCollapsed ? 'justify-center px-2' : 'px-3'}`
                    }
                    title={isCollapsed ? item.name : ''}
                  >
                   <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

// Sidebar para móvil (se abre/cierra con el menú hamburguesa)
function MobileSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const userRole = user?.rol || 'empleado';

  return (
    <>
      {/* Overlay para móvil - se muestra cuando el sidebar está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar móvil */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out mt-16">
          <nav className="px-1 pt-4">
            {navigationSections.map((section) => {
              const filteredItems = filterItemsByRole(section.items, userRole);
              
              if (filteredItems.length === 0) return null;

              return (
                <div key={section.title} className="mb-6">
                  <div className="px-3 mb-2">
                    <h2 className="text-xs uppercase tracking-wide text-gray-400">
                      {section.title}
                    </h2>
                  </div>
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => 
                          `flex items-center px-3 py-3 rounded-md mb-1 hover:bg-gray-700 transition-colors duration-200 ${
                            isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
                          }`
                        }
                        onClick={onClose}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </aside>
      </div>
    </>
  );
}

// Componente principal Sidebar
export default function Sidebar({ isOpen, onClose, isCollapsed }) {
  return (
    <>
      <DesktopSidebar isCollapsed={isCollapsed} />
      <MobileSidebar isOpen={isOpen} onClose={onClose} />
    </>
  );
}