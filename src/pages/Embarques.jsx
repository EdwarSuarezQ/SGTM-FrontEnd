import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getEmbarquesRequest,
  createEmbarqueRequest,
  updateEmbarqueRequest,
  deleteEmbarqueRequest,
  getEmbarquesStatsRequest,
} from "../api/embarques";
import { getEmbarcacionesRequest } from "../api/embarcaciones";
import { getRutasRequest } from "../api/rutas";
import { getAlmacenesRequest } from "../api/almacenes";
import { getPersonalRequest } from "../api/personal";
import { toast } from "react-hot-toast";
import {
  formatDate,
  getColorEstadoEmbarque,
  getTextoEstadoEmbarque,
} from "../utils/helpers";

// Importar componentes
import EmbarquesStats from "../components/embarques/EmbarquesStats";
import EmbarquesFilter from "../components/embarques/EmbarquesFilter";
import EmbarquesTable from "../components/embarques/EmbarquesTable";
import EmbarquesForm from "../components/embarques/EmbarquesForm";
import Pagination from "../components/Pagination";

// Función para calcular entregas a tiempo
const calcularEntregasATiempo = (embarques) => {
  const entregados = embarques.filter((e) => e.estado === "entregado").length;
  const total = embarques.length;
  return total > 0 ? Math.round((entregados / total) * 100) : 0;
};

// Función para calcular peso total
const calcularPesoTotal = (embarques) => {
  return embarques.reduce((total, e) => total + (e.peso || 0), 0);
};

// Función para calcular variación de peso
const calcularVariacionPeso = (embarques) => {
  const pesoTotal = calcularPesoTotal(embarques);
  const promedioPeso = embarques.length > 0 ? pesoTotal / embarques.length : 0;

  if (promedioPeso === 0) return 0;
  return Math.round(((pesoTotal - promedioPeso) / promedioPeso) * 100);
};

// Función para calcular embarques en retraso
const calcularEmbarquesRetraso = (embarques) => {
  const hoy = new Date();
  return embarques.filter((embarque) => {
    if (embarque.estado === "entregado" || embarque.estado === "cancelado")
      return false;
    if (!embarque.fechaEstimada) return false;

    const fechaEstimada = new Date(embarque.fechaEstimada);
    return fechaEstimada < hoy;
  }).length;
};

// Función para obtener próximos embarques
const obtenerProximosEmbarques = (embarques, limite = 4) => {
  const hoy = new Date();
  return embarques
    .filter((embarque) => {
      if (embarque.estado === "entregado" || embarque.estado === "cancelado")
        return false;
      if (!embarque.fechaEstimada) return false;

      const fechaEstimada = new Date(embarque.fechaEstimada);
      return fechaEstimada >= hoy;
    })
    .sort((a, b) => new Date(a.fechaEstimada) - new Date(b.fechaEstimada))
    .slice(0, limite);
};

// Componente para la barra de progreso
const BarraProgreso = ({ porcentaje, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className={`h-2 rounded-full bg-${color}-500`}
      style={{ width: `${porcentaje}%` }}
    ></div>
  </div>
);

function Embarques() {
  const { user } = useAuth();
  const [embarques, setEmbarques] = useState([]);
  const [embarcaciones, setEmbarcaciones] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEmbarque, setCurrentEmbarque] = useState(null);
  
  // Estados de filtros y paginación
  const [filtros, setFiltros] = useState({
    estado: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    totalPeso: 0,
    avgPeso: 0,
    pendientes: 0,
    enTransito: 0,
    enAduana: 0,
    entregados: 0
  });
  const [proximosEmbarquesGlobal, setProximosEmbarquesGlobal] = useState([]);

  const [formData, setFormData] = useState({
    numeroGuia: "",
    cliente: "",
    embarcacionId: "",
    rutaId: "",
    almacenId: "",
    supervisorId: "",
    origen: "",
    destino: "",
    fechaSalida: "",
    fechaEstimada: "",
    tipoCarga: "seco",
    estado: "pendiente",
    peso: "",
    volumen: "",
    valorDeclarado: "",
    observaciones: "",
  });

  // Cargar embarques cuando cambian los filtros o la página
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarEmbarques();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, filtros]);

  // Cargar datos auxiliares al montar
  useEffect(() => {
    cargarEmbarcaciones();
    cargarRutas();
    cargarAlmacenes();
    cargarPersonal();
    cargarStats();
    cargarProximosEmbarques();
  }, []);

  const cargarStats = async () => {
    try {
      const res = await getEmbarquesStatsRequest();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const cargarProximosEmbarques = async () => {
    try {
      // Buscamos embarques en tránsito o pendientes, ordenados por fecha estimada (ascendente)
      // Usamos estado "en-transito" como prioridad, o podríamos no filtrar por estado y ordenar por fecha estimada >= hoy
      // El backend actual filtra por estado exacto.
      // Vamos a pedir los "en-transito" ordenados por fecha estimada.
      const params = {
        page: 1,
        limit: 4,
        sort: "fechaEstimada",
        estado: "en-transito"
      };
      
      const res = await getEmbarquesRequest(params);
      if (res.data && res.data.success && res.data.data) {
        setProximosEmbarquesGlobal(res.data.data.items || []);
      }
    } catch (error) {
      console.error("Error al cargar próximos embarques:", error);
    }
  };

  const cargarEmbarques = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        estado: filtros.estado,
        search: filtros.search
      };

      const res = await getEmbarquesRequest(params);

      if (
        res.data &&
        res.data.success &&
        res.data.data
      ) {
        setEmbarques(res.data.data.items || []);
        setTotalItems(res.data.data.total || 0);
        setTotalPages(Math.ceil((res.data.data.total || 0) / itemsPerPage));
      } else {
        setEmbarques([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error al cargar embarques:", error);
      toast.error("Error al cargar los embarques");
      setEmbarques([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarEmbarcaciones = async () => {
    try {
      const res = await getEmbarcacionesRequest();
      if (res.data?.success && Array.isArray(res.data.data?.items)) {
        setEmbarcaciones(res.data.data.items);
      }
    } catch (error) {
      console.error("Error al cargar embarcaciones:", error);
    }
  };

  const cargarRutas = async () => {
    try {
      const res = await getRutasRequest();
      if (res.data?.success && Array.isArray(res.data.data?.items)) {
        setRutas(res.data.data.items);
      }
    } catch (error) {
      console.error("Error al cargar rutas:", error);
    }
  };

  const cargarAlmacenes = async () => {
    try {
      const res = await getAlmacenesRequest();
      if (res.data?.success && Array.isArray(res.data.data?.items)) {
        // Filtrar solo almacenes operativos
        const almacenesOperativos = res.data.data.items.filter(
          (almacen) => almacen.estado === "operativo"
        );
        setAlmacenes(almacenesOperativos);
      }
    } catch (error) {
      console.error("Error al cargar almacenes:", error);
    }
  };

  const cargarPersonal = async () => {
    try {
      const res = await getPersonalRequest({ limit: 100 });
      if (res.data?.success && Array.isArray(res.data.data?.items)) {
        // Filtrar solo personal activo
        const personalActivo = res.data.data.items.filter(
          (p) => p.estado === "activo"
        );
        setPersonal(personalActivo);
      }
    } catch (error) {
      console.error("Error al cargar personal:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  // Calcular estadísticas (basadas en la página actual por ahora)
  // Calcular estadísticas usando datos globales
  const embarquesActivos = (stats.enTransito || 0) + (stats.enAduana || 0) + (stats.pendientes || 0);

  const entregasATiempo = stats.total > 0 ? Math.round((stats.entregados / stats.total) * 100) : 0;
  const pesoTotal = stats.totalPeso || 0;
  const totalEmbarquesGlobal = stats.total || 0;
  const porcentajeActivos =
    totalEmbarquesGlobal > 0
      ? Math.round((embarquesActivos / totalEmbarquesGlobal) * 100)
      : 0;
  
  // Replicar lógica de variación de peso
  const variacionPeso = stats.avgPeso > 0 
    ? Math.round(((stats.totalPeso - stats.avgPeso) / stats.avgPeso) * 100) 
    : 0;

  // Nota: embarquesRetraso requiere filtrado por fecha que no está en stats agregados aún,
  // por ahora usamos 0 o lo que venga del backend si lo implementamos.
  // Para mantener consistencia visual, podemos dejarlo en 0 o calcularlo solo de la página actual (pero eso sería inconsistente).
  // Vamos a dejarlo como estaba (página actual) solo para este dato específico o 0.
  const embarquesRetraso = calcularEmbarquesRetraso(embarques); 
  
  const proximosEmbarques = proximosEmbarquesGlobal;

  // Calcular estadísticas por estado
  const estadisticasPorEstado = [
    {
      nombre: "En tránsito",
      color: "blue",
      cantidad: stats.enTransito,
    },
    {
      nombre: "Entregados",
      color: "green",
      cantidad: stats.entregados,
    },
    {
      nombre: "Pendientes",
      color: "gray",
      cantidad: stats.pendientes,
    },
    {
      nombre: "En retraso",
      color: "red",
      cantidad: embarquesRetraso,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRutaChange = (e) => {
    const rutaId = e.target.value;
    const rutaSeleccionada = rutas.find((r) => r._id === rutaId);

    setFormData((prev) => ({
      ...prev,
      rutaId: rutaId,
      origen: rutaSeleccionada ? rutaSeleccionada.origen : "",
      destino: rutaSeleccionada ? rutaSeleccionada.destino : "",
    }));
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Resetear a página 1 al filtrar
  };

  const validateForm = () => {
    const requiredFields = [
      "numeroGuia",
      "cliente",
      "origen",
      "destino",
      "fechaSalida",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Los siguientes campos son obligatorios: ${missingFields.join(", ")}`
      );
      return false;
    }

    // Validar formato de fechas
    if (
      formData.fechaSalida &&
      isNaN(new Date(formData.fechaSalida).getTime())
    ) {
      toast.error("La fecha de salida no es válida");
      return false;
    }

    if (
      formData.fechaEstimada &&
      isNaN(new Date(formData.fechaEstimada).getTime())
    ) {
      toast.error("La fecha estimada no es válida");
      return false;
    }

    // Validar que la fecha estimada sea posterior a la fecha de salida si ambas existen
    if (formData.fechaSalida && formData.fechaEstimada) {
      const fechaSalida = new Date(formData.fechaSalida);
      const fechaEstimada = new Date(formData.fechaEstimada);

      if (fechaEstimada < fechaSalida) {
        toast.error(
          "La fecha estimada debe ser posterior a la fecha de salida"
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // MAPEAR "completado" a "entregado" para el backend
      const estadoParaBackend =
        formData.estado === "completado" ? "entregado" : formData.estado;

      // Preparar los datos para enviar
      const embarqueData = {
        numeroGuia: formData.numeroGuia?.trim(),
        cliente: formData.cliente?.trim(),
        embarcacionId: formData.embarcacionId || undefined,
        rutaId: formData.rutaId || undefined,
        almacenId: formData.almacenId || undefined,
        origen: formData.origen?.trim(),
        destino: formData.destino?.trim(),
        tipoCarga: formData.tipoCarga,
        estado: estadoParaBackend || "pendiente",
        fechaSalida: new Date(formData.fechaSalida).toISOString(),
        fechaEstimada: formData.fechaEstimada
          ? new Date(formData.fechaEstimada).toISOString()
          : undefined,
        peso: formData.peso ? Number(formData.peso) : undefined,
        volumen: formData.volumen ? Number(formData.volumen) : undefined,
        valorDeclarado: formData.valorDeclarado
          ? Number(formData.valorDeclarado)
          : undefined,
        observaciones: formData.observaciones?.trim() || undefined,
      };

      // Limpiar campos undefined
      Object.keys(embarqueData).forEach((key) => {
        if (embarqueData[key] === undefined || embarqueData[key] === "") {
          delete embarqueData[key];
        }
      });

      if (currentEmbarque) {
        await updateEmbarqueRequest(currentEmbarque._id, embarqueData);
        toast.success("Embarque actualizado correctamente");
      } else {
        await createEmbarqueRequest(embarqueData);
        toast.success("Embarque creado correctamente");
      }

      setModalIsOpen(false);
      setModalIsOpen(false);
      
      // Actualizar todo en paralelo
      await Promise.all([
        cargarEmbarques(),
        cargarStats(),
        cargarProximosEmbarques()
      ]);
      
      resetForm();
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.entries(validationErrors).map(
          ([field, message]) => `${field}: ${message}`
        );

        errorMessages.forEach((msg) => {
          toast.error(msg, { duration: 5000 });
        });
      } else if (error.response?.data?.error?.includes("duplicate")) {
        toast.error("El número de guía ya existe. Use un número diferente.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al guardar el embarque");
      }
    }
  };

  const handleEdit = (embarque) => {
    setCurrentEmbarque(embarque);

    // Convertir fechas de Date a string para el input (YYYY-MM-DD)
    const formatDateForInput = (date) => {
      if (!date) return "";
      try {
        if (typeof date === "string") {
          return date.split("T")[0];
        }
        if (date instanceof Date) {
          return date.toISOString().split("T")[0];
        }
        return "";
      } catch (error) {
        console.error("Error formateando fecha:", error);
        return "";
      }
    };

    setFormData({
      numeroGuia: embarque.numeroGuia || "",
      cliente: embarque.cliente || "",
      embarcacionId: embarque.embarcacionId?._id || embarque.embarcacionId || "",
      rutaId: embarque.rutaId?._id || embarque.rutaId || "",
      almacenId: embarque.almacenId?._id || embarque.almacenId || "",
      origen: embarque.origen || "",
      destino: embarque.destino || "",
      fechaSalida: formatDateForInput(embarque.fechaSalida),
      fechaEstimada: formatDateForInput(embarque.fechaEstimada),
      tipoCarga: embarque.tipoCarga || "seco",
      estado: embarque.estado || "pendiente",
      peso: embarque.peso || "",
      volumen: embarque.volumen || "",
      valorDeclarado: embarque.valorDeclarado || "",
      observaciones: embarque.observaciones || "",
    });
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este embarque?")) {
      try {
        await deleteEmbarqueRequest(id);
        toast.success("Embarque eliminado correctamente");
        
        // Actualizar todo en paralelo
        await Promise.all([
          cargarEmbarques(),
          cargarStats(),
          cargarProximosEmbarques()
        ]);
      } catch (error) {
        console.error("Error al eliminar embarque:", error);
        toast.error("Error al eliminar el embarque");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      numeroGuia: "",
      cliente: "",
      embarcacionId: "",
      rutaId: "",
      almacenId: "",
      origen: "",
      destino: "",
      fechaSalida: "",
      fechaEstimada: "",
      tipoCarga: "seco",
      estado: "pendiente",
      peso: "",
      volumen: "",
      valorDeclarado: "",
      observaciones: "",
    });
    setCurrentEmbarque(null);
  };

  const abrirModalCrear = () => {
    resetForm();
    setModalIsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Embarques</h1>

      <div className="mb-6 flex justify-end">
        {user && user.rol === "admin" && (
          <button
            onClick={abrirModalCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Nuevo Embarque
          </button>
        )}
      </div>

      <EmbarquesStats
        embarquesActivos={embarquesActivos}
        entregasATiempo={entregasATiempo}
        pesoTotal={pesoTotal}
        porcentajeActivos={porcentajeActivos}
        variacionPeso={variacionPeso}
      />

      <div className="bg-white rounded-lg shadow-md mb-6">
        <EmbarquesFilter
          filtros={filtros}
          handleFiltroChange={handleFiltroChange}
        />

        <EmbarquesTable
          loading={loading}
          embarquesFiltrados={embarques} // Pasamos los embarques directamente
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
        {/* Panel: Embarques por Estado */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Embarques por Estado
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
            {estadisticasPorEstado.map((estado, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <span
                      className={`w-3 h-3 bg-${estado.color}-500 rounded-full mr-2`}
                    ></span>
                    {estado.nombre}
                  </span>
                  <span>{estado.cantidad} embarques</span>
                </div>
                <BarraProgreso
                  porcentaje={
                    totalEmbarquesGlobal > 0
                      ? (estado.cantidad / totalEmbarquesGlobal) * 100
                      : 0
                  }
                  color={estado.color}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Panel: Próximas Llegadas */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Próximas Llegadas
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {proximosEmbarques.length > 0 ? (
              proximosEmbarques.map((embarque) => (
                <div
                  key={embarque._id}
                  className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <i className="fas fa-shipping-fast"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {embarque.numeroGuia} - {embarque.cliente}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ETA: {formatDate(embarque.fechaEstimada)} -{" "}
                      {embarque.origen} a {embarque.destino}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoEmbarque(
                      embarque.estado
                    )}`}
                  >
                    {getTextoEstadoEmbarque(embarque.estado)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No hay próximas llegadas programadas
              </div>
            )}
          </div>
        </div>
      </div>

      <EmbarquesForm
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        currentEmbarque={currentEmbarque}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleRutaChange={handleRutaChange}
        embarcaciones={embarcaciones}
        rutas={rutas}
        almacenes={almacenes}
        personal={personal}
      />
    </div>
  );
}

export default Embarques;
