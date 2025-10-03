import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buscarMedico,
  criarMedico,
  atualizarMedico,
  excluirMedico,
} from "../../service/medicos";
import Loader from "../../components/Loader";

export default function MedicoForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();
  const qc = useQueryClient();

  const { data: existente, isLoading: carregandoExistente, isError: erroExistente } = useQuery({
    queryKey: ["medico", id],
    queryFn: () => buscarMedico(id),
    enabled: isEdit,
  });

  const [form, setForm] = React.useState({
    nome: "",
    especialidade: "",
    telefone: "",
    email: "",
    crm: "",
    uf: "",
    cpf: "",
    password: "",
  });

  React.useEffect(() => {
    if (!existente) return;
    setForm({
      nome: existente.nome || "",
      especialidade: existente.especialidade || "",
      telefone: existente.telefone || "",
      email: existente.email || "",
      crm: existente.crm || "",
      uf: existente.uf || "",
      cpf: existente.cpf || "",
      password: "", // nunca preenche a senha ao editar
    });
  }, [existente]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((v) => ({ ...v, [name]: value }));
  }

  const mutSave = useMutation({
    mutationFn: () => (isEdit ? atualizarMedico(id, form) : criarMedico(form)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicos"] });
      nav("/medicos");
    },
  });

  const mutDelete = useMutation({
    mutationFn: () => excluirMedico(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicos"] });
      nav("/medicos");
    },
  });

  function submit(e) {
    e.preventDefault();
    mutSave.mutate();
  }

  async function onDelete() {
    if (confirm("Tem certeza que deseja excluir este médico?")) {
      mutDelete.mutate();
    }
  }

  if (isEdit && carregandoExistente) return <Loader message="Carregando médico..." />;
  if (isEdit && erroExistente) {
    return <div className="text-red-600">Erro ao carregar os dados do médico.</div>;
  }

  return (
    <div className="paciente-form-container">
      <form onSubmit={submit} className="paciente-form">
        <h1 className="paciente-form-title">{isEdit ? "Editar" : "Novo"} Médico</h1>

        <div className="form-group">
          <label>Nome *</label>
          <input
            name="nome"
            value={form.nome}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Especialidade *</label>
          <input
            name="especialidade"
            value={form.especialidade}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label>CRM</label>
            <input
              name="crm"
              value={form.crm}
              onChange={onChange}
              placeholder="CRM"
              required
            />
          </div>
          <div className="form-group">
            <label>UF</label>
            <input
              name="uf"
              value={form.uf}
              onChange={onChange}
              placeholder="UF"
              maxLength={2}
              style={{ textTransform: "uppercase" }}
              required
            />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={onChange}
              placeholder="CPF"
              required
            />
          </div>
        </div>

        <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label>Telefone</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={onChange}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="exemplo@dominio.com"
              required
            />
          </div>
        </div>

        {!isEdit && (
          <div className="form-group">
            <label>Senha para acesso *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Senha do médico"
              required
            />
          </div>
        )}

        <div className="form-actions">
          <button
            className="btn-salvar"
            disabled={mutSave.isPending}
          >
            {mutSave.isPending ? "Salvando..." : "Salvar"}
          </button>

          <button
            type="button"
            onClick={() => nav("/medicos")}
            className="btn-cancelar"
          >
            Cancelar
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={onDelete}
              className="btn-excluir"
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
    </div>
  );
}