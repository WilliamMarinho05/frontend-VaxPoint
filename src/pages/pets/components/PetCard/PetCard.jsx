import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import './PetCard.css';

function PetCard({ pet, onVerCarteira, onEditar, onDeletar, calcularIdade }) {
  return (
    <div className="pets-card" onClick={() => onVerCarteira(pet)}>
      <div className="pets-card-actions">
        <button onClick={(e) => onEditar(pet, e)} className="pets-action-icon edit">
          <Edit2 size={14} />
        </button>
        <button onClick={(e) => onDeletar(pet.id_pet, e)} className="pets-action-icon delete">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="pets-avatar-wrapper">
        {pet.foto_url ? (
          <img src={pet.foto_url} alt={pet.nome} className="pets-avatar-img" />
        ) : (
          <div className="pets-avatar-placeholder">
            {pet.especie === 'Cachorro' ? '🐶' : '🐱'}
          </div>
        )}
      </div>

      <h4 className="pets-name">{pet.nome}</h4>
      <span className="pets-raca-badge">{pet.nome_raca}</span>
      
      <div className="pets-info-box">
        <p className="pets-info"><strong>Idade:</strong> {calcularIdade(pet.data_nascimento)}</p>
        <p className="pets-info"><strong>Porte:</strong> {pet.porte} ({pet.peso} kg)</p>
        <p className="pets-info"><strong>Sexo:</strong> {pet.sexo}</p>
        <p className="pets-info"><strong>Microchip/RGA:</strong> {pet.numero_microchip || 'Não informado'}</p>
      </div>
      
      <span className="pets-click-badge">📋 Ver Carteira</span>
    </div>
  );
}

export default PetCard;