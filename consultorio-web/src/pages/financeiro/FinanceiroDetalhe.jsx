import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { buscarFinanceiro } from "../../service/financeiro";
import Loader from "../../components/Loader";

export default function FinanceiroDetalhe() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["financeiro", id],
    queryFn: () => buscarFinanceiro(id),
  });

  if (isLoading) return <Loader message="Carregando lançamento..." />;
  if (isError || !data) return <div className="text-red-600">Erro ao carregar lançamento.</div>;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Detalhe do Lançamento Financeiro</h1>
      <p><strong>Data:</strong> {data.data ? new Date(data.data).toLocaleDateString() : "-"}</p>
      <p><strong>Paciente:</strong> {data.pacienteNome}</p>
      <p><strong>Médico:</strong> {data.medicoNome}</p>
      <p><strong>Valor:</strong> R$ {Number(data.valor).toFixed(2)}</p>
      {/* Adicione mais campos se desejar */}
    </div>
  );
}