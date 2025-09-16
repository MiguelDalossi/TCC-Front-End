import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listarConsultas } from "../../service/consultas";
import Loader from "../../components/Loader";

export default function ConsultasList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["consultas"],
    queryFn: () => listarConsultas(),
  });

  if (isLoading) return <Loader message="Carregando consultas..." />;
  if (isError) return <div className="text-red-600">Erro ao carregar consultas.</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Consultas</h1>
        <Link to="/consultas/nova" className="bg-blue-600 text-white px-3 py-1 rounded">
          Nova
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Início</th>
            <th>Fim</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Status</th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-2">{new Date(c.inicio).toLocaleString()}</td>
              <td>{new Date(c.fim).toLocaleString()}</td>
              <td>{c.pacienteNome}</td>
              <td>{c.medicoNome}</td>
              <td>{c.status}</td>
              <td className="text-right">
                <Link to={`/consultas/${c.id}`} className="text-blue-600">
                  Abrir
                </Link>
              </td>
            </tr>
          ))}
          {data?.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                Nenhuma consulta encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
