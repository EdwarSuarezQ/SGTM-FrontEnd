// src/api/facturas.js
import axios from "./axios";

export const getFacturasRequest = (params = {}) => {
  return axios.get("/api/facturas", { params });
};

export const getFacturaRequest = (id) => axios.get(`/api/facturas/${id}`);

export const createFacturaRequest = (factura) =>
  axios.post("/api/facturas", factura);

export const updateFacturaRequest = (id, factura) =>
  axios.put(`/api/facturas/${id}`, factura);

export const deleteFacturaRequest = (id) => axios.delete(`/api/facturas/${id}`);

export const getFacturasStatsRequest = () =>
  axios.get("/api/facturas/stats/summary");
