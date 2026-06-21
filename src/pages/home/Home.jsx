import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Map, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import './Home.css';

function Home() {
  const [usuario, setUsuario] = useState({ nome: 'Cidadão' });
  const [currentBanner, setCurrentBanner] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState('postos');

  useEffect(() => {
    const userLogado = JSON.parse(localStorage.getItem('vaxpoint_user'));

    if (userLogado) {
      setUsuario(userLogado);
    }
  }, []);

  const [campanhas] = useState([
    {
      id: 1,
      titulo: "Campanha Antirrábica 2026",
      publico: "🐶 Cães e Gatos",
      periodo: "01 de Junho a 30 de Junho",
      descricao: "Proteja o seu melhor amigo!",
      imagemUrl: "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 2,
      titulo: "Mobilização Nacional Contra a Gripe",
      publico: "👥 População Geral",
      periodo: "Permanente",
      descricao: "Campanha de imunização anual.",
      imagemUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      titulo: "Vacinação Infantil",
      publico: "👶 Crianças",
      periodo: "15 de Julho a 31 de Agosto",
      descricao: "Atualização da caderneta infantil.",
      imagemUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
    }
  ]);

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
      alertaInstabilidade: true
    },
    {
      id: 103,
      nome: "USF Taquaralto",
      endereco: "Taquaralto, Palmas - TO",
      horario: "07:00 às 17:00",
      linkGoogleMaps: "https://www.google.com/maps/search/?api=1&query=Taquaralto+Palmas+TO",
      alertaInstabilidade: false
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === campanhas.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [campanhas.length]);

  const nextBanner = () => {
    setCurrentBanner((prev) =>
      prev === campanhas.length - 1 ? 0 : prev + 1
    );
  };

  const prevBanner = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? campanhas.length - 1 : prev - 1
    );
  };

  const getPosition = (index) => {
    const diff = index - currentBanner;

    if (diff === 0) return 'active';
    if (diff === 1 || diff === -2) return 'right';
    return 'left';
  };

  return (
    <div className="home-container">

      {/* 🔵 BLOCO 1: HEADER + CARROSSEL (HIERARQUIA PRINCIPAL) */}
      <section className="home-hero">

        <header className="home-banner">
          <div className="home-welcome-text">
            <h2 className="home-greeting">
              Olá, {usuario.nome.split(' ')[0]}
            </h2>
            <p className="home-subtitle">
              Veja as campanhas e postos disponíveis em Palmas
            </p>
          </div>
        </header>

        <section className="carousel-section">
          <div className="carousel-header">
            <h2>Campanhas</h2>
          </div>

          <div className="home-carousel">

            <button onClick={prevBanner} className="carousel-btn-arrow left">
              <ChevronLeft size={36} color="#fff" />
            </button>

            <div className="carousel-viewport">
              <div className="carousel-track">

                {campanhas.map((campanha, index) => (
                  <div
                    key={campanha.id}
                    className={`carousel-slide ${getPosition(index)}`}
                  >
                    <img
                      src={campanha.imagemUrl}
                      className="carousel-image"
                      alt={campanha.titulo}
                    />

                    <div className="carousel-info">
                      <h3>{campanha.titulo}</h3>
                      <p>{campanha.publico}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            <button onClick={nextBanner} className="carousel-btn-arrow right">
              <ChevronRight size={36} color="#fff" />
            </button>

          </div>
        </section>

      </section>

      {/* 🟡 BLOCO 2: CONTROLE (TOGGLE) */}
      <section className="home-controls">

        <div className="toggle-switch-container">
          <button
            className={`toggle-tab btn-postos ${abaAtiva === 'postos' ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva('postos')}
          >
            <MapPin size={18} /> Postos
          </button>

          <button
            className={`toggle-tab btn-campanhas ${abaAtiva === 'campanhas' ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva('campanhas')}
          >
            <Calendar size={18} /> Campanhas
          </button>
        </div>

      </section>

      {/* 🟢 BLOCO 3: CONTEÚDO */}
      <main className="home-main-content">

        {abaAtiva === 'postos' ? (
          <section className="home-section animate-fade">

            {postos.map(posto => (
              <div key={posto.id} className="home-card-posto-linear">

                {posto.alertaInstabilidade && (
                  <div className="home-alerta-estoque-box">
                    <AlertTriangle size={20} />
                    <span>
                      <strong>Alerta Comunitário:</strong> Relato de falta de estoque hoje!
                    </span>
                  </div>
                )}

                <div className="card-texto-alinhado">
                  <h4 className="home-card-title">{posto.nome}</h4>

                  <p className="home-posto-texto">
                    📍 <strong>Endereço:</strong> {posto.endereco}
                  </p>

                  <p className="home-posto-texto">
                    ⏰ <strong>Horário:</strong> {posto.horario}
                  </p>
                </div>

                {/* BOTÃO FORA DO BLOCO DE TEXTO */}
                <div className="home-card-actions">
                  <a
                    href={posto.linkGoogleMaps}
                    target="_blank"
                    rel="noreferrer"
                    className="home-btn-mapa"
                  >
                    <Map size={18} /> Ver no mapa
                  </a>
                </div>

              </div>
         ))}

          </section>
        ) : (
          <section className="home-section animate-fade">

            {campanhas.map(campanha => (
              <div key={campanha.id} className="home-card-campanha-linear">

                <img
                  src={campanha.imagemUrl}
                  alt={campanha.titulo}
                  className="lista-campanha-thumb"
                />

                <div className="card-texto-alinhado">

                  <div className="campanha-row-header">
                    <h4 className="home-card-title">{campanha.titulo}</h4>

                    <div className="home-badge-publico">
                      {campanha.publico}
                    </div>
                  </div>

                  <p className="home-card-periodo">
                    🗓️ <strong>Período:</strong> {campanha.periodo}
                  </p>

                  <p className="home-card-desc">
                    {campanha.descricao}
                  </p>

                </div>

              </div>
            ))}

          </section>
        )}

      </main>

    </div>
  );
}

export default Home;