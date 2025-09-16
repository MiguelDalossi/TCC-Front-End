import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buscarPaciente,
  criarPaciente,
  atualizarPaciente,
  excluirPaciente,
} from "../../service/paciente";
import Loader from "../../components/Loader"; // ⬅️ importa o loader

export default function PacienteForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();
  const qc = useQueryClient();

  // Carrega dados do paciente se for edição
  const { data: existente, isLoading: carregandoExistente, isError: erroExistente } = useQuery({
    queryKey: ["paciente", id],
    queryFn: () => buscarPaciente(id),
    enabled: isEdit,
  });

  // estado do formulário
  const [form, setForm] = React.useState({
    nome: "",
    dataNascimento: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
    observacoes: "",
  });

  // sincroniza estado quando carregar o existente
  React.useEffect(() => {
    if (!existente) return;
    setForm({
      nome: existente.nome || "",
      dataNascimento: toDateInput(existente.dataNascimento), // 'YYYY-MM-DD'
      cpf: existente.cpf || "",
      telefone: existente.telefone || "",
      email: existente.email || "",
      endereco: existente.endereco || "",
      observacoes: existente.observacoes || "",
    });
  }, [existente]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((v) => ({ ...v, [name]: value }));
  }

  const mutSave = useMutation({
    mutationFn: () => (isEdit ? atualizarPaciente(id, form) : criarPaciente(form)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pacientes"] });
      nav("/pacientes");
    },
  });

  const mutDelete = useMutation({
    mutationFn: () => excluirPaciente(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pacientes"] });
      nav("/pacientes");
    },
  });

  function submit(e) {
    e.preventDefault();
    mutSave.mutate();
  }

  async function onDelete() {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
      mutDelete.mutate();
    }
  }

  // ⬇️ Loader enquanto carrega o paciente no modo edição
  if (isEdit && carregandoExistente) return <Loader message="Carregando paciente..." />;

  // (opcional) Tratativa de erro ao carregar paciente
  if (isEdit && erroExistente) {
    return <div className="text-red-600">Erro ao carregar os dados do paciente.</div>;
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-3">
      <h1 className="text-xl font-semibold">{isEdit ? "Editar" : "Novo"} Paciente</h1>

      <div>
        <label className="block text-sm mb-1">Nome *</label>
        <input
          name="nome"
          value={form.nome}
          onChange={onChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Data de Nascimento *</label>
        <input
          type="date"
          name="dataNascimento"
          value={form.dataNascimento}
          onChange={onChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">CPF</label>
          <input
            name="cpf"
            value={form.cpf}
            onChange={onChange}
            className="w-full border rounded p-2"
            placeholder="000.000.000-00"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Telefone</label>
          <input
            name="telefone"
            value={form.telefone}
            onChange={onChange}
            className="w-full border rounded p-2"
            placeholder="(00) 00000-0000"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full border rounded p-2"
            placeholder="exemplo@dominio.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Endereço</label>
        <input
          name="endereco"
          value={form.endereco}
          onChange={onChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Observações</label>
        <textarea
          name="observacoes"
          value={form.observacoes}
          onChange={onChange}
          className="w-full border rounded p-2"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={mutSave.isPending}
        >
          {mutSave.isPending ? "Salvando..." : "Salvar"}
        </button>

        <button
          type="button"
          onClick={() => history.back()}
          className="px-4 py-2 border rounded"
        >
          Cancelar
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto px-4 py-2 border rounded text-red-600 border-red-600"
            disabled={mutDelete.isPending}
          >
            {mutDelete.isPending ? "Excluindo..." : "Excluir"}
          </button>
        )}
      </div>

      {(mutSave.isError || mutDelete.isError) && (
        <p className="text-red-600 text-sm">Ocorreu um erro. Tente novamente.</p>
      )}
    </form>
  );
}

/* util: ISO → 'YYYY-MM-DD' para <input type="date"> */
function toDateInput(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    return `${yyyy}-${MM}-${dd}`;
  } catch {
    return "";
  }
}
