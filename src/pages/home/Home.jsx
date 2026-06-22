import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Map, AlertTriangle, ChevronLeft, ChevronRight, Search, CheckCircle, Filter, Clock } from 'lucide-react';
import './Home.css';

function Home() {
  const [usuario, setUsuario] = useState({ nome: 'Maria Clara' });
  const [currentBanner, setCurrentBanner] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState('postos');

  // Filtros e Modais
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroRegiao, setFiltroRegiao] = useState('');
  const [postoSelecionado, setPostoSelecionado] = useState(null);
  const [intencaoVacina, setIntencaoVacina] = useState(null);
  const [targetVacina, setTargetVacina] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const meusPets = [
    { id: 'pet1', nome: 'Thor (Cachorro)' },
    { id: 'pet2', nome: 'Luna (Gata)' }
  ];

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
      vacinaNome: "Antirrábica",
      imagemUrl: "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 2,
      titulo: "Mobilização Nacional Contra a Gripe",
      publico: "👥 População Geral",
      periodo: "Permanente",
      descricao: "Campanha de imunização anual.",
      vacinaNome: "Gripe (Influenza)",
      imagemUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      titulo: "Vacinação Infantil",
      publico: "👶 Crianças",
      periodo: "15 de Julho a 31 de Agosto",
      descricao: "Atualização da caderneta infantil.",
      vacinaNome: "Tríplice Viral / BCG",
      imagemUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
    }
  ]);

  const [postos] = useState([
    {
      id: 101,
      nome: "USF 307 Norte (Posto Central)",
      endereco: "Arno 33, Alameda 2, Palmas - TO",
      regiao: "Norte",
      horario: "07:00 às 19:00",
      linkGoogleMaps: "https://www.google.com/maps/search/?api=1&query=USF+307+Norte+Palmas+TO",
      alertaInstabilidade: false,
      vacinasEstoque: ["Antirrábica", "Gripe (Influenza)", "Tríplice Viral", "Covid-19"]
    },
    {
      id: 102,
      nome: "Centro de Saúde das Arnos (Parque)",
      endereco: "Arno 42, APM 05, Palmas - TO",
      regiao: "Norte",
      horario: "08:00 às 18:00",
      linkGoogleMaps: "https://www.google.com/maps/search/?api=1&query=Centro+de+Saude+Arno+Palmas+TO",
      alertaInstabilidade: true,
      vacinasEstoque: ["Antirrábica", "Tríplice Viral"]
    },
    {
      id: 103,
      nome: "USF Taquaralto",
      endereco: "Taquaralto, Palmas - TO",
      regiao: "Sul",
      horario: "07:00 às 17:00",
      linkGoogleMaps: "https://www.google.com/maps/search/?api=1&query=Taquaralto+Palmas+TO",
      alertaInstabilidade: false,
      vacinasEstoque: ["Gripe (Influenza)", "Covid-19", "Febre Amarela"]
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

  const postosFiltrados = postos.filter(posto => {
    const matchBusca = posto.nome.toLowerCase().includes(filtroBusca.toLowerCase()) || 
                        posto.vacinasEstoque.some(v => v.toLowerCase().includes(filtroBusca.toLowerCase()));
    const matchRegiao = filtroRegiao === '' || posto.regiao === filtroRegiao;
    return matchBusca && matchRegiao;
  });

  const campanhasFiltradas = campanhas.filter(campanha =>
    campanha.titulo.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    campanha.vacinaNome.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  const handleSalvarIntencao = (e) => {
    e.preventDefault();
    const nomeDestinatario = targetVacina === 'humano' ? usuario.nome : meusPets.find(p => p.id === targetVacina)?.nome;

    setMensagemSucesso(`Intenção para "${nomeDestinatario}" registrada com sucesso!`);
    setIntencaoVacina(null);
    setTargetVacina('');
    setTimeout(() => setMensagemSucesso(''), 5000);
  };

  return (
    <div className="home-container">
      {mensagemSucesso && (
        <div className="home-toast-sucesso">
          <CheckCircle size={20} /> {mensagemSucesso}
        </div>
      )}

      {/* 🔵 BLOCO 1: HEADER + CARROSSEL */}
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

      {/* 🟡 BLOCO 2: FILTROS INTEGRADOS */}
      <section className="home-controls-wrapper">
        <div className="home-controls">
          <div className="toggle-switch-container">
            <button
              className={`toggle-tab btn-postos ${abaAtiva === 'postos' ? 'ativa' : ''}`}
              onClick={() => { setAbaAtiva('postos'); setFiltroBusca(''); }}
            >
              <MapPin size={18} /> Postos
            </button>

            <button
              className={`toggle-tab btn-campanhas ${abaAtiva === 'campanhas' ? 'ativa' : ''}`}
              onClick={() => { setAbaAtiva('campanhas'); setFiltroBusca(''); }}
            >
              <Calendar size={18} /> Campanhas
            </button>
          </div>
        </div>

        <div className="home-search-bar-grid">
          <div className="home-input-with-icon">
            <Search size={18} className="home-search-icon" />
            <input 
              type="text"
              placeholder={abaAtiva === 'postos' ? "Buscar por posto ou vacina..." : "Pesquisar por vacina..."}
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
              className="home-functional-input"
            />
          </div>

          {abaAtiva === 'postos' && (
            <div className="home-input-with-icon">
              <Filter size={18} className="home-search-icon" />
              <select 
                value={filtroRegiao} 
                onChange={(e) => setFiltroRegiao(e.target.value)}
                className="home-functional-select"
              >
                <option value="">Todas as Regiões</option>
                <option value="Norte">Região Norte</option>
                <option value="Sul">Região Sul</option>
              </select>
            </div>
          )}
        </div>
      </section>

      {/* 🟢 BLOCO 3: CONTEÚDO */}
      <main className="home-main-content">
        {abaAtiva === 'postos' ? (
          <section className="home-section animate-fade">
            {postosFiltrados.map(posto => (
              <div 
                key={posto.id} 
                className="home-card-posto-linear" 
                onClick={() => setPostoSelecionado(posto)}
              >
                {posto.alertaInstabilidade && (
                  <div className="home-alerta-estoque-box" onClick={(e) => e.stopPropagation()}>
                    <AlertTriangle size={18} />
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
                  <span className="home-click-indicator">💡 Clique no card para ver as vacinas disponíveis</span>
                </div>

                <div className="home-card-actions" onClick={(e) => e.stopPropagation()}>
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
            {campanhasFiltradas.map(campanha => (
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

                  <button 
                    className="home-btn-registrar-intencao"
                    onClick={() => setIntencaoVacina(campanha)}
                  >
                    Marcar Intenção de Vacinar
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* MODAL PERFIL DO POSTO */}
      {postoSelecionado && (
        <div className="home-modal-overlay" onClick={() => setPostoSelecionado(null)}>
          <div className="home-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{postoSelecionado.nome}</h3>
            <p className="home-modal-address">📍 {postoSelecionado.endereco}</p>
            <div className="home-modal-badge"><Clock size={14} /> Horário: {postoSelecionado.horario}</div>
            
            <hr className="home-modal-divider" />
            
            <h4>📋 Vacinas Disponíveis em Estoque:</h4>
            <div className="home-modal-stocks-grid">
              {postoSelecionado.vacinasEstoque.map((v, i) => (
                <div key={i} className="home-stock-item-tag">✓ {v}</div>
              ))}
            </div>

            <button className="home-modal-btn-close" onClick={() => setPostoSelecionado(null)}>Fechar</button>
          </div>
        </div>
      )}

      {/* MODAL INTENÇÃO */}
      {intencaoVacina && (
        <div className="home-modal-overlay" onClick={() => setIntencaoVacina(null)}>
          <div className="home-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Intenção</h3>
            <p style={{ margin: '10px 0', color: '#475569' }}>Deseja registrar interesse na vacina: <strong>{intencaoVacina.vacinaNome}</strong>?</p>
            
            <form onSubmit={handleSalvarIntencao} style={{ marginTop: '15px' }}>
              <label className="home-modal-label">Quem irá tomar a vacina?</label>
              <select 
                required
                className="home-modal-select"
                value={targetVacina}
                onChange={(e) => setTargetVacina(e.target.value)}
              >
                <option value="">Selecione o Beneficiário</option>
                <option value="humano">🙋‍♂️ Eu mesmo ({usuario.nome})</option>
                {meusPets.map(p => (
                  <option key={p.id} value={p.id}>🐾 {p.nome}</option>
                ))}
              </select>

              <div className="home-modal-actions-row">
                <button type="button" className="home-modal-btn-cancel" onClick={() => setIntencaoVacina(null)}>Cancelar</button>
                <button type="submit" className="home-modal-btn-confirm">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;