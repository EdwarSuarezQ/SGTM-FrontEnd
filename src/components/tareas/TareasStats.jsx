import React from 'react';

const TareasStats = ({ 
  tareasPendientes, 
  eficiencia, 
  tareasAltaPrioridad, 
  porcentajePendientes, 
  diferencia, 
  porcentajeAltaPrioridad 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Tareas pendientes</p>
            <h2 className="text-2xl font-bold">{tareasPendientes}</h2>
          </div>
          <div className="p-2 bg-blue-100 rounded-md text-blue-600">
            <i className="fas fa-tasks"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className="text-red-600"><i className="fas fa-arrow-up"></i> {porcentajePendientes}%</span>
          del total
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Eficiencia</p>
            <h2 className="text-2xl font-bold">{eficiencia}%</h2>
          </div>
          <div className="p-2 bg-green-100 rounded-md text-green-600">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className="text-green-600"><i className="fas fa-arrow-up"></i> {diferencia}%</span>
          desde la semana pasada
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-red-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Alta prioridad</p>
            <h2 className="text-2xl font-bold">{tareasAltaPrioridad}</h2>
          </div>
          <div className="p-2 bg-red-100 rounded-md text-red-600">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <span className="text-red-600"><i className="fas fa-arrow-up"></i> {porcentajeAltaPrioridad}%</span>
          requieren atención
        </div>
      </div>
    </div>
  );
};

export default TareasStats;
