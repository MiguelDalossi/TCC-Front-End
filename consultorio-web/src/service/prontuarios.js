// src/service/prontuarios.js
import api from "./api";

/**
 * Upsert de prontuário por consulta
 * POST /api/prontuarios/{consultaId}
 * Body esperado (ajuste se seu DTO tiver campos adicionais):
 * {
 *   queixaPrincipal, hda, antecedentes, exameFisico,
 *   hipotesesDiagnosticas, conduta
 * }
 */
export async function upsertProntuario(consultaId, prontuario) {
  const body = {
    queixaPrincipal: prontuario.queixaPrincipal ?? "",
    hda: prontuario.hda ?? "",
    antecedentes: prontuario.antecedentes ?? "",
    exameFisico: prontuario.exameFisico ?? "",
    hipotesesDiagnosticas: prontuario.hipotesesDiagnosticas ?? "",
    conduta: prontuario.conduta ?? "",
  };
  return api.post(`/prontuarios/${consultaId}`, body);
}

/** (Opcional) se você expuser GET do prontuário direto:
 * GET /api/prontuarios/{consultaId}
 */
export async function obterProntuarioPorConsulta(consultaId) {
  const { data } = await api.get(`/prontuarios/${consultaId}`);
  return data;
}
