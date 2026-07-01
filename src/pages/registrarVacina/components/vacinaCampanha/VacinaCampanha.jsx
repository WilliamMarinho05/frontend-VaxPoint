// VacinaCampanha.jsx
import React, { useState, useEffect } from 'react';
import BuscaFilaCampanha from './components/buscaFilaCampanha/BuscaFilaCampanha';
import RegistroManualCampanha from './components/registroManualCampanha/RegistroManualCampanha';
import campaignService from '../../../../services/campaignService'; 
import vaccinationService from '../../../../services/vaccinationService';

import './VacinaCampanha.css';
import '.././CardAtendimento.css';

function VacinaCampanha() {
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  
  // Estados para os Postos do Banco
  const [idPosto, setIdPosto] = useState(''); 
  const [postos, setPostos] = useState([]);
  const [carregandoPostos, setCarregandoPostos] = useState(true);

  // Estados de controle da fila de intenções
  const [intencoes, setIntencoes] = useState([]);
  const [dadosUsuario, setDadosUsuario] = useState(null); 
  const [pesquisado, setPesquisado] = useState(false);
  const [modoManual, setModoManual] = useState(false);
  const [erroUsuario, setErroUsuario] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Carrega a lista de postos direto do banco de dados ao montar o componente
  useEffect(() => {
    async function carregarPostosIniciais() {
      try {
        const dados = await vaccinationService.getHealthPosts();
        setPostos(dados || []);
      } catch (error) {
        console.error("Erro ao carregar postos no componente:", error);
        alert("Não foi possível carregar a lista de postos de saúde.");
      } finally {
        setCarregandoPostos(false);
      }
    }
    carregarPostosIniciais();
  }, []);

  const handleBuscarCidadao = async (e) => {
    e.preventDefault();
    if (!email || !dataNascimento || !idPosto) {
      alert("Por favor, selecione o Posto de Atendimento primeiro.");
      return;
    }

    setErroUsuario('');
    setPesquisado(false);
    setCarregando(true);
    setModoManual(false); 

    try {
      const res = await campaignService.checkIntentions(email, dataNascimento, idPosto);
      setIntencoes(res.intencoes || []);
      setDadosUsuario(res.user); 
      setPesquisado(true);
    } catch (error) {
      if (error.error && error.error.includes("Cidadão não encontrado")) {
        setErroUsuario("Cidadão não encontrado no sistema. Verifique o e-mail e a data de nascimento.");
      } else {
        alert("Erro ao conectar com o servidor: " + (error.error || error));
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleLimparCampos = () => {
    setEmail('');
    setDataNascimento('');
    setIntencoes([]);
    setDadosUsuario(null);
    setPesquisado(false);
    setModoManual(false);
    setErroUsuario('');
  };

  return (
    <section className="card-atendimento">
      <h3>Controle de Campanhas Vigentes</h3>
      <p>Gerencie o fluxo de vacinação em massa selecionando o posto atual e buscando agendamentos prévios.</p>
      
      <form onSubmit={handleBuscarCidadao} className="form-grupo" style={{ marginTop: '20px' }}>
        
        {/* SELECT DINÂMICO CONECTADO AO VACCINATIONSERVICE */}
        <div className="form-linha-unica" style={{ marginBottom: '12px' }}>
          <select 
            value={idPosto} 
            onChange={(e) => { setIdPosto(e.target.value); setPesquisado(false); }}
            disabled={carregando || carregandoPostos}
            required
            className="select-vax-posto"
          >
            <option value="">
              {carregandoPostos ? "-- Carregando Postos de Saúde... --" : " Selecione o Posto de Saúde Onde Você Está Atendendo "}
            </option>
            {postos.map((posto) => (
              <option key={posto.id_posto} value={posto.id_posto}>
                {posto.nome_posto} 
              </option>
            ))}
          </select>
        </div>

        <div className="form-linha">
          <input 
            type="email" 
            placeholder="E-mail do Cidadão" 
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErroUsuario(''); }}
            disabled={carregando}
            required
          />

          <input 
            type="date" 
            value={dataNascimento}
            onChange={(e) => { setDataNascimento(e.target.value); setErroUsuario(''); }}
            disabled={carregando}
            max={new Date().toLocaleDateString('en-CA')}
            required
            title="Data de Nascimento do Cidadão"
          />
        </div>
        
        {erroUsuario && <div className="msg-erro-usuario">{erroUsuario}</div>}

        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <button type="submit" className="btn-secundario" disabled={carregando || !idPosto}>
            {carregando ? 'Buscando...' : 'Pesquisar Cidadão'}
          </button>
          {pesquisado && (
            <button type="button" onClick={handleLimparCampos} className="btn-voltar" style={{ padding: '10px 20px' }}>
              Limpar
            </button>
          )}
        </div>
      </form>

      {pesquisado && (
        <div className="container-interno-abas animate-fade-in" style={{ marginTop: '24px' }}>
          <div className="abas-navegacao">
            <button 
              className={`aba-item ${!modoManual ? 'ativa' : ''}`}
              onClick={() => setModoManual(false)}
            >
              Intenções na Fila ({intencoes.length})
            </button>
            <button 
              className={`aba-item ${modoManual ? 'ativa' : ''}`}
              onClick={() => setModoManual(true)}
            >
              Registrar Aplicação Direta
            </button>
          </div>

          <div className="painel-conteudo-aba">
            {!modoManual ? (
              <BuscaFilaCampanha 
                intencoes={intencoes}
                setIntencoes={setIntencoes}
                idPosto={idPosto} 
                onAlternarModo={() => setModoManual(true)} 
              />
            ) : (
              <RegistroManualCampanha 
                dadosUsuario={dadosUsuario}
                idPosto={idPosto} 
                onSucesso={handleLimparCampos}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default VacinaCampanha;