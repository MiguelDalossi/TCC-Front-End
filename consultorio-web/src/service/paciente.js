// src/services/pacientes.js
import api from "./api";

/** Converte date string (yyyy-mm-dd) → ISO para o back .NET */
function toIso(dateOrString) {
  if (!dateOrString) return null;
  // Se vier "2025-09-15", enviar "2025-09-15T00:00:00Z" (ajuste conforme sua API)
  if (typeof dateOrString === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateOrString)) {
    return new Date(dateOrString + "T00:00:00").toISOString();
  }
  try {
    return new Date(dateOrString).toISOString();
  } catch {
    return dateOrString;
  }
}

/** Lista (GET /api/pacientes) → PacienteListDto[] */
export async function listarPacientes() {
  const { data } = await api.get("/pacientes");
  return data;
}

/** Detalhe (GET /api/pacientes/{id}) → PacienteDetailDto */
export async function buscarPaciente(id) {
  const { data } = await api.get(`/pacientes/${id}`);
  return data;
}

/** Criar (POST /api/pacientes) → PacienteCreateDto */
export async function criarPaciente(form) {
  const payload = {
    nome: form.nome?.trim(),
    dataNascimento: toIso(form.dataNascimento),
    cpf: form.cpf || null,
    telefone: form.telefone || null,
    email: form.email || null,
    endereco: form.endereco || null,
    observacoes: form.observacoes || null,
  };
  return api.post("/pacientes", payload);
}

/** Atualizar (PUT /api/pacientes/{id}) → PacienteUpdateDto */
export async function atualizarPaciente(id, form) {
  const payload = {
    nome: form.nome?.trim(),
    dataNascimento: toIso(form.dataNascimento),
    cpf: form.cpf || null,
    telefone: form.telefone || null,
    email: form.email || null,
    endereco: form.endereco || null,
    observacoes: form.observacoes || null,
  };
  return api.put(`/pacientes/${id}`, payload);
}

/** Excluir (DELETE /api/pacientes/{id}) */
export async function excluirPaciente(id) {
  return api.delete(`/pacientes/${id}`);
}