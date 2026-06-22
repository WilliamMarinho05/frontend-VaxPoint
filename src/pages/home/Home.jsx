import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Map, AlertTriangle, ChevronLeft, ChevronRight, Search, CheckCircle, Filter } from 'lucide-react';
import { buscarPostos, buscarCampanhas } from '../../services/infoService';
import ModalPosto from '../../components/ModalPosto'; 
import './Home.css';

function Home() {
  const [usuario, setUsuario] = useState({ nome: 'Maria Clara' });
  const [currentBanner, setCurrentBanner] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState('postos');

  // Estados de dados da API
  const [postos, setPostos] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [postosData, campanhasData] = await Promise.all([
          buscarPostos(),
          buscarCampanhas()
        ]);

        setPostos(postosData || []);
        setCampanhas(campanhasData || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (campanhas.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === campanhas.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [campanhas]);

  const nextBanner = () => {
    if (campanhas.length === 0) return;

    setCurrentBanner((prev) =>
      prev === campanhas.length - 1 ? 0 : prev + 1
    );
  };

  const prevBanner = () => {
    if (campanhas.length === 0) return;

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
      const termo = filtroBusca.toLowerCase();
      const nome = (posto?.nome || '').toLowerCase();
      const endereco = (posto?.endereco || '').toLowerCase();
      
      return nome.includes(termo) || endereco.includes(termo);
  });

  const campanhasFiltradas = campanhas.filter(campanha =>
    (campanha?.titulo || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
    (campanha?.vacinaNome || '').toLowerCase().includes(filtroBusca.toLowerCase())
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

      {/* BLOCO 1: HEADER + CARROSSEL */}
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
                {campanhas.length > 0 ? (
                  campanhas.map((campanha, index) => (
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
                  ))
                ) : (
                  <div className="carousel-empty">
                    Nenhuma campanha disponível.
                  </div>
                )}
              </div>
            </div>

            <button onClick={nextBanner} className="carousel-btn-arrow right">
              <ChevronRight size={36} color="#fff" />
            </button>
          </div>
        </section>
      </section>

      {/* BLOCO 2: FILTROS INTEGRADOS */}
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

      {/* BLOCO 3: CONTEÚDO */}
      <main className="home-main-content">
        {abaAtiva === 'postos' ? (
          <section className="home-section animate-fade">
            {postosFiltrados.map(posto => (
              <div 
                key={posto.id} 
                className="home-card-posto-linear" 
                onClick={() => setPostoSelecionado(posto)}
              >
                {Boolean(posto.alertaInstabilidade) && (
                  <div className="home-alerta-estoque-box" onClick={(e) => e.stopPropagation()}>
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

      {/* MODAL DO POSTO (IMPORTADO E SEGURO) */}
      <ModalPosto 
        posto={postoSelecionado} 
        onClose={() => setPostoSelecionado(null)} 
      />

      {/* MODAL INTENÇÃO */}
      {intencaoVacina && (
        <div className="home-modal-overlay" onClick={() => setIntencaoVacina(null)}>
          <div className="home-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Intenção</h3>
            <p className="home-modal-text">
              Deseja registrar interesse na vacina: <strong>{intencaoVacina.vacinaNome || intencaoVacina.titulo}</strong>?
            </p>
            
            <form onSubmit={handleSalvarIntencao} className="home-modal-form">
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