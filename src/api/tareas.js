import axios from "./axios";

export const getTareasRequest = (params = {}) => {
  return axios.get("/api/tareas", { params });
};

export const getTareaRequest = (id) => axios.get(`/api/tareas/${id}`);

export const createTareaRequest = (tarea) => axios.post("/api/tareas", tarea);

export const updateTareaRequest = (id, tarea) =>
  axios.put(`/api/tareas/${id}`, tarea);

export const deleteTareaRequest = (id) => axios.delete(`/api/tareas/${id}`);

export const getTareasStatsRequest = () => axios.get("/api/tareas/stats/summary");
