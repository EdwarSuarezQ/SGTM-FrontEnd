import axios from "./axios";

export const loginRequest = (credentials) =>
  axios.post("/api/auth/login", credentials);

export const registerRequest = (userData) =>
  axios.post("/api/auth/register", userData);

export const getMeRequest = () => axios.get("/api/auth/me");

export const verifyTokenRequest = () => axios.get("/api/auth/verify-token");

export const logoutRequest = () => axios.post("/api/auth/logout");

export const updateProfileRequest = (data) =>
  axios.put("/api/auth/profile", data);

export const changePasswordRequest = (data) =>
  axios.put("/api/auth/change-password", data);

