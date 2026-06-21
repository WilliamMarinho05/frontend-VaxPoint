import React, { useState } from 'react';
import { ShieldAlert, Package, CalendarPlus } from 'lucide-react';
import './Admin.css';

function Admin() {
  const [posto, setPosto] = useState('USF 307 Norte');
  const [vacina, setVacina] = useState('BCG');
  const [qtd, setQtd] = useState('');

  const handleAtualizarEstoque = (e) => {
    e.preventDefault();
    if (!qtd) return alert('Insira a quantidade de doses!');
    alert(`Estoque atualizado: ${posto} agora conta com +${qtd} doses de ${vacina}.`);
    setQtd('');
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2 className="admin-title"><ShieldAlert size={26} color="#DC2626" /> Painel de Controle do Administrador</h2>
        <p className="admin-subtitle">Gerenciamento institucional de insumos, postos e campanhas de saúde pública.</p>
      </header>

      <div className="admin-grid">
        {/* Bloco 1: Abastecimento de Estoque */}
        <div className="admin-card">
          <h3 className="admin-card-title"><Package size={18} color="#DC2626" /> Atualizar Insumos de Postos</h3>
          <form onSubmit={handleAtualizarEstoque}>
            <div className="admin-group">
              <label className="admin-label">Selecione o Ponto de Atendimento</label>
              <select value={posto} onChange={(e) => setPosto(e.target.value)} className="admin-select">
                <option value="USF 307 Norte">USF 307 Norte (Posto Central)</option>
                <option value="Centro de Saúde das Arnos">Centro de Saúde das Arnos (Parque)</option>
              </select>
            </div>
            <div className="admin-group">
              <label className="admin-label">Insumo / Vacina</label>
              <select value={vacina} onChange={(e) => setVacina(e.target.value)} className="admin-select">
                <option value="BCG">BCG</option>
                <option value="Influenza">Influenza (Gripe)</option>
                <option value="Antirrábica">Antirrábica Animal</option>
                <option value="V10 Canina">V10 Canina</option>
              </select>
            </div>
            <div className="admin-group">
              <label className="admin-label">Quantidade de Doses Disponibilizadas</label>
              <input type="number" placeholder="Ex: 150" value={qtd} onChange={(e) => setQtd(e.target.value)} className="admin-input" />
            </div>
            <button type="submit" className="admin-btn admin-btn-danger">Atualizar Lote no Sistema</button>
          </form>
        </div>

        {/* Bloco 2: Lançamento de Campanhas */}
        <div className="admin-card">
          <h3 className="admin-card-title"><CalendarPlus size={18} color="#007BFF" /> Publicar Nova Campanha Geral</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Nova campanha veiculada com sucesso na Home do cidadão!'); }}>
            <div className="admin-group">
              <label className="admin-label">Título Oficial da Campanha</label>
              <input type="text" placeholder="Ex: Campanha de Multivacinação" className="admin-input" />
            </div>
            <div className="admin-group">
              <label className="admin-label">Vigência (Período)</label>
              <input type="text" placeholder="Ex: De 10 a 25 de Julho" className="admin-input" />
            </div>
            <div className="admin-group">
              <label className="admin-label">Descrição / Orientações do Ministério</label>
              <textarea placeholder="Diretrizes da campanha..." className="admin-input admin-textarea"></textarea>
            </div>
            <button type="submit" className="admin-btn admin-btn-primary">Publicar Campanha Informativa</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;