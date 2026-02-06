// components/Navbar.jsx
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ onToggleSidebar, onToggleCollapse }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-blue-800 text-white shadow-md flex items-center justify-between px-4 py-4 fixed top-0 left-0 right-0 z-50 h-16">
      <div className="flex items-center">
        {/* Botón menú hamburguesa para móvil */}
        <button 
          onClick={onToggleSidebar}
          className="text-white focus:outline-none lg:hidden"
        >
          <i className="fas fa-bars w-5 h-5"></i>
        </button>

        {/* Botón para plegar/desplegar sidebar en desktop */}
        <button 
          onClick={onToggleCollapse}
          className="text-white focus:outline-none hidden lg:block ml-2"
        >
          <i className="fas fa-bars w-5 h-5"></i>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between ml-4">
        <h1 className="text-lg sm:text-xl font-bold flex items-center truncate">
          <i className="fas fa-ship w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0"></i>
          <span className="truncate">SGTM {/* Buenaventura oculto en móviles muy pequeños si es necesario, pero truncate ayuda */}</span>
          <span className="hidden sm:inline ml-1 text-blue-200">Buenaventura</span>
        </h1>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="text-white focus:outline-none relative">
            <i className="fas fa-bell w-5 h-5"></i>
          </button>

          {/* Profile Dropdown */}
          <Menu as="div" className="relative">
            <div>
              <Menu.Button 
                id="profile-dropdown-btn"
                className="flex items-center focus:outline-none"
              >
                <span className="mr-2 hidden sm:block">
                  {user?.nombre || user?.email || 'Usuario'}
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <i className="fas fa-user w-4 h-4"></i>
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items 
                id="profile-dropdown"
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/perfil"
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700 flex items-center'
                        )}
                      >
                        <i className="fas fa-user mr-2 w-4 h-4"></i>
                        Mi Perfil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center'
                        )}
                      >
                        <i className="fas fa-sign-out-alt mr-2 w-4 h-4"></i>
                        Cerrar sesión
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}