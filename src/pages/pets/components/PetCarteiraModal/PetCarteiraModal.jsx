import React from 'react';
import { Syringe, X, Calendar, ShieldAlert } from 'lucide-react';
import './PetCarteiraModal.css';

function PetCarteiraModal({ pet, historicoVacinas, onClose }) {
  if (!pet) return null;
  
  const vacinasDoPet = historicoVacinas[pet.id_pet] || [];

  return (
    <div className="pets-modal-overlay" onClick={onClose}>
      <div className="pets-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="pets-modal-header">
          <div className="pets-modal-title-box">
            {/* Atualizado para a cor --primary-blue */}
            <Syringe size={22} color="#007BFF" />
            <h3>Carteira de Vacinação: {pet.nome}</h3>
          </div>
          <button className="pets-modal-close-icon" onClick={onClose}><X size={20} /></button>
        </header>
        
        <div className="pets-modal-body">
          {vacinasDoPet.length > 0 ? (
            <div className="pets-timeline">
              {vacinasDoPet.map((item) => (
                <div key={item.id_historico} className="pets-timeline-item">
                  <div className="pets-timeline-marker"></div>
                  <div className="pets-timeline-content">
                    <h4 className="pets-timeline-vaccine">{item.nome_vacina}</h4>
                    <p className="pets-timeline-meta">
                      <span><Calendar size={13} />{item.data_aplicacao}</span>
                    </p>
                    <span className="pets-badge-status-applied">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pets-no-history">
              {/* Atualizado para a cor --text-light */}
              <ShieldAlert size={36} color="#94A3B8" />
              <p>Nenhuma vacina aplicada encontrada no banco para {pet.nome}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetCarteiraModal;