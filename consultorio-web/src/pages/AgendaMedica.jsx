import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useQuery } from "@tanstack/react-query";
import { listarConsultas } from "../service/consultas";
import { getCurrentUser } from "../service/auth";
import { Link } from "react-router-dom";

const LUPA_PNG = "https://cdn-icons-png.flaticon.com/512/622/622669.png";

export default function AgendaMedica() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [search, setSearch] = useState("");
  const user = getCurrentUser();

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

  // Filtro por usuário (médico)
  let consultasFiltradas = consultasDoDia;
  if (user?.role === "Medico") {
    consultasFiltradas = consultasFiltradas.filter(
      (c) => c.medicoNome === user.fullName
    );
  }

  // Filtro por busca (paciente ou médico)
  const searchLower = search.trim().toLowerCase();
  if (searchLower) {
    consultasFiltradas = consultasFiltradas.filter(
      (c) =>
        c.pacienteNome?.toLowerCase().includes(searchLower) ||
        c.medicoNome?.toLowerCase().includes(searchLower)
    );
  }

  return (
    <main className="agenda-main">
      <section className="consultas-section">
        <h2>Consultas do dia</h2>
        {/* Barra de busca */}
        <div style={{ position: "relative", width: "100%", maxWidth: 340, marginBottom: 16 }}>
          <img
            src={LUPA_PNG}
            alt="Buscar"
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              width: 22,
              height: 22,
              opacity: 0.7,
              pointerEvents: "none"
            }}
          />
          <input
            type="text"
            placeholder="Buscar por paciente ou médico..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem 1rem 0.5rem 2.5rem", // espaço à esquerda para a lupa
              borderRadius: 8,
              border: "1px solid #b6fcb6",
              fontSize: "1rem"
            }}
            aria-label="Buscar por paciente ou médico"
          />
        </div>
        <ul className="consultas-list">
          {isLoading && <li>Carregando...</li>}
          {isError && <li className="text-red-600">Erro ao carregar consultas.</li>}
          {consultasDoDia?.length === 0 && !isLoading && (
            <li className="consulta-vazia">Nenhuma consulta para este dia.</li>
          )}
          {consultasFiltradas?.map(c => (
            <li
              key={c.id}
              className="consulta-item"
              style={{
                background: "#e6ffe6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.9rem 1.2rem",
                borderRadius: "10px",
                marginBottom: "0.7rem",
                boxShadow: "0 1px 6px #90ee9080"
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#215c21" }}>
                  {c.inicio?.slice(11, 16)} — {c.pacienteNome}
                </div>
                <div style={{ fontSize: "0.97rem", color: "#555", marginTop: 2 }}>
                  <span style={{ fontWeight: 500 }}>Médico:</span> {c.medicoNome}
                </div>
                <div style={{
                  display: "inline-block",
                  marginTop: 4,
                  padding: "2px 10px",
                  borderRadius: "12px",
                  fontSize: "0.93rem",
                  fontWeight: 600,
                  color: "#fff",
                  background:
                    c.status === "Agendada"
                      ? "#1976d2"
                      : c.status === "EmAndamento"
                      ? "#fbbf24"
                      : c.status === "Concluida"
                      ? "#16a34a"
                      : "#dc2626"
                }}>
                  {c.status === "Agendada" && "Agendada"}
                  {c.status === "EmAndamento" && "Em andamento"}
                  {c.status === "Concluida" && "Concluída"}
                  {c.status === "Cancelada" && "Cancelada"}
                </div>
              </div>
              <Link
                to={`/consultas/${c.id}`}
                className="detalhes-btn"
                style={{
                  background: "#1976d2",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "0.5rem 1.2rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  fontSize: "1rem",
                  transition: "background 0.2s",
                  cursor: "pointer",
                  marginLeft: "1rem"
                }}
              >
                Detalhes
              </Link>
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