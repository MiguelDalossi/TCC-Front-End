import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { buscarMedico } from "../../service/medicos";
import Loader from "../../components/Loader";

export default function MedicoDetails() {
  const { id } = useParams();
  const { data: medico, isLoading, isError } = useQuery({
    queryKey: ["medico", id],
    queryFn: () => buscarMedico(id),
  });

  if (isLoading) return <Loader message="Carregando detalhes..." />;
  if (isError || !medico)
    return <div className="text-red-600">Médico não encontrado.</div>;

  return (
    <div className="pacientes-container">
      <div className="pacientes-header">
        <h1>Detalhes do Médico</h1>
        <div>
          <Link to="/medicos" className="detalhes-btn">Voltar</Link>
          <Link to={`/medicos/${medico.id}/editar`} className="editar-btn" style={{ marginLeft: 8 }}>Editar</Link>
        </div>
      </div>
      <div className="pacientes-table-wrapper">
        <table className="pacientes-table">
          <tbody>
            <tr>
              <th>Nome</th>
              <td>{medico.nome || medico.fullName}</td>
            </tr>
            <tr>
              <th>Especialidade</th>
              <td>{medico.especialidade || "-"}</td>
            </tr>
            <tr>
              <th>CRM</th>
              <td>{medico.crm || "-"}</td>
            </tr>
            <tr>
              <th>UF</th>
              <td>{medico.uf || "-"}</td>
            </tr>
            <tr>
              <th>CPF</th>
              <td>{medico.cpf || "-"}</td>
            </tr>
            <tr>
              <th>Telefone</th>
              <td>{medico.telefone || "-"}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{medico.email || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}