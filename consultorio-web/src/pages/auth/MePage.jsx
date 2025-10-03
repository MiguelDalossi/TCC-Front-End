import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../service/auth";
import Loader from "../../components/Loader";

export default function MePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  if (isLoading) return <Loader message="Carregando usuário..." />;
  if (isError) return <div className="text-red-600">Erro ao buscar usuário.</div>;

  return (
    <div className="paciente-form-container">
      <h1>Usuário logado</h1>
      <p><strong>Nome:</strong> {data?.name || data?.Name}</p>
      <p><strong>Roles:</strong> {Array.isArray(data?.roles || data?.Roles) ? (data.roles || data.Roles).join(", ") : ""}</p>
    </div>
  );
}