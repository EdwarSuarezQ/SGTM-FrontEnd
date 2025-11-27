import React from "react";

const EmbarquesStats = ({
  embarquesActivos,
  entregasATiempo,
  pesoTotal,
  porcentajeActivos,
  variacionPeso,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Embarques activos</p>
            <h2 className="text-2xl font-bold">{embarquesActivos}</h2>
          </div>
          <div className="p-2 bg-blue-100 rounded-md text-blue-600">
            <i className="fas fa-shipping-fast"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={
              porcentajeActivos > 50 ? "text-green-600" : "text-yellow-600"
            }
          >
            <i
              className={`fas ${
                porcentajeActivos > 50 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>{" "}
            {porcentajeActivos}%
          </span>
          del total
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Entregas completadas</p>
            <h2 className="text-2xl font-bold">{entregasATiempo}%</h2>
          </div>
          <div className="p-2 bg-green-100 rounded-md text-green-600">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={entregasATiempo > 80 ? "text-green-600" : "text-red-600"}
          >
            <i
              className={`fas ${
                entregasATiempo > 80 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>{" "}
            {entregasATiempo}%
          </span>
          tasa de éxito
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Peso total (kg)</p>
            <h2 className="text-2xl font-bold">{pesoTotal.toLocaleString()}</h2>
          </div>
          <div className="p-2 bg-yellow-100 rounded-md text-yellow-600">
            <i className="fas fa-weight-hanging"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span
            className={variacionPeso >= 0 ? "text-green-600" : "text-red-600"}
          >
            <i
              className={`fas ${
                variacionPeso >= 0 ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>{" "}
            {Math.abs(variacionPeso)}%
          </span>
          vs. promedio
        </div>
      </div>
    </div>
  );
};

export default EmbarquesStats;
