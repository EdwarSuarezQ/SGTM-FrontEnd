import React from 'react';

const TareasFilter = ({ 
  busqueda, 
  setBusqueda, 
  filtroEstado, 
  setFiltroEstado, 
  filtroPrioridad, 
  setFiltroPrioridad 
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-1 items-center w-full">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Buscar tareas..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
          <div className="w-full">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 bg-white w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en-progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>
          <div className="w-full">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 bg-white w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
            >
              <option value="">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TareasFilter;
