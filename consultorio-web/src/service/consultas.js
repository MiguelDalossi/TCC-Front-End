// src/service/consulta.js
import api from "./api";

/** PATCH /api/consultas/{id}/pagamento → Atualiza status de pagamento */
export async function atualizarStatusPagamento(id, statusPagamento) {
  // Envie o número puro (0, 1 ou 2) como body
  return api.patch(
    `/consultas/${id}/pagamento`,
    statusPagamento,
    { headers: { "Content-Type": "application/json" } }
  );
}

/** Normaliza datas (Date | 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm' → ISO) */
function toIso(dt) {
  if (!dt) return null;
  // Se já está no formato local, retorna como está
  if (typeof dt === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dt)) {
    return dt;
  }
  if (typeof dt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dt)) {
    return dt + "T00:00";
  }
  try {
    // Não converte para UTC, retorna local
    const d = new Date(dt);
    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
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
export async function criarConsulta({
  pacienteId,
  medicoId,
  inicio,
  fim,
  tipoAtendimento,
  valorConsulta,
  convenio,
  numeroCarteirinha,
  guiaConvenio
}) {
  const payload = {
    pacienteId,
    medicoId,
    inicio: toIso(inicio),
    fim: toIso(fim),
    tipoAtendimento: Number(tipoAtendimento),
    valorConsulta: valorConsulta ? Number(valorConsulta) : 0,
    convenio: convenio ?? null,
    numeroCarteirinha: numeroCarteirinha ?? null,
    guiaConvenio: guiaConvenio ?? null,
  };
  return api.post("/consultas", payload);
}

/** PATCH /api/consultas/{id}/status → { Status } (Agendada|EmAndamento|Concluida|Cancelada) */
export async function atualizarStatus(id, status) {
  // status deve ser: "Agendada", "EmAndamento", "Concluida", "Cancelada"
  return api.patch(`/consultas/${id}/status`, { Status: status });
}

/** PUT /api/consultas/{id} → Atualiza todos os dados da consulta */
export async function atualizarConsultaCompleta(id, { inicio, fim, status, prontuario, prescricoes }) {
  const payload = {
    Inicio: toIso(inicio),
    Fim: toIso(fim),
    Status: status,
    Prontuario: prontuario,
    Prescricoes: prescricoes,
  };
  return api.put(`/consultas/${id}`, payload);
}

/** DELETE /api/consultas/{id} */
export async function excluirConsulta(id) {
  return api.delete(`/consultas/${id}`);
}

/** PATCH /api/consultas/{id}/horario → Atualiza horário da consulta */
export async function atualizarHorario(id, { inicio, fim }) {
  const payload = {
    Inicio: toIso(inicio),
    Fim: toIso(fim),
  };
  return api.patch(`/consultas/${id}/horario`, payload);
}

/** GET /api/consultas?pacienteId={pacienteId} → ConsultaListDto[] por paciente */
export async function listarConsultasPorPaciente(pacienteId) {
  const { data } = await api.get("/consultas", { params: { pacienteId } });
  return data;
}

