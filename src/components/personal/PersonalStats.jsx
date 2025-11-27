import React from "react";

const PersonalStats = ({
  total,
  stats,
  porcentajeActivos,
  variacionPersonal,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total empleados</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </div>
          <div className="p-2 bg-blue-100 rounded-md text-blue-600">
            <i className="fas fa-users"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              variacionPersonal >= 0 ? "text-green-600" : "text-red-600"
            }
          >
            <i
              className={`fas ${
                variacionPersonal >= 0 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>{" "}
            {Math.abs(variacionPersonal)}%
          </span>
          vs. trimestre anterior
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Empleados activos</p>
            <h2 className="text-2xl font-bold">{stats.activos}</h2>
          </div>
          <div className="p-2 bg-green-100 rounded-md text-green-600">
            <i className="fas fa-user-check"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              porcentajeActivos > 80 ? "text-green-600" : "text-yellow-600"
            }
          >
            <i
              className={`fas ${
                porcentajeActivos > 80 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>{" "}
            {porcentajeActivos}%
          </span>
          tasa de actividad
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Departamentos</p>
            <h2 className="text-2xl font-bold">{stats.departamentos}</h2>
          </div>
          <div className="p-2 bg-purple-100 rounded-md text-purple-600">
            <i className="fas fa-building"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className="text-blue-600">
            <i className="fas fa-chart-bar"></i> {stats.promedioPorDepto}
          </span>
          promedio por depto
        </div>
      </div>
    </div>
  );
};

export default PersonalStats;
