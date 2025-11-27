import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { exportDataRequest } from "../api/exportar";
import { toast } from "react-hot-toast";
import { exportConfig } from "../utils/exportConfig";
import Loader from "../components/common/Loader";
import ExcelJS from "exceljs";

function ExportarDatos() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState("tareas");
  const [formato, setFormato] = useState("json");
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    estado: "",
  });

  // Opciones de recursos para exportar
  const opcionesRecursos = [
    { value: "tareas", label: "Tareas", icon: "fas fa-tasks", color: "blue" },
    {
      value: "embarques",
      label: "Embarques",
      icon: "fas fa-shipping-fast",
      color: "green",
    },
    {
      value: "embarcaciones",
      label: "Embarcaciones",
      icon: "fas fa-ship",
      color: "purple",
    },
    {
      value: "almacen",
      label: "Almacenes",
      icon: "fas fa-warehouse",
      color: "yellow",
    },
    {
      value: "personal",
      label: "Personal",
      icon: "fas fa-users",
      color: "indigo",
    },
    { value: "rutas", label: "Rutas", icon: "fas fa-route", color: "pink" },
    {
      value: "facturas",
      label: "Facturas",
      icon: "fas fa-file-invoice-dollar",
      color: "red",
    },
  ];

  // Opciones de formato
  const opcionesFormato = [
    { value: "json", label: "JSON", icon: "fas fa-code" },
    { value: "csv", label: "CSV", icon: "fas fa-table" },
    { value: "excel", label: "Excel", icon: "fas fa-file-excel" },
  ];

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExportar = async () => {
    if (!recursoSeleccionado) {
      toast.error("Por favor selecciona un recurso para exportar");
      return;
    }

    setLoading(true);
    try {
      const res = await exportDataRequest(recursoSeleccionado);

      if (res.data && res.data.success) {
        // Crear y descargar el archivo
        await descargarArchivo(res.data, recursoSeleccionado, formato);
        toast.success(`Datos de ${getRecursoLabel()} exportados correctamente`);
      } else {
        toast.error("Error al exportar los datos");
      }
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error al exportar los datos");
    } finally {
      setLoading(false);
    }
  };

  const descargarArchivo = async (data, recurso, formato) => {
    let contenido, tipoMime, extension;

    switch (formato) {
      case "json":
        contenido = JSON.stringify(data, null, 2);
        tipoMime = "application/json";
        extension = "json";
        break;
      case "csv":
        contenido = convertirACSV(data.data);
        tipoMime = "text/csv";
        extension = "csv";
        break;
      case "excel":
        // Usar ExcelJS para crear un archivo Excel real
        await exportarAExcel(data.data, recurso);
        return; // Salir temprano ya que exportarAExcel maneja la descarga
      default:
        contenido = JSON.stringify(data, null, 2);
        tipoMime = "application/json";
        extension = "json";
    }

    // Agregar BOM para que Excel reconozca correctamente los caracteres especiales (tildes, ñ, etc.)
    const bom = "\uFEFF";
    const blob = new Blob([bom + contenido], { type: tipoMime });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const fecha = new Date().toISOString().split("T")[0];
    const nombreRecurso = getRecursoLabel().toLowerCase();
    link.download = `${nombreRecurso}_export_${fecha}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportarAExcel = async (datos, recurso) => {
    if (!datos || datos.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const config = exportConfig[recurso];
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(getRecursoLabel());

    // Configurar columnas
    if (config) {
      worksheet.columns = config.headers.map((h) => ({
        header: h.label,
        key: h.key,
        width: 20,
      }));

      // Agregar datos con formateo
      datos.forEach((fila) => {
        const filaFormateada = {};
        config.headers.forEach((header) => {
          let valor = fila[header.key];
          if (header.formatter) {
            valor = header.formatter(valor);
          }
          filaFormateada[header.key] = valor || "";
        });
        worksheet.addRow(filaFormateada);
      });
    } else {
      // Fallback si no hay configuración
      const headers = Object.keys(datos[0]);
      worksheet.columns = headers.map((h) => ({
        header: h,
        key: h,
        width: 20,
      }));
      datos.forEach((fila) => worksheet.addRow(fila));
    }

    // Estilizar encabezados
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

    // Agregar bordes a todas las celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Generar archivo y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const fecha = new Date().toISOString().split("T")[0];
    const nombreRecurso = getRecursoLabel().toLowerCase();
    link.download = `${nombreRecurso}_export_${fecha}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const convertirACSV = (datos) => {
    if (!datos || datos.length === 0) return "";

    const config = exportConfig[recursoSeleccionado];
    let cabecerasKeys = [];
    let cabecerasLabels = [];

    if (config) {
      cabecerasKeys = config.headers.map((h) => h.key);
      cabecerasLabels = config.headers.map((h) => h.label);
    } else {
      // Fallback si no hay configuración
      cabecerasKeys = Object.keys(datos[0]);
      cabecerasLabels = cabecerasKeys;
    }

    const filas = datos.map((fila) =>
      cabecerasKeys
        .map((key, index) => {
          let valor = fila[key];

          // Aplicar formateador si existe
          if (config && config.headers[index].formatter) {
            valor = config.headers[index].formatter(valor);
          }

          // Manejar valores nulos o undefined
          if (valor === null || valor === undefined) {
            valor = "";
          }

          // Escapar punto y coma y comillas para CSV
          const stringValue = String(valor);
          if (stringValue.includes(";") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(";")
    );

    return [cabecerasLabels.join(";"), ...filas].join("\n");
  };

  const getRecursoLabel = () => {
    const recurso = opcionesRecursos.find(
      (r) => r.value === recursoSeleccionado
    );
    return recurso ? recurso.label : "Datos";
  };

  const getRecursoInfo = () => {
    const recurso = opcionesRecursos.find(
      (r) => r.value === recursoSeleccionado
    );
    return recurso || { label: "", icon: "", color: "gray" };
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: "",
      fechaFin: "",
      estado: "",
    });
  };

  const recursoInfo = getRecursoInfo();

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold mb-2">Exportar Datos</h1>
      <p className="text-gray-600 mb-6">
        Exporta información del sistema en diferentes formatos
      </p>

      {/* Tarjeta Principal de Exportación */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selección de Recurso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-database mr-2"></i>
              Seleccionar Recurso
            </label>
            <select
              value={recursoSeleccionado}
              onChange={(e) => setRecursoSeleccionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {opcionesRecursos.map((recurso) => (
                <option key={recurso.value} value={recurso.value}>
                  {recurso.label}
                </option>
              ))}
            </select>
          </div>

          {/* Selección de Formato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-file-export mr-2"></i>
              Formato de Exportación
            </label>
            <select
              value={formato}
              onChange={(e) => setFormato(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {opcionesFormato.map((formato) => (
                <option key={formato.value} value={formato.value}>
                  {formato.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Información del Recurso Seleccionado */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className={`p-3 bg-${recursoInfo.color}-100 rounded-lg mr-4`}>
              <i
                className={`${recursoInfo.icon} text-${recursoInfo.color}-600 text-xl`}
              ></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {recursoInfo.label}
              </h3>
              <p className="text-sm text-gray-600">
                Exporta todos los registros de {recursoInfo.label.toLowerCase()}{" "}
                en el formato seleccionado
              </p>
            </div>
          </div>
        </div>

        {/* Filtros Avanzados (Opcionales) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Filtros de Exportación
            </h3>
            <button
              onClick={limpiarFiltros}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              <i className="fas fa-eraser mr-1"></i> Limpiar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={filtros.fechaInicio}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                name="fechaFin"
                value={filtros.fechaFin}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <input
                type="text"
                name="estado"
                value={filtros.estado}
                onChange={handleFiltroChange}
                placeholder="Filtrar por estado"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Botón de Exportación */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleExportar}
            disabled={loading}
            className={`px-8 py-3 rounded-md flex items-center ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium`}
          >
            {loading ? (
              <>
                <Loader size="sm" color="text-white" className="mr-2" />
                Exportando...
              </>
            ) : (
              <>
                <i className="fas fa-download mr-2"></i>
                Exportar {getRecursoLabel()}
              </>
            )}
          </button>
        </div>
      </div>

      
      {/* Recursos Disponibles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recursos Disponibles para Exportar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {opcionesRecursos.map((recurso) => (
            <div
              key={recurso.value}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                recursoSeleccionado === recurso.value
                  ? `border-${recurso.color}-500 bg-${recurso.color}-50`
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setRecursoSeleccionado(recurso.value)}
            >
              <div className="flex items-center">
                <div className={`p-2 bg-${recurso.color}-100 rounded-lg mr-3`}>
                  <i
                    className={`${recurso.icon} text-${recurso.color}-600`}
                  ></i>
                </div>
                <span className="font-medium text-gray-800">
                  {recurso.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExportarDatos;
