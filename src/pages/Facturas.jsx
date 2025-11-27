import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getFacturasRequest,
  createFacturaRequest,
  updateFacturaRequest,
  deleteFacturaRequest,
  getFacturasStatsRequest,
} from "../api/facturas";
import { getEmbarquesRequest } from "../api/embarques";
import { toast } from "react-hot-toast";
import {
  formatCurrency,
  getColorEstadoFactura,
  getEstadoTextFactura,
} from "../utils/helpers";

// Importar componentes
import FacturasStats from "../components/facturas/FacturasStats";
import FacturasFilter from "../components/facturas/FacturasFilter";
import FacturasTable from "../components/facturas/FacturasTable";
import FacturasForm from "../components/facturas/FacturasForm";
import Pagination from "../components/Pagination";

function Facturas() {
  const { user } = useAuth();
  const [facturas, setFacturas] = useState([]);
  const [embarques, setEmbarques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentFactura, setCurrentFactura] = useState(null);
  
  // Estados de filtros y paginación
  const [filtros, setFiltros] = useState({
    estado: "",
    cliente: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    idFactura: "",
    cliente: "",
    embarqueId: "",
    fechaEmision: "",
    monto: "",
    estado: "pendiente",
  });

  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    pagadas: 0,
    vencidas: 0,
    canceladas: 0,
    totalFacturado: 0,
    totalPagado: 0,
    totalPendiente: 0
  });
  const [proximosVencimientosGlobal, setProximosVencimientosGlobal] = useState([]);

  // Opciones predefinidas
  const opcionesEstados = [
    { value: "pagada", label: "Pagada" },
    { value: "pendiente", label: "Pendiente" },
    { value: "vencida", label: "Vencida" },
    { value: "cancelada", label: "Cancelada" },
  ];

  // Cargar facturas cuando cambian los filtros o la página
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarFacturas();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, filtros]);

  // Cargar estadísticas al montar
  useEffect(() => {
    cargarStats();
    cargarProximosVencimientos();
  }, []);

  const cargarStats = async () => {
    try {
      const res = await getFacturasStatsRequest();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const cargarProximosVencimientos = async () => {
    try {
      // Buscamos facturas pendientes, ordenadas por fecha de emisión (o vencimiento si existiera)
      // Asumiremos orden por createdAt o fechaEmision.
      // El backend soporta sort.
      const params = {
        page: 1,
        limit: 4,
        sort: "fechaEmision", // O "-createdAt"
        estado: "pendiente"
      };
      
      const res = await getFacturasRequest(params);
      if (res.data && res.data.success && res.data.data) {
        setProximosVencimientosGlobal(res.data.data.items || []);
      }
    } catch (error) {
      console.error("Error al cargar próximos vencimientos:", error);
    }
  };

  // Cargar embarques al montar
  useEffect(() => {
    cargarEmbarques();
  }, []);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        estado: filtros.estado,
        cliente: filtros.cliente,
        q: filtros.search
      };

      const res = await getFacturasRequest(params);

      if (
        res.data &&
        res.data.success &&
        res.data.data
      ) {
        setFacturas(res.data.data.items || []);
        setTotalItems(res.data.data.total || 0);
        setTotalPages(Math.ceil((res.data.data.total || 0) / itemsPerPage));
      } else {
        setFacturas([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error al cargar facturas:", error);
      toast.error("Error al cargar las facturas");
      setFacturas([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarEmbarques = async () => {
    try {
      const res = await getEmbarquesRequest();
      if (res.data?.success && Array.isArray(res.data.data?.items)) {
        // Solo embarques que no estén cancelados
        const embarquesActivos = res.data.data.items.filter(
          (embarque) => embarque.estado !== "cancelado"
        );
        setEmbarques(embarquesActivos);
      }
    } catch (error) {
      console.error("Error al cargar embarques:", error);
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
    const facturasPendientes = stats.pendientes || 0;
    const facturasPagadas = stats.pagadas || 0;
    const facturasVencidas = stats.vencidas || 0;
    const facturasCanceladas = stats.canceladas || 0;

    const ingresosTotales = stats.totalPagado || 0;

    return {
      facturasPendientes,
      facturasPagadas,
      facturasVencidas,
      facturasCanceladas,
      ingresosTotales: formatCurrency(ingresosTotales),
      facturasTotales: stats.total || 0,
    };
  };

  // Calcular variación de ingresos (simulada)
  const calcularVariacionIngresos = () => {
    const ingresosActuales = facturas
      .filter((f) => f.estado === "pagada")
      .reduce((sum, f) => sum + (f.monto || 0), 0);

    const ingresosMesAnterior = ingresosActuales * 0.8;
    if (ingresosMesAnterior === 0) return 0;

    return Math.round(
      ((ingresosActuales - ingresosMesAnterior) / ingresosMesAnterior) * 100
    );
  };

  // Obtener clientes únicos para filtro (de la página actual)
  const obtenerClientesUnicos = () => {
    return [...new Set(facturas.map((f) => f.cliente).filter(Boolean))];
  };

  // Obtener próximos vencimientos
  const obtenerProximosVencimientos = () => {
    return facturas.filter((f) => f.estado === "pendiente").slice(0, 4);
  };

  // Estadísticas para mostrar
  const statsDisplay = calcularEstadisticas();
  const totalFacturasGlobal = stats.total || 0;
  const porcentajePagadas =
    totalFacturasGlobal > 0
      ? Math.round((statsDisplay.facturasPagadas / totalFacturasGlobal) * 100)
      : 0;
  const porcentajePendientes =
    totalFacturasGlobal > 0
      ? Math.round((statsDisplay.facturasPendientes / totalFacturasGlobal) * 100)
      : 0;
  const variacionIngresos = calcularVariacionIngresos();
  const clientesUnicos = obtenerClientesUnicos();
  const proximosVencimientos = proximosVencimientosGlobal;

  // Calcular distribución por estado (Global)
  const distribucionEstados = {
    pagada: stats.pagadas || 0,
    pendiente: stats.pendientes || 0,
    vencida: stats.vencidas || 0,
    cancelada: stats.canceladas || 0,
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleEmbarqueChange = (e) => {
    const embarqueId = e.target.value;
    const embarqueSeleccionado = embarques.find((emb) => emb._id === embarqueId);

    setFormData((prev) => ({
      ...prev,
      embarqueId: embarqueId,
      cliente: embarqueSeleccionado ? embarqueSeleccionado.cliente : prev.cliente,
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

    // Validaciones básicas
    if (
      !formData.idFactura ||
      !formData.cliente ||
      !formData.fechaEmision ||
      !formData.monto
    ) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      const facturaData = {
        idFactura: formData.idFactura.toUpperCase(),
        cliente: formData.cliente,
        embarqueId: formData.embarqueId || undefined,
        fechaEmision: formData.fechaEmision,
        monto: Number(formData.monto),
        estado: formData.estado,
      };

      if (currentFactura) {
        await updateFacturaRequest(currentFactura._id, facturaData);
        toast.success("Factura actualizada correctamente");
      } else {
        await createFacturaRequest(facturaData);
        toast.success("Factura creada correctamente");
      }

      setModalIsOpen(false);
      setModalIsOpen(false);
      
      // Actualizar todo en paralelo
      await Promise.all([
        cargarFacturas(),
        cargarStats(),
        cargarProximosVencimientos()
      ]);
      
      resetForm();
    } catch (error) {
      console.error("Error al guardar factura:", error);
      const errorMessage =
        error.response?.data?.message || "Error al guardar la factura";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (factura) => {
    setCurrentFactura(factura);

    // Convertir fecha ISO a YYYY-MM-DD para el input
    let fechaInput = "";
    if (factura.fechaEmision) {
      fechaInput = new Date(factura.fechaEmision).toISOString().split('T')[0];
    }

    setFormData({
      idFactura: factura.idFactura || "",
      cliente: factura.cliente || "",
      embarqueId: factura.embarqueId?._id || factura.embarqueId || "",
      fechaEmision: fechaInput,
      monto: factura.monto || "",
      estado: factura.estado || "pendiente",
    });
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta factura?")) {
      try {
        await deleteFacturaRequest(id);
        toast.success("Factura eliminada correctamente");
        
        // Actualizar todo en paralelo
        await Promise.all([
          cargarFacturas(),
          cargarStats(),
          cargarProximosVencimientos()
        ]);
      } catch (error) {
        console.error("Error al eliminar factura:", error);
        toast.error("Error al eliminar la factura");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idFactura: "",
      cliente: "",
      embarqueId: "",
      fechaEmision: "",
      monto: "",
      estado: "pendiente",
    });
    setCurrentFactura(null);
  };

  const abrirModalCrear = () => {
    resetForm();
    setModalIsOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Facturas</h1>

      <div className="mb-6 flex justify-end">
        {user && user.rol === "admin" && (
          <button
            onClick={abrirModalCrear}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Nueva Factura
          </button>
        )}
      </div>

      <FacturasStats
        stats={statsDisplay}
        porcentajePendientes={porcentajePendientes}
        porcentajePagadas={porcentajePagadas}
        variacionIngresos={variacionIngresos}
      />

      <div className="bg-white rounded-lg shadow-md mb-6">
        <FacturasFilter
          filtros={filtros}
          handleFiltroChange={handleFiltroChange}
          opcionesEstados={opcionesEstados}
          clientesUnicos={clientesUnicos}
        />

        <FacturasTable
          loading={loading}
          facturasFiltradas={facturas} // Pasamos las facturas directamente
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          filtros={filtros}
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
        {/* Facturas por Estado */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Facturas por Estado
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
            {Object.entries(distribucionEstados).map(([estado, cantidad]) => {
              const porcentaje =
                totalFacturasGlobal > 0 ? (cantidad / totalFacturasGlobal) * 100 : 0;
              const colorMap = {
                pagada: "green",
                pendiente: "yellow",
                vencida: "red",
                cancelada: "gray",
              };
              const color = colorMap[estado] || "gray";

              return (
                <div key={estado}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <span
                        className={`w-3 h-3 bg-${color}-500 rounded-full mr-2`}
                      ></span>
                      {getEstadoTextFactura(estado)}
                    </span>
                    <span>{cantidad} facturas</span>
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

        {/* Próximos Vencimientos */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Próximos Vencimientos
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {proximosVencimientos.length > 0 ? (
              proximosVencimientos.map((factura) => (
                <div
                  key={factura._id}
                  className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {factura.idFactura} - {factura.cliente}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Monto: {formatCurrency(factura.monto)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorEstadoFactura(
                      factura.estado
                    )}`}
                  >
                    {getEstadoTextFactura(factura.estado)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No hay próximos vencimientos
              </div>
            )}
          </div>
        </div>
      </div>

      <FacturasForm
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        currentFactura={currentFactura}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleEmbarqueChange={handleEmbarqueChange}
        opcionesEstados={opcionesEstados}
        embarques={embarques}
      />
    </div>
  );
}

export default Facturas;
