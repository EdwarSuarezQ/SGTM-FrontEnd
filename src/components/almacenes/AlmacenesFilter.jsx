import React from "react";

const AlmacenesFilter = ({ filtros, handleFiltroChange }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-1 items-center w-full">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar almacenes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
              name="search"
              value={filtros.search}
              onChange={handleFiltroChange}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white w-full text-sm"
            name="estado"
            value={filtros.estado}
            onChange={handleFiltroChange}
          >
            <option value="">Todos los estados</option>
            <option value="operativo">Operativo</option>
            <option value="mantenimiento">En Mantenimiento</option>
            <option value="inoperativo">Inoperativo</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AlmacenesFilter;
