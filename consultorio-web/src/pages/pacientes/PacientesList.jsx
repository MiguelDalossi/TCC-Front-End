import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listarPacientes } from "../../service/paciente";
import Loader from "../../components/Loader";

export default function PacientesList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pacientes"],
    queryFn: listarPacientes,
  });

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
            {(data || []).map((p) => (
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
            {data?.length === 0 && (
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
