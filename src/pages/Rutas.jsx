import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getRutasRequest,
  createRutaRequest,
  updateRutaRequest,
  deleteRutaRequest,
  getRutasStatsRequest,
} from "../api/rutas";
import { toast } from "react-hot-toast";
import {
  getColorEstadoRuta,
  getEstadoTextRuta,
  getTipoTextRuta,
} from "../utils/helpers";

// Importar componentes
import RutasStats from "../components/rutas/RutasStats";
import RutasFilter from "../components/rutas/RutasFilter";
import RutasTable from "../components/rutas/RutasTable";
import RutasForm from "../components/rutas/RutasForm";
import Pagination from "../components/Pagination";

function Rutas() {
  const { user } = useAuth();
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentRuta, setCurrentRuta] = useState(null);
  
  // Estados de filtros y paginación
  const [filtros, setFiltros] = useState({
    tipo: "",
    estado: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    idRuta: "",
    nombre: "",
    origen: "",
    paisOrigen: "",
    estadoOrigen: "",
    destino: "",
    paisDestino: "",
    estadoDestino: "",
    distancia: "",
    duracion: "",
    tipo: "regional",
    estado: "activa",
    viajesAnio: 0,
  });

  const [stats, setStats] = useState({
    total: 0,
    activas: 0,
    internacionales: 0,
    regionales: 0,
    costeras: 0,
    totalViajes: 0
  });
  const [proximasSalidasGlobal, setProximasSalidasGlobal] = useState([]);

  // Opciones predefinidas
  const opcionesTipos = [
    { value: "internacional", label: "Internacional" },
    { value: "regional", label: "Regional" },
    { value: "costera", label: "Costera" },
  ];

  const opcionesEstados = [
    { value: "activa", label: "Activa" },
    { value: "pendiente", label: "Pendiente" },
    { value: "completada", label: "Completada" },
    { value: "inactiva", label: "Inactiva" },
  ];

  const opcionesPaises = [
    "Colombia",
    "Ecuador",
    "Perú",
    "Chile",
    "Argentina",
    "Brasil",
    "Panamá",
    "Costa Rica",
    "México",
    "Estados Unidos",
    "España",
    "China",
  ];

  // Cargar rutas cuando cambian los filtros o la página
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarRutas();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, filtros]);

  // Cargar estadísticas al montar
  useEffect(() => {
    cargarStats();
    cargarProximasSalidas();
  }, []);

  const cargarStats = async () => {
    try {
      const res = await getRutasStatsRequest();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const cargarProximasSalidas = async () => {
    try {
      // Buscamos rutas activas o pendientes, ordenadas por fecha de creación o alguna fecha relevante.
      // Como rutas no tiene fecha de salida explícita en el modelo visible (solo duracion), 
      // usaremos sort por createdAt o idRuta para consistencia.
      // O si hubiera un campo de próxima salida, lo usaríamos.
      // Asumiremos orden por creación reciente por ahora.
      const params = {
        page: 1,
        limit: 4,
        sort: "-createdAt",
        estado: "activa"
      };
      
      const res = await getRutasRequest(params);
      if (res.data && res.data.success && res.data.data) {
        setProximasSalidasGlobal(res.data.data.items || []);
      }
    } catch (error) {
      console.error("Error al cargar próximas salidas:", error);
    }
  };

  const cargarRutas = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        tipo: filtros.tipo,
        estado: filtros.estado,
        q: filtros.search
      };

      const res = await getRutasRequest(params);

      if (
        res.data &&
        res.data.success &&
        res.data.data
      ) {
        setRutas(res.data.data.items || []);
        setTotalItems(res.data.data.total || 0);
        setTotalPages(Math.ceil((res.data.data.total || 0) / itemsPerPage));
      } else {
        setRutas([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error al cargar rutas:", error);
      toast.error("Error al cargar las rutas");
      setRutas([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  // Calcular estadísticas detalladas usando datos globales
  const calcularEstadisticas = () => {
    const rutasActivas = stats.activas || 0;
    const rutasTotales = stats.total || 0;

    // Distancia total y promedio vienen del backend
    const distanciaTotal = stats.distanciaTotal || 0;
    const distanciaPromedio = stats.distanciaPromedio || 0;
    const totalViajes = stats.totalViajes || 0;

    // Calcular distribución por tipo
    const tiposDistribucion = {
      internacional: stats.internacionales || 0,
      regional: stats.regionales || 0,
      costera: stats.costeras || 0,
    };

    // Calcular variación de viajes (simulada o 0)
    const promedioViajes = rutasTotales > 0 ? totalViajes / rutasTotales : 0;
    const variacionViajes = 0; // No tenemos histórico para variación real

    return {
      rutasActivas,
      rutasTotales,
      distanciaTotal: distanciaTotal.toLocaleString(),
      distanciaPromedio: Math.round(distanciaPromedio).toLocaleString(),
      totalViajes: totalViajes.toLocaleString(),
      tiposDistribucion,
      variacionViajes,
      porcentajeActivas:
        rutasTotales > 0 ? Math.round((rutasActivas / rutasTotales) * 100) : 0,
    };
  };

  // Estadísticas para mostrar
  const statsDisplay = calcularEstadisticas();
  const proximasSalidas = proximasSalidasGlobal;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Función para manejar el clic en "Ver todas"
  const handleVerTodas = () => {
    toast.success('Funcionalidad "Ver todas" en desarrollo');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (
      !formData.idRuta ||
      !formData.nombre ||
      !formData.origen ||
      !formData.destino
    ) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      const rutaData = {
        ...formData,
        distancia: formData.distancia ? parseInt(formData.distancia) : 0,
        viajesAnio: parseInt(formData.viajesAnio) || 0,
      };

      if (currentRuta) {
        await updateRutaRequest(currentRuta._id, rutaData);
        toast.success("Ruta actualizada correctamente");
      } else {
        await createRutaRequest(rutaData);
        toast.success("Ruta creada correctamente");
      }

      setModalIsOpen(false);
      setModalIsOpen(false);
      
      // Actualizar todo en paralelo
      await Promise.all([
        cargarRutas(),
        cargarStats(),
        cargarProximasSalidas()
      ]);
      
      resetForm();
    } catch (error) {
      console.error("Error al guardar ruta:", error);
      const errorMessage =
        error.response?.data?.message || "Error al guardar la ruta";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (ruta) => {
    setCurrentRuta(ruta);
    setFormData({
      idRuta: ruta.idRuta || "",
      nombre: ruta.nombre || "",
      origen: ruta.origen || "",
      paisOrigen: ruta.paisOrigen || "",
      estadoOrigen: ruta.estadoOrigen || "",
      destino: ruta.destino || "",
      paisDestino: ruta.paisDestino || "",
      estadoDestino: ruta.estadoDestino || "",
      distancia: ruta.distancia || "",
      duracion: ruta.duracion || "",
      tipo: ruta.tipo || "regional",
      estado: ruta.estado || "activa",
      viajesAnio: ruta.viajesAnio || 0,
    });
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta ruta?")) {
      try {
        await deleteRutaRequest(id);
        toast.success("Ruta eliminada correctamente");
        
        // Actualizar todo en paralelo
        await Promise.all([
          cargarRutas(),
          cargarStats(),
          cargarProximasSalidas()
        ]);
      } catch (error) {
        console.error("Error al eliminar ruta:", error);
        toast.error("Error al eliminar la ruta");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idRuta: "",
      nombre: "",
      origen: "",
      paisOrigen: "",
      estadoOrigen: "",
      destino: "",
      paisDestino: "",
      estadoDestino: "",
      distancia: "",
      duracion: "",
      tipo: "regional",
      estado: "activa",
      viajesAnio: 0,
    });
    setCurrentRuta(null);
  };

  const abrirModalCrear = () => {
    resetForm();
    setModalIsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Rutas</h1>

      <div className="mb-6 flex justify-end">
        {user && user.rol === "admin" && (
          <button
            onClick={abrirModalCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Nueva Ruta
          </button>
        )}
      </div>

      <RutasStats stats={statsDisplay} />

      <div className="bg-white rounded-lg shadow-md mb-6">
        <RutasFilter
          filtros={filtros}
          handleFiltroChange={handleFiltroChange}
          opcionesTipos={opcionesTipos}
          opcionesEstados={opcionesEstados}
        />

        <RutasTable
          loading={loading}
          rutasFiltradas={rutas} // Pasamos las rutas directamente
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          user={user}
        />

        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estadísticas por Tipo */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Rutas por Tipo
            </h2>
            <div className="text-sm text-gray-500">
              <select className="border-none text-sm bg-transparent">
                <option>Este Año</option>
                <option>Últimos 6 meses</option>
                <option>Total</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(statsDisplay.tiposDistribucion).map(([tipo, cantidad]) => {
              const porcentaje =
                statsDisplay.rutasTotales > 0
                  ? (cantidad / statsDisplay.rutasTotales) * 100
                  : 0;
              const colorMap = {
                internacional: "purple",
                regional: "blue",
                costera: "teal",
              };
              const color = colorMap[tipo] || "gray";

              return (
                <div key={tipo}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <span
                        className={`w-3 h-3 bg-${color}-500 rounded-full mr-2`}
                      ></span>
                      {getTipoTextRuta(tipo)}
                    </span>
                    <span>{cantidad} rutas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${color}-500 h-2 rounded-full`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Próximas Salidas */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Próximas Salidas
            </h2>
            <button
              onClick={handleVerTodas}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-3">
            {proximasSalidas.length > 0 ? (
              proximasSalidas.map((ruta) => (
                <div
                  key={ruta._id}
                  className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <i className="fas fa-route"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {ruta.idRuta} - {ruta.origen} a {ruta.destino}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Duración: {ruta.duracion}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoRuta(
                      ruta.estado
                    )}`}
                  >
                    {getEstadoTextRuta(ruta.estado)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No hay próximas salidas programadas
              </div>
            )}
          </div>
        </div>
      </div>

      <RutasForm
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        currentRuta={currentRuta}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        opcionesPaises={opcionesPaises}
        opcionesTipos={opcionesTipos}
        opcionesEstados={opcionesEstados}
      />
    </div>
  );
}

export default Rutas;
