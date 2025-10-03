import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listarMedicos } from "../../service/medicos";
import Loader from "../../components/Loader";

export default function MedicosList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["medicos"],
    queryFn: listarMedicos,
  });

  if (isLoading) return <Loader message="Carregando médicos..." />;
  if (isError) return <div className="text-red-600">Erro ao carregar médicos.</div>;

  const listaMedicos = Array.isArray(data) ? data : [];

  return (
    <div className="pacientes-container">
      <div className="pacientes-header">
        <h1>Médicos</h1>
        <Link to="/medicos/novo" className="novo-btn">
          + Novo Médico
        </Link>
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
            {listaMedicos.map((m) => (
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
            {listaMedicos.length === 0 && (
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