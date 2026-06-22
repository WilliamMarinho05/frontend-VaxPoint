import React, { useState } from 'react';
import './ModalIntencao.css';


function ModalIntencao({ intencaoVacina, usuario, meusPets, onClose, onSucesso }) {
  const [targetVacina, setTargetVacina] = useState('');

  // Se o modal não estiver ativo, não renderiza nada
  if (!intencaoVacina) return null;

  const handleSalvarIntencao = (e) => {
    e.preventDefault();
    
    // Descobre o nome do beneficiário com base na seleção
    const nomeDestinatario = targetVacina === 'humano' 
      ? usuario.nome 
      : meusPets.find(p => p.id === targetVacina)?.nome;

    // Dispara a função de sucesso passando o nome para o Toast da Home
    onSucesso(nomeDestinatario);
    
    // Reseta o estado interno do formulário
    setTargetVacina('');
  };

  return (
    <div className="home-modal-overlay" onClick={onClose}>
      <div className="home-modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Confirmar Intenção</h3>
        <p className="home-modal-text">
          Deseja registrar interesse na vacina: <strong>{intencaoVacina.vacinaNome || intencaoVacina.titulo}</strong>?
        </p>
        
        <form onSubmit={handleSalvarIntencao} className="home-modal-form">
          <label className="home-modal-label">Quem irá tomar a vacina?</label>
          <select 
            required
            className="home-modal-select"
            value={targetVacina}
            onChange={(e) => setTargetVacina(e.target.value)}
          >
            <option value="">Selecione o Beneficiário</option>
            <option value="humano">🙋‍♂️ Eu mesmo ({usuario?.nome})</option>
            {meusPets.map(p => (
              <option key={p.id} value={p.id}>🐾 {p.nome}</option>
            ))}
          </select>

          <div className="home-modal-actions-row">
            <button type="button" className="home-modal-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="home-modal-btn-confirm">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalIntencao;