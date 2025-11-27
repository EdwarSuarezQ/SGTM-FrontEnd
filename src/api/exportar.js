import axios from "./axios";

export const exportDataRequest = (recurso) =>
  axios.get(`/api/export/${recurso}`);
