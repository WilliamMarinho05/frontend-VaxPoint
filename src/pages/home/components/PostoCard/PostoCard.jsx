import React from 'react';
import { MapPin, Map, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { atualizarAlertaPostoAPI } from '../../../../services/infoService'; // Importação correta do serviço
import './PostoCard.css';

function PostoCard({ posto, onClick, usuarioLogado, onAtualizarPosto }) {
  
  const eAdmin = usuarioLogado?.is_admin === 1;

  const alternarAlertaAdmin = async (e) => {
    e.stopPropagation(); // Impede de abrir o modal do posto
    
    try {
      const novoStatusAlerta = posto.alertaInstabilidade ? 0 : 1;
      
      // Chamada usando a função limpa do infoService
      await atualizarAlertaPostoAPI(posto.id, novoStatusAlerta);

      // Avisa a Home para atualizar a listagem na tela
      if (onAtualizarPosto) onAtualizarPosto();

    } catch (error) {
      console.error("Erro ao atualizar alerta do posto:", error);
      alert("Não foi possível alterar o status do alerta.");
    }
  };

  return (
    <div className="home-card-posto-linear" onClick={onClick}>
      
      {Boolean(posto.alertaInstabilidade) && (
        <div className="home-alerta-estoque-box" onClick={(e) => e.stopPropagation()}>
          <AlertTriangle size={20} />
          <span>
            <strong>Alerta Oficial:</strong> Este posto está temporariamente sem doses desta vacina!
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

        {eAdmin && (
          <div className="admin-zone-alert" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className={`btn-admin-toggle ${posto.alertaInstabilidade ? 'ativo' : ''}`}
              onClick={alternarAlertaAdmin}
            >
              {posto.alertaInstabilidade ? <ToggleRight size={20} color="#ef4444" /> : <ToggleLeft size={20} />}
              <span>{posto.alertaInstabilidade ? "Desativar Alerta" : "Sinalizar Falta de Doses"}</span>
            </button>
          </div>
        )}

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