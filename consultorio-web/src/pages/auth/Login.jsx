import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../service/auth.js";
import Loader from "../../components/Loader.jsx";

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((v) => ({ ...v, [name]: value }));
  }

  const mut = useMutation({
    mutationFn: () => login(form.email, form.password),
    onSuccess: () => nav(from, { replace: true }),
  });

  useEffect(() => {
    document.body.classList.add("login-bg");
    return () => document.body.classList.remove("login-bg");
  }, []);

  if (mut.isPending) return <Loader message="Entrando..." />;

  return (
    <div className="login-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate();
        }}
        className="login-form"
        aria-label="Formulário de login"
      >
        <h1 className="login-title">Acessar o Consultório Médico</h1>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="username"
            value={form.email}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Senha
          </label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>

        <button className="btn-salvar" type="submit">
          Entrar
        </button>

        {mut.isError && (
          <p className="text-red-600 text-sm" role="alert">
            Falha no login. Verifique e-mail e senha.
          </p>
        )}
      </form>
    </div>
  );
}
