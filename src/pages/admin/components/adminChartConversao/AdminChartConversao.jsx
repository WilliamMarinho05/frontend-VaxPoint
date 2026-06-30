import React from 'react';
import { BarChart3 } from 'lucide-react';
import AdminCard from '../AdminCard';
import './AdminChartConversao.css';

export default function AdminChartConversao({ dadosConversao = [] }) {
  return (
    <AdminCard
      title="Conversão: Aplicações por Vacina"
      icon={BarChart3}
      iconColor="#f59e0b"
      subtitle="Total de doses aplicadas por tipo de vacina."
    >
      <div className="admin-chart-bars-container">

        {dadosConversao.length === 0 ? (
          <p className="admin-empty-message">
            Nenhum dado de conversão encontrado.
          </p>
        ) : (

          dadosConversao.map((item, index) => {
            const aplicacoes = Number(item.aplicacoes) || 0;

            // segurança visual
            const max = Math.max(...dadosConversao.map(d => Number(d.aplicacoes) || 0), 1);
            const perc = (aplicacoes / max) * 100;

            return (
              <div key={index} className="chart-bar-row conversion-row">

                <div className="chart-bar-info">
                  <span className="chart-vacine-name">
                    {item.nome}
                  </span>
                </div>

                <div className="conversion-bars-wrapper">

                  <div className="conversion-line">
                    <div className="chart-bar-bg custom-height">
                      <div
                        className="chart-bar-fill bg-green"
                        style={{ width: `${perc}%` }}
                      />
                    </div>

                    <span className="conversion-label">
                      {aplicacoes} Aplicações
                    </span>
                  </div>

                </div>

              </div>
            );
          })

        )}

      </div>
    </AdminCard>
  );
}