import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

/**
 * Layout das páginas privadas: Header + conteúdo principal.
 */
export default function Shell() {
  return (
    <>
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
}