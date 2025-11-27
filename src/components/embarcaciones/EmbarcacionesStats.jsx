import React from "react";

const EmbarcacionesStats = ({ estadisticas }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Embarcaciones activas</p>
            <h2 className="text-2xl font-bold">{estadisticas.activas}</h2>
          </div>
          <div className="p-2 bg-blue-100 rounded-md text-blue-600">
            <i className="fas fa-ship"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              estadisticas.variacionActivas >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            <i
              className={`fas ${
                estadisticas.variacionActivas >= 0
                  ? "fa-arrow-up"
                  : "fa-arrow-down"
              }`}
            ></i>{" "}
            {Math.abs(estadisticas.variacionActivas)}%
          </span>
          desde el mes pasado
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">En puerto</p>
            <h2 className="text-2xl font-bold">{estadisticas.enPuerto}</h2>
          </div>
          <div className="p-2 bg-green-100 rounded-md text-green-600">
            <i className="fas fa-anchor"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              estadisticas.variacionPuerto >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            <i
              className={`fas ${
                estadisticas.variacionPuerto >= 0
                  ? "fa-arrow-up"
                  : "fa-arrow-down"
              }`}
            ></i>{" "}
            {Math.abs(estadisticas.variacionPuerto)}%
          </span>
          desde el mes pasado
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Total embarcaciones</p>
            <h2 className="text-2xl font-bold">{estadisticas.total}</h2>
          </div>
          <div className="p-2 bg-yellow-100 rounded-md text-yellow-600">
            <i className="fas fa-water"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              estadisticas.variacionTotal >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            <i
              className={`fas ${
                estadisticas.variacionTotal >= 0
                  ? "fa-arrow-up"
                  : "fa-arrow-down"
              }`}
            ></i>{" "}
            {Math.abs(estadisticas.variacionTotal)}%
          </span>
          desde el mes pasado
        </div>
      </div>
    </div>
  );
};

export default EmbarcacionesStats;
