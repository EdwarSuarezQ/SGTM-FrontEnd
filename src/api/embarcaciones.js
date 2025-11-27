import axios from "./axios";

export const getEmbarcacionesRequest = (params = {}) =>
  axios.get("/api/embarcaciones", { params });

export const getEmbarcacionRequest = (id) =>
  axios.get(`/api/embarcaciones/${id}`);

export const createEmbarcacionRequest = (embarcacion) =>
  axios.post("/api/embarcaciones", embarcacion);

export const updateEmbarcacionRequest = (id, embarcacion) =>
  axios.put(`/api/embarcaciones/${id}`, embarcacion);

export const deleteEmbarcacionRequest = (id) =>
  axios.delete(`/api/embarcaciones/${id}`);

export const getEmbarcacionesStatsRequest = () =>
  axios.get("/api/embarcaciones/stats/general");
