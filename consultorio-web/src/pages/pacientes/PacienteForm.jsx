import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buscarPaciente,
  criarPaciente,
  atualizarPaciente,
  excluirPaciente,
} from "../../service/paciente";
import { buscarEnderecoPorCep } from "../../service/viacep";
import Loader from "../../components/Loader";

export default function PacienteForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();
  const qc = useQueryClient();

  const { data: existente, isLoading: carregandoExistente, isError: erroExistente } = useQuery({
    queryKey: ["paciente", id],
    queryFn: () => buscarPaciente(id),
    enabled: isEdit,
  });

  const [form, setForm] = React.useState({
    nome: "",
    dataNascimento: "",
    cpf: "",
    telefone: "",
    email: "",
    observacoes: "",
    cidade: "",
    estado: "",
    bairro: "",
    rua: "",
    numero: "",
    cep: "",
    complemento: "",
  });

  React.useEffect(() => {
    if (!existente) return;
    setForm({
      nome: existente.nome || "",
      dataNascimento: toDateInput(existente.dataNascimento),
      cpf: existente.cpf || "",
      telefone: existente.telefone || "",
      email: existente.email || "",
      observacoes: existente.observacoes || "",
      cidade: existente.cidade || "",
      estado: existente.estado || "",
      bairro: existente.bairro || "",
      rua: existente.rua || "",
      numero: existente.numero || "",
      cep: existente.cep || "",
      complemento: existente.complemento || "",
    });
  }, [existente]);

  // Busca endereço ao digitar o CEP
  React.useEffect(() => {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      buscarEnderecoPorCep(form.cep).then((endereco) => {
        if (endereco) {
          setForm((f) => ({
            ...f,
            rua: endereco.rua,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            complemento: endereco.complemento,
          }));
        }
      });
    }
  }, [form.cep]);

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

  if (isEdit && carregandoExistente) return <Loader message="Carregando paciente..." />;
  if (isEdit && erroExistente) {
    return <div className="text-red-600">Erro ao carregar os dados do paciente.</div>;
  }

  return (
    <div className="paciente-form-container">
      <form onSubmit={submit} className="paciente-form">
        <h1 className="paciente-form-title">{isEdit ? "Editar" : "Novo"} Paciente</h1>

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
          <label>Data de Nascimento *</label>
          <input
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>CPF</label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={onChange}
              placeholder="000.000.000-00"
            />
          </div>
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
            />
          </div>
        </div>

        <div className="form-group">
          <label>Observações</label>
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={onChange}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Cidade</label>
          <input
            name="cidade"
            value={form.cidade}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <input
            name="estado"
            value={form.estado}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Bairro</label>
          <input
            name="bairro"
            value={form.bairro}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Rua</label>
          <input
            name="rua"
            value={form.rua}
            onChange={onChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Número</label>
            <input
              name="numero"
              value={form.numero}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>CEP</label>
            <input
              name="cep"
              value={form.cep}
              onChange={onChange}
              placeholder="00000-000"
            />
          </div>
          <div className="form-group">
            <label>Complemento</label>
            <input
              name="complemento"
              value={form.complemento}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn-salvar"
            disabled={mutSave.isPending}
          >
            {mutSave.isPending ? "Salvando..." : "Salvar"}
          </button>

          <button
            type="button"
            onClick={() => nav("/pacientes")}
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
