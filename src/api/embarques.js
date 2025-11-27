// src/api/embarques.js
import axios from "./axios";

export const getEmbarquesRequest = (params = {}) => {
  return axios.get("/api/embarques", { params });
};

export const getEmbarqueRequest = (id) => axios.get(`/api/embarques/${id}`);

export const createEmbarqueRequest = (embarque) =>
  axios.post("/api/embarques", embarque);

export const updateEmbarqueRequest = (id, embarque) =>
  axios.put(`/api/embarques/${id}`, embarque);

export const deleteEmbarqueRequest = (id) =>
  axios.delete(`/api/embarques/${id}`);

export const getEmbarquesStatsRequest = () =>
  axios.get("/api/embarques/stats/estadisticas");
