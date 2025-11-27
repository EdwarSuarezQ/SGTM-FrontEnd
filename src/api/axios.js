// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api", // ✅ AGREGAR /api
  withCredentials: true,
});

// Interceptor para manejar errores
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir al login si no está autenticado
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
