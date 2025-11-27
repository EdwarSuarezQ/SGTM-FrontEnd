import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getPersonalRequest,
  createPersonalRequest,
  updatePersonalRequest,
  deletePersonalRequest,
  getPersonalStatsRequest,
} from "../api/personal";
import { toast } from "react-hot-toast";
import {
  getIniciales,
  getColorIniciales,
  validarEmail,
  getEstadoTextPersonal,
  getColorEstadoPersonal,
  getColorDepartamento,
} from "../utils/helpers";

// Importar componentes
import PersonalStats from "../components/personal/PersonalStats";
import PersonalFilter from "../components/personal/PersonalFilter";
import PersonalTable from "../components/personal/PersonalTable";
import PersonalForm from "../components/personal/PersonalForm";
import Pagination from "../components/Pagination";

function Personal() {
  const { user } = useAuth();
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPersonal, setCurrentPersonal] = useState(null);
  
  // Estados de filtros y paginación
  const [filtros, setFiltros] = useState({
    departamento: "",
    estado: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tipoDocumento: "",
    numeroDocumento: "",
    puesto: "",
    departamento: "",
    estado: "activo",
    rol: "usuario",
  });
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    porDepartamento: []
  });
  const [nuevosIngresosGlobal, setNuevosIngresosGlobal] = useState([]);

  // Opciones predefinidas
  const opcionesPuestos = [
    "Coordinador de Operaciones",
    "Especialista en Aduanas",
    "Técnico de Mantenimiento",
    "Supervisora de Almacén",
    "Analista de Documentación",
    "Gerente de Logística",
    "Operador Portuario",
    "Asistente Administrativo",
    "Jefe de Turno",
    "Inspector de Calidad",
    "Jefe de Operaciones",
    "Auxiliar de Almacén",
    "Conductor",
    "Mecánico",
    "Contador",
    "Recepcionista",
    "Vigilante"
  ];

  const opcionesDepartamentos = [
    "Logística",
    "Gestión de Documentos",
    "Operaciones Portuarias",
    "Mantenimiento",
    "Administración",
    "Recursos Humanos",
    "Finanzas",
    "TI y Sistemas",
    "Seguridad",
    "Calidad",
    "Almacén",
    "Transporte"
  ];

  // Cargar personal cuando cambian los filtros o la página
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarPersonal();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, filtros]);

  // Cargar estadísticas al montar
  useEffect(() => {
    cargarStats();
    cargarNuevosIngresos();
  }, []);

  const cargarStats = async () => {
    try {
      const res = await getPersonalStatsRequest();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const cargarNuevosIngresos = async () => {
    try {
      const params = {
        page: 1,
        limit: 4,
        sort: "-createdAt"
      };
      
      const res = await getPersonalRequest(params);
      if (res.data && res.data.success && res.data.data) {
        setNuevosIngresosGlobal(res.data.data.items || []);
      }
    } catch (error) {
      console.error("Error al cargar nuevos ingresos:", error);
    }
  };

  const cargarPersonal = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        departamento: filtros.departamento,
        estado: filtros.estado,
        q: filtros.search
      };

      const res = await getPersonalRequest(params);

      if (
        res.data &&
        res.data.success &&
        res.data.data
      ) {
        setPersonal(res.data.data.items || []);
        setTotalItems(res.data.data.total || 0);
        setTotalPages(Math.ceil((res.data.data.total || 0) / itemsPerPage));
      } else {
        setPersonal([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error al cargar personal:", error);
      toast.error("Error al cargar el personal");
      setPersonal([]);
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

  // Calcular estadísticas usando datos globales
  const calcularEstadisticas = () => {
    const activos = stats.activos || 0;
    // porDepartamento viene como [{_id: "Depto", count: 1}]
    const departamentos = stats.porDepartamento ? stats.porDepartamento.length : 0;
    const total = stats.total || 0;
    const promedioPorDepto =
      total > 0 && departamentos > 0 ? Math.round(total / departamentos) : 0;

    return {
      activos,
      departamentos,
      promedioPorDepto,
      total,
    };
  };

  // Calcular variación de personal (simulada)
  const calcularVariacionPersonal = () => {
    const personalActual = personal.length;
    const personalAnterior = Math.round(personalActual * 0.9);
    if (personalAnterior === 0) return 0;
    return Math.round(
      ((personalActual - personalAnterior) / personalAnterior) * 100
    );
  };

  // Estadísticas para mostrar
  const statsDisplay = calcularEstadisticas();
  const totalPersonalGlobal = stats.total || 0;
  const porcentajeActivos =
    totalPersonalGlobal > 0 ? Math.round((statsDisplay.activos / totalPersonalGlobal) * 100) : 0;
  const variacionPersonal = calcularVariacionPersonal();

  // Calcular estadísticas por departamento - MOSTRAR TODOS LOS DEPARTAMENTOS
  const estadisticasDepartamentos = opcionesDepartamentos.map((depto) => {
    const deptoData = stats.porDepartamento?.find(d => d._id === depto);
    return {
      nombre: depto,
      color: getColorDepartamento(depto),
      cantidad: deptoData ? deptoData.count : 0,
    };
  });

  // Obtener nuevos ingresos (globales)
  const nuevosIngresos = nuevosIngresosGlobal;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (
      !formData.nombre ||
      !formData.email ||
      !formData.tipoDocumento ||
      !formData.numeroDocumento ||
      !formData.puesto ||
      !formData.departamento
    ) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    if (!validarEmail(formData.email)) {
      toast.error(
        "Por favor ingresa un email válido (ejemplo: usuario@dominio.com)"
      );
      return;
    }

    try {
      const personalData = {
        ...formData,
        email: formData.email.toLowerCase(),
      };

      if (currentPersonal) {
        await updatePersonalRequest(currentPersonal._id, personalData);
        toast.success("Empleado actualizado correctamente");
      } else {
        await createPersonalRequest(personalData);
        toast.success("Empleado creado correctamente");
      }

      setModalIsOpen(false);
      setModalIsOpen(false);
      
      // Actualizar todo en paralelo
      await Promise.all([
        cargarPersonal(),
        cargarStats(),
        cargarNuevosIngresos()
      ]);
      
      resetForm();
    } catch (error) {
      console.error("Error al guardar personal:", error);
      const errorMessage =
        error.response?.data?.message || "Error al guardar el empleado";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (persona) => {
    setCurrentPersonal(persona);
    setFormData({
      nombre: persona.nombre || "",
      email: persona.email || "",
      tipoDocumento: persona.tipoDocumento || "",
      numeroDocumento: persona.numeroDocumento || "",
      puesto: persona.puesto || "",
      departamento: persona.departamento || "",
      estado: persona.estado || "activo",
      rol: persona.usuarioId?.rol || "user",
    });
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este empleado?")) {
      try {
        await deletePersonalRequest(id);
        toast.success("Empleado eliminado correctamente");
        
        // Actualizar todo en paralelo
        await Promise.all([
          cargarPersonal(),
          cargarStats(),
          cargarNuevosIngresos()
        ]);
      } catch (error) {
        console.error("Error al eliminar personal:", error);
        toast.error("Error al eliminar el empleado");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      tipoDocumento: "",
      numeroDocumento: "",
      puesto: "",
      departamento: "",
      estado: "activo",
      rol: "user",
    });
    setCurrentPersonal(null);
  };

  const abrirModalCrear = () => {
    resetForm();
    setModalIsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Personal</h1>

      <div className="mb-6 flex justify-end">
        {user && user.rol === "admin" && (
          <button
            onClick={abrirModalCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Nuevo Empleado
          </button>
        )}
      </div>

      <PersonalStats
        total={totalItems} // Usar totalItems del backend
        stats={statsDisplay}
        porcentajeActivos={porcentajeActivos}
        variacionPersonal={variacionPersonal}
      />

      <div className="bg-white rounded-lg shadow-md mb-6">
        <PersonalFilter
          filtros={filtros}
          handleFiltroChange={handleFiltroChange}
          opcionesDepartamentos={opcionesDepartamentos}
        />

        <PersonalTable
          loading={loading}
          personalFiltrado={personal} // Pasamos el personal directamente
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
              Personal por Departamento
            </h2>
            <div className="text-sm text-gray-500">
              <select className="border-none text-sm">
                <option>Este Año</option>
                <option>Últimos 6 meses</option>
                <option>Total</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {estadisticasDepartamentos.map((depto) => {
              const porcentaje =
                totalPersonalGlobal > 0 ? Math.round((depto.cantidad / totalPersonalGlobal) * 100) : 0;

              // Mapear colores a clases de Tailwind CSS
              const colorClasses = {
                blue: "bg-blue-500",
                green: "bg-green-500",
                yellow: "bg-yellow-500",
                purple: "bg-purple-500",
                red: "bg-red-500",
                pink: "bg-pink-500",
                indigo: "bg-indigo-500",
                teal: "bg-teal-500",
                gray: "bg-gray-500",
                orange: "bg-orange-500",
              };

              const colorClass = colorClasses[depto.color] || "bg-gray-500";

              return (
                <div key={depto.nombre}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <span
                        className={`w-3 h-3 ${colorClass} rounded-full mr-2`}
                      ></span>
                      {depto.nombre}
                    </span>
                    <span>{depto.cantidad} empleados</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {porcentaje}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Nuevos Ingresos
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {nuevosIngresos.length > 0 ? (
              nuevosIngresos.map((persona) => (
                <div
                  key={persona._id}
                  className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div
                    className={`h-10 w-10 rounded-full ${getColorIniciales(
                      persona.nombre
                    )} flex items-center justify-center text-white font-semibold mr-3`}
                  >
                    {getIniciales(persona.nombre)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{persona.nombre}</h3>
                    <p className="text-xs text-gray-500">
                      {persona.puesto} - {persona.departamento}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoPersonal(
                      persona.estado
                    )}`}
                  >
                    {getEstadoTextPersonal(persona.estado)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No hay nuevos ingresos
              </div>
            )}
          </div>
        </div>
      </div>

      <PersonalForm
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        currentPersonal={currentPersonal}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        opcionesPuestos={opcionesPuestos}
        opcionesDepartamentos={opcionesDepartamentos}
      />
    </div>
  );
}

export default Personal;
