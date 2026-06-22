import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

import { buscarPostos, buscarCampanhas } from '../../services/infoService';

import ModalPosto from '../../components/ModalPosto/ModalPosto'; 
import FilterBar from '../../components/FilterBar/FilterBar';
import PostoCard from '../../components/PostoCard/PostoCard';
import CampanhaCard from '../../components/CampanhaCard/CampanhaCard';
import Carousel from '../../components/Carousel/Carousel'; 
import ModalIntencao from '../../components/ModalIntencao/ModalIntencao';

import './Home.css';

function Home() {
  const [usuario, setUsuario] = useState({ nome: 'Maria Clara' });
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

  const postosFiltrados = postos.filter(posto => {
    const termo = filtroBusca.toLowerCase();
    const nome = (posto?.nome || '').toLowerCase();
    const endereco = (posto?.endereco || '').toLowerCase();
    
    const bateComBusca = nome.includes(termo) || endereco.includes(termo);
    
    let bateComRegiao = true;
    if (filtroRegiao === 'Norte') {
      bateComRegiao = endereco.includes('norte');
    } else if (filtroRegiao === 'Sul') {
      bateComRegiao = !endereco.includes('norte');
    }

    return bateComBusca && bateComRegiao;
  });

  const campanhasFiltradas = campanhas.filter(campanha =>
    (campanha?.titulo || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
    (campanha?.vacinaNome || '').toLowerCase().includes(filtroBusca.toLowerCase())
  );

  const lidarComSucessoIntencao = (nomeDestinatario) => {
    setMensagemSucesso(`Intenção para "${nomeDestinatario}" registrada com sucesso!`);
    setIntencaoVacina(null);
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
          <Carousel campanhas={campanhas} />
        </section>
      </section>

      {/* BLOCO 2: FILTROS */}
      <FilterBar 
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        filtroBusca={filtroBusca}
        setFiltroBusca={setFiltroBusca}
        filtroRegiao={filtroRegiao}
        setFiltroRegiao={setFiltroRegiao}
      />

      {/* BLOCO 3: CONTEÚDO (POSTOS / CAMPANHAS) */}
      <main className="home-main-content">
        {abaAtiva === 'postos' ? (
          <section className="home-section animate-fade">
            {postosFiltrados.map(posto => (
              <PostoCard 
                key={posto.id}
                posto={posto}
                onClick={() => setPostoSelecionado(posto)}
              />
            ))}
          </section>
        ) : (
          <section className="home-section animate-fade">
            {campanhasFiltradas.map(campanha => (
              <CampanhaCard 
                key={campanha.id}
                campanha={campanha}
                onRegistrarIntencao={setIntencaoVacina}
              />
            ))}
          </section>
        )}
      </main>

      {/* MODAIS */}
      <ModalPosto 
        posto={postoSelecionado} 
        onClose={() => setPostoSelecionado(null)} 
      />

      <ModalIntencao 
        intencaoVacina={intencaoVacina}
        usuario={usuario}
        meusPets={meusPets}
        onClose={() => setIntencaoVacina(null)}
        onSucesso={lidarComSucessoIntencao}
      />
    </div>
  );
}

export default Home;