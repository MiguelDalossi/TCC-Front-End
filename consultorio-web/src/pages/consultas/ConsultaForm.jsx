import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { criarConsulta } from "../../service/consultas";
import { listarPacientes } from "../../service/paciente";
import { listarMedicos } from "../../service/medicos";
import Loader from "../../components/Loader";

export default function ConsultaForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    pacienteId: "",
    medicoId: "",
    inicio: "",
  });

  // Busca pacientes e médicos
  const { data: pacientes, isLoading: loadingPac, isError: errorPac } = useQuery({
    queryKey: ["pacientes"],
    queryFn: listarPacientes,
  });
  const { data: medicos, isLoading: loadingMed, isError: errorMed } = useQuery({
    queryKey: ["medicos"],
    queryFn: listarMedicos,
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((v) => ({ ...v, [name]: value }));
  }

  const mut = useMutation({
    mutationFn: (dados) => criarConsulta(dados),
    onSuccess: () => nav("/consultas"),
  });

  function submit(e) {
    e.preventDefault();
    // Apenas calcula o fim somando 30 minutos ao início
    const inicioStr = form.inicio; // 'YYYY-MM-DDTHH:mm'
    const inicioDate = new Date(inicioStr);
    const fimDate = new Date(inicioDate.getTime() + 30 * 60000);

    // Formata para 'YYYY-MM-DDTHH:mm'
    const pad = (n) => n.toString().padStart(2, "0");
    const fimStr = `${fimDate.getFullYear()}-${pad(fimDate.getMonth() + 1)}-${pad(fimDate.getDate())}T${pad(fimDate.getHours())}:${pad(fimDate.getMinutes())}`;

    mut.mutate({ ...form, fim: fimStr });
  }

  // Garante que são arrays
  const listaMedicos = Array.isArray(medicos) ? medicos : [];
  const listaPacientes = Array.isArray(pacientes) ? pacientes : [];

  if (mut.isPending || loadingPac || loadingMed)
    return <Loader message="Carregando dados..." />;

  if (errorPac || errorMed)
    return <div className="text-red-600">Erro ao carregar pacientes ou médicos.</div>;

  return (
    <div className="paciente-form-container">
      <form onSubmit={submit} className="paciente-form">
        <h1 className="paciente-form-title">Nova Consulta</h1>

        <div className="form-group">
          <label>Paciente</label>
          <select
            name="pacienteId"
            value={form.pacienteId}
            onChange={onChange}
            required
          >
            <option value="">Selecione...</option>
            {listaPacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Médico</label>
          <select
            name="medicoId"
            value={form.medicoId}
            onChange={onChange}
            required
          >
            <option value="">Selecione...</option>
            {listaMedicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} {m.especialidade ? `- ${m.especialidade}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Início</label>
          <input
            type="datetime-local"
            name="inicio"
            value={form.inicio}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-actions">
          <button className="btn-salvar" disabled={mut.isPending}>
            Salvar
          </button>
          <button
            type="button"
            onClick={() => nav("/consultas")}
            className="btn-cancelar"
            disabled={mut.isPending}
          >
            Cancelar
          </button>
        </div>

        {mut.isError && (
          <p className="text-red-600 text-sm">
            {mut.error?.response?.status === 409
              ? "Já existe uma consulta para este médico neste horário."
              : "Erro ao salvar a consulta."}
          </p>
        )}
      </form>
    </div>
  );
}
