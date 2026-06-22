import React, { useState } from 'react';
import { ShieldAlert, Package, CalendarPlus, BarChart3, Users, Syringe, AlertTriangle, ShieldCheck } from 'lucide-react';
import './Admin.css';

function Admin() {
  const [posto, setPosto] = useState('USF 307 Norte');
  const [vacina, setVacina] = useState('BCG');
  const [qtd, setQtd] = useState('');

  // Dados mockados de métricas do sistema
  const [metricas] = useState({
    totalAplicadas: 1420,
    totalUsuarios: 850,
    alertasFaltaEstoque: 1,
    taxaSucesso: "98.4%"
  });

  const [dadosVacinas] = useState([
    { nome: "Antirrábica", quantidade: 540, porcentagem: 85, cor: "#10b981" },
    { nome: "Influenza (Gripe)", quantidade: 420, porcentagem: 68, cor: "#007bff" },
    { nome: "BCG", quantidade: 290, porcentagem: 45, cor: "#f59e0b" },
    { nome: "V10 Canina", quantidade: 170, porcentagem: 28, cor: "#ec4899" }
  ]);

  const handleAtualizarEstoque = (e) => {
    e.preventDefault();
    if (!qtd) return alert('Insira a quantidade de doses!');
    alert(`Estoque atualizado: ${posto} agora conta com +${qtd} doses de ${vacina}.`);
    setQtd('');
  };

  return (
    <div className="admin-container animate-fade">
      <header className="admin-header">
        <div className="admin-header-main">
          <h2 className="admin-title">
            <ShieldAlert size={26} color="#DC2626" /> Painel de Controle do Administrador
          </h2>
          <div className="admin-badge-status">
            <ShieldCheck size={16} /> Modo Admin Ativo
          </div>
        </div>
        <p className="admin-subtitle">Gerenciamento institucional de insumos, postos e monitoramento de métricas de saúde pública.</p>
      </header>

      {/* NOVO SEÇÃO: CARDS DE MÉTRICAS RÁPIDAS */}
      <section className="admin-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrapper blue">
            <Syringe size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Doses Aplicadas</span>
            <h3 className="metric-value">{metricas.totalAplicadas}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper green">
            <Users size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Usuários Ativos</span>
            <h3 className="metric-value">{metricas.totalUsuarios}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper orange">
            <BarChart3 size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Meta Atingida</span>
            <h3 className="metric-value">{metricas.taxaSucesso}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrapper red">
            <AlertTriangle size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Alertas de Estoque</span>
            <h3 className="metric-value">{metricas.alertasFaltaEstoque}</h3>
          </div>
        </div>
      </section>

      {/* NOVO SEÇÃO: VISUALIZAÇÃO GRÁFICA DE MÉTRICAS */}
      <section className="admin-chart-section">
        <div className="admin-card">
          <h3 className="admin-card-title"><BarChart3 size={18} color="#007BFF" /> Quantidades Aplicadas por Vacina</h3>
          <p className="admin-chart-subtitle">Visualização proporcional de doses aplicadas no município.</p>
          
          <div className="admin-chart-bars-container">
            {dadosVacinas.map((item, index) => (
              <div key={index} className="chart-bar-row">
                <div className="chart-bar-info">
                  <span className="chart-vacine-name">{item.nome}</span>
                  <span className="chart-vacine-qty"><strong>{item.quantidade}</strong> doses</span>
                </div>
                <div className="chart-bar-bg">
                  <div 
                    className="chart-bar-fill" 
                    style={{ width: `${item.porcentagem}%`, backgroundColor: item.cor }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEUS DOIS BLOCOS DE FORMULÁRIO ORIGINAIS */}
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