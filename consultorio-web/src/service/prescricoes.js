// src/service/prescricoes.js
import api from "./api";

/**
 * Upsert da lista de itens de prescrição vinculados a uma consulta
 * POST /api/prescricoes/{consultaId}
 * Body: { itens: [{ medicamento, posologia, orientacoes? }, ...] }
 */
export async function upsertPrescricoes(consultaId, itens) {
  const safeItens = (itens || []).map((x) => ({
    medicamento: (x.medicamento || "").trim(),
    posologia: (x.posologia || "").trim(),
    orientacoes: x.orientacoes?.trim() || null,
  }));
  return api.post(`/prescricoes/${consultaId}`, { itens: safeItens });
}

/** Se houver deleção de uma prescrição específica:
 * DELETE /api/prescricoes/{prescricaoId}
 */
export async function excluirPrescricao(prescricaoId) {
  return api.delete(`/prescricoes/${prescricaoId}`);
}

/** URL do PDF de uma prescrição específica (para <a href=... target="_blank">)
 * Geralmente: GET /api/prescricoes/{prescricaoId}/pdf → application/pdf
 */
export function obterPrescricaoPdfUrl(prescricaoId) {
  // VITE_API_URL já tem /api no final → mantemos o padrão
  return `${import.meta.env.VITE_API_URL}/prescricoes/${prescricaoId}/pdf`;
}

/** Download do PDF (caso queira salvar/abrir via Blob programaticamente) */
export async function baixarPrescricaoPdf(prescricaoId) {
  const res = await api.get(`/prescricoes/${prescricaoId}/pdf`, {
    responseType: "blob",
  });
  return res.data; // Blob
}
