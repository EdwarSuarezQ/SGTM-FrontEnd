// components/Layout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar fijo en la parte superior */}
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Contenedor principal que incluye sidebar y contenido */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar - se pasa el estado de colapsado */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
        />
        
        {/* Contenido principal - ocupa el espacio restante */}
        <div className={`flex-1 flex flex-col min-h-[calc(100vh-4rem)] min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}'
        }`}>
          <main className="flex-1 p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Footer - fuera del contenedor flex, ocupa todo el ancho */}
      <Footer />
    </div>
  );
}