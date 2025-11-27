import axios from "./axios";

export const getAlmacenesRequest = (params = {}) =>
  axios.get("/api/almacen", { params });

export const getAlmacenRequest = (id) => axios.get(`/api/almacen/${id}`);

export const createAlmacenRequest = (almacen) =>
  axios.post("/api/almacen", almacen);

export const updateAlmacenRequest = (id, almacen) =>
  axios.put(`/api/almacen/${id}`, almacen);

export const deleteAlmacenRequest = (id) => axios.delete(`/api/almacen/${id}`);

export const getAlmacenesStatsRequest = () =>
  axios.get("/api/almacen/stats/summary");
