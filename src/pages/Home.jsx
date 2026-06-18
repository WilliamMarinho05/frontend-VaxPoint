import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Map, AlertTriangle } from 'lucide-react';

function Home() {
  // Pegar o usuário logado para dar as boas-vindas personalizado
  const [usuario, setUsuario] = useState({ nome: 'Cidadão' });

  useEffect(() => {
    const userLogado = JSON.parse(localStorage.getItem('vaxpoint_user'));
    if (userLogado) {
      setUsuario(userLogado);
    }
  }, []);

  // Dados Fictícios de Campanhas Ativas (Mocado)
  const [campanhas] = useState([
    {
      id: 1,
      titulo: "Campanha Antirrábica 2026",
      publico: "Cães e Gatos",
      periodo: "01 de Junho a 30 de Junho",
      descricao: "Proteja o seu melhor amigo! Vacinação gratuita para animais a partir dos 3 meses de idade em todos os postos parceiros."
    },
    {
      id: 2,
      titulo: "Mobilização Nacional Contra a Gripe",
      publico: "População Geral (Humana)",
      periodo: "Permanente",
      descricao: "Campanha de imunização anual contra a Influenza. Garanta a sua dose e evite complicações respiratórias no inverno."
    }
  ]);

  // Dados Fictícios de Postos de Saúde com Simulação de Alerta (RF-16)
  const [postos] = useState([
    {
      id: 101,
      nome: "USF 307 Norte (Posto Central)",
      endereco: "Arno 33, Alameda 2, Palmas - TO",
      horario: "07:00 às 19:00",
      linkGoogleMaps: "https://www.google.com/maps/search/?api=1&query=USF+307+Norte+Palmas+TO",
      alertaInstabilidade: false
    },
    {
      id: 102,
      nome: "Centro de Saúde das Arnos (Parque)",
      endereco: "Arno 42, APM 05, Palmas - TO",
      horario: "08:00 às 18:00",
      linkGoogleMaps: "https://www.google.com/maps/search/?api=1&query=Centro+de+Saude+Arno+Palmas+TO",
      alertaInstabilidade: true // Alerta Comunitário de Falta de Estoque ativo!
    }
  ]);

  return (
    <div style={styles.container}>
      {/* Banner de Boas-Vindas */}
      <header style={styles.banner}>
        <h2 style={styles.greeting}>Olá, {usuario.nome.split(' ')[0]}!</h2>
        <p style={styles.subtitle}>Mantenha a sua saúde e a do seu pet em dia. Veja as informações em Palmas.</p>
      </header>

      <div style={styles.gridMain}>
        
        {/* Lado Esquerdo: Campanhas Ativas */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}><Calendar size={22} color="#007BFF" /> Campanhas Ativas</h3>
          <div style={styles.cardsList}>
            {campanhas.map(campanha => (
              <div key={campanha.id} style={styles.cardCampanha}>
                <div style={styles.badgePublico}>{campanha.publico}</div>
                <h4 style={styles.cardTitle}>{campanha.titulo}</h4>
                <p style={styles.cardPeriodo}>🗓️ <strong>Período:</strong> {campanha.periodo}</p>
                <p style={styles.cardDesc}>{campanha.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lado Direito: Postos e Pontos de Atendimento */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}><MapPin size={22} color="#10B981" /> Postos de Vacinação</h3>
          <div style={styles.cardsList}>
            {postos.map(posto => (
              <div key={posto.id} style={styles.cardPosto}>
                
                {/* Alerta de instabilidade mocado para a banca ver (RF-16) */}
                {posto.alertaInstabilidade && (
                  <div style={styles.alertaEstoque}>
                    <AlertTriangle size={16} /> 
                    <span>Alerta Comunitário: Relato de falta de estoque hoje!</span>
                  </div>
                )}

                <h4 style={styles.cardTitle}>{posto.nome}</h4>
                <p style={styles.postoTexto}> {posto.endereco}</p>
                <p style={styles.postoTexto}> {posto.horario}</p>
                
                {/* Atalho Inteligente para o Google Maps */}
                <a 
                  href={posto.linkGoogleMaps} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={styles.btnMapa}
                >
                  <Map size={16} /> Ver Localização no Mapa
                </a>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// Estilos inline para o painel principal
const styles = {
  container: {
    padding: '30px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  banner: {
    backgroundColor: '#0A2540',
    color: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '35px',
    boxShadow: '0 4px 15px rgba(10, 37, 64, 0.1)',
  },
  greeting: {
    fontSize: '26px',
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    marginTop: '5px',
    fontSize: '15px',
  },
  gridMain: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#0A2540',
  },
  cardsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cardCampanha: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    borderLeft: '5px solid #007BFF',
    position: 'relative',
  },
  badgePublico: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: '#EFF6FF',
    color: '#007BFF',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0A2540',
    marginBottom: '8px',
  },
  cardPeriodo: {
    fontSize: '13px',
    color: '#64748B',
    marginBottom: '10px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.5',
  },
  cardPosto: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    borderLeft: '5px solid #10B981',
  },
  alertaEstoque: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '15px',
    border: '1px solid #FEE2E2',
  },
  postoTexto: {
    fontSize: '14px',
    color: '#475569',
    marginBottom: '6px',
  },
  btnMapa: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '15px',
    backgroundColor: '#F1F5F9',
    color: '#334155',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  }
};

export default Home;