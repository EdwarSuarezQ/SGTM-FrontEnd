import { useState, useEffect } from "react";
import { getTareasRequest } from "../api/tareas";
import { getEmbarquesRequest } from "../api/embarques";
import { useAuth } from "../context/AuthContext";
import {
  ClipboardDocumentListIcon,
  TruckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";

export default function MiEspacio() {
  const { user } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [embarques, setEmbarques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch tasks for current user only (myTasks=true ensures filtering even for admins)
        const tareasRes = await getTareasRequest({ limit: 5, estado: "pendiente", myTasks: true });
        // Fetch shipments for current user only (myShipments=true ensures filtering even for admins)
        const embarquesRes = await getEmbarquesRequest({ limit: 5, estado: "pendiente", myShipments: true });

        setTareas(tareasRes.data.data?.items || tareasRes.data.items || []);
        setEmbarques(embarquesRes.data.data?.items || embarquesRes.data.items || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Loader size="xl" color="text-blue-600" />
          <div className="text-center">
            <p className="text-gray-600 font-medium">Cargando tu espacio...</p>
            <p className="text-sm text-gray-400 mt-1">
              Estamos preparando tus tareas y embarques
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Espacio</h1>
        <p className="text-gray-600">
          Bienvenido, {user?.nombre}. Aquí tienes un resumen de tus asignaciones.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ClipboardDocumentListIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Tareas Pendientes
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {tareas.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <TruckIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Embarques a Supervisar
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {embarques.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tareas Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Mis Tareas Recientes
            </h2>
            <Link
              to="/tareas"
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Ver todas
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {tareas.length > 0 ? (
              tareas.map((tarea) => (
                <div key={tarea._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {tarea.titulo}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {tarea.descripcion}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tarea.prioridad === "alta"
                          ? "bg-red-100 text-red-700"
                          : tarea.prioridad === "media"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {tarea.prioridad}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {new Date(tarea.fecha).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No tienes tareas pendientes.
              </div>
            )}
          </div>
        </div>

        {/* Embarques Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Embarques Asignados
            </h2>
            <Link
              to="/embarques"
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {embarques.length > 0 ? (
              embarques.map((embarque) => (
                <div key={embarque._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Guía: {embarque.numeroGuia}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {embarque.origen} ➝ {embarque.destino}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        embarque.estado === "entregado"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {embarque.estado}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <TruckIcon className="h-4 w-4 mr-1" />
                    Salida: {new Date(embarque.fechaSalida).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No tienes embarques asignados.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}