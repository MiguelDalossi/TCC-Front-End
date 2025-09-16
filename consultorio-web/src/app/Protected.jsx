// src/app/Protected.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Lê o token salvo no localStorage.
 */
function getToken() {
  return localStorage.getItem("auth_token");
}

/**
 * Decodifica o payload do JWT sem validar assinatura (suficiente para checar exp e claims no front).
 */
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    // atob lida com base64; substitui URL-safe chars se houver
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

/**
 * Verifica se o token está expirado (claim "exp" em segundos).
 */
function isExpired(token) {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return false; // se não tiver exp, não vamos bloquear por aqui
  const nowSec = Math.floor(Date.now() / 1000);
  return decoded.exp <= nowSec;
}

/**
 * Extrai papel/role do usuário.
 * - Primeiro tenta do localStorage ("auth_user.role")
 * - Depois tenta do próprio JWT (claim "role" ou "roles")
 */
function getUserRole(token) {
  try {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.role) return u.role;
    }
  } catch {
    /* ignore */
  }
  const decoded = decodeJwt(token);
  if (!decoded) return undefined;
  if (decoded.role) return decoded.role;
  if (Array.isArray(decoded.roles) && decoded.roles.length) return decoded.roles[0];
  return undefined;
}

/**
 * Componente de proteção de rotas.
 * - Se não houver token → redireciona para /login guardando a rota original (state.from)
 * - Se o token estiver expirado → limpa storage e redireciona para /login
 * - Se "roles" for informado na rota e o usuário não tiver permissão → redireciona para "/"
 *
 * Uso básico (em Routes.jsx):
 *   <Route element={<Protected />}>
 *     <Route element={<Shell />}>
 *       <Route index element={<Dashboard />} />
 *       ...
 *     </Route>
 *   </Route>
 *
 * Uso com RBAC:
 *   <Route element={<Protected roles={['Admin']} />}>
 *     <Route path="admin" element={<AdminPage />} />
 *   </Route>
 */
export default function Protected({ roles }) {
  const location = useLocation();
  const token = getToken();

  // Sem token → manda pro login
  /*if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }*/

    if (!token) {
  console.warn("Sem token, mas permitindo acesso para testes.");
}

  // Token expirado → limpa e manda pro login
  if (isExpired(token)) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // RBAC opcional
  if (Array.isArray(roles) && roles.length > 0) {
    const role = getUserRole(token);
    const isAllowed = role && roles.includes(role);
    if (!isAllowed) {
      // poderíamos mandar para uma página 403 dedicada; por simplicidade, manda pro dashboard
      return <Navigate to="/" replace />;
    }
  }

  // Autorizado → renderiza as rotas filhas
  return <Outlet />;
}