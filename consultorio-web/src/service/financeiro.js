import api from "./api";

/** Lista todos os lançamentos financeiros */
export async function listarFinanceiro() {
  const { data } = await api.get("/controlefinanceiro");
  return data;
}

/** Busca um lançamento financeiro por ID */
export async function buscarFinanceiro(id) {
  const { data } = await api.get(`/controlefinanceiro/${id}`);
  return data;
}

/** Lista lançamentos financeiros de um médico específico */
export async function listarFinanceiroPorMedico(medicoId) {
  const { data } = await api.get(`/controlefinanceiro/medico/${medicoId}`);
  return data;
}