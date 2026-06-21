import React, { useState, useEffect } from 'react';
import { Clock, Filter, Plus, CheckCircle, CalendarDays } from 'lucide-react';
import './Historico.css';

function Historico() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState('TODOS'); // TODOS, HUMANO, PET
  const [showModal, setShowModal] = useState(false);

  // Campos do pequeno Modal de Inserção
  const [perfil, setPerfil] = useState('HUMANO');
  const [vacina, setVacina] = useState('');
  const [data, setData] = useState('');
  const [status, setStatus] = useState('CONCLUIDA');

  useEffect(() => {
    const historicoInicial = [
      { id: 1, beneficiario: "Maria Clara", tipo: "HUMANO", vacina: "Gripe (Influenza)", data: "2026-05-10", status: "CONCLUIDA" },
      { id: 2, beneficiario: "Thor (Pet)", tipo: "PET", vacina: "Antirrábica Canina", data: "2026-06-01", status: "CONCLUIDA" },
      { id: 3, beneficiario: "Maria Clara", tipo: "HUMANO", vacina: "Tríplice Viral (Reforço)", data: "2026-08-15", status: "PLANEJADA" }
    ];
    const salvos = JSON.parse(localStorage.getItem('vaxpoint_historico')) || historicoInicial;
    setEventos(salvos);
    if (!localStorage.getItem('vaxpoint_historico')) {
      localStorage.setItem('vaxpoint_historico', JSON.stringify(historicoInicial));
    }
  }, []);

  const handleSalvarVacina = (e) => {
    e.preventDefault();
    if (!vacina || !data) { return alert('Preencha a vacina e a data!'); }

    const novoRegistro = {
      id: Date.now(),
      beneficiario: perfil === 'HUMANO' ? "Maria Clara" : "Thor (Pet)",
      tipo: perfil,
      vacina,
      data,
      status
    };

    const novaLista = [novoRegistro, ...eventos];
    setEventos(novaLista);
    localStorage.setItem('vaxpoint_historico', JSON.stringify(novaLista));
    setShowModal(false);
    setVacina('');
    setData('');
  };

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
        <button onClick={() => setShowModal(true)} className="historico-btn-launch"><Plus size={16} /> Registrar Vacina</button>
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
        {eventosFiltrados.map(ev => (
          <div key={ev.id} className="historico-timeline-item">
            <div className="historico-timeline-dot">
              {ev.status === 'CONCLUIDA' ? <CheckCircle size={20} color="#10B981" /> : <CalendarDays size={20} color="#007BFF" />}
            </div>
            <div className="historico-timeline-content">
              <div className="historico-meta-row">
                <span className={ev.tipo === 'HUMANO' ? "historico-tag-humano" : "historico-tag-pet"}>{ev.tipo}</span>
                <span className="historico-date-text">📅 {ev.data}</span>
              </div>
              <h4 className="historico-vacina-name">{ev.vacina}</h4>
              <p className="historico-benefi-text">Aplica-se a: <strong>{ev.beneficiario}</strong></p>
              <span className={ev.status === 'CONCLUIDA' ? "historico-status-pronto" : "historico-status-agendado"}>
                {ev.status === 'CONCLUIDA' ? 'Dose Aplicada' : 'Dose Planejada'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Reutilizável de Registro Mocado */}
      {showModal && (
        <div className="historico-modal-overlay">
          <div className="historico-modal-card">
            <h3 className="historico-modal-title">Registrar Dose de Vacina</h3>
            <form onSubmit={handleSalvarVacina}>
              <div className="historico-modal-group">
                <label className="historico-modal-label">Para quem?</label>
                <select value={perfil} onChange={(e) => setPerfil(e.target.value)} className="historico-modal-input">
                  <option value="HUMANO">Para Mim (Humano)</option>
                  <option value="PET">Para o Pet (Animal)</option>
                </select>
              </div>
              <div className="historico-modal-group">
                <label className="historico-modal-label">Nome da Vacina</label>
                <input type="text" placeholder="Ex: BCG ou V10" value={vacina} onChange={(e) => setVacina(e.target.value)} className="historico-modal-input" />
              </div>
              <div className="historico-modal-group">
                <label className="historico-modal-label">Data da Aplicação / Planejamento</label>
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="historico-modal-input" />
              </div>
              <div className="historico-modal-group">
                <label className="historico-modal-label">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="historico-modal-input">
                  <option value="CONCLUIDA">Já tomei (Concluída)</option>
                  <option value="PLANEJADA">Quero planejar (Futura)</option>
                </select>
              </div>
              <div className="historico-modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="historico-btn-cancel">Cancelar</button>
                <button type="submit" className="historico-btn-save">Adicionar à Linha do Tempo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Historico;