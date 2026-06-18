import React, { useState, useEffect } from 'react';
import { Clock, Filter, Plus, CheckCircle, CalendarDays } from 'lucide-react';

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
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}><Clock size={26} color="#007BFF" /> Linha do Tempo de Vacinação</h2>
          <p style={styles.subtitle}>Histórico integrado e cronológico da sua imunização familiar e pet.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={styles.btnLaunch}><Plus size={16} /> Registrar Vacina</button>
      </header>

      {/* Barra de Filtros Rápidos */}
      <div style={styles.filterBar}>
        <span style={styles.filterLabel}><Filter size={16} /> Filtrar por:</span>
        <button onClick={() => setFiltro('TODOS')} style={filtro === 'TODOS' ? styles.btnActive : styles.btnInactive}>Ver Todas</button>
        <button onClick={() => setFiltro('HUMANO')} style={filtro === 'HUMANO' ? styles.btnActive : styles.btnInactive}>Só Minhas</button>
        <button onClick={() => setFiltro('PET')} style={filtro === 'PET' ? styles.btnActive : styles.btnInactive}>Só dos Pets</button>
      </div>

      {/* Linha do Tempo Vertical */}
      <div style={styles.timeline}>
        {eventosFiltrados.map(ev => (
          <div key={ev.id} style={styles.timelineItem}>
            <div style={styles.timelineDot}>
              {ev.status === 'CONCLUIDA' ? <CheckCircle size={20} color="#10B981" /> : <CalendarDays size={20} color="#007BFF" />}
            </div>
            <div style={styles.timelineContent}>
              <div style={styles.metaRow}>
                <span style={ev.tipo === 'HUMANO' ? styles.tagHumano : styles.tagPet}>{ev.tipo}</span>
                <span style={styles.dateText}>📅 {ev.data}</span>
              </div>
              <h4 style={styles.vacinaName}>{ev.vacina}</h4>
              <p style={styles.benefiText}>Aplica-se a: <strong>{ev.beneficiario}</strong></p>
              <span style={ev.status === 'CONCLUIDA' ? styles.statusPronto : styles.statusAgendado}>
                {ev.status === 'CONCLUIDA' ? 'Dose Aplicada' : 'Dose Planejada'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Reutilizável de Registro Mocado */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginBottom: '15px' }}>Registrar Dose de Vacina</h3>
            <form onSubmit={handleSalvarVacina}>
              <div style={styles.modalGroup}>
                <label style={styles.label}>Para quem?</label>
                <select value={perfil} onChange={(e) => setPerfil(e.target.value)} style={styles.input}>
                  <option value="HUMANO">Para Mim (Humano)</option>
                  <option value="PET">Para o Pet (Animal)</option>
                </select>
              </div>
              <div style={styles.modalGroup}>
                <label style={styles.label}>Nome da Vacina</label>
                <input type="text" placeholder="Ex: BCG ou V10" value={vacina} onChange={(e) => setVacina(e.target.value)} style={styles.input} />
              </div>
              <div style={styles.modalGroup}>
                <label style={styles.label}>Data da Aplicação / Planejamento</label>
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={styles.input} />
              </div>
              <div style={styles.modalGroup}>
                <label style={styles.label}>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.input}>
                  <option value="CONCLUIDA">Já tomei (Concluída)</option>
                  <option value="PLANEJADA">Quero planejar (Futura)</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.btnCancel}>Cancelar</button>
                <button type="submit" style={styles.btnSave}>Adicionar à Linha do Tempo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '30px 40px', maxWidth: '800px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', color: '#0A2540' },
  subtitle: { color: '#64748B', fontSize: '15px', marginTop: '5px' },
  btnLaunch: { padding: '10px 16px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  filterBar: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', backgroundColor: '#fff', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' },
  filterLabel: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: '600', color: '#64748B' },
  btnActive: { padding: '6px 12px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  btnInactive: { padding: '6px 12px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  timeline: { borderLeft: '3px solid #E2E8F0', paddingLeft: '20px', marginLeft: '10px' },
  timelineItem: { position: 'relative', marginBottom: '30px' },
  timelineDot: { position: 'absolute', left: '-32px', top: '2px', backgroundColor: '#F4F7FC', padding: '2px' },
  timelineContent: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' },
  metaRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' },
  tagHumano: { backgroundColor: '#EFF6FF', color: '#007BFF', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' },
  tagPet: { backgroundColor: '#ECFDF5', color: '#10B981', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' },
  dateText: { fontSize: '12px', color: '#94A3B8', fontWeight: '500' },
  vacinaName: { fontSize: '16px', fontWeight: '700', color: '#0A2540', marginBottom: '4px' },
  benefiText: { fontSize: '13px', color: '#64748B', marginBottom: '12px' },
  statusPronto: { fontSize: '12px', color: '#10B981', fontWeight: '600' },
  statusAgendado: { fontSize: '12px', color: '#007BFF', fontWeight: '600' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,37,64,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 },
  modalCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '450px' },
  modalGroup: { marginBottom: '15px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  btnCancel: { padding: '10px 14px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  btnSave: { padding: '10px 14px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};

export default Historico;