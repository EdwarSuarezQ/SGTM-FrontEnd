import React from "react";
import {
  UsersIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const ACTIVITY_TYPES = {
  TASK: "task",
  USER: "user",
};

// Componente para ítem de actividad
const ActivityItem = ({ actividad }) => {
  const isTask = actividad.type === ACTIVITY_TYPES.TASK;
  const Icon = isTask ? DocumentTextIcon : UsersIcon;
  const colorClasses = isTask
    ? "bg-blue-100 text-blue-600"
    : "bg-green-100 text-green-600";

  return (
    <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
      <div
        className={`h-10 w-10 rounded-full ${colorClasses} flex items-center justify-center mr-3 flex-shrink-0`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {actividad.description}
        </h3>
        <p className="text-xs text-gray-500 capitalize">{actividad.action}</p>
      </div>
      <span className="text-xs text-gray-400 ml-2 flex-shrink-0 group-hover:text-gray-600 transition-colors">
        {actividad.time}
      </span>
    </div>
  );
};

// Componente para la lista de actividades
const ActivityList = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="font-medium">No hay actividades recientes</p>
        <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
          Las actividades aparecerán aquí cuando se registren nuevas tareas o
          personal
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((actividad) => (
        <ActivityItem key={actividad.id} actividad={actividad} />
      ))}
    </div>
  );
};

export default ActivityList;
