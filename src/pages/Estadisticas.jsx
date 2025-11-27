import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getEstadisticasRequest } from "../api/estadisticas";
import { toast } from "react-hot-toast";

function Estadisticas() {
  const { user } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("mes");

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const res = await getEstadisticasRequest();

      if (res.data && res.data.success) {
        setEstadisticas(res.data.data);
      } else {
        toast.error("Error al cargar las estadísticas");
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      toast.error("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular porcentajes
  const calcularPorcentaje = (parcial, total) => {
    if (total === 0) return 0;
    return Math.round((parcial / total) * 100);
  };

  // Función para obtener color según el porcentaje
  const getColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 80) return "text-green-600";
    if (porcentaje >= 60) return "text-blue-600";
    if (porcentaje >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  // Función para obtener color de fondo (borde izquierdo)
  const getColorFondo = (index) => {
    const colores = [
      "border-l-4 border-blue-500",
      "border-l-4 border-green-500",
      "border-l-4 border-purple-500",
      "border-l-4 border-yellow-500",
    ];
    return colores[index % colores.length];
  };

  if (!estadisticas) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="text-center text-gray-500 py-8">
          No se pudieron cargar las estadísticas
        </div>
      </div>
    );
  }

  const { tareas, embarques, embarcaciones, almacenes, facturas } =
    estadisticas;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard de Estadísticas
          </h1>
          <p className="text-gray-600 mt-1">Resumen general del sistema</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="año">Este año</option>
          </select>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tareas */}
        <div
          className={`bg-white p-6 rounded-lg shadow-md ${getColorFondo(0)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tareas</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {tareas.total}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="fas fa-tasks text-blue-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Completadas</span>
              <span className="font-medium">
                {tareas.completadas} (
                {calcularPorcentaje(tareas.completadas, tareas.total)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${calcularPorcentaje(
                    tareas.completadas,
                    tareas.total
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Embarques */}
        <div
          className={`bg-white p-6 rounded-lg shadow-md ${getColorFondo(1)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Embarques
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {embarques.total}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <i className="fas fa-shipping-fast text-green-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">En tránsito</span>
              <span className="font-medium">
                {embarques.enTransito}(
                {calcularPorcentaje(embarques.enTransito, embarques.total)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${calcularPorcentaje(
                    embarques.enTransito,
                    embarques.total
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Embarcaciones */}
        <div
          className={`bg-white p-6 rounded-lg shadow-md ${getColorFondo(2)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Embarcaciones
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {embarcaciones.total}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <i className="fas fa-ship text-purple-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">En puerto</span>
              <span className="font-medium">
                {embarcaciones.enPuerto} (
                {calcularPorcentaje(
                  embarcaciones.enPuerto,
                  embarcaciones.total
                )}
                %)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{
                  width: `${calcularPorcentaje(
                    embarcaciones.enPuerto,
                    embarcaciones.total
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Almacenes */}
        <div
          className={`bg-white p-6 rounded-lg shadow-md ${getColorFondo(3)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Almacenes
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {almacenes.total}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <i className="fas fa-warehouse text-yellow-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              Operativos en el sistema
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Facturas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado de Facturas
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Total Facturas
              </span>
              <span className="text-lg font-bold">{facturas.total}</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Pagadas
                  </span>
                  <span>
                    {facturas.pagadas} (
                    {calcularPorcentaje(facturas.pagadas, facturas.total)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${calcularPorcentaje(
                        facturas.pagadas,
                        facturas.total
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    Pendientes
                  </span>
                  <span>
                    {facturas.pendientes} (
                    {calcularPorcentaje(facturas.pendientes, facturas.total)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${calcularPorcentaje(
                        facturas.pendientes,
                        facturas.total
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Vencidas
                  </span>
                  <span>
                    {facturas.vencidas} (
                    {calcularPorcentaje(facturas.vencidas, facturas.total)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${calcularPorcentaje(
                        facturas.vencidas,
                        facturas.total
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen General */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen General
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {tareas.total}
                </div>
                <div className="text-sm text-blue-600">Tareas</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {embarques.total}
                </div>
                <div className="text-sm text-green-600">Embarques</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {embarcaciones.total}
                </div>
                <div className="text-sm text-purple-600">Embarcaciones</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {almacenes.total}
                </div>
                <div className="text-sm text-yellow-600">Almacenes</div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <div className="flex justify-between mb-2">
                  <span>Tareas completadas:</span>
                  <span className="font-medium">
                    {tareas.completadas} / {tareas.total}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Embarques en tránsito:</span>
                  <span className="font-medium">
                    {embarques.enTransito} / {embarques.total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Embarcaciones en puerto:</span>
                  <span className="font-medium">
                    {embarcaciones.enPuerto} / {embarcaciones.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos de Distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Tareas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución de Tareas
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completadas</span>
                <span>
                  {tareas.completadas} (
                  {calcularPorcentaje(tareas.completadas, tareas.total)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${calcularPorcentaje(
                      tareas.completadas,
                      tareas.total
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pendientes</span>
                <span>
                  {tareas.pendientes} (
                  {calcularPorcentaje(tareas.pendientes, tareas.total)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{
                    width: `${calcularPorcentaje(
                      tareas.pendientes,
                      tareas.total
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribución de Embarcaciones */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado de Embarcaciones
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>En puerto</span>
                <span>
                  {embarcaciones.enPuerto} (
                  {calcularPorcentaje(
                    embarcaciones.enPuerto,
                    embarcaciones.total
                  )}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{
                    width: `${calcularPorcentaje(
                      embarcaciones.enPuerto,
                      embarcaciones.total
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>En operación</span>
                <span>
                  {embarcaciones.total - embarcaciones.enPuerto} (
                  {calcularPorcentaje(
                    embarcaciones.total - embarcaciones.enPuerto,
                    embarcaciones.total
                  )}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full"
                  style={{
                    width: `${calcularPorcentaje(
                      embarcaciones.total - embarcaciones.enPuerto,
                      embarcaciones.total
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Actualizar */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={cargarEstadisticas}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <i className="fas fa-sync-alt mr-2"></i> Actualizar Estadísticas
        </button>
      </div>
    </div>
  );
}

export default Estadisticas;
