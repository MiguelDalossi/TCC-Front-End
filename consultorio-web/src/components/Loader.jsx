// src/components/Loader.jsx
import React from "react";
import "./Loader.css"; // estilos opcionais (animação do spinner)

const Loader = ({ message = "Carregando..." }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loader;
