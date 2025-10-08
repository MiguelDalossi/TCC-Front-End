// src/service/prescricoes.js
import api from "./api";

/**
 * Upsert da lista de itens de prescrição vinculados a uma consulta
 * POST /api/prescricoes/{consultaId}
 * Body: { itens: [{ medicamento, posologia, orientacoes? }, ...] }
 */
export async function upsertPrescricoes(consultaId, itens) {
  // Validação básica: todos os itens devem ter medicamento e posologia
  const safeItens = (itens || [])
    .map((x) => ({
      medicamento: (x.medicamento || "").trim(),
      posologia: (x.posologia || "").trim(),
      orientacoes: x.orientacoes?.trim() || null,
    }))
    .filter((x) => x.medicamento && x.posologia);

  if (safeItens.length === 0) {
    throw new Error("Adicione pelo menos um item de prescrição com medicamento e posologia.");
  }

  return api.post(`/prescricoes/${consultaId}`, { itens: safeItens });
}

/** Se houver deleção de uma prescrição específica:
 * DELETE /api/prescricoes/{prescricaoId}
 */
export async function excluirPrescricao(prescricaoId) {
  return api.delete(`/prescricoes/${prescricaoId}`);
}

/** URL do PDF de uma prescrição específica */
export function obterPrescricaoPdfUrl(consultaId, itemId) {
  return `${import.meta.env.VITE_API_URL}/prescricoes/${consultaId}/pdf/${itemId}`;
}

/** Download do PDF (caso queira salvar/abrir via Blob programaticamente) */
export async function baixarPrescricaoPdf(consultaId, itemId) {
  const res = await api.get(`/prescricoes/${consultaId}/pdf/${itemId}`, {
    responseType: "blob",
  });
  return res.data; // Blob
}
