import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ChartBarIcon,
  UsersIcon,
  TruckIcon,
  DocumentTextIcon,
  BuildingStorefrontIcon,
  MapIcon,
} from "@heroicons/react/24/outline";

// Componente individual para acción rápida
const QuickAction = ({ title, description, icon: Icon, to, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
    green: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
    purple:
      "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
    yellow:
      "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
    indigo:
      "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
    red: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <Link
      to={to}
      className={`flex items-center p-3 border rounded-lg transition-all duration-200 hover:shadow-sm ${classes}`}
    >
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 min-w-0 flex-1">
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <p className="text-xs opacity-80 truncate">{description}</p>
      </div>
    </Link>
  );
};

// Componente para las acciones rápidas
const QuickActions = () => {
  const { user } = useAuth();
  const userRole = user?.rol || "empleado";

  const actions = [
    {
      title: "Gestionar Tareas",
      description: "Ver y gestionar todas las tareas",
      icon: DocumentTextIcon,
      to: "/tareas",
      color: "blue",
      allowedRoles: ["admin", "empleado"],
    },
    {
      title: "Gestionar Personal",
      description: "Administrar el personal",
      icon: UsersIcon,
      to: "/personal",
      color: "green",
      allowedRoles: ["admin"],
    },
    {
      title: "Gestionar Embarques",
      description: "Ver embarques y envíos",
      icon: TruckIcon,
      to: "/embarques",
      color: "purple",
      allowedRoles: ["admin", "empleado", "cliente"],
    },
    {
      title: "Ver Rutas",
      description: "Consultar rutas de transporte",
      icon: MapIcon,
      to: "/rutas",
      color: "yellow",
      allowedRoles: ["admin", "empleado"],
    },
    {
      title: "Almacenes",
      description: "Gestionar almacenes",
      icon: BuildingStorefrontIcon,
      to: "/almacen",
      color: "indigo",
      allowedRoles: ["admin", "empleado"],
    },
    {
      title: "Estadísticas",
      description: "Ver reportes y métricas",
      icon: ChartBarIcon,
      to: "/estadisticas",
      color: "red",
      allowedRoles: ["admin"],
    },
  ];

  const filteredActions = actions.filter((action) =>
    action.allowedRoles.includes(userRole)
  );

  return (
    <div className="space-y-2">
      {filteredActions.map((action, index) => (
        <QuickAction key={index} {...action} />
      ))}
    </div>
  );
};

export default QuickActions;
