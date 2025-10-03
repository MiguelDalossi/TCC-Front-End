import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useQuery } from "@tanstack/react-query";
import { listarConsultas } from "../service/consultas";
import { getCurrentUser } from "../service/auth";

export default function AgendaMedica() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const user = getCurrentUser();

  // Formata a data para 'YYYY-MM-DD'
  // const diaSelecionado = dataSelecionada.toISOString().slice(0, 10);

  // Busca consultas do banco
  const { data: consultas, isLoading, isError } = useQuery({
    queryKey: ["consultas"],
    queryFn: listarConsultas,
  });

  // Filtra consultas do dia selecionado
  const consultasDoDia = (consultas || []).filter(c => {
    if (!c.inicio) return false;
    const d = new Date(c.inicio);
    return d.getFullYear() === dataSelecionada.getFullYear() &&
      d.getMonth() === dataSelecionada.getMonth() &&
      d.getDate() === dataSelecionada.getDate();
  });

  let consultasFiltradas = consultasDoDia;
  if (user?.role === "Medico") {
    consultasFiltradas = consultasFiltradas.filter(
      (c) => c.medicoNome === user.fullName
    );
  }

  return (
    <main className="agenda-main">
      <section className="consultas-section">
        <h2>Consultas do dia</h2>
        <ul className="consultas-list">
          {isLoading && <li>Carregando...</li>}
          {isError && <li className="text-red-600">Erro ao carregar consultas.</li>}
          {consultasDoDia?.length === 0 && !isLoading && (
            <li className="consulta-vazia">Nenhuma consulta para este dia.</li>
          )}
          {consultasFiltradas?.map(c => (
            <li key={c.id} className="consulta-item" style={{ background: "#e6ffe6" }}>
              <strong>{c.inicio?.slice(11, 16)}</strong> - {c.pacienteNome} ({c.medicoNome})
            </li>
          ))}
        </ul>
      </section>
      <aside className="calendario-section">
        <h2>Calendário</h2>
        <Calendar value={dataSelecionada} onChange={setDataSelecionada} />
      </aside>
    </main>
  );
}