import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getEmbarcacionesRequest,
  createEmbarcacionRequest,
  updateEmbarcacionRequest,
  deleteEmbarcacionRequest,
  getEmbarcacionesStatsRequest,
} from "../api/embarcaciones";
import { toast } from "react-hot-toast";
import { formatDate, getColorEstado, getTextoEstado } from "../utils/helpers";

// Importar componentes
import EmbarcacionesStats from "../components/embarcaciones/EmbarcacionesStats";
import EmbarcacionesFilter from "../components/embarcaciones/EmbarcacionesFilter";
import EmbarcacionesTable from "../components/embarcaciones/EmbarcacionesTable";
import EmbarcacionesForm from "../components/embarcaciones/EmbarcacionesForm";
import Pagination from "../components/Pagination";

function Embarcaciones() {
  const { user } = useAuth();
  const [embarcaciones, setEmbarcaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEmbarcacion, setCurrentEmbarcacion] = useState(null);
  
  // Estados de filtros y paginación
  const [filtros, setFiltros] = useState({
    estado: "",
    tipo: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    nombre: "",
    imo: "",
    fecha: "",
    capacidad: "",
    tipo: "contenedor",
    estado: "pendiente",
  });

  // Estado para las estadísticas
  const [estadisticas, setEstadisticas] = useState({
    activas: 0,
    enPuerto: 0,
    total: 0,
    variacionTotal: 0,
    variacionActivas: 0,
    variacionPuerto: 0,
    // Desglose por estado
    enTransito: 0,
    enRuta: 0,
    pendientes: 0
  });
  const [proximosArribosGlobal, setProximosArribosGlobal] = useState([]);

  // Cargar embarcaciones cuando cambian los filtros o la página
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarEmbarcaciones();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, filtros]);

  // Cargar estadísticas al montar
  useEffect(() => {
    cargarStats();
    cargarProximosArribos();
  }, []);

  const cargarStats = async () => {
    try {
      const res = await getEmbarcacionesStatsRequest();
      if (res.data && res.data.success) {
        const data = res.data.data;
        const activas = (data.enTransito || 0) + (data.enRuta || 0);
        const enPuerto = data.enPuerto || 0;
        const total = data.total || 0;

        // Simulamos variaciones (o las dejamos en 0)
        const variacionTotal = total > 0 ? Math.round((total / Math.max(total - 2, 1) - 1) * 100) : 0;
        const variacionActivas = activas > 0 ? Math.round((activas / Math.max(activas - 1, 1) - 1) * 100) : 0;
        const variacionPuerto = enPuerto > 0 ? Math.round((enPuerto / Math.max(enPuerto - 1, 1) - 1) * 100) : 0;

        setEstadisticas({
          activas,
          enPuerto,
          total,
          variacionTotal,
          variacionActivas,
          variacionPuerto,
          enTransito: data.enTransito || 0,
          enRuta: data.enRuta || 0,
          pendientes: data.pendientes || 0
        });
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const cargarProximosArribos = async () => {
    try {
      // Buscamos embarcaciones en ruta o en tránsito, ordenadas por fecha (ascendente)
      const params = {
        page: 1,
        limit: 4,
        sort: "fecha",
        estado: "en-ruta" // Priorizamos en-ruta, o podríamos pedir sin filtro de estado y ordenar
      };
      
      const res = await getEmbarcacionesRequest(params);
      if (res.data && res.data.success && res.data.data) {
        setProximosArribosGlobal(res.data.data.items || []);
      }
    } catch (error) {
      console.error("Error al cargar próximos arribos:", error);
    }
  };

  const cargarEmbarcaciones = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        estado: filtros.estado,
        tipo: filtros.tipo,
        q: filtros.search
      };

      const res = await getEmbarcacionesRequest(params);

      if (
        res.data &&
        res.data.success &&
        res.data.data
      ) {
        setEmbarcaciones(res.data.data.items || []);
        setTotalItems(res.data.data.total || 0);
        setTotalPages(Math.ceil((res.data.data.total || 0) / itemsPerPage));
      } else {
        setEmbarcaciones([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error al cargar embarcaciones:", error);
      toast.error("Error al cargar las embarcaciones");
      setEmbarcaciones([]);
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



  // Función para calcular estadísticas por estado
  const calcularEstadisticasEstado = () => {
    const estados = {
      "en-transito": {
        nombre: "En tránsito",
        color: "blue",
        cantidad: estadisticas.enTransito,
      },
      "en-ruta": {
        nombre: "En ruta",
        color: "green",
        cantidad: estadisticas.enRuta,
      },
      "en-puerto": {
        nombre: "En puerto",
        color: "yellow",
        cantidad: estadisticas.enPuerto,
      },
      pendiente: {
        nombre: "Pendientes",
        color: "gray",
        cantidad: estadisticas.pendientes,
      },
    };

    const total = estadisticas.total;

    return Object.values(estados).map((estado) => ({
      ...estado,
      porcentaje: total > 0 ? (estado.cantidad / total) * 100 : 0,
    }));
  };

  // Función para obtener próximos arribos
  const obtenerProximosArribos = (embarcaciones) => {
    return embarcaciones
      .filter((e) => e.estado === "en-transito" || e.estado === "en-ruta")
      .slice(0, 4);
  };

  const estadisticasEstado = calcularEstadisticasEstado();
  const proximosArribos = proximosArribosGlobal;

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

  const validateForm = () => {
    const requiredFields = ["nombre", "fecha", "capacidad", "tipo"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Los siguientes campos son obligatorios: ${missingFields.join(", ")}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const embarcacionData = {
        nombre: formData.nombre?.trim(),
        imo: formData.imo?.trim() || undefined,
        fecha: formData.fecha,
        capacidad: formData.capacidad?.trim(),
        tipo: formData.tipo,
        estado: formData.estado || "pendiente",
      };

      Object.keys(embarcacionData).forEach((key) => {
        if (embarcacionData[key] === undefined || embarcacionData[key] === "") {
          delete embarcacionData[key];
        }
      });

      if (currentEmbarcacion) {
        await updateEmbarcacionRequest(currentEmbarcacion._id, embarcacionData);
        toast.success("Embarcación actualizada correctamente");
      } else {
        await createEmbarcacionRequest(embarcacionData);
        toast.success("Embarcación creada correctamente");
      }

      setModalIsOpen(false);
      
      // Actualizar todo en paralelo
      await Promise.all([
        cargarEmbarcaciones(),
        cargarStats(),
        cargarProximosArribos()
      ]);
      
      resetForm();
    } catch (error) {
      console.error("Error completo:", error);
      toast.error(
        error.response?.data?.message || "Error al guardar la embarcación"
      );
    }
  };

  const handleEdit = (embarcacion) => {
    setCurrentEmbarcacion(embarcacion);

    let fechaFormateada = "";
    if (embarcacion.fecha) {
      try {
        const dateObj = new Date(embarcacion.fecha);
        // Asegurarse de que la fecha sea válida antes de formatear
        if (!isNaN(dateObj.getTime())) {
          fechaFormateada = dateObj.toISOString().split("T")[0];
        }
      } catch (e) {
        console.error("Error al formatear la fecha:", e);
      }
    }

    setFormData({
      nombre: embarcacion.nombre || "",
      imo: embarcacion.imo || "",
      fecha: fechaFormateada || "",
      capacidad: embarcacion.capacidad || "",
      tipo: embarcacion.tipo || "contenedor",
      estado: embarcacion.estado || "pendiente",
    });
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta embarcación?")) {
      try {
        await deleteEmbarcacionRequest(id);
        toast.success("Embarcación eliminada correctamente");
        
        // Actualizar todo en paralelo
        await Promise.all([
          cargarEmbarcaciones(),
          cargarStats(),
          cargarProximosArribos()
        ]);
      } catch (error) {
        console.error("Error al eliminar embarcación:", error);
        toast.error("Error al eliminar la embarcación");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      imo: "",
      fecha: "",
      capacidad: "",
      tipo: "contenedor",
      estado: "pendiente",
    });
    setCurrentEmbarcacion(null);
  };

  const abrirModalCrear = () => {
    resetForm();
    setModalIsOpen(true);
  };

  const handleVerTodos = () => {
    toast.success('Funcionalidad "Ver todos" en desarrollo');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Embarcaciones</h1>

      <div className="mb-6 flex justify-end">
        {user && user.rol === "admin" && (
          <button
            onClick={abrirModalCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Nueva Embarcación
          </button>
        )}
      </div>

      <EmbarcacionesStats estadisticas={estadisticas} />

      <div className="bg-white rounded-lg shadow-md mb-6">
        <EmbarcacionesFilter
          filtros={filtros}
          handleFiltroChange={handleFiltroChange}
        />

        <EmbarcacionesTable
          loading={loading}
          embarcacionesFiltradas={embarcaciones} // Pasamos las embarcaciones directamente
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
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Embarcaciones por Estado
            </h2>
            <div className="text-sm text-gray-500">
              <select className="border-none text-sm bg-transparent">
                <option>Este Mes</option>
                <option>Este Trimestre</option>
                <option>Este Año</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {estadisticasEstado.map((estado) => (
              <div key={estado.nombre}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <span
                      className={`w-3 h-3 bg-${estado.color}-500 rounded-full mr-2`}
                    ></span>
                    {estado.nombre}
                  </span>
                  <span>{estado.cantidad} embarcaciones</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${estado.color}-500 h-2 rounded-full`}
                    style={{ width: `${estado.porcentaje}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Próximos Arribos
            </h2>
            <button
              onClick={handleVerTodos}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {proximosArribos.length > 0 ? (
              proximosArribos.map((embarcacion) => (
                <div
                  key={embarcacion._id}
                  className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <i className="fas fa-ship"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {embarcacion.nombre}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ETA: {formatDate(embarcacion.fecha)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstado(
                      embarcacion.estado
                    )}`}
                  >
                    {getTextoEstado(embarcacion.estado)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No hay próximos arribos programados
              </div>
            )}
          </div>
        </div>
      </div>

      <EmbarcacionesForm
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        currentEmbarcacion={currentEmbarcacion}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export default Embarcaciones;
