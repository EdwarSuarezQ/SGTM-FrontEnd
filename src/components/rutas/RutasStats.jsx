import React from "react";

const RutasStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Tarjeta Rutas Activas */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Rutas activas</p>
            <h2 className="text-2xl font-bold">{stats.rutasActivas}</h2>
          </div>
          <div className="p-2 bg-purple-100 rounded-md text-purple-600">
            <i className="fas fa-map-marker-alt"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              stats.porcentajeActivas > 50
                ? "text-green-600"
                : "text-yellow-600"
            }
          >
            <i
              className={`fas ${
                stats.porcentajeActivas > 50 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>
            {stats.porcentajeActivas}%
          </span>
          del total
        </div>
      </div>

      {/* Tarjeta Distancia Promedio */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-pink-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Distancia promedio</p>
            <h2 className="text-2xl font-bold">{stats.distanciaPromedio} nm</h2>
          </div>
          <div className="p-2 bg-pink-100 rounded-md text-pink-600">
            <i className="fas fa-compass"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              stats.distanciaPromedio > 5000
                ? "text-green-600"
                : "text-blue-600"
            }
          >
            <i
              className={`fas ${
                stats.distanciaPromedio > 5000
                  ? "fa-arrow-up"
                  : "fa-arrow-right"
              }`}
            ></i>
            {stats.distanciaPromedio > 5000 ? "Larga" : "Media"}
          </span>
          distancia
        </div>
      </div>

      {/* Tarjeta Viajes Este Año */}
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-teal-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Viajes este año</p>
            <h2 className="text-2xl font-bold">{stats.totalViajes}</h2>
          </div>
          <div className="p-2 bg-teal-100 rounded-md text-teal-600">
            <i className="fas fa-ship"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              stats.variacionViajes >= 0 ? "text-green-600" : "text-red-600"
            }
          >
            <i
              className={`fas ${
                stats.variacionViajes >= 0 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>
            {Math.abs(stats.variacionViajes)}%
          </span>
          vs. promedio
        </div>
      </div>
    </div>
  );
};

export default RutasStats;
