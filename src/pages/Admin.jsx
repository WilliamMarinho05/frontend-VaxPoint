import React, { useState } from 'react';
import { ShieldAlert, Package, CalendarPlus } from 'lucide-react';

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
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}><ShieldAlert size={26} color="#DC2626" /> Painel de Controle do Administrador</h2>
        <p style={styles.subtitle}>Gerenciamento institucional de insumos, postos e campanhas de saúde pública.</p>
      </header>

      <div style={styles.grid}>
        {/* Bloco 1: Abastecimento de Estoque */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}><Package size={18} color="#DC2626" /> Atualizar Insumos de Postos</h3>
          <form onSubmit={handleAtualizarEstoque}>
            <div style={styles.group}>
              <label style={styles.label}>Selecione o Ponto de Atendimento</label>
              <select value={posto} onChange={(e) => setPosto(e.target.value)} style={styles.select}>
                <option value="USF 307 Norte">USF 307 Norte (Posto Central)</option>
                <option value="Centro de Saúde das Arnos">Centro de Saúde das Arnos (Parque)</option>
              </select>
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Insumo / Vacina</label>
              <select value={vacina} onChange={(e) => setVacina(e.target.value)} style={styles.select}>
                <option value="BCG">BCG</option>
                <option value="Influenza">Influenza (Gripe)</option>
                <option value="Antirrábica">Antirrábica Animal</option>
                <option value="V10 Canina">V10 Canina</option>
              </select>
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Quantidade de Doses Disponibilizadas</label>
              <input type="number" placeholder="Ex: 150" value={qtd} onChange={(e) => setQtd(e.target.value)} style={styles.input} />
            </div>
            <button type="submit" style={styles.btnAdmin}>Atualizar Lote no Sistema</button>
          </form>
        </div>

        {/* Bloco 2: Lançamento de Campanhas */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}><CalendarPlus size={18} color="#007BFF" /> Publicar Nova Campanha Geral</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Nova campanha veiculada com sucesso na Home do cidadão!'); }}>
            <div style={styles.group}>
              <label style={styles.label}>Título Oficial da Campanha</label>
              <input type="text" placeholder="Ex: Campanha de Multivacinação" style={styles.input} />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Vigência (Período)</label>
              <input type="text" placeholder="Ex: De 10 a 25 de Julho" style={styles.input} />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Descrição / Orientações do Ministério</label>
              <textarea placeholder="Diretrizes da campanha..." style={{ ...styles.input, height: '80px', resize: 'none' }}></textarea>
            </div>
            <button type="submit" style={{ ...styles.btnAdmin, backgroundColor: '#007BFF' }}>Publicar Campanha Informativa</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px 40px', maxWidth: '1100px', margin: '0 auto' },
  header: { marginBottom: '30px' },
  title: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', color: '#0A2540' },
  subtitle: { color: '#64748B', fontSize: '15px', marginTop: '5px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' },
  cardTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#0A2540' },
  group: { marginBottom: '15px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#475569' },
  select: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', outline: 'none' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC' },
  btnAdmin: { width: '100%', padding: '12px', backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }
};

export default Admin;