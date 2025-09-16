import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../service/auth";

/**
 * Layout “casca” das páginas privadas:
 * sidebar com navegação, botão de sair e <Outlet/> para o conteúdo.
 */
export default function Shell() {
  const nav = useNavigate();

  function doLogout() {
    logout();
    nav("/login");
  }

  const linkClass = ({ isActive }) =>
    `block px-2 py-1 rounded ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-800 hover:bg-gray-50"}`;

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r p-4 space-y-4">
        <div className="font-bold text-lg">
          <Link to="/">Consultório</Link>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/pacientes" className={linkClass}>
            Pacientes
          </NavLink>
          <NavLink to="/consultas" className={linkClass}>
            Consultas
          </NavLink>
        </nav>

        <button
          onClick={doLogout}
          className="text-sm text-red-600 border rounded px-2 py-1 hover:bg-red-50"
        >
          Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}