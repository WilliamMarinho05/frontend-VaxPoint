import React from 'react';
import { MapPin, Map, AlertTriangle } from 'lucide-react';
import './PostoCard.css';
function PostoCard({ posto, onClick }) {
  return (
    <div className="home-card-posto-linear" onClick={onClick}>
      {Boolean(posto.alertaInstabilidade) && (
        <div className="home-alerta-estoque-box" onClick={(e) => e.stopPropagation()}>
          <AlertTriangle size={20} />
          <span>
            <strong>Alerta Comunitário:</strong> Relato de falta de estoque hoje!
          </span>
        </div>
      )}

      <div className="card-texto-alinhado">
        <h4 className="home-card-title">{posto.nome}</h4>
        <p className="home-posto-texto">
          📍 <strong>Endereço:</strong> {posto.endereco}
        </p>
        <p className="home-posto-texto">
          ⏰ <strong>Horário:</strong> {posto.horario}
        </p>
        <span className="home-click-indicator">💡 Clique no card para ver as vacinas disponíveis</span>
      </div>

      <div className="home-card-actions" onClick={(e) => e.stopPropagation()}>
        <a href={posto.linkGoogleMaps} target="_blank" rel="noreferrer" className="home-btn-mapa">
          <Map size={18} /> Ver no mapa
        </a>
      </div>
    </div>
  );
}

export default PostoCard;