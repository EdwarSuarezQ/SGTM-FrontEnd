import axios from "./axios";

export const getEstadisticasRequest = () =>
  axios.get("/api/estadisticas/resumen");
