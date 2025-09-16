import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/Loader";

import {
  obterConsulta,
  atualizarStatus,
  atualizarHorario,
} from "../../service/consultas.js";
import { upsertProntuario } from "../../service/prontuarios.js";
import {
  upsertPrescricoes,
  obterPrescricaoPdfUrl,
} from "../../service/prescricoes.js";

const STATUS_OPTS = ["Agendada", "EmAndamento", "Concluida", "Cancelada"];

export default function ConsultaDetalhe() {
  const { id } = useParams();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["consulta", id],
    queryFn: () => obterConsulta(id),
    enabled: !!id,
  });

  // estado local (espelha dados atuais; ao salvar, recarrega via invalidate)
  const [status, setStatus] = useState(STATUS_OPTS[0]);

  const [horario, setHorario] = useState({
    inicio: "",
    fim: "",
  });

  const prontInicial = useMemo(
    () => ({
      queixaPrincipal: data?.prontuario?.queixaPrincipal || "",
      hda: data?.prontuario?.hda || "",
      antecedentes: data?.prontuario?.antecedentes || "",
      exameFisico: data?.prontuario?.exameFisico || "",
      hipotesesDiagnosticas: data?.prontuario?.hipotesesDiagnosticas || "",
      conduta: data?.prontuario?.conduta || "",
    }),
    [data]
  );

  const [pront, setPront] = useState(prontInicial);

  const [itensRx, setItensRx] = useState(
    data?.prescricoes?.length ? data.prescricoes : [{ medicamento: "", posologia: "", orientacoes: "" }]
  );

  // Atualizar status
  const mutStatus = useMutation({
    mutationFn: () => atualizarStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consulta", id] }),
  });

  // Atualizar horário (opcional, se seu back tiver esse endpoint)
  const mutHorario = useMutation({
    mutationFn: () => atualizarHorario(id, horario),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consulta", id] }),
  });

  // Upsert prontuário
  const mutPront = useMutation({
    mutationFn: () => upsertProntuario(id, pront),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consulta", id] }),
  });

  // Upsert prescrições
  const mutRx = useMutation({
    mutationFn: () => upsertPrescricoes(id, itensRx),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["consulta", id] }),
  });

  // Sempre que os dados carregarem, sincroniza estados locais
  React.useEffect(() => {
    if (!data) return;
    setStatus(data.status || STATUS_OPTS[0]);
    setHorario({
      inicio: data.inicio ? toLocalInput(data.inicio) : "",
      fim: data.fim ? toLocalInput(data.fim) : "",
    });
    setPront(prontInicial);
    setItensRx(
      data.prescricoes?.length
        ? data.prescricoes
        : [{ medicamento: "", posologia: "", orientacoes: "" }]
    );
  }, [data, prontInicial]);

  if (isLoading) return <Loader message="Carregando consulta..." />;
  if (isError || !data) return <div className="text-red-600">Erro ao carregar consulta.</div>;

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Consulta</h1>
        <p className="text-sm text-gray-600">
          Paciente: <strong>{data.pacienteNome}</strong> · Médico:{" "}
          <strong>{data.medicoNome}</strong>
        </p>
      </header>

      {/* Status e Horário */}
      <section className="space-y-3">
        <h2 className="font-semibold">Status & Horário</h2>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-1"
          >
            {STATUS_OPTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={() => mutStatus.mutate()}
            className="px-3 py-1 bg-blue-600 text-white rounded"
            disabled={mutStatus.isPending}
          >
            {mutStatus.isPending ? "Atualizando..." : "Atualizar status"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-xl">
          <div>
            <label className="block text-sm mb-1">Início</label>
            <input
              type="datetime-local"
              value={horario.inicio}
              onChange={(e) =>
                setHorario((v) => ({ ...v, inicio: e.target.value }))
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Fim</label>
            <input
              type="datetime-local"
              value={horario.fim}
              onChange={(e) =>
                setHorario((v) => ({ ...v, fim: e.target.value }))
              }
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <button
          onClick={() => mutHorario.mutate()}
          className="px-3 py-1 border rounded"
          disabled={mutHorario.isPending}
        >
          {mutHorario.isPending ? "Salvando..." : "Salvar horário"}
        </button>
      </section>

      {/* Prontuário */}
      <section className="space-y-3">
        <h2 className="font-semibold">Prontuário</h2>
        <ProntuarioForm pront={pront} setPront={setPront} />
        <button
          onClick={() => mutPront.mutate()}
          className="px-3 py-1 bg-blue-600 text-white rounded"
          disabled={mutPront.isPending}
        >
          {mutPront.isPending ? "Salvando..." : "Salvar prontuário"}
        </button>
      </section>

      {/* Prescrição */}
      <section className="space-y-3">
        <h2 className="font-semibold">Prescrição</h2>
        <PrescricaoForm itens={itensRx} setItens={setItensRx} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => mutRx.mutate()}
            className="px-3 py-1 bg-blue-600 text-white rounded"
            disabled={mutRx.isPending}
          >
            {mutRx.isPending ? "Salvando..." : "Salvar prescrição"}
          </button>
        </div>

        {/* Se o back retornar IDs das prescrições, podemos exibir links de PDF */}
        {!!data.prescricoes?.length && (
          <div className="pt-2 text-sm">
            {data.prescricoes.map((rx, i) => (
              <div key={rx.id || i} className="flex items-center justify-between border-b py-1">
                <span>
                  <strong>{rx.medicamento}</strong> — {rx.posologia}
                  {rx.orientacoes ? ` · ${rx.orientacoes}` : ""}
                </span>
                {rx.id ? (
                  <a
                    className="text-blue-600"
                    href={obterPrescricaoPdfUrl(rx.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    PDF
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ----------------- componentes auxiliares ----------------- */

function ProntuarioForm({ pront, setPront }) {
  function onChange(e) {
    const { name, value } = e.target;
    setPront((v) => ({ ...v, [name]: value }));
  }
  return (
    <div className="space-y-2 max-w-3xl">
      <input
        name="queixaPrincipal"
        value={pront.queixaPrincipal}
        onChange={onChange}
        placeholder="Queixa Principal"
        className="w-full border rounded p-2"
      />
      <textarea
        name="hda"
        value={pront.hda}
        onChange={onChange}
        placeholder="História da Doença Atual (HDA)"
        className="w-full border rounded p-2"
      />
      <textarea
        name="antecedentes"
        value={pront.antecedentes}
        onChange={onChange}
        placeholder="Antecedentes"
        className="w-full border rounded p-2"
      />
      <textarea
        name="exameFisico"
        value={pront.exameFisico}
        onChange={onChange}
        placeholder="Exame Físico"
        className="w-full border rounded p-2"
      />
      <textarea
        name="hipotesesDiagnosticas"
        value={pront.hipotesesDiagnosticas}
        onChange={onChange}
        placeholder="Hipóteses Diagnósticas"
        className="w-full border rounded p-2"
      />
      <textarea
        name="conduta"
        value={pront.conduta}
        onChange={onChange}
        placeholder="Conduta"
        className="w-full border rounded p-2"
      />
    </div>
  );
}

function PrescricaoForm({ itens, setItens }) {
  function setItem(i, field, value) {
    setItens((arr) => arr.map((x, idx) => (idx === i ? { ...x, [field]: value } : x)));
  }
  function add() {
    setItens((arr) => [...arr, { medicamento: "", posologia: "", orientacoes: "" }]);
  }
  function remove(i) {
    setItens((arr) => arr.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      {itens.map((it, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-center">
          <input
            className="col-span-4 border rounded p-2"
            placeholder="Medicamento"
            value={it.medicamento}
            onChange={(e) => setItem(i, "medicamento", e.target.value)}
          />
          <input
            className="col-span-4 border rounded p-2"
            placeholder="Posologia"
            value={it.posologia}
            onChange={(e) => setItem(i, "posologia", e.target.value)}
          />
          <input
            className="col-span-3 border rounded p-2"
            placeholder="Orientações"
            value={it.orientacoes || ""}
            onChange={(e) => setItem(i, "orientacoes", e.target.value)}
          />
          <div className="col-span-1 text-right">
            <button
              type="button"
              onClick={() => remove(i)}
              className="px-2 py-1 border rounded"
            >
              Remover
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className="px-3 py-1 border rounded">
        Adicionar item
      </button>
    </div>
  );
}

/* util para preencher <input type="datetime-local"> com ISO vindo do back */
function toLocalInput(isoString) {
  try {
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  } catch {
    return "";
  }
}
