import React from "react";

const FacturasStats = ({
  stats,
  porcentajePendientes,
  porcentajePagadas,
  variacionIngresos,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Facturas Pendientes */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-emerald-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Facturas pendientes</p>
            <h2 className="text-2xl font-bold">{stats.facturasPendientes}</h2>
          </div>
          <div className="p-2 bg-emerald-100 rounded-md text-emerald-600">
            <i className="fas fa-file-alt"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              porcentajePendientes > 30 ? "text-red-600" : "text-green-600"
            }
          >
            <i
              className={`fas ${
                porcentajePendientes > 30 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>
            {porcentajePendientes}%
          </span>
          del total
        </div>
      </div>

      {/* Facturas Pagadas */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-sky-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Facturas pagadas</p>
            <h2 className="text-2xl font-bold">{stats.facturasPagadas}</h2>
          </div>
          <div className="p-2 bg-sky-100 rounded-md text-sky-600">
            <i className="fas fa-money-check-alt"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              porcentajePagadas > 70 ? "text-green-600" : "text-yellow-600"
            }
          >
            <i
              className={`fas ${
                porcentajePagadas > 70 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>
            {porcentajePagadas}%
          </span>
          tasa de éxito
        </div>
      </div>

      {/* Ingresos Totales */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-rose-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Ingresos totales</p>
            <h2 className="text-2xl font-bold">{stats.ingresosTotales}</h2>
          </div>
          <div className="p-2 bg-rose-100 rounded-md text-rose-600">
            <i className="fas fa-dollar-sign"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              variacionIngresos >= 0 ? "text-green-600" : "text-red-600"
            }
          >
            <i
              className={`fas ${
                variacionIngresos >= 0 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>
            {Math.abs(variacionIngresos)}%
          </span>
          vs. mes anterior
        </div>
      </div>
    </div>
  );
};

export default FacturasStats;
