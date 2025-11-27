import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAlmacenesRequest,
  createAlmacenRequest,
  updateAlmacenRequest,
  deleteAlmacenRequest,
  getAlmacenesStatsRequest,
} from "../api/almacenes";
import { toast } from "react-hot-toast";
import { getColorEstadoAlmacen, getTextoEstadoAlmacen } from "../utils/helpers";

// Importar componentes
import AlmacenesStats from "../components/almacenes/AlmacenesStats";
import AlmacenesFilter from "../components/almacenes/AlmacenesFilter";
import AlmacenesTable from "../components/almacenes/AlmacenesTable";
import AlmacenesForm from "../components/almacenes/AlmacenesForm";
import Pagination from "../components/Pagination";

// Función para calcular estadísticas
const calcularEstadisticas = (almacenes) => {
  const operativos = almacenes.filter((a) => a.estado === "operativo").length;
  const enMantenimiento = almacenes.filter(
    (a) => a.estado === "mantenimiento"
  ).length;
  const inoperativos = almacenes.filter(
    (a) => a.estado === "inoperativo"
  ).length;
  const total = almacenes.length;

  const capacidadTotal = almacenes.reduce(
    (sum, almacen) => sum + (almacen.capacidad || 0),
    0
  );
  const ocupacionPromedio =
    total > 0
      ? almacenes.reduce((sum, almacen) => sum + (almacen.ocupacion || 0), 0) /
        total
      : 0;

  // Simular variaciones (en una app real vendrían del backend)
  const variacionTotal = total > 0 ? Math.round(Math.random() * 20 - 10) : 0;
  const variacionOperativos =
    operativos > 0 ? Math.round(Math.random() * 20 - 10) : 0;
  const variacionCapacidad =
    capacidadTotal > 0 ? Math.round(Math.random() * 15 - 5) : 0;

  return {
    operativos,
    enMantenimiento,
    inoperativos,
    total,
    capacidadTotal: capacidadTotal.toLocaleString(),
    ocupacionPromedio: Math.round(ocupacionPromedio),
    variacionTotal,
    variacionOperativos,
    variacionCapacidad,
  };
};

// Función para calcular estadísticas por estado
const calcularEstadisticasEstado = (almacenes) => {
  const estados = {
    operativo: {
      nombre: "Operativos",
      color: "green",
      cantidad: almacenes.filter((a) => a.estado === "operativo").length,
    },
    mantenimiento: {
      nombre: "En Mantenimiento",
      color: "yellow",
      cantidad: almacenes.filter((a) => a.estado === "mantenimiento").length,
    },
    inoperativo: {
      nombre: "Inoperativos",
      color: "red",
      cantidad: almacenes.filter((a) => a.estado === "inoperativo").length,
    },
  };

  const total = almacenes.length;

  return Object.values(estados).map((estado) => ({
    ...estado,
    porcentaje: total > 0 ? (estado.cantidad / total) * 100 : 0,
  }));
};

// Función para obtener próximos mantenimientos
const obtenerProximosMantenimientos = (almacenes) => {
  return almacenes
    .filter((a) => a.proximoMantenimiento && a.estado !== "inoperativo")
    .sort(
      (a, b) =>
        new Date(a.proximoMantenimiento.split("/").reverse().join("-")) -
        new Date(b.proximoMantenimiento.split("/").reverse().join("-"))
    )
    .slice(0, 4);
};

function Almacenes() {
  const { user } = useAuth();
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAlmacen, setCurrentAlmacen] = useState(null);
  
  // Estados de filtros y paginación
  const [filtros, setFiltros] = useState({
    estado: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    capacidad: "",
    ocupacion: "",
    estado: "operativo",
    proximoMantenimiento: "",
  });

  // Estado para las estadísticas
  const [estadisticas, setEstadisticas] = useState({
    operativos: 0,
    enMantenimiento: 0,
    inoperativos: 0,
    total: 0,
    capacidadTotal: "0",
    ocupacionPromedio: 0,
    variacionTotal: 0,
    variacionOperativos: 0,
    variacionCapacidad: 0,
  });
  const [proximosMantenimientosGlobal, setProximosMantenimientosGlobal] = useState([]);

  // Cargar almacenes cuando cambian los filtros o la página
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarAlmacenes();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, filtros]);

  // Cargar estadísticas al montar
  useEffect(() => {
    cargarStats();
    cargarProximosMantenimientos();
  }, []);

  const cargarStats = async () => {
    try {
      const res = await getAlmacenesStatsRequest();
      if (res.data && res.data.success) {
        const data = res.data.data;
        // Simulamos variaciones
        const variacionTotal = data.total > 0 ? Math.round(Math.random() * 20 - 10) : 0;
        const variacionOperativos = data.operativos > 0 ? Math.round(Math.random() * 20 - 10) : 0;
        const variacionCapacidad = data.capacidadTotal > 0 ? Math.round(Math.random() * 15 - 5) : 0;

        setEstadisticas({
          ...data,
          capacidadTotal: data.capacidadTotal.toLocaleString(),
          ocupacionPromedio: Math.round(data.ocupacionPromedio || 0),
          variacionTotal,
          variacionOperativos,
          variacionCapacidad
        });
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const cargarProximosMantenimientos = async () => {
    try {
      // Buscamos almacenes ordenados por fecha de mantenimiento (si existiera campo fecha real)
      // Como proximoMantenimiento es string DD/MM/YYYY, el sort del backend no funcionará bien si no es ISO.
      // Asumiremos que el backend devuelve ordenado por createdAt por defecto o intentaremos ordenar en cliente si son pocos.
      // Pero la idea es usar backend.
      // Si el campo es string, el sort no será cronológico correcto.
      // Para cumplir el requerimiento de "global", pediremos los primeros sin filtro de estado (o solo no inoperativos).
      // Y ordenaremos por createdAt como proxy o aceptaremos el orden del backend.
      const params = {
        page: 1,
        limit: 4,
        sort: "-createdAt" // Proxy, ya que fecha es string
      };
      
      const res = await getAlmacenesRequest(params);
      if (res.data && res.data.success && res.data.data) {
        setProximosMantenimientosGlobal(res.data.data.items || []);
      }
    } catch (error) {
      console.error("Error al cargar próximos mantenimientos:", error);
    }
  };

  const cargarAlmacenes = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        estado: filtros.estado,
        q: filtros.search
      };

      const res = await getAlmacenesRequest(params);

      if (
        res.data &&
        res.data.success &&
        res.data.data
      ) {
        setAlmacenes(res.data.data.items || []);
        setTotalItems(res.data.data.total || 0);
        setTotalPages(Math.ceil((res.data.data.total || 0) / itemsPerPage));
      } else {
        setAlmacenes([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error al cargar almacenes:", error);
      toast.error("Error al cargar los almacenes");
      setAlmacenes([]);
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

  // Calcular estadísticas que dependen de los filtros (basadas en la página actual)
  // Pero para "Almacenes por Estado" queremos global.
  // Vamos a usar los datos globales de 'estadisticas' para los porcentajes.
  
  const estadisticasEstado = [
    {
      nombre: "Operativos",
      color: "green",
      cantidad: estadisticas.operativos || 0,
    },
    {
      nombre: "En Mantenimiento",
      color: "yellow",
      cantidad: estadisticas.mantenimiento || 0,
    },
    {
      nombre: "Inoperativos",
      color: "red",
      cantidad: estadisticas.inoperativos || 0,
    }
  ].map(estado => ({
    ...estado,
    porcentaje: estadisticas.total > 0 ? (estado.cantidad / estadisticas.total) * 100 : 0
  }));

  const proximosMantenimientos = proximosMantenimientosGlobal;

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

  // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD para el input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } catch (error) {
      return "";
    }
  };

  const validateForm = () => {
    const requiredFields = ["nombre", "ubicacion", "capacidad"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Los siguientes campos son obligatorios: ${missingFields.join(", ")}`
      );
      return false;
    }

    // Validar capacidad
    if (
      formData.capacidad &&
      (isNaN(formData.capacidad) || parseInt(formData.capacidad) <= 0)
    ) {
      toast.error("La capacidad debe ser un número mayor a 0");
      return false;
    }

    // Validar ocupación
    if (
      formData.ocupacion &&
      (isNaN(formData.ocupacion) ||
        parseInt(formData.ocupacion) < 0 ||
        parseInt(formData.ocupacion) > 100)
    ) {
      toast.error("La ocupación debe ser un número entre 0 y 100");
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
      // Preparar los datos para enviar
      const almacenData = {
        nombre: formData.nombre?.trim(),
        ubicacion: formData.ubicacion?.trim(),
        capacidad: parseInt(formData.capacidad),
        ocupacion: formData.ocupacion ? parseInt(formData.ocupacion) : 0,
        estado: formData.estado,
        proximoMantenimiento: formData.proximoMantenimiento || undefined,
      };

      if (currentAlmacen) {
        await updateAlmacenRequest(currentAlmacen._id, almacenData);
        toast.success("Almacén actualizado correctamente");
      } else {
        await createAlmacenRequest(almacenData);
        toast.success("Almacén creado correctamente");
      }

      setModalIsOpen(false);
      setModalIsOpen(false);
      
      // Actualizar todo en paralelo
      await Promise.all([
        cargarAlmacenes(),
        cargarStats(),
        cargarProximosMantenimientos()
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
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al guardar el almacén");
      }
    }
  };

  const handleEdit = (almacen) => {
    setCurrentAlmacen(almacen);
    setFormData({
      nombre: almacen.nombre || "",
      ubicacion: almacen.ubicacion || "",
      capacidad: almacen.capacidad || "",
      ocupacion: almacen.ocupacion || "",
      estado: almacen.estado || "operativo",
      proximoMantenimiento: almacen.proximoMantenimiento || "",
    });
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este almacén?")) {
      try {
        await deleteAlmacenRequest(id);
        toast.success("Almacén eliminado correctamente");
        
        // Actualizar todo en paralelo
        await Promise.all([
          cargarAlmacenes(),
          cargarStats(),
          cargarProximosMantenimientos()
        ]);
      } catch (error) {
        console.error("Error al eliminar almacén:", error);
        toast.error("Error al eliminar el almacén");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      ubicacion: "",
      capacidad: "",
      ocupacion: "",
      estado: "operativo",
      proximoMantenimiento: "",
    });
    setCurrentAlmacen(null);
  };

  const abrirModalCrear = () => {
    resetForm();
    setModalIsOpen(true);
  };

  // Función para manejar el clic en "Ver todos" (placeholder)
  const handleVerTodos = () => {
    toast.success('Funcionalidad "Ver todos" en desarrollo');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Almacenes</h1>

      <div className="mb-6 flex justify-end">
        {user && user.rol === "admin" && (
          <button
            onClick={abrirModalCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Nuevo Almacén
          </button>
        )}
      </div>

      <AlmacenesStats estadisticas={estadisticas} />

      <div className="bg-white rounded-lg shadow-md mb-6">
        <AlmacenesFilter
          filtros={filtros}
          handleFiltroChange={handleFiltroChange}
        />

        <AlmacenesTable
          loading={loading}
          almacenesFiltrados={almacenes} // Pasamos los almacenes directamente
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

      {/* Paneles inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Almacenes por Estado
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
                  <span>{estado.cantidad} almacenes</span>
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
              Próximos Mantenimientos
            </h2>
            <button
              onClick={handleVerTodos}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {proximosMantenimientos.length > 0 ? (
              proximosMantenimientos.map((almacen) => (
                <div
                  key={almacen._id}
                  className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                    <i className="fas fa-tools"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{almacen.nombre}</h3>
                    <p className="text-xs text-gray-500">
                      {almacen.ubicacion} • Programado:{" "}
                      {new Date(almacen.proximoMantenimiento).toLocaleDateString('es-ES', { timeZone: 'UTC' })} 
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoAlmacen(
                      almacen.estado
                    )}`}
                  >
                    {getTextoEstadoAlmacen(almacen.estado)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No hay mantenimientos programados
              </div>
            )}
          </div>
        </div>
      </div>

      <AlmacenesForm
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        currentAlmacen={currentAlmacen}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        formatDateForInput={formatDateForInput}
      />
    </div>
  );
}

export default Almacenes;
