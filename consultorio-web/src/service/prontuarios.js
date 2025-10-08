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
  // Validação básica dos campos obrigatórios
  if (!prontuario.queixaPrincipal || !prontuario.hda) {
    throw new Error("Preencha todos os campos obrigatórios do prontuário.");
  }

  const body = {
    queixaPrincipal: prontuario.queixaPrincipal ?? "",
    hda: prontuario.hda ?? "",
    antecedentes: prontuario.antecedentes ?? "",
    exameFisico: prontuario.exameFisico ?? "",
    hipotesesDiagnosticas: prontuario.hipotesesDiagnosticas ?? "",
    conduta: prontuario.conduta ?? "",
  };

  // Garante que o token JWT será enviado
  // (api.js já faz isso, mas reforçando a orientação)
  return api.post(`/prontuarios/${consultaId}`, body);
}

/** (Opcional) se você expuser GET do prontuário direto:
 * GET /api/prontuarios/{consultaId}
 */
export async function obterProntuarioPorConsulta(consultaId) {
  const { data } = await api.get(`/prontuarios/${consultaId}`);
  return data;
}

export function obterProntuarioPdfUrl(consultaId) {
  return `${import.meta.env.VITE_API_URL}/prontuarios/${consultaId}/pdf`;
}

export async function baixarProntuarioPdf(consultaId) {
  const res = await api.get(`/prontuarios/${consultaId}/pdf`, {
    responseType: "blob",
  });
  return res.data; // Blob
}
