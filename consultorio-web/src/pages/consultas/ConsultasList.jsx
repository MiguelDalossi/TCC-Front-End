import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listarConsultas } from "../../service/consultas";
import Loader from "../../components/Loader";
import { getCurrentUser } from "../../service/auth";

export default function ConsultasList() {
  const user = getCurrentUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["consultas"],
    queryFn: () => listarConsultas(),
  });

  if (isLoading) return <Loader message="Carregando consultas..." />;
  if (isError) return <div className="text-red-600">Erro ao carregar consultas.</div>;

  // Filtra conforme o papel
  let consultasFiltradas = data || [];
  if (user?.role === "Medico") {
    consultasFiltradas = consultasFiltradas.filter(
      (c) => c.medicoNome === user.fullName // ajuste aqui!
    );
  }

  return (
    <div className="pacientes-container">
      <div className="pacientes-header">
        <h1>Consultas</h1>
        <Link to="/consultas/nova" className="novo-btn">
          + Nova Consulta
        </Link>
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
                <td>{c.status}</td>
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
