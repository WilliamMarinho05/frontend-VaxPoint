import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Map, AlertTriangle } from 'lucide-react';
import './Home.css';

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
    <div className="home-container">
      {/* Banner de Boas-Vindas */}
      <header className="home-banner">
        <h2 className="home-greeting">Olá, {usuario.nome.split(' ')[0]}!</h2>
        <p className="home-subtitle">Mantenha a sua saúde e a do seu pet em dia. Veja as informações em Palmas.</p>
      </header>

      <div className="home-grid-main">
        
        {/* Lado Esquerdo: Campanhas Ativas */}
        <section className="home-section">
          <h3 className="home-section-title"><Calendar size={22} color="#007BFF" /> Campanhas Ativas</h3>
          <div className="home-cards-list">
            {campanhas.map(campanha => (
              <div key={campanha.id} className="home-card-campanha">
                <div className="home-badge-publico">{campanha.publico}</div>
                <h4 className="home-card-title">{campanha.titulo}</h4>
                <p className="home-card-periodo">🗓️ <strong>Período:</strong> {campanha.periodo}</p>
                <p className="home-card-desc">{campanha.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lado Direito: Postos e Pontos de Atendimento */}
        <section className="home-section">
          <h3 className="home-section-title"><MapPin size={22} color="#10B981" /> Postos de Vacinação</h3>
          <div className="home-cards-list">
            {postos.map(posto => (
              <div key={posto.id} className="home-card-posto">
                
                {/* Alerta de instabilidade mocado para a banca ver (RF-16) */}
                {posto.alertaInstabilidade && (
                  <div className="home-alerta-estoque">
                    <AlertTriangle size={16} /> 
                    <span>Alerta Comunitário: Relato de falta de estoque hoje!</span>
                  </div>
                )}

                <h4 className="home-card-title">{posto.nome}</h4>
                <p className="home-posto-texto"> {posto.endereco}</p>
                <p className="home-posto-texto"> {posto.horario}</p>
                
                {/* Atalho Inteligente para o Google Maps */}
                <a 
                  href={posto.linkGoogleMaps} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="home-btn-mapa"
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

export default Home;