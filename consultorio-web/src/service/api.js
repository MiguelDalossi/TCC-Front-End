// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex: https://localhost:5282/api
  withCredentials: false,
  timeout: 15000,
});                       

// Anexa token Bearer (se existir)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata 401 globalmente
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("auth_token");
      if (location.pathname !== "/login") location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// ————————————————————————
// Utilitário opcional para checar a API rapidamente
export async function ping() {
  const { data } = await api.get("/ping");
  return data; // esperado: { ok: true, msg: "pong" }
}