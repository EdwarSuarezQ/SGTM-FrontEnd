import React from "react";
import { getColorOcupacion } from "../../utils/helpers";

const AlmacenesStats = ({ estadisticas }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Almacenes operativos</p>
            <h2 className="text-2xl font-bold">{estadisticas.operativos}</h2>
          </div>
          <div className="p-2 bg-green-100 rounded-md text-green-600">
            <i className="fas fa-warehouse"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              estadisticas.variacionOperativos >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            <i
              className={`fas ${
                estadisticas.variacionOperativos >= 0
                  ? "fa-arrow-up"
                  : "fa-arrow-down"
              }`}
            ></i>{" "}
            {Math.abs(estadisticas.variacionOperativos)}%
          </span>
          desde el mes pasado
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Capacidad total</p>
            <h2 className="text-2xl font-bold">
              {estadisticas.capacidadTotal}
            </h2>
            <p className="text-sm text-gray-500">unidades</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-md text-blue-600">
            <i className="fas fa-boxes"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              estadisticas.variacionCapacidad >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            <i
              className={`fas ${
                estadisticas.variacionCapacidad >= 0
                  ? "fa-arrow-up"
                  : "fa-arrow-down"
              }`}
            ></i>{" "}
            {Math.abs(estadisticas.variacionCapacidad)}%
          </span>
          desde el mes pasado
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Ocupación promedio</p>
            <h2 className="text-2xl font-bold">
              {estadisticas.ocupacionPromedio}%
            </h2>
          </div>
          <div className="p-2 bg-purple-100 rounded-md text-purple-600">
            <i className="fas fa-chart-pie"></i>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getColorOcupacion(
                estadisticas.ocupacionPromedio
              )}`}
              style={{ width: `${estadisticas.ocupacionPromedio}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlmacenesStats;
