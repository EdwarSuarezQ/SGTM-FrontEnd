
export const getIniciales = (nombre) => {
  if (!nombre) return "??";
  return nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
export const getColorIniciales = (nombre) => {
  const colores = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
  ];
  const index = nombre?.charCodeAt(0) % colores.length || 0;
  return colores[index];
};
export const calcularDiasRestantes = (fecha) => {
  if (!fecha) return "Sin fecha";

  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    
    const fechaLimite = new Date(fecha);
    fechaLimite.setHours(0, 0, 0, 0); 
    
    const diffTime = fechaLimite - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Mañana";
    if (diffDays > 1) return `En ${diffDays} días`;
    if (diffDays === -1) return "Ayer";
    return `Hace ${Math.abs(diffDays)} días`;
  } catch (error) {
    return "Fecha inválida";
  }
};
export const getColorPrioridad = (prioridad) => {
  const colores = {
    alta: "bg-red-500",
    media: "bg-yellow-500",
    baja: "bg-green-500",
  };
  return colores[prioridad] || "bg-gray-500";
};
export const getEstadoText = (estado) => {
  const estados = {
    pendiente: "Pendiente",
    "en-progreso": "En progreso",
    completada: "Completada",
  };
  return estados[estado] || estado;
};
export const getColorEstado = (estado) => {
  const colores = {
    pendiente: "bg-gray-100 text-gray-800 border-gray-200",
    "en-transito": "bg-blue-100 text-blue-800 border-blue-200",
    "en-ruta": "bg-green-100 text-green-800 border-green-200",
    "en-puerto": "bg-yellow-100 text-yellow-800 border-yellow-200",
  };
  return colores[estado] || "bg-gray-100 text-gray-800 border-gray-200";
};
export const getTextoEstado = (estado) => {
  const estados = {
    pendiente: "Pendiente",
    "en-transito": "En tránsito",
    "en-ruta": "En ruta",
    "en-puerto": "En puerto",
  };
  return estados[estado] || estado;
};
export const getBadgeInfo = (tipo) => {
  const badges = {
    contenedor: {
      color: "bg-blue-100 text-blue-800",
      icono: "fas fa-boxes-stacked",
      nombre: "Portacontenedores",
    },
    granel: {
      color: "bg-yellow-100 text-yellow-800",
      icono: "fas fa-mountain",
      nombre: "Granelero",
    },
    general: {
      color: "bg-green-100 text-green-800",
      icono: "fas fa-dolly",
      nombre: "Carga general",
    },
    cisterna: {
      color: "bg-red-100 text-red-800",
      icono: "fas fa-oil-can",
      nombre: "Tanquero",
    },
  };

  return (
    badges[tipo] || {
      color: "bg-gray-100 text-gray-800",
      icono: "fas fa-ship",
      nombre: "Desconocido",
    }
  );
};
export const getColorEstadoRuta = (estado) => {
  const colores = {
    activa: "bg-green-100 text-green-800 border-green-200",
    pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completada: "bg-blue-100 text-blue-800 border-blue-200",
    inactiva: "bg-red-100 text-red-800 border-red-200",
  };
  return colores[estado] || "bg-gray-100 text-gray-800 border-gray-200";
};
export const getEstadoTextRuta = (estado) => {
  const map = {
    activa: "Activa",
    pendiente: "Pendiente",
    completada: "Completada",
    inactiva: "Inactiva",
  };
  return map[estado] || estado;
};
export const getTipoTextRuta = (tipo) => {
  const map = {
    internacional: "Internacional",
    regional: "Regional",
    costera: "Costera",
  };
  return map[tipo] || tipo;
};
export const getColorTipoRuta = (tipo) => {
  const colores = {
    internacional: "bg-purple-100 text-purple-800 border-purple-200",
    regional: "bg-blue-100 text-blue-800 border-blue-200",
    costera: "bg-teal-100 text-teal-800 border-teal-200",
  };
  return colores[tipo] || "bg-gray-100 text-gray-800 border-gray-200";
};
export const getColorEstadoEmbarque = (estado) => {
  const colores = {
    pendiente: "bg-gray-100 text-gray-800 border-gray-200",
    "en-transito": "bg-blue-100 text-blue-800 border-blue-200",
    "en-aduana": "bg-yellow-100 text-yellow-800 border-yellow-200",
    entregado: "bg-green-100 text-green-800 border-green-200",
    retrasado: "bg-red-100 text-red-800 border-red-200",
    cancelado: "bg-red-100 text-red-800 border-red-200",
    completado: "bg-green-100 text-green-800 border-green-200",
  };
  return colores[estado] || "bg-gray-100 text-gray-800 border-gray-200";
};
export const getTextoEstadoEmbarque = (estado) => {
  const estados = {
    pendiente: "Pendiente",
    "en-transito": "En tránsito",
    "en-aduana": "En aduana",
    entregado: "Entregado",
    retrasado: "Retrasado",
    cancelado: "Cancelado",
    completado: "Completado",
  };
  return estados[estado] || estado;
};
export const getBadgeTipoCarga = (tipo) => {
  const badges = {
    seco: {
      badge: "bg-gray-100 text-gray-800",
      icono: "fa-box",
      texto: "Seco",
    },
    refrigerado: {
      badge: "bg-blue-100 text-blue-800",
      icono: "fa-snowflake",
      texto: "Refrigerado",
    },
    peligroso: {
      badge: "bg-red-100 text-red-800",
      icono: "fa-exclamation-triangle",
      texto: "Peligroso",
    },
    perecedero: {
      badge: "bg-green-100 text-green-800",
      icono: "fa-apple-alt",
      texto: "Perecedero",
    },
    sobredimensionado: {
      badge: "bg-yellow-100 text-yellow-800",
      icono: "fa-truck-loading",
      texto: "Sobredimensionado",
    },
  };
  return (
    badges[tipo] || {
      badge: "bg-gray-100 text-gray-800",
      icono: "fa-box",
      texto: tipo,
    }
  );
};
export const getColorEstadoFactura = (estado) => {
  const colores = {
    pagada: "bg-green-100 text-green-800 border-green-200",
    pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    vencida: "bg-red-100 text-red-800 border-red-200",
    cancelada: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colores[estado] || "bg-gray-100 text-gray-800 border-gray-200";
};
export const getEstadoTextFactura = (estado) => {
  const map = {
    pagada: "Pagada",
    pendiente: "Pendiente",
    vencida: "Vencida",
    cancelada: "Cancelada",
  };
  return map[estado] || estado;
};
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};
export const validarEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
export const getEstadoTextPersonal = (estado) => {
  const map = { activo: "Activo", inactivo: "Inactivo" };
  return map[estado] || estado;
};
export const getColorEstadoPersonal = (estado) => {
  const colores = {
    activo: "bg-green-100 text-green-800 border-green-200",
    inactivo: "bg-red-100 text-red-800 border-red-200",
  };
  return colores[estado] || "bg-gray-100 text-gray-800 border-gray-200";
};
export const getColorDepartamento = (depto) => {
  const colores = {
    Logística: "blue",
    "Gestión de Documentos": "green",
    "Operaciones Portuarias": "yellow",
    Mantenimiento: "purple",
    Administración: "red",
    "Recursos Humanos": "pink",
    Finanzas: "indigo",
    "TI y Sistemas": "teal",
    Seguridad: "gray",
    Calidad: "orange",
  };
  return colores[depto] || "gray";
};
export const getColorEstadoAlmacen = (estado) => {
  const colores = {
    operativo: "bg-green-100 text-green-800 border-green-200",
    mantenimiento: "bg-yellow-100 text-yellow-800 border-yellow-200",
    inoperativo: "bg-red-100 text-red-800 border-red-200",
  };
  return colores[estado] || "bg-gray-100 text-gray-800 border-gray-200";
};
export const getTextoEstadoAlmacen = (estado) => {
  const estados = {
    operativo: "Operativo",
    mantenimiento: "En Mantenimiento",
    inoperativo: "Inoperativo",
  };
  return estados[estado] || estado;
};
export const getColorOcupacion = (ocupacion) => {
  if (ocupacion >= 90) return "bg-red-500";
  if (ocupacion >= 75) return "bg-yellow-500";
  return "bg-green-500";
};
