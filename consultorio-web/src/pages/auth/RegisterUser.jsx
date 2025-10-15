import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../service/auth";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../service/auth";

const ROLES = [
  { value: "Admin", label: "Administrador" },
  { value: "Medico", label: "Médico" },
  { value: "Recepcao", label: "Recepção" }
];

export default function RegisterUser() {
  const nav = useNavigate();
  const user = getCurrentUser();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Recepcao"
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  const mut = useMutation({
    mutationFn: () => register(form),
    onSuccess: () => {
      alert("Usuário cadastrado com sucesso!");
      nav("/"); // Redireciona para home ou onde preferir
    }
  });

  // Só permite acesso se for admin
  if (!user || user.role !== "Admin") {
    return <div className="text-red-600 p-8">Acesso restrito ao administrador.</div>;
  }

  if (mut.isPending) return <Loader message="Registrando usuário..." />;

  return (
    <div className="register-container" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          mut.mutate();
        }}
        className="register-form"
        aria-label="Cadastro de usuário"
      >
        <h1 className="register-title">Cadastrar Novo Usuário</h1>

        <div className="form-group">
          <label htmlFor="fullName" className="form-label">Nome completo</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            className="form-input"
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">Perfil</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={onChange}
            className="form-input"
            required
          >
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <button className="btn-salvar" type="submit">
          Cadastrar
        </button>

        {mut.isError && (
          <p className="text-red-600 text-sm" role="alert">
            {Array.isArray(mut.error?.response?.data)
              ? mut.error.response.data.join(", ")
              : "Erro ao cadastrar usuário."}
          </p>
        )}
      </form>
    </div>
  );
}