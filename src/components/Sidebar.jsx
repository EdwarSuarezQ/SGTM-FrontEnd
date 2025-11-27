// components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
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
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const navigationSections = [
  {
    title: 'NAVEGACIÓN',
    items: [
      { name: 'Inicio', href: '/', icon: HomeIcon, exact: true }
    ]
  },
  {
    title: 'MENU PRINCIPAL',
    items: [
      { name: 'Tareas', href: '/tareas', icon: ClipboardDocumentCheckIcon },
      { name: 'Embarques', href: '/embarques', icon: TruckIcon },
      { name: 'Rutas', href: '/rutas', icon: MapIcon },
      { name: 'Facturas', href: '/facturas', icon: DocumentTextIcon }
    ]
  },
  {
    title: 'GESTIÓN',
    items: [
      { name: 'Personal', href: '/personal', icon: UserGroupIcon },
      { name: 'Embarcaciones', href: '/embarcaciones', icon: CubeIcon },
      { name: 'Almacenes', href: '/almacen', icon: BuildingStorefrontIcon }
    ]
  },
  {
    title: 'REPORTES',
    items: [
      { name: 'Estadísticas', href: '/estadisticas', icon: ChartBarIcon },
      { name: 'Exportar Datos', href: '/exportar-datos', icon: ArrowDownTrayIcon }
    ]
  }
];

// Sidebar para desktop (se puede plegar)
function DesktopSidebar({ isCollapsed }) {
  return (
    <aside className={`hidden lg:block bg-gray-800 text-white sticky top-16 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <nav className="px-1 pt-4">
        {navigationSections.map((section) => (
          <div key={section.title} className="mb-6">
            {/* Títulos de sección - se ocultan cuando está colapsado */}
            {!isCollapsed && (
  <div className="px-3 mb-2">
    <h2 className="text-xs uppercase tracking-wide text-gray-400">
      {section.title}
    </h2>
  </div>
)}
            
            {section.items.map((item) => {
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
        ))}
      </nav>
    </aside>
  );
}

// Sidebar para móvil (se abre/cierra con el menú hamburguesa)
function MobileSidebar({ isOpen, onClose }) {
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
            {navigationSections.map((section) => (
              <div key={section.title} className="mb-6">
                <div className="px-3 mb-2">
                  <h2 className="text-xs uppercase tracking-wide text-gray-400">
                    {section.title}
                  </h2>
                </div>
                {section.items.map((item) => {
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
            ))}
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