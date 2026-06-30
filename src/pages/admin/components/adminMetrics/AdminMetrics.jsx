import React from 'react';
import { Syringe, Users, BarChart3, AlertTriangle } from 'lucide-react';
import './AdminMetrics.css'; // Arquivo de estilo exclusivo

export default function AdminMetrics({ metricas }) {
  if (!metricas) return <p>Carregando métricas...</p>;

  return (
    <section className="admin-metrics-grid">
      <div className="metric-card">
        <div className="metric-icon-wrapper blue"><Syringe size={22} /></div>
        <div className="metric-data">
          <span className="metric-label">Doses Aplicadas</span>
          <h3 className="metric-value">{metricas.totalAplicadas}</h3>
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-icon-wrapper green"><Users size={22} /></div>
        <div className="metric-data">
          <span className="metric-label">Usuários Ativos</span>
          <h3 className="metric-value">{metricas.totalUsuarios}</h3>
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-icon-wrapper red"><AlertTriangle size={22} /></div>
        <div className="metric-data">
          <span className="metric-label">Alertas de Estoque</span>
          <h3 className="metric-value">{metricas.alertasFaltaEstoque}</h3>
        </div>
      </div>
    </section>
  );
}