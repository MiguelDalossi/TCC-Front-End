import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listarPacientes } from "../service/paciente";
import { listarConsultas } from "../service/consultas";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { data: pacientes, isLoading: loadingPac, isError: errPac } = useQuery({
    queryKey: ["pacientes"],
    queryFn: listarPacientes,
  });

  const { data: consultas, isLoading: loadingCons, isError: errCons } = useQuery({
    queryKey: ["consultas"],
    queryFn: listarConsultas,
  });

  const proxConsultas = useMemo(() => {
    if (!consultas?.length) return [];
    // ordena por inicio asc e pega as 5 mais próximas a partir de agora
    const now = new Date();
    return [...consultas]
      .filter((c) => (c.inicio ? new Date(c.inicio) >= now : true))
      .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
      .slice(0, 5);
  }, [consultas]);

  const totalPacientes = pacientes?.length || 0;
  const totalConsultasHoje = useMemo(() => {
    if (!consultas?.length) return 0;
    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = hoje.getMonth();
    const dd = hoje.getDate();
    return consultas.filter((c) => {
      if (!c.inicio) return false;
      const d = new Date(c.inicio);
      return d.getFullYear() === yyyy && d.getMonth() === mm && d.getDate() === dd;
    }).length;
  }, [consultas]);

  const emAndamento = consultas?.filter((c) => c.status === "EmAndamento").length || 0;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/consultas/nova" className="px-3 py-2 bg-blue-600 text-white rounded">
            Nova Consulta
          </Link>
          <Link to="/pacientes/novo" className="px-3 py-2 border rounded">
            Novo Paciente
          </Link>
        </div>
      </header>

      {/* Cards de resumo */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Pacientes cadastrados" loading={loadingPac} error={errPac}>
          <div className="text-3xl font-bold">{totalPacientes}</div>
          <Link to="/pacientes" className="text-blue-600 text-sm">Ver pacientes</Link>
        </Card>

        <Card title="Consultas hoje" loading={loadingCons} error={errCons}>
          <div className="text-3xl font-bold">{totalConsultasHoje}</div>
          <Link to="/consultas" className="text-blue-600 text-sm">Abrir agenda</Link>
        </Card>

        <Card title="Em andamento" loading={loadingCons} error={errCons}>
          <div className="text-3xl font-bold">{emAndamento}</div>
          <Link to="/consultas" className="text-blue-600 text-sm">Ver consultas</Link>
        </Card>
      </section>

      {/* Próximas consultas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Próximas consultas</h2>
          <Link to="/consultas" className="text-blue-600">Ver todas</Link>
        </div>

        {loadingCons && <Loader message="Carregando consultas..." />}
        {errCons && <div className="text-red-600">Erro ao carregar consultas.</div>}

        {!loadingCons && !errCons && (
          <div className="border rounded overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="py-2 px-3">Início</th>
                  <th className="px-3">Fim</th>
                  <th className="px-3">Paciente</th>
                  <th className="px-3">Médico</th>
                  <th className="px-3">Status</th>
                  <th className="px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {proxConsultas.length > 0 ? (
                  proxConsultas.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-2 px-3">{formatDateTime(c.inicio)}</td>
                      <td className="px-3">{formatDateTime(c.fim)}</td>
                      <td className="px-3">{c.pacienteNome}</td>
                      <td className="px-3">{c.medicoNome}</td>
                      <td className="px-3">{c.status}</td>
                      <td className="px-3 text-right">
                        <Link to={`/consultas/${c.id}`} className="text-blue-600">Abrir</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 px-3 text-center text-gray-500">
                      Nenhuma consulta futura encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------------------- componentes auxiliares ---------------------- */

function Card({ title, children, loading, error }) {
  return (
    <div className="border rounded p-4 space-y-2">
      <div className="text-sm text-gray-600">{title}</div>
      {loading ? (
        <div className="text-gray-500">Carregando…</div>
      ) : error ? (
        <div className="text-red-600">Erro ao carregar.</div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}

function formatDateTime(v) {
  if (!v) return "-";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v;
  }
}