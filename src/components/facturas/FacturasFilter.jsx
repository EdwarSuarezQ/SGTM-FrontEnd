import React from "react";

const FacturasFilter = ({
  filtros,
  handleFiltroChange,
  opcionesEstados,
  clientesUnicos,
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-1 items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar facturas..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              name="search"
              value={filtros.search}
              onChange={handleFiltroChange}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
            >
              <option value="">Todos los estados</option>
              {opcionesEstados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              name="cliente"
              value={filtros.cliente}
              onChange={handleFiltroChange}
            >
              <option value="">Todos los clientes</option>
              {clientesUnicos.map((cliente) => (
                <option key={cliente} value={cliente}>
                  {cliente}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturasFilter;
