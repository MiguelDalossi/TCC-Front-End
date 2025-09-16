import React, { useState } from "react";
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

  if (mut.isPending) return <Loader message="Entrando..." />;

  return (
    <div className="max-w-sm mx-auto mt-20 border rounded p-6 space-y-4">
      <h1 className="text-xl font-semibold">Acessar</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate();
        }}
        className="space-y-3"
      >
        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Entrar
        </button>

        {mut.isError && (
          <p className="text-red-600 text-sm">
            Falha no login. Verifique e-mail e senha.
          </p>
        )}
      </form>
    </div>
  );
}
