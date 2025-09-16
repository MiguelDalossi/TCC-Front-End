import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { criarConsulta } from "../../service/consultas";
import Loader from "../../components/Loader";

export default function ConsultaForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    pacienteId: "",
    medicoId: "",
    inicio: "",
    fim: "",
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((v) => ({ ...v, [name]: value }));
  }

  const mut = useMutation({
    mutationFn: () => criarConsulta(form),
    onSuccess: () => nav("/consultas"),
  });

  function submit(e) {
    e.preventDefault();
    mut.mutate();
  }

  // ⬇️ enquanto estiver salvando, mostra Loader global da tela
  if (mut.isPending) return <Loader message="Salvando consulta..." />;

  return (
    <form onSubmit={submit} className="max-w-xl space-y-3">
      <h1 className="text-xl font-semibold">Nova Consulta</h1>

      <div>
        <label className="block text-sm mb-1">PacienteId</label>
        <input
          name="pacienteId"
          value={form.pacienteId}
          onChange={onChange}
          className="w-full border p-2 rounded"
          placeholder="GUID do paciente"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">MédicoId</label>
        <input
          name="medicoId"
          value={form.medicoId}
          onChange={onChange}
          className="w-full border p-2 rounded"
          placeholder="GUID do médico"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Início</label>
          <input
            type="datetime-local"
            name="inicio"
            value={form.inicio}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Fim</label>
          <input
            type="datetime-local"
            name="fim"
            value={form.fim}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={mut.isPending}
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={() => history.back()}
          className="px-4 py-2 border rounded"
          disabled={mut.isPending}
        >
          Cancelar
        </button>
      </div>

      {mut.isError && (
        <p className="text-red-600 text-sm">Erro ao salvar a consulta.</p>
      )}
    </form>
  );
}
