import React from 'react';
import { BarChart3 } from 'lucide-react';
import AdminCard from '../AdminCard'; // Usado apenas como o container/casca
import './AdminChartVacinas.css';

export default function AdminChartVacinas({ dadosVacinas = [] }) {
  return (
    <AdminCard
      title="Quantidades Aplicadas por Vacina"
      icon={BarChart3}
      iconColor="#007BFF"
      subtitle="Visualização proporcional de doses aplicadas."
    >
      <div className="admin-chart-bars-container">

        {dadosVacinas.length === 0 ? (
          <p className="admin-empty-message">
            Nenhuma vacina aplicada encontrada.
          </p>
        ) : (

          dadosVacinas.map((item, index) => {
            const quantidade = Number(item.quantidade) || 0;
            const porcentagem = Number(item.porcentagem) || 0;

            return (
              <div key={index} className="chart-bar-row">

                <div className="chart-bar-info">
                  <span className="chart-vacine-name">{item.nome}</span>
                  <span className="chart-vacine-qty">
                    <strong>{quantidade}</strong> doses
                  </span>
                </div>

                <div className="chart-bar-bg">
                  <div
                    className="chart-bar-fill"
                    style={{
                      width: `${porcentagem}%`,
                      backgroundColor: item.cor || '#007BFF'
                    }}
                  />
                </div>

              </div>
            );
          })

        )}

      </div>
    </AdminCard>
  );
}