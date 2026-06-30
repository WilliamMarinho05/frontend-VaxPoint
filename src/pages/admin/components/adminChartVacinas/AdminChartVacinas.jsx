import React from 'react';
import { BarChart3 } from 'lucide-react';
import AdminCard from '../AdminCard'; // Usado apenas como o container/casca
import './AdminChartVacinas.css';

export default function AdminChartVacinas({ dadosVacinas = [] }) {
  return (
    <AdminCard
      title="Quantidades Aplicadas por Vacina (Pets)"
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
            const estoque = Number(item.estoque) || 0;
            const aplicadas = Number(item.aplicadas) || 0;

            const percentualUso = estoque > 0
              ? (aplicadas / estoque) * 100
              : 0;

            return (
              <div key={index} className="chart-bar-row">

                <div className="chart-bar-info">
                  <span className="chart-vacine-name">{item.nome}</span>

                  <span className="chart-vacine-qty">
                    <strong>{aplicadas}</strong> / {estoque} doses
                  </span>
                </div>

                {/* BARRA BASE (ESTOQUE TOTAL) */}
                <div className="chart-bar-bg">

                  {/* PARTE USADA */}
                  <div
                    className="chart-bar-fill"
                    style={{
                      width: `${percentualUso}%`,
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