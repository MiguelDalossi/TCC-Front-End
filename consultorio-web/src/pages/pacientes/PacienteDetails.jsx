import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { buscarPaciente } from "../../service/paciente";
import { listarConsultasPorPaciente } from "../../service/consultas";
import Loader from "../../components/Loader";

export default function PacienteDetails() {
  const { id } = useParams();
  const { data: paciente, isLoading, isError } = useQuery({
    queryKey: ["paciente", id],
    queryFn: () => buscarPaciente(id),
  });

  const { data: consultas, isLoading: carregandoConsultas } = useQuery({
    queryKey: ["consultas-paciente", id],
    queryFn: () => listarConsultasPorPaciente(id),
    enabled: !!id,
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

      {/* Lista de consultas do paciente */}
      <div className="consultas-paciente-list" style={{ marginTop: "2rem" }}>
        <h2>Consultas deste paciente</h2>
        {carregandoConsultas ? (
          <Loader message="Carregando consultas..." />
        ) : (
          <div>
            {(consultas || []).length === 0 ? (
              <div className="consulta-vazia">
                Nenhuma consulta encontrada para este paciente.
              </div>
            ) : (
              <ul className="consultas-list">
                {consultas.map((c) => (
                  <li key={c.id} className="consulta-item">
                    <div>
                      <span style={{ fontWeight: 700, color: "#215c21", fontSize: "1.1rem" }}>
                        {c.medicoNome}
                      </span>
                      <span style={{ margin: "0 12px", color: "#333", fontWeight: 400 }}>
                        — {/* traço separador */}
                      </span>
                      <span style={{ color: "#333", fontWeight: 400 }}>
                        {c.inicio
                          ? new Date(c.inicio).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </span>
                    </div>
                    <Link
                      to={`/consultas/${c.id}`}
                      className="detalhes-btn"
                      style={{
                        marginLeft: "1rem",
                        background: "#1976d2",
                        color: "#fff",
                        borderRadius: "6px",
                        padding: "0.4rem 1rem",
                        fontWeight: 500,
                        textDecoration: "none",
                        fontSize: "1rem",
                        transition: "background 0.2s",
                        cursor: "pointer",
                        boxShadow: "0 1px 4px rgba(25,118,210,0.08)"
                      }}
                    >
                      Ver detalhes
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}