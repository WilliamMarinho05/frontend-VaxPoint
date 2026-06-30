import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { CheckCircle } from 'lucide-react';

import { buscarPetsAPI } from '../../services/petService';
import { buscarPostos, buscarCampanhas, registrarIntencaoAPI } from '../../services/infoService';

import ModalPosto from './components/ModalPosto/ModalPosto'; 
import FilterBar from './components/FilterBar/FilterBar';
import PostoCard from './components/PostoCard/PostoCard';
import CampanhaCard from './components/CampanhaCard/CampanhaCard';
import Carousel from './components/Carousel/Carousel'; 
import ModalIntencao from '../../components/ModalIntencao/ModalIntencao';

import './Home.css';

function Home() {
  const navigate = useNavigate();

  // 1. Inicializa pegando o usuário real do localStorage imediatamente
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('vaxpoint_user');
    return salvo ? JSON.parse(salvo) : null;
  });

  const [abaAtiva, setAbaAtiva] = useState('postos');
  const [postos, setPostos] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [meusPets, setMeusPets] = useState([]);
  const [vacinasHumanas, setVacinasHumanas] = useState([]);
  const [vacinasPets, setVacinasPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroBusca, setFiltroBusca] = useState(''); 
  const [vacinasSelecionadas, setVacinasSelecionadas] = useState([]); 
  const [filtroRegiao, setFiltroRegiao] = useState(''); 
  const [filtroPublico, setFiltroPublico] = useState(''); 
  
  const [postoSelecionado, setPostoSelecionado] = useState(null);
  const [intencaoVacina, setIntencaoVacina] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

// PROTEÇÃO DE ROTA E CARREGAMENTO DE DADOS (Tudo em 1)
  useEffect(() => {
    // 1. Verificação de segurança (usando o estado que já foi lido no topo)
    const token = localStorage.getItem("vaxpoint_token");

    if (!token || !usuario) {

      navigate("/login");
      return;
    }

    // 3. Carrega os pets cruzando com o ID do dono
    buscarPetsAPI()
      .then(dados => setMeusPets(dados || []))
      .catch(err => console.error(err));
    }, [usuario, navigate]);

  // 3. Carrega Postos e Campanhas do Banco
  useEffect(() => {
    const token = localStorage.getItem("vaxpoint_token");
    if (!token) return;
    const carregarDados = async () => {
      try {
        const [postosData, campanhasData] = await Promise.all([
          buscarPostos(),
          buscarCampanhas()
        ]);

        setPostos(postosData || []);
        setCampanhas(campanhasData || []);

        const vHumanas = [];
        postosData.forEach(p => {
          p.vacinas?.forEach(v => {
            if (!vHumanas.includes(v.nome)) vHumanas.push(v.nome);
          });
        });
        setVacinasHumanas(vHumanas);

        const vPets = [];
        campanhasData.forEach(c => {
          if ((c.publico === 'Cachorro' || c.publico === 'Gato') && c.vacinaNome) {
            if (!vPets.includes(c.vacinaNome)) vPets.push(c.vacinaNome);
          }
        });
        setVacinasPets(vPets);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // 4. Filtragem de Postos Fixo (Apenas Vacinas Humanas)
  const postosFiltrados = postos.filter(posto => {
    const termo = filtroBusca.toLowerCase();
    const nome = (posto?.nome || '').toLowerCase();
    const endereco = (posto?.endereco || '').toLowerCase();
    
    const bateComTexto = nome.includes(termo) || endereco.includes(termo);

    let bateComRegiao = true;
    if (filtroRegiao === 'Norte') {
      bateComRegiao = endereco.includes('norte');
    } else if (filtroRegiao === 'Sul') {
      bateComRegiao = !endereco.includes('norte');
    }

    let bateComVacinas = true;
    if (vacinasSelecionadas.length > 0) {
      bateComVacinas = vacinasSelecionadas.some(vacinaNome => 
        posto?.vacinas?.some(v => v.nome === vacinaNome && v.quantidade > 0)
      );
    }

    return bateComTexto && bateComRegiao && bateComVacinas;
  });

  // 5. Filtragem Inteligente de Campanhas Cruzando Dados de Postos Parceiros
  const campanhasFiltradas = campanhas.filter(campanha => {
    const termo = filtroBusca.toLowerCase();
    const bateComTexto = (campanha?.titulo || '').toLowerCase().includes(termo) ||
                         (campanha?.vacinaNome || '').toLowerCase().includes(termo);

    let bateComPublico = true;
    if (filtroPublico) {
      bateComPublico = campanha.publico === filtroPublico;
    }

    let bateComRegiao = true;
    if (filtroRegiao && campanha.postos) {
      if (filtroRegiao === 'Norte') {
        bateComRegiao = campanha.postos.some(p => (p.endereco || '').toLowerCase().includes('norte'));
      } else if (filtroRegiao === 'Sul') {
        bateComRegiao = campanha.postos.some(p => !(p.endereco || '').toLowerCase().includes('norte'));
      }
    }

    let bateComVacinas = true;
    if (vacinasSelecionadas.length > 0) {
      bateComVacinas = vacinasSelecionadas.includes(campanha.vacinaNome);
    }

    return bateComTexto && bateComPublico && bateComRegiao && bateComVacinas;
  });

  const lidarComSucessoIntencao = async (nomeDestinatario, targetVacina, idPostoEscolhido) => {
    try {
      const dadosParaEnviar = {
          idPosto: parseInt(idPostoEscolhido),
          idVacina: intencaoVacina.id_vacina,
          idCampanha: intencaoVacina.id,
          idPet: targetVacina === "humano"
              ? null
              : parseInt(targetVacina)
      };

      const resultado = await registrarIntencaoAPI(dadosParaEnviar);

      if (resultado.success) {
        setMensagemSucesso(`Intenção para "${nomeDestinatario}" registrada com sucesso!`);
        setIntencaoVacina(null);
        setTimeout(() => setMensagemSucesso(''), 5000);
      } else {
        alert("Erro ao salvar intenção.");
      }
    } catch (error) {
      console.error(error);
      alert("Houve um erro de comunicação ao salvar a intenção.");
    }
  };

  if (loading) {
    return <div className="loading-placeholder">Carregando dados do VaxPoint...</div>;
  }

  return (
    <div className="home-container">
      {mensagemSucesso && (
        <div className="home-toast-sucesso">
          <CheckCircle size={20} /> {mensagemSucesso}
        </div>
      )}

      <section className="home-hero">
        <header className="home-banner">
          <div className="home-welcome-text">
            <h2 className="home-greeting">Olá, {usuario?.nome?.split(' ')[0]}</h2>
            <p className="home-subtitle">Veja as campanhas e postos disponíveis em Palmas</p>
          </div>
        </header>

        <section className="carousel-section">
          <div className="carousel-header"><h2>Campanhas em Destaque</h2></div>
          <Carousel 
            campanhas={[...campanhas]
              .sort((a, b) => b.id - a.id) 
              .slice(0, 5)                  
            } 
          />
        </section>
      </section>

      <FilterBar 
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        filtroBusca={filtroBusca}
        setFiltroBusca={setFiltroBusca}
        vacinasHumanas={vacinasHumanas}
        vacinasPets={vacinasPets}
        vacinasSelecionadas={vacinasSelecionadas}
        setVacinasSelecionadas={setVacinasSelecionadas}
        filtroRegiao={filtroRegiao}
        setFiltroRegiao={setFiltroRegiao}
        filtroPublico={filtroPublico}
        setFiltroPublico={setFiltroPublico}
      />

      <main className="home-main-content">
        {abaAtiva === 'postos' ? (
          <section className="home-section animate-fade">
            {postosFiltrados.map(posto => (
              <PostoCard key={posto.id} posto={posto} onClick={() => setPostoSelecionado(posto)} />
            ))}
            {postosFiltrados.length === 0 && (
              <p className="no-data-alert">Nenhum posto encontrado com os filtros selecionados.</p>
            )}
          </section>
        ) : (
          <section className="home-section animate-fade">
            {campanhasFiltradas.map(campanha => (
              <CampanhaCard key={campanha.id} campanha={campanha} onRegistrarIntencao={setIntencaoVacina} />
            ))}
            {campanhasFiltradas.length === 0 && (
              <p className="no-data-alert">Nenhuma campanha encontrada com os filtros selecionados.</p>
            )}
          </section>
        )}
      </main>

      <ModalPosto posto={postoSelecionado} onClose={() => setPostoSelecionado(null)} />
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