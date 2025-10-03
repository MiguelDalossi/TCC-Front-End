// src/service/auth.js
import api from "./api";

// Login → recebe { token, expiresAt, fullName, email, role }
export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });

  // Salva token e dados no localStorage
  localStorage.setItem("auth_token", data.token);
  localStorage.setItem("auth_user", JSON.stringify({
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    expiresAt: data.expiresAt
  }));

  return data;
}

// Registro → cria novo usuário
export async function register({ email, password, fullName, role }) {
  const { data } = await api.post("/auth/register", {
    email,
    password,
    fullName,
    role
  });
  return data;
}

// Retorna usuário atual salvo
export function getCurrentUser() {
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Logout → limpa storage
export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

// Verifica se está logado
export function isAuthenticated() {
  return Boolean(localStorage.getItem("auth_token"));
}

export async function getMe() {
  return api.get("/auth/me").then(res => res.data);
}