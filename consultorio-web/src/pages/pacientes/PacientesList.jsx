import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listarPacientes } from "../../service/paciente";
import Loader from "../../components/Loader";

const LUPA_PNG = "https://cdn-icons-png.flaticon.com/512/622/622669.png";

export default function PacientesList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pacientes"],
    queryFn: listarPacientes,
  });

  const [search, setSearch] = useState("");

  // Filtro por nome do paciente
  const searchLower = search.trim().toLowerCase();
  const pacientesFiltrados = !searchLower
    ? data || []
    : (data || []).filter((p) =>
        p.nome?.toLowerCase().includes(searchLower)
      );

  if (isLoading) return <Loader message="Carregando pacientes..." />;
  if (isError) return <div className="text-red-600">Erro ao carregar pacientes.</div>;

  return (
    <div className="pacientes-container">
      <div className="pacientes-header">
        <h1>Pacientes</h1>
        <Link to="/pacientes/novo" className="novo-btn">
          + Novo Paciente
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
          placeholder="Buscar por nome do paciente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem 1rem 0.5rem 2.5rem", // espaço à esquerda para a lupa
            borderRadius: 8,
            border: "1px solid #b6fcb6",
            fontSize: "1rem"
          }}
          aria-label="Buscar por nome do paciente"
        />
      </div>

      <div className="pacientes-table-wrapper">
        <table className="pacientes-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Nascimento</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(pacientesFiltrados || []).map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.telefone || "-"}</td>
                <td>
                  {p.dataNascimento
                    ? new Date(p.dataNascimento).toLocaleDateString()
                    : "-"}
                </td>
                <td>{p.cidade || "-"}</td>
                <td>{p.estado || "-"}</td>
                <td className="text-right">
                  <Link
                    to={`/pacientes/${p.id}/editar`}
                    className="editar-btn"
                  >
                    Editar
                  </Link>
                  <Link
                    to={`/pacientes/${p.id}/detalhes`}
                    className="detalhes-btn"
                    style={{ marginLeft: 8 }}
                  >
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {pacientesFiltrados?.length === 0 && (
              <tr>
                <td colSpan={6} className="sem-pacientes">
                  Nenhum paciente cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
