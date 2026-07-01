import React, { useState, useEffect } from 'react';
import { Clock, Filter, CheckCircle, Calendar } from 'lucide-react';
import { historicoService } from '../../services/historicService'; 
import './Historico.css';

function Historico() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState('TODOS'); // TODOS, HUMANO, PET

  const carregarHistorico = async () => {
    try {
      const dados = await historicoService.getHistorico();
      
      const historicoFormatado = dados.map(item => ({
        id: item.id_historico,
        beneficiario: item.nome_pet ? `${item.nome_pet} (Pet)` : "Você",
        tipo: item.nome_pet ? 'PET' : 'HUMANO',
        vacina: item.nome_vacina,
        data: item.data_prevista,
        status: item.status
      }));

      setEventos(historicoFormatado);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      alert("Não foi possível carregar o histórico.");
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const eventosFiltrados = eventos.filter(ev => {
    if (filtro === 'TODOS') return true;
    return ev.tipo === filtro;
  });

  return (
    <div className="historico-container">
      <header className="historico-header">
        <div>
          <h2 className="historico-title"><Clock size={26} color="#007BFF" /> Linha do Tempo de Vacinação</h2>
          <p className="historico-subtitle">Histórico integrado e cronológico da sua imunização familiar e pet.</p>
        </div>
      </header>

      {/* Barra de Filtros Rápidos */}
      <div className="historico-filter-bar">
        <span className="historico-filter-label"><Filter size={16} /> Filtrar por:</span>
        <button onClick={() => setFiltro('TODOS')} className={filtro === 'TODOS' ? "historico-btn-active" : "historico-btn-inactive"}>Ver Todas</button>
        <button onClick={() => setFiltro('HUMANO')} className={filtro === 'HUMANO' ? "historico-btn-active" : "historico-btn-inactive"}>Só Minhas</button>
        <button onClick={() => setFiltro('PET')} className={filtro === 'PET' ? "historico-btn-active" : "historico-btn-inactive"}>Só dos Pets</button>
      </div>

      {/* Linha do Tempo Vertical */}
      <div className="historico-timeline">
        {eventosFiltrados.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            Nenhum registro encontrado no histórico.
          </p>
        ) : (
          eventosFiltrados.map(ev => (
            <div key={ev.id} className="historico-timeline-item">
              <div className="historico-timeline-dot">
                {ev.status === 'CONCLUIDA' || ev.status === 'Aplicada' ? <CheckCircle size={20} color="#10B981" /> : <CalendarDays size={20} color="#007BFF" />}
              </div>
              <div className="historico-timeline-content">
                <div className="historico-meta-row">
                  <span className={ev.tipo === 'HUMANO' ? "historico-tag-humano" : "historico-tag-pet"}>{ev.tipo}</span>
                  <span className="historico-date-text">
                    <Calendar size={14} className="historico-date-icon" />
                    {ev.data}
                  </span>
                </div>
                <h4 className="historico-vacina-name">{ev.vacina}</h4>
                <p className="historico-benefi-text">Aplica-se a: <strong>{ev.beneficiario}</strong></p>
                <span className=
                  {
                    ev.status === 'CONCLUIDA' || ev.status === 'Aplicada'
                    ? <CheckCircle size={20} className="historico-icon-success" />
                    : <Calendar size={20} className="historico-icon-default" />
                  }>
                  {ev.status === 'CONCLUIDA' || ev.status === 'Aplicada' ? 'Dose Aplicada' : 'Dose Planejada'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Historico;