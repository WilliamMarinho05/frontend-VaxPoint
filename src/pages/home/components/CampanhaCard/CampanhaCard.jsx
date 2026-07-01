import React from 'react';
import { CalendarRange } from "lucide-react";
import './CampanhaCard.css';

function CampanhaCard({ campanha, onRegistrarIntencao }) {
  return (
    <div className="home-card-campanha-linear">
      <img src={campanha.imagem_url} alt={campanha.titulo} className="lista-campanha-thumb" />

      <div className="card-texto-alinhado">
        <div className="campanha-row-header">
          <h4 className="home-card-title">{campanha.titulo}</h4>
          <div className="home-badge-publico">{campanha.publico}</div>
        </div>

        <p className="home-card-periodo">
          <CalendarRange size={16} className="texto-icon" />
          <strong>Período:</strong> {campanha.periodo}
        </p>

        <p className="home-card-desc">{campanha.descricao}</p>

        <button className="home-btn-registrar-intencao" onClick={() => onRegistrarIntencao(campanha)}>
          Marcar Intenção de Vacinar
        </button>
      </div>
    </div>
  );
}

export default CampanhaCard;