import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Protected from "./Protected";
import Shell from "./Shell";

// Páginas
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";

// Pacientes  
import PacientesList from "../pages/pacientes/PacientesList";
import PacienteForm from "../pages/pacientes/PacienteForm";

// Consultas
import ConsultasList from "../pages/consultas/ConsultasList";
import ConsultaForm from "../pages/consultas/ConsultaForm";
import ConsultaDetalhe from "../pages/consultas/ConsultaDetalhe";
import AgendaMedica from "../pages/AgendaMedica";

// Médicos
import MedicosList from "../pages/medicos/MedicosList";
import MedicoForm from "../pages/medicos/MedicoForm";



/**
 * Árvore de rotas da aplicação.
 * - /login é público
 * - Demais rotas ficam dentro de <Protected> + <Shell>
 */
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/login" element={<Login />} />

        {/* Privado */}
        <Route element={<Protected />}>
          <Route element={<Shell />}>
            <Route index element={<AgendaMedica />} /> {/* <-- Troque Dashboard por AgendaMedica */}

            {/* Pacientes */}
            <Route path="pacientes" element={<PacientesList />} />
            <Route path="pacientes/novo" element={<PacienteForm />} />
            <Route path="pacientes/:id/editar" element={<PacienteForm />} />

            {/* Consultas */}
            <Route path="consultas" element={<ConsultasList />} />
            <Route path="consultas/nova" element={<ConsultaForm />} />
            <Route path="consultas/:id" element={<ConsultaDetalhe />} />

            {/* Médicos */}
            <Route path="medicos" element={<MedicosList />} />
            <Route path="medicos/novo" element={<MedicoForm />} />
            <Route path="medicos/:id/editar" element={<MedicoForm />} />
          </Route>
        </Route>

        {/* 404 simples */}
        <Route path="*" element={<div className="p-6">404 - Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
