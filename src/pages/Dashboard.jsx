import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  UsersIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getPersonalRequest, getPersonalStatsRequest } from "../api/personal";
import { getTareasRequest, getTareasStatsRequest } from "../api/tareas";
import { getAlmacenesStatsRequest } from "../api/almacenes";

// Importar componentes
import StatCard from "../components/dashboard/StatCard";
import ActivityList from "../components/dashboard/ActivityList";
import QuickActions from "../components/dashboard/QuickActions";

const ACTIVITY_TYPES = {
  TASK: "task",
  USER: "user",
};

// Hook personalizado para manejar los datos del dashboard
const useDashboardData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPersonal: 0,
    personalActivo: 0,
    tareasPendientes: 0,
    tareasCompletadas: 0,
    totalAlmacenes: 0,
    almacenesOperativos: 0,
    actividadesRecientes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función optimizada para extraer datos de la respuesta API (para listas)
  const extractData = useCallback((response) => {
    if (!response?.data) return [];
    const { data } = response;
    if (data.success === true && Array.isArray(data.data)) return data.data;
    if (data.data?.items && Array.isArray(data.data.items)) return data.data.items;
    if (Array.isArray(data)) return data;
    if (data.items && Array.isArray(data.items)) return data.items;
    if (Array.isArray(response)) return response;
    return [];
  }, []);

  // Función para obtener fecha válida de un objeto
  const getValidDate = (obj) => {
    const dateKeys = [
      "fechaActualizacion",
      "updatedAt",
      "fechaCreacion",
      "createdAt",
      "fecha",
      "fechaRegistro",
    ];

    for (const key of dateKeys) {
      if (obj[key]) {
        const date = new Date(obj[key]);
        if (!isNaN(date.getTime())) return date;
      }
    }
    return new Date();
  };

  // Función para crear actividades del personal
  const createPersonalActivities = (personal) => {
    return personal.map((p) => ({
      id: p._id || p.id || `personal-${Math.random().toString(36).substr(2, 9)}`,
      type: ACTIVITY_TYPES.USER,
      action: "Registro",
      description: `Nuevo personal: ${p.nombre || p.name || "Sin nombre"}`,
      time: formatDistanceToNow(getValidDate(p), {
        addSuffix: true,
        locale: es,
      }),
      timestamp: getValidDate(p).getTime(),
    }));
  };

  // Función para crear actividades de tareas
  const createTaskActivities = (tareas) => {
    return tareas.map((t) => {
      const estado = t.estado || t.status || "";
      const esCompletada = ["completada", "terminada"].includes(estado.toLowerCase());

      return {
        id: t._id || t.id || `task-${Math.random().toString(36).substr(2, 9)}`,
        type: ACTIVITY_TYPES.TASK,
        action: esCompletada ? "Completada" : "Pendiente",
        description: `Tarea: ${t.titulo || t.nombre || t.descripcion || "Tarea sin título"}`,
        time: formatDistanceToNow(getValidDate(t), {
          addSuffix: true,
          locale: es,
        }),
        timestamp: getValidDate(t).getTime(),
      };
    });
  };

  // Cargar datos reales de la API
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);



      // Definir promesas base vacías para evitar errores si no se tiene permiso
      const emptyStats = { data: { data: {} } };
      const emptyList = { data: [] };

      const { rol: userRole } = user || { rol: "empleado" };

      // Ejecutar peticiones según el rol
      const [
        personalStatsRes,
        tareasStatsRes,
        almacenesStatsRes,
        personalRecentRes,
        tareasRecentRes
      ] = await Promise.all([
        // Personal Stats: Solo Admin
        userRole === "admin" ? getPersonalStatsRequest() : Promise.resolve(emptyStats),
        
        // Tareas Stats: Admin y Empleado
        ["admin", "empleado"].includes(userRole) ? getTareasStatsRequest() : Promise.resolve(emptyStats),
        
        // Almacenes Stats: Admin y Empleado
        ["admin", "empleado"].includes(userRole) ? getAlmacenesStatsRequest() : Promise.resolve(emptyStats),
        
        // Personal Reciente: Solo Admin
        userRole === "admin" ? getPersonalRequest({ limit: 5, sort: "-createdAt" }) : Promise.resolve(emptyList),
        
        // Tareas Recientes: Admin y Empleado
        ["admin", "empleado"].includes(userRole) ? getTareasRequest({ limit: 5, sort: "-createdAt" }) : Promise.resolve(emptyList)
      ]);

      // Procesar Estadísticas de Personal
      const pStats = personalStatsRes.data?.data || {};
      const totalPersonal = pStats.total || 0;
      const personalActivo = pStats.activos || 0;

      // Procesar Estadísticas de Tareas
      const tStats = tareasStatsRes.data?.data || {};
      const tareasPendientes = tStats.pendientes || 0;
      const tareasCompletadas = tStats.completadas || 0;

      // Procesar Estadísticas de Almacenes
      const aStats = almacenesStatsRes.data?.data || {};
      const totalAlmacenes = aStats.total || 0;
      const almacenesOperativos = aStats.operativos || 0;

      // Procesar Actividad Reciente
      const recentPersonal = extractData(personalRecentRes) || [];
      const recentTareas = extractData(tareasRecentRes) || [];

      const actividadesPersonal = createPersonalActivities(recentPersonal);
      const actividadesTareas = createTaskActivities(recentTareas);

      const actividadesRecientes = [
        ...actividadesPersonal,
        ...actividadesTareas,
      ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);

      setStats({
        totalPersonal,
        personalActivo,
        tareasPendientes,
        tareasCompletadas,
        totalAlmacenes,
        almacenesOperativos,
        actividadesRecientes,
      });
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al cargar los datos. Intente nuevamente.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [extractData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, loading, error, refetch: fetchDashboardData };
};

import Loader from "../components/common/Loader";

// Componente de Loading mejorado
const LoadingSpinner = () => (
  <div className="max-w-7xl mx-auto px-6 py-6">
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <Loader size="xl" color="text-blue-600" />
      <div className="text-center">
        <p className="text-gray-600 font-medium">Cargando dashboard...</p>
        <p className="text-sm text-gray-400 mt-1">
          Estamos preparando toda la información
        </p>
      </div>
    </div>
  </div>
);

// Componente de Error mejorado
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="max-w-7xl mx-auto px-6 py-6">
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700 font-medium">{error}</p>
          <div className="mt-2">
            <button
              onClick={onRetry}
              className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, loading, error, refetch } = useDashboardData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <DashboardContent stats={stats} user={user} onRefresh={refetch} />
    </div>
  );
};

// Componente separado para el contenido del dashboard
const DashboardContent = ({ stats, user, onRefresh }) => {
  const porcentajeActivos =
    stats.totalPersonal > 0
      ? Math.round((stats.personalActivo / stats.totalPersonal) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header mejorado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido/a,{" "}
            <span className="font-semibold text-gray-800">
              {user?.nombre || user?.email || "Usuario"}
            </span>
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="mt-3 sm:mt-0 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center"
        >
          <ClockIcon className="w-4 h-4 mr-2" />
          Actualizar
        </button>
      </div>

      {/* Grid de estadísticas mejorado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {user?.rol === "admin" && (
          <>
            <StatCard
              title="Total Personal"
              value={stats.totalPersonal}
              subtitle={`${stats.personalActivo} activos`}
              icon={UsersIcon}
              color="blue"
            />

            <StatCard
              title="Personal Activo"
              value={stats.personalActivo}
              subtitle={`${porcentajeActivos}% del total`}
              icon={CheckCircleIcon}
              color="green"
            />
          </>
        )}

        {(user?.rol === "admin" || user?.rol === "empleado") && (
          <>
            <StatCard
              title="Tareas Pendientes"
              value={stats.tareasPendientes}
              subtitle="Requieren atención"
              icon={ClockIcon}
              color="yellow"
            />

            <StatCard
              title="Tareas Completadas"
              value={stats.tareasCompletadas}
              subtitle="Finalizadas"
              icon={DocumentTextIcon}
              color="purple"
            />

            <StatCard
              title="Almacenes"
              value={stats.totalAlmacenes}
              subtitle={`${stats.almacenesOperativos} operativos`}
              icon={BuildingStorefrontIcon}
              color="indigo"
            />
          </>
        )}
      </div>

      {/* Contenido principal en grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad Reciente */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Actividad Reciente
              </h2>
              <Link
                to="/tareas"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Ver todas →
              </Link>
            </div>
            <ActivityList activities={stats.actividadesRecientes} />
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow-md p-5 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Acciones Rápidas
            </h2>
          </div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
