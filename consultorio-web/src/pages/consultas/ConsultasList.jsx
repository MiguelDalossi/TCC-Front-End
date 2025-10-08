import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listarConsultas } from "../../service/consultas";
import Loader from "../../components/Loader";
import { getCurrentUser } from "../../service/auth";

const LUPA_PNG = "https://cdn-icons-png.flaticon.com/512/622/622669.png";

export default function ConsultasList() {
  const user = getCurrentUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["consultas"],
    queryFn: () => listarConsultas(),
  });

  const [search, setSearch] = useState("");

  // Filtra conforme o papel
  let consultasFiltradas = data || [];
  if (user?.role === "Medico") {
    consultasFiltradas = consultasFiltradas.filter(
      (c) => c.medicoNome === user.fullName
    );
  }

  // Filtro por busca (paciente ou médico)
  const searchLower = search.trim().toLowerCase();
  if (searchLower) {
    consultasFiltradas = consultasFiltradas.filter(
      (c) =>
        c.pacienteNome?.toLowerCase().includes(searchLower) ||
        c.medicoNome?.toLowerCase().includes(searchLower)
    );
  }

  if (isLoading) return <Loader message="Carregando consultas..." />;
  if (isError) return <div className="text-red-600">Erro ao carregar consultas.</div>;

  return (
    <div className="pacientes-container">
      <div className="pacientes-header">
        <h1>Consultas</h1>
        <Link to="/consultas/nova" className="novo-btn">
          + Nova Consulta
        </Link>
      </div>

      {/* Barra de busca */}
      <div style={{ position: "relative", width: "100%", maxWidth: 340, marginBottom: 16 }}>
        <img
          src={LUPA_PNG}
          alt="Buscar"
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            width: 22,
            height: 22,
            opacity: 0.7,
            pointerEvents: "none"
          }}
        />
        <input
          type="text"
          placeholder="Buscar por paciente ou médico..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem 1rem 0.5rem 2.5rem", // espaço à esquerda para a lupa
            borderRadius: 8,
            border: "1px solid #b6fcb6",
            fontSize: "1rem"
          }}
          aria-label="Buscar por paciente ou médico"
        />
      </div>

      <div className="pacientes-table-wrapper">
        <table className="pacientes-table">
          <thead>
            <tr>
              <th>Início</th>
              <th>Fim</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Status</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(consultasFiltradas || []).map((c) => (
              <tr key={c.id}>
                <td>{new Date(c.inicio).toLocaleString()}</td>
                <td>{new Date(c.fim).toLocaleString()}</td>
                <td>{c.pacienteNome}</td>
                <td>{c.medicoNome}</td>
                <td>
                  {c.status === "EmAndamento"
                    ? "Em andamento"
                    : c.status === "Concluida"
                    ? "Concluída"
                    : c.status === "Agendada"
                    ? "Agendada"
                    : c.status === "Cancelada"
                    ? "Cancelada"
                    : c.status}
                </td>
                <td className="text-right">
                  <Link to={`/consultas/${c.id}`} className="editar-btn">
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}
            {consultasFiltradas?.length === 0 && (
              <tr>
                <td colSpan={6} className="sem-pacientes">
                  Nenhuma consulta encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
