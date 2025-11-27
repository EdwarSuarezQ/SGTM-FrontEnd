// src/api/rutas.js
import axios from "./axios";

export const getRutasRequest = (params = {}) => {
  return axios.get("/api/rutas", { params });
};

export const getRutaRequest = (id) => axios.get(`/api/rutas/${id}`);

export const createRutaRequest = (ruta) => axios.post("/api/rutas", ruta);

export const updateRutaRequest = (id, ruta) =>
  axios.put(`/api/rutas/${id}`, ruta);

export const deleteRutaRequest = (id) => axios.delete(`/api/rutas/${id}`);
export const getRutasStatsRequest = () => axios.get("/api/rutas/stats/summary");
