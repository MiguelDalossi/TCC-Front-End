import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Mock de consultas do dia
const consultasMock = [
  { id: 1, paciente: "João", medico: "Dr. Silva", hora: "09:00", cor: "#FFD700", data: "2025-09-22" },
  { id: 2, paciente: "Maria", medico: "Dr. Silva", hora: "10:00", cor: "#90ee90", data: "2025-09-22" },
  { id: 3, paciente: "Carlos", medico: "Dra. Souza", hora: "11:00", cor: "#87CEFA", data: "2025-09-23" },
];

export default function AgendaMedica() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // Filtrar consultas do dia selecionado
  const diaSelecionado = dataSelecionada.toISOString().slice(0, 10);
  const consultasDoDia = consultasMock.filter(
    c => c.data === diaSelecionado
  );

  return (
    <main className="agenda-main">
      <section className="consultas-section">
        <h2>Consultas do dia</h2>
        <ul className="consultas-list">
          {consultasDoDia.length === 0 && (
            <li className="consulta-vazia">Nenhuma consulta para este dia.</li>
          )}
          {consultasDoDia.map(c => (
            <li key={c.id} className="consulta-item" style={{ background: c.cor }}>
              <strong>{c.hora}</strong> - {c.paciente} ({c.medico})
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