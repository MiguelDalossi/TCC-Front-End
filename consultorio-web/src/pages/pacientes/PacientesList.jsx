import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listarPacientes } from "../../service/paciente";
import Loader from "../../components/Loader"; // import do Loader

export default function PacientesList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pacientes"],
    queryFn: listarPacientes,
  });

  if (isLoading) return <Loader message="Carregando pacientes..." />;
  if (isError) return <div className="text-red-600">Erro ao carregar pacientes.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pacientes</h1>
        <Link
          to="/pacientes/novo"
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Novo
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nome</th>
            <th>Telefone</th>
            <th>Nascimento</th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.nome}</td>
              <td>{p.telefone || "-"}</td>
              <td>
                {p.dataNascimento
                  ? new Date(p.dataNascimento).toLocaleDateString()
                  : "-"}
              </td>
              <td className="text-right">
                <Link
                  to={`/pacientes/${p.id}/editar`}
                  className="text-blue-600"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
          {data?.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500">
                Nenhum paciente cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
