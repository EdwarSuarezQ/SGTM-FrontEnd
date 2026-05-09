import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getTareasRequest,
  createTareaRequest,
  updateTareaRequest,
  deleteTareaRequest,
  getTareasStatsRequest,
} from "../api/tareas";
import { getPersonalRequest } from "../api/personal";
import { toast } from "react-hot-toast";
import { getColorPrioridad, getEstadoText } from "../utils/helpers";
import TareasStats from "../components/tareas/TareasStats";
import TareasFilter from "../components/tareas/TareasFilter";
import TareasTable from "../components/tareas/TareasTable";
import TareasForm from "../components/tareas/TareasForm";
import Pagination from "../components/Pagination";

function Tareas() {
  const { user } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentTarea, setCurrentTarea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    completadas: 0,
    enProgreso: 0,
    altaPrioridad: 0
  });
  const [proximasTareasGlobal, setProximasTareasGlobal] = useState([]);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    estado: "",
    prioridad: "",
    fecha: "",
    asignado: "",
    asignadoEmail: "",
    departamento: "",
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarTareas();
    }, 300); 
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, filtroEstado, filtroPrioridad, busqueda]);
  useEffect(() => {
    cargarPersonal();
    cargarStats();
    cargarProximasTareas();
  }, []);

  const cargarStats = async () => {
    try {
      const res = await getTareasStatsRequest();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const cargarProximasTareas = async () => {
    try {
      const params = {
        page: 1,
        limit: 4,
        sort: "fecha", 
        estado: "pendiente"
      };
      
      const res = await getTareasRequest(params);
      if (res.data && res.data.success && res.data.data) {
        setProximasTareasGlobal(res.data.data.items || []);
      }
    } catch (error) {
      console.error("Error al cargar próximas tareas:", error);
    }
  };

  const cargarTareas = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        estado: filtroEstado,
        prioridad: filtroPrioridad,
        q: busqueda
      };
      
      const res = await getTareasRequest(params);

      if (
        res.data &&
        res.data.success &&
        res.data.data
      ) {
        setTareas(res.data.data.items || []);
        setTotalItems(res.data.data.total || 0);
        setTotalPages(Math.ceil((res.data.data.total || 0) / itemsPerPage));
      } else {
        setTareas([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      toast.error("Error al cargar las tareas");
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarPersonal = async () => {
    try {
      const res = await getPersonalRequest();

      if (
        res.data &&
        res.data.success &&
        res.data.data &&
        Array.isArray(res.data.data.items)
      ) {
        const personalActivo = res.data.data.items.filter((p) => {
          const estado = p.estado?.toLowerCase() || "";
          return estado === "activo" || p.activo === true;
        });

        setPersonal(personalActivo);
      } else {
        setPersonal([]);
      }
    } catch (error) {
      console.error("Error al cargar personal:", error);
      setPersonal([]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit) => {
    setItemsPerPage(limit);
    setCurrentPage(1); 
  };

  const handleAsignadoChange = (e) => {
    const personaId = e.target.value;
    const personaSeleccionada = personal.find((p) => p._id === personaId);

    setFormData({
      ...formData,
      asignadoId: personaId, 
      asignado: personaSeleccionada ? personaSeleccionada.nombre : "", 
      departamento: personaSeleccionada ? personaSeleccionada.departamento : "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      toast.error("El título es requerido");
      return;
    }

    try {
      const tareaData = {
        ...formData,
        fecha: formData.fecha, 
      };

      if (currentTarea) {
        await updateTareaRequest(currentTarea._id, tareaData);
        toast.success("Tarea actualizada correctamente");
      } else {
        await createTareaRequest(tareaData);
        toast.success("Tarea creada correctamente");
      }

      setModalIsOpen(false);
      await Promise.all([
        cargarTareas(),
        cargarStats(),
        cargarProximasTareas()
      ]);
      setFormData({
        titulo: "",
        descripcion: "",
        estado: "",
        prioridad: "",
        fecha: "",
        asignado: "",
        departamento: "",
      });
      setCurrentTarea(null);
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      toast.error(error.response?.data?.message || "Error al guardar la tarea");
    }
  };

  const handleEdit = (tarea) => {
    setCurrentTarea(tarea);
    const fechaFormateada = tarea.fecha 
      ? new Date(tarea.fecha).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    setFormData({
      titulo: tarea.titulo || "",
      descripcion: tarea.descripcion || "",
      estado: tarea.estado || "pendiente",
      prioridad: tarea.prioridad || "media",
      fecha: fechaFormateada,
      asignado: tarea.asignado || "",
      departamento: tarea.departamento || "",
    });
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
      try {
        await deleteTareaRequest(id);
        toast.success("Tarea eliminada correctamente");
        await Promise.all([
          cargarTareas(),
          cargarStats(),
          cargarProximasTareas()
        ]);
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        toast.error("Error al eliminar la tarea");
      }
    }
  };

  const abrirModalCrear = () => {
    setCurrentTarea(null);
    setFormData({
      titulo: "",
      descripcion: "",
      estado: "",
      prioridad: "",
      fecha: "",
      asignado: "",
      asignadoEmail: "",
      departamento: "",
    });
    setModalIsOpen(true);
  };
  const tareasPendientes = stats.pendientes;
  const tareasCompletadas = stats.completadas;
  const eficiencia =
    stats.total > 0
      ? Math.round((tareasCompletadas / stats.total) * 100)
      : 0;
  const tareasAltaPrioridad = stats.altaPrioridad;
  const porcentajePendientes =
    stats.total > 0
      ? Math.round((tareasPendientes / stats.total) * 100)
      : 0;
  const porcentajeAltaPrioridad =
    stats.total > 0
      ? Math.round((tareasAltaPrioridad / stats.total) * 100)
      : 0;
  const eficienciaSemanaPasada = 72;
  const diferencia = eficiencia - eficienciaSemanaPasada;
  const estadisticasEstado = [
    {
      nombre: "En progreso",
      color: "blue",
      cantidad: stats.enProgreso,
    },
    {
      nombre: "Completadas",
      color: "green",
      cantidad: stats.completadas,
    },
    {
      nombre: "Pendientes",
      color: "yellow",
      cantidad: stats.pendientes,
    },
  ];

  const totalTareasGlobal = stats.total;
  const proximasTareas = proximasTareasGlobal;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Tareas</h1>

      <div className="mb-6 flex justify-end">
        {user && user.rol === "admin" && (
          <button
            onClick={abrirModalCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Nueva Tarea
          </button>
        )}
      </div>

      {}
      <TareasStats
        tareasPendientes={tareasPendientes}
        eficiencia={eficiencia}
        tareasAltaPrioridad={tareasAltaPrioridad}
        porcentajePendientes={porcentajePendientes}
        diferencia={diferencia}
        porcentajeAltaPrioridad={porcentajeAltaPrioridad}
      />

      {}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <TareasFilter
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          filtroPrioridad={filtroPrioridad}
          setFiltroPrioridad={setFiltroPrioridad}
        />

        <TareasTable
          loading={loading}
          tareasFiltradas={tareas} 
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          user={user}
        />

        {}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Tareas por Estado
            </h2>
            <div className="text-sm text-gray-500">
              <select className="border-none text-sm">
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
                  <span>{estado.cantidad} tareas</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${estado.color}-500 h-2 rounded-full`}
                    style={{
                      width:
                        totalTareasGlobal > 0
                          ? `${(estado.cantidad / totalTareasGlobal) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Próximas Tareas
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Ver todas
            </button>
          </div>
          <div className="space-y-3">
            {proximasTareas.map((tarea) => (
              <div
                key={tarea._id}
                className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div
                  className={`h-10 w-10 rounded-full ${getColorPrioridad(
                    tarea.prioridad
                  )} flex items-center justify-center text-white mr-3`}
                >
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{tarea.titulo}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(tarea.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })} - {tarea.asignado}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    tarea.estado === "completada"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : tarea.estado === "en-progreso"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }`}
                >
                  {getEstadoText(tarea.estado)}
                </span>
              </div>
            ))}
            {proximasTareas.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No hay tareas próximas
              </div>
            )}
          </div>
        </div>
      </div>

      {}
      <TareasForm
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        currentTarea={currentTarea}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleAsignadoChange={handleAsignadoChange}
        personal={personal}
        user={user}
      />
    </div>
  );
}

export default Tareas;
