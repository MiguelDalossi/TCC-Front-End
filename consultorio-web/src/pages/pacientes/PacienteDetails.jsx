import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { buscarPaciente } from "../../service/paciente";
import Loader from "../../components/Loader";

export default function PacienteDetails() {
  const { id } = useParams();
  const { data: paciente, isLoading, isError } = useQuery({
    queryKey: ["paciente", id],
    queryFn: () => buscarPaciente(id),
  });

  if (isLoading) return <Loader message="Carregando detalhes..." />;
  if (isError || !paciente)
    return <div className="text-red-600">Paciente não encontrado.</div>;

  return (
    <div className="pacientes-container">
      <div className="pacientes-header">
        <h1>Detalhes do Paciente</h1>
        <div>
          <Link to="/pacientes" className="detalhes-btn">Voltar</Link>
          <Link to={`/pacientes/${paciente.id}/editar`} className="editar-btn" style={{ marginLeft: 8 }}>Editar</Link>
        </div>
      </div>
      <div className="pacientes-table-wrapper">
        <table className="pacientes-table">
          <tbody>
            <tr>
              <th>Nome</th>
              <td>{paciente.nome}</td>
            </tr>
            <tr>
              <th>Data de Nascimento</th>
              <td>{paciente.dataNascimento ? new Date(paciente.dataNascimento).toLocaleDateString() : "-"}</td>
            </tr>
            <tr>
              <th>CPF</th>
              <td>{paciente.cpf || "-"}</td>
            </tr>
            <tr>
              <th>Telefone</th>
              <td>{paciente.telefone || "-"}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{paciente.email || "-"}</td>
            </tr>
            {/* Removido campo Endereço */}
            <tr>
              <th>Cidade</th>
              <td>{paciente.cidade || "-"}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{paciente.estado || "-"}</td>
            </tr>
            <tr>
              <th>Bairro</th>
              <td>{paciente.bairro || "-"}</td>
            </tr>
            <tr>
              <th>Rua</th>
              <td>{paciente.rua || "-"}</td>
            </tr>
            <tr>
              <th>Número</th>
              <td>{paciente.numero || "-"}</td>
            </tr>
            <tr>
              <th>CEP</th>
              <td>{paciente.cep || "-"}</td>
            </tr>
            <tr>
              <th>Complemento</th>
              <td>{paciente.complemento || "-"}</td>
            </tr>
            <tr>
              <th>Observações</th>
              <td>{paciente.observacoes || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}