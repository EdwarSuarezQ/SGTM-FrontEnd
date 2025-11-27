import { formatCurrency } from "./helpers";

export const exportConfig = {
  tareas: {
    headers: [
      { key: "titulo", label: "Título" },
      { key: "descripcion", label: "Descripción" },
      { key: "estado", label: "Estado", formatter: (val) => (val ? val.toUpperCase() : "") },
      { key: "prioridad", label: "Prioridad", formatter: (val) => (val ? val.toUpperCase() : "") },
      { key: "fecha", label: "Fecha Límite", formatter: (val) => (val ? new Date(val).toLocaleDateString("es-ES") : "") },
      { key: "asignado", label: "Asignado A" },
      { key: "departamento", label: "Departamento" },
    ],
  },
  embarques: {
    headers: [
      { key: "numeroGuia", label: "N° Guía" },
      { key: "cliente", label: "Cliente" },
      { key: "origen", label: "Origen" },
      { key: "destino", label: "Destino" },
      { key: "fechaSalida", label: "Fecha Salida", formatter: (val) => (val ? new Date(val).toLocaleDateString("es-ES") : "") },
      { key: "fechaLlegada", label: "Fecha Llegada", formatter: (val) => (val ? new Date(val).toLocaleDateString("es-ES") : "") },
      { key: "peso", label: "Peso (kg)" },
      { key: "tipoCarga", label: "Tipo Carga" },
      { key: "estado", label: "Estado", formatter: (val) => (val ? val.toUpperCase() : "") },
    ],
  },
  embarcaciones: {
    headers: [
      { key: "nombre", label: "Nombre" },
      { key: "matricula", label: "Matrícula" },
      { key: "tipo", label: "Tipo" },
      { key: "capacidad", label: "Capacidad (ton)" },
      { key: "estado", label: "Estado", formatter: (val) => (val ? val.toUpperCase() : "") },
    ],
  },
  almacen: {
    headers: [
      { key: "nombre", label: "Nombre Almacén" },
      { key: "ubicacion", label: "Ubicación" },
      { key: "capacidad", label: "Capacidad Total" },
      { key: "ocupacion", label: "Ocupación Actual" },
      { key: "estado", label: "Estado", formatter: (val) => (val ? val.toUpperCase() : "") },
    ],
  },
  personal: {
    headers: [
      { key: "nombre", label: "Nombre Completo" },
      { key: "email", label: "Email" },
      { key: "telefono", label: "Teléfono" },
      { key: "cargo", label: "Cargo" },
      { key: "departamento", label: "Departamento" },
      { key: "estado", label: "Estado", formatter: (val) => (val ? val.toUpperCase() : "") },
      { key: "fechaIngreso", label: "Fecha Ingreso", formatter: (val) => (val ? new Date(val).toLocaleDateString("es-ES") : "") },
    ],
  },
  rutas: {
    headers: [
      { key: "nombre", label: "Nombre Ruta" },
      { key: "origen", label: "Origen" },
      { key: "destino", label: "Destino" },
      { key: "distancia", label: "Distancia (km)" },
      { key: "tiempoEstimado", label: "Tiempo Estimado (h)" },
      { key: "estado", label: "Estado", formatter: (val) => (val ? val.toUpperCase() : "") },
    ],
  },
  facturas: {
    headers: [
      { key: "idFactura", label: "ID Factura" },
      { key: "cliente", label: "Cliente" },
      { key: "fechaEmision", label: "Fecha Emisión", formatter: (val) => (val ? new Date(val).toLocaleDateString("es-ES") : "") },
      { key: "monto", label: "Monto", formatter: (val) => formatCurrency(val) },
      { key: "estado", label: "Estado", formatter: (val) => (val ? val.toUpperCase() : "") },
    ],
  },
};
