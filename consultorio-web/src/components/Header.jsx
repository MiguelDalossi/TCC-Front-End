import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../service/auth";

const FOTO_PADRAO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function Header() {
  const nav = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = getCurrentUser();

  function handleLogout() {
    localStorage.clear();
    nav("/login");
  }

  return (
    <>
      <header className="header" style={{
        background: "#90ee90",
        padding: "1rem",
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "2rem"
      }}>
        <div className="header-content">
          <h1 style={{ margin: 0, color: "#215c21" }}>Consultório Médico</h1>
          <nav>
            <Link to="/" className="nav-link">Agenda</Link>
            <Link to="/pacientes" className="nav-link">Pacientes</Link>
            <Link to="/medicos" className="nav-link">Médicos</Link>
            <Link to="/consultas" className="nav-link">Consultas</Link>
            <Link to="/financeiro" className="nav-link">Financeiro</Link> {/* <-- Adicione esta linha */}
            {user?.role === "Admin" && (
              <Link to="/usuarios/novo" className="nav-link">Cadastrar</Link>
            )}
            <button className="logout-btn" onClick={handleLogout}>Sair</button>
            <button
              className="user-btn"
              style={{
                marginLeft: 12,
                background: "#b6fcb6",
                border: "none",
                borderRadius: "50%",
                width: 38,
                height: 38,
                padding: 0,
                cursor: "pointer",
                verticalAlign: "middle",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 2px #90ee90"
              }}
              title="Ver usuário"
              onClick={() => setDrawerOpen(true)}
            >
              <img
                src={user?.fotoUrl || FOTO_PADRAO}
                alt="Usuário"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  background: "#b6fcb6",
                  border: "2px solid #90ee90"
                }}
              />
            </button>
          </nav>
        </div>
      </header>

      {/* Drawer lateral */}
      <div
        className="user-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: drawerOpen ? 0 : "-320px",
          width: 320,
          height: "100vh",
          background: "#fff",
          boxShadow: "-2px 0 12px #0002",
          transition: "right 0.3s, visibility 0.3s, pointer-events 0.3s",
          zIndex: 1000,
          padding: "2rem 1.5rem",
          pointerEvents: drawerOpen ? "auto" : "none",
          visibility: drawerOpen ? "visible" : "hidden"
        }}
        aria-hidden={!drawerOpen}
      >
        <button
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer"
          }}
          aria-label="Fechar"
          onClick={() => setDrawerOpen(false)}
        >
          ×
        </button>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <img
            src={user?.fotoUrl || FOTO_PADRAO}
            alt="Foto do usuário"
            style={{ width: 90, height: 90, borderRadius: "50%", marginBottom: 16, border: "2px solid #90ee90" }}
          />
          <h2 style={{ margin: "0 0 8px 0", fontSize: 22 }}>{user?.fullName || "Usuário"}</h2>
          <div style={{ color: "#555", marginBottom: 8 }}>
            <strong>Email:</strong> {user?.email || "-"}
          </div>
          <div style={{ color: "#555", marginBottom: 8 }}>
            <strong>Perfil:</strong> {user?.role || "-"}
          </div>
        </div>
      </div>

      {/* Overlay para fechar o drawer ao clicar fora */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "#0003",
            zIndex: 999
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
}