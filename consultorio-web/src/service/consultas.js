// src/service/consulta.js
import api from "./api";

/** Normaliza datas (Date | 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm' → ISO) */
function toIso(dt) {
  if (!dt) return null;
  if (typeof dt === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dt)) {
    return new Date(dt).toISOString();
  }
  if (typeof dt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dt)) {
    return new Date(dt + "T00:00:00").toISOString();
  }
  try {
    return new Date(dt).toISOString();
  } catch {
    return dt;
  }
}

/** GET /api/consultas → ConsultaListDto[] */
export async function listarConsultas(params = {}) {
  const { data } = await api.get("/consultas", { params });
  return data;
}

/** GET /api/consultas/{id} → ConsultaDetailDto (inclui prontuário e prescrições) */
export async function obterConsulta(id) {
  const { data } = await api.get(`/consultas/${id}`);
  return data;
}

/** POST /api/consultas → ConsultaCreateDto */
export async function criarConsulta({ pacienteId, medicoId, inicio, fim }) {
  const payload = {
    pacienteId,
    medicoId,
    inicio: toIso(inicio),
    fim: toIso(fim),
  };
  return api.post("/consultas", payload);
}

/** PATCH /api/consultas/{id}/status → { status } (Agendada|EmAndamento|Concluida|Cancelada) */
export async function atualizarStatus(id, status) {
  // status deve ser: "Agendada", "EmAndamento", "Concluida", "Cancelada"
  return api.patch(`/consultas/${id}/status`, { Status: status });
}

/** PUT /api/consultas/{id}/horario → { inicio, fim } */
export async function atualizarHorario(id, { inicio, fim }) {
  const payload = { inicio: toIso(inicio), fim: toIso(fim) };
  return api.put(`/consultas/${id}/horario`, payload);
}

/** DELETE /api/consultas/{id} */
export async function excluirConsulta(id) {
  return api.delete(`/consultas/${id}`);
}
