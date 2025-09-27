import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const nav = useNavigate();

  function handleLogout() {
    localStorage.clear();
    nav("/login");
  }

  return (
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
          <button className="logout-btn" onClick={handleLogout}>Sair</button>
        </nav>
      </div>
    </header>
  );
}