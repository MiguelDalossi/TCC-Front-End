import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listarMedicos } from "../../service/medicos";
import Loader from "../../components/Loader";

const LUPA_PNG = "https://cdn-icons-png.flaticon.com/512/622/622669.png";

export default function MedicosList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["medicos"],
    queryFn: listarMedicos,
  });

  const [search, setSearch] = useState("");

  const listaMedicos = Array.isArray(data) ? data : [];
  const searchLower = search.trim().toLowerCase();
  const medicosFiltrados = !searchLower
    ? listaMedicos
    : listaMedicos.filter((m) =>
        (m.nome || m.fullName || "")
          .toLowerCase()
          .includes(searchLower)
      );

  if (isLoading) return <Loader message="Carregando médicos..." />;
  if (isError) return <div className="text-red-600">Erro ao carregar médicos.</div>;

  return (
    <div className="pacientes-container">
      <div className="pacientes-header">
        <h1>Médicos</h1>
        <Link to="/medicos/novo" className="novo-btn">
          + Novo Médico
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
          placeholder="Buscar por nome do médico..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem 1rem 0.5rem 2.5rem", // espaço à esquerda para a lupa
            borderRadius: 8,
            border: "1px solid #b6fcb6",
            fontSize: "1rem"
          }}
          aria-label="Buscar por nome do médico"
        />
      </div>

      <div className="pacientes-table-wrapper">
        <table className="pacientes-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CRM</th>
              <th>UF</th>
              <th>Especialidade</th>
              <th>CPF</th>
              <th>Email</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {medicosFiltrados.map((m) => (
              <tr key={m.id}>
                <td>{m.nome || m.fullName}</td>
                <td>{m.crm}</td>
                <td>{m.uf}</td>
                <td>{m.especialidade}</td>
                <td>{m.cpf}</td>
                <td>{m.email}</td>
                <td className="text-right">
                  <Link
                    to={`/medicos/${m.id}/editar`}
                    className="editar-btn"
                  >
                    Editar
                  </Link>
                  <Link
                    to={`/medicos/${m.id}/detalhes`}
                    className="detalhes-btn"
                    style={{ marginLeft: 8 }}
                  >
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {medicosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="sem-pacientes">
                  Nenhum médico cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}