import React, { useState, useEffect } from 'react';
import './ModalIntencao.css';

function ModalIntencao({ intencaoVacina, usuario, meusPets, onClose, onSucesso }) {
  const [targetVacina, setTargetVacina] = useState('');
  const [postoEscolhido, setPostoEscolhido] = useState('');

  // Reseta escolhas internas ao fechar/abrir outro modal
  useEffect(() => {
    setTargetVacina('');
    setPostoEscolhido('');
  }, [intencaoVacina]);

  if (!intencaoVacina) return null;

  // Filtra a lista de pets para mostrar apenas a espécie que combina com a campanha
  const petsValidosParaCampanha = meusPets.filter(pet => {
    if (intencaoVacina.publico === 'Cachorro') return pet.especie === 'Cachorro';
    if (intencaoVacina.publico === 'Gato') return pet.especie === 'Gato';
    return false;
  });

  const handleSalvarIntencao = (e) => {
    e.preventDefault();
    if (!targetVacina || !postoEscolhido) return;
    
    const nomeDestinatario = targetVacina === 'humano' 
      ? usuario.nome 
      : meusPets.find(p => p.id_pet === parseInt(targetVacina))?.nome;

    onSucesso(nomeDestinatario, targetVacina, postoEscolhido);
  };

  return (
    <div className="home-modal-overlay" onClick={onClose}>
      <div className="home-modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Confirmar Intenção</h3>
        <p className="home-modal-text">
          Deseja registrar interesse na vacina: <strong>{intencaoVacina.vacinaNome || intencaoVacina.titulo}</strong>?
        </p>
        
        <form onSubmit={handleSalvarIntencao} className="home-modal-form">
          
          {/* SELEÇÃO DO BENEFICIÁRIO BASEADO NO PÚBLICO DA CAMPANHA */}
          <div className="home-modal-field-group">
            <label className="home-modal-label">Quem irá tomar a vacina?</label>
            <select 
              required
              className="home-modal-select"
              value={targetVacina}
              onChange={(e) => setTargetVacina(e.target.value)}
            >
              <option value="">Selecione o Beneficiário</option>
              
              {/* Opção Humana só aparece se o público da campanha for Humano */}
              {intencaoVacina.publico === 'Humano' && (
                <option value="humano">🙋‍♂️ Eu mesmo ({usuario?.nome})</option>
              )}
              
              {/* Lista apenas pets que batem com a espécie correta do pet requisitado */}
              {(intencaoVacina.publico === 'Cachorro' || intencaoVacina.publico === 'Gato') && 
                petsValidosParaCampanha.map(p => (
                  <option key={p.id_pet} value={p.id_pet}>🐾 {p.nome} ({p.especie})</option>
                ))
              }
            </select>

            {/* Aviso inteligente caso o usuário precise vacinar um pet mas não tenha a espécie cadastrada */}
            {intencaoVacina.publico !== 'Humano' && petsValidosParaCampanha.length === 0 && (
              <p className="modal-warning-text">⚠️ Você não possui nenhum {intencaoVacina.publico.toLowerCase()} cadastrado.</p>
            )}
          </div>

          {/* NOVO CAMPO: SELEÇÃO DE POSTOS OBRIGATÓRIA DA RELAÇÃO DA CAMPANHA */}
          <div className="home-modal-field-group">
            <label className="home-modal-label">Selecione o Posto para Atendimento:</label>
            <select
              required
              className="home-modal-select"
              value={postoEscolhido}
              onChange={(e) => setPostoEscolhido(e.target.value)}
            >
              <option value="">Selecione um local disponível...</option>
              {intencaoVacina.postos && intencaoVacina.postos.length > 0 ? (
                intencaoVacina.postos.map(p => (
                  <option key={p.id} value={p.id}>📍 {p.nome} - {p.endereco.split(',')[1] || p.endereco}</option>
                ))
              ) : (
                <option value="" disabled>Nenhum posto cadastrado nesta campanha</option>
              )}
            </select>
          </div>

          <div className="home-modal-actions-row">
            <button type="button" className="home-modal-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="home-modal-btn-confirm" 
              disabled={intencaoVacina.publico !== 'Humano' && petsValidosParaCampanha.length === 0}
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalIntencao;