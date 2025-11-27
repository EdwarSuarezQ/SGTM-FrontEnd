// src/api/personal.js
import axios from "./axios";

export const getPersonalRequest = (params = {}) =>
  axios.get("/api/personal", { params });

export const getPersonalByIdRequest = (id) => axios.get(`/api/personal/${id}`);

export const createPersonalRequest = (personalData) =>
  axios.post("/api/personal", personalData);

export const updatePersonalRequest = (id, personalData) =>
  axios.put(`/api/personal/${id}`, personalData);

export const deletePersonalRequest = (id) =>
  axios.delete(`/api/personal/${id}`);

export const getPersonalStatsRequest = () =>
  axios.get("/api/personal/stats/summary");
