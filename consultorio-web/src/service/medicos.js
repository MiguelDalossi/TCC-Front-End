import api from "./api";

// Lista todos os médicos
export function listarMedicos() {
  return api.get("/medicos").then(res => res.data);
}

// Busca médico por ID
export function buscarMedico(id) {
  return api.get(`/medicos/${id}`).then(res => res.data);
}

// Cria novo médico
export function criarMedico(dados) {
  return api.post("/medicos", dados).then(res => res.data);
}

// Atualiza médico
export function atualizarMedico(id, dados) {
  return api.put(`/medicos/${id}`, dados).then(res => res.data);
}

// Exclui médico
export function excluirMedico(id) {
  return api.delete(`/medicos/${id}`).then(res => res.data);
}