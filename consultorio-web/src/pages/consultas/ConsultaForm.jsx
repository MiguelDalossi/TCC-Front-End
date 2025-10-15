import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { criarConsulta } from "../../service/consultas";
import { listarPacientes } from "../../service/paciente";
import { listarMedicos } from "../../service/medicos";
import Loader from "../../components/Loader";

const TIPOS_ATENDIMENTO = [
  { value: 0, label: "Particular" },
  { value: 1, label: "Convênio" },
  { value: 2, label: "Telemedicina" }
];

export default function ConsultaForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    pacienteId: "",
    medicoId: "",
    inicio: "",
    tipoAtendimento: 0,
    valorConsulta: "",
    numeroCarteirinha: "",
    guiaConvenio: ""
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

  // Preenche valorConsulta automaticamente ao selecionar médico (se desejar)
  useEffect(() => {
    // Se quiser buscar valor padrão do médico, adicione aqui
    // Exemplo: setForm(f => ({ ...f, valorConsulta: valorPadrao }));
  }, [form.medicoId, form.tipoAtendimento]);

  // Limpa campos de convênio se não for convênio
  useEffect(() => {
    if (Number(form.tipoAtendimento) !== 1) {
      setForm(f => ({
        ...f,
        numeroCarteirinha: "",
        guiaConvenio: ""
      }));
    }
  }, [form.tipoAtendimento]);

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
    // Calcula o fim somando 30 minutos ao início
    const inicioStr = form.inicio;
    const inicioDate = new Date(inicioStr);
    const fimDate = new Date(inicioDate.getTime() + 30 * 60000);
    const pad = (n) => n.toString().padStart(2, "0");
    const fimStr = `${fimDate.getFullYear()}-${pad(fimDate.getMonth() + 1)}-${pad(fimDate.getDate())}T${pad(fimDate.getHours())}:${pad(fimDate.getMinutes())}`;

    mut.mutate({ ...form, fim: fimStr });
  }

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

        <div className="form-group">
          <label>Tipo de Atendimento</label>
          <select
            name="tipoAtendimento"
            value={form.tipoAtendimento}
            onChange={onChange}
            required
          >
            {TIPOS_ATENDIMENTO.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Se for convênio, mostra campos de convênio */}
        {Number(form.tipoAtendimento) === 1 && (
          <>
            <div className="form-group">
              <label>Número da Carteirinha</label>
              <input
                name="numeroCarteirinha"
                value={form.numeroCarteirinha}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Guia do Convênio</label>
              <input
                name="guiaConvenio"
                value={form.guiaConvenio}
                onChange={onChange}
                required
              />
            </div>
          </>
        )}

        {/* Se não for convênio, mostra valor da consulta */}
        {Number(form.tipoAtendimento) !== 1 && (
          <div className="form-group">
            <label>Valor da Consulta</label>
            <input
              type="number"
              name="valorConsulta"
              value={form.valorConsulta}
              onChange={onChange}
              min={0}
              step="0.01"
              required
            />
          </div>
        )}

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
