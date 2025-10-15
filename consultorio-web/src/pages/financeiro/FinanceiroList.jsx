import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listarFinanceiro, listarFinanceiroPorMedico } from "../../service/financeiro";
import Loader from "../../components/Loader";

export default function FinanceiroList() {
  const [medicoSelecionado, setMedicoSelecionado] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["financeiro", medicoSelecionado],
    queryFn: async () =>
      medicoSelecionado
        ? await listarFinanceiroPorMedico(medicoSelecionado)
        : await listarFinanceiro(),
  });

  if (isLoading) return <Loader message="Carregando lançamentos financeiros..." />;
  if (isError) return <div className="text-red-600">Erro ao carregar financeiro.</div>;

  // Obter lista única de médicos (id + nome)
  const medicos = Array.from(
    new Map(
      (data || [])
        .filter(item => item.medicoId && item.medicoNome)
        .map(item => [item.medicoId, item.medicoNome])
    ).entries()
  );

  const total = (data || []).reduce((sum, item) => sum + Number(item.valor || item.Valor || 0), 0);

  // Ordena os lançamentos por data decrescente (mais recente primeiro)
  const dataOrdenada = (data || []).slice().sort((a, b) => {
    const da = new Date(a.data);
    const db = new Date(b.data);
    return db - da;
  });

  return (
    <div className="financeiro-container" style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ color: "#215c21", marginBottom: 24 }}>Controle Financeiro</h1>

      {/* Filtro de médico */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 500, color: "#215c21", marginRight: 12 }}>
          Filtrar por médico:
        </label>
        <select
          value={medicoSelecionado}
          onChange={e => setMedicoSelecionado(e.target.value)}
          style={{
            minWidth: 180,
            padding: "0.5rem",
            borderRadius: 8,
            border: "1px solid #b6fcb6",
            fontSize: "1rem"
          }}
        >
          <option value="">Todos</option>
          {medicos.map(([id, nome]) => (
            <option key={id} value={id}>{nome}</option>
          ))}
        </select>
      </div>

      <table className="financeiro-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
        <thead>
          <tr style={{ background: "#eaffea" }}>
            <th style={{ padding: "0.7rem 1rem", textAlign: "left" }}>Data</th>
            <th style={{ padding: "0.7rem 1rem", textAlign: "left" }}>Paciente</th>
            <th style={{ padding: "0.7rem 1rem", textAlign: "left" }}>Médico</th>
            <th style={{ padding: "0.7rem 1rem", textAlign: "left" }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {dataOrdenada.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
              <td style={{ padding: "0.6rem 1rem" }}>
                {item.data ? new Date(item.data).toLocaleDateString() : "-"}
              </td>
              <td style={{ padding: "0.6rem 1rem" }}>{item.pacienteNome || "-"}</td>
              <td style={{ padding: "0.6rem 1rem" }}>{item.medicoNome || "-"}</td>
              <td style={{ padding: "0.6rem 1rem" }}>
                R$ {Number(item.valor || item.Valor || 0).toFixed(2)}
              </td>
            </tr>
          ))}
          {dataOrdenada.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "1.2rem" }}>
                Nenhum lançamento financeiro encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ fontWeight: 700, fontSize: "1.15rem", color: "#215c21" }}>
        Total: R$ {total.toFixed(2)}
      </div>
    </div>
  );
}