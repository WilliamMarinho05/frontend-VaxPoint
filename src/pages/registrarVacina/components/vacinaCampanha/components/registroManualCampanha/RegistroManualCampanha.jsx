// components/RegistroManualCampanha.jsx
import React, { useState, useEffect } from 'react';
import campaignService from '../../../../../../services/campaignService';
import { buscarPetsAPI } from '../../../../../../services/PetService';

import './RegistroManualCampanha.css';

function RegistroManualCampanha({ dadosUsuario, idPosto, onSucesso }) {
  const [campanhas, setCampanhas] = useState([]);
  const [pets, setPets] = useState([]);
  
  const [campanhaSelecionada, setCampanhaSelecionada] = useState('');
  const [candidatoSelecionado, setCandidatoSelecionado] = useState('');
  
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const [dadosCampanhas, dadosPets] = await Promise.all([
          campaignService.getCampaigns(idPosto),
          campaignService.getUserPets(dadosUsuario.id_usuario)
        ]);
        setCampanhas(dadosCampanhas || []);
        setPets(dadosPets || []);
      } catch (error) {
        alert("Erro ao buscar dados complementares: " + (error.error || error));
      } finally {
        setCarregando(false);
      }
    }
    if (dadosUsuario?.id_usuario) {
      carregarDadosIniciais();
    }
  }, [idPosto, dadosUsuario]);

  useEffect(() => {
    setCandidatoSelecionado('');
  }, [campanhaSelecionada]);

  const obterCampanhaAtual = () => {
    return campanhas.find(c => c.id_campanha === Number(campanhaSelecionada));
  };

  const obterCandidatosCompativeis = () => {
    const campanha = obterCampanhaAtual();
    if (!campanha) return [];

    let compativeis = [];
    
    if (campanha.publico === 'Humano') {
      // Proteção no dadosUsuario?.nome
      compativeis.push({ id: 'humano', nome: dadosUsuario?.nome || 'Cidadão (Titular)' });
    } else {
      // 1ª PROTEÇÃO CRÍTICA: Garante que pets é uma lista antes de usar .filter()
      const listaPets = Array.isArray(pets) ? pets : [];
      
      // 2ª PROTEÇÃO: Garante que a espécie existe no pet antes de dar toLowerCase()
      const petsCompativeis = listaPets.filter(p => 
        p.especie && p.especie.toLowerCase() === campanha.publico.toLowerCase()
      );
      
      petsCompativeis.forEach(p => {
        compativeis.push({ id: p.id_pet, nome: p.nome, tag: p.especie });
      });
    }
    
    return compativeis;
  };

  const candidatosCompativeis = obterCandidatosCompativeis();
  const campanhaAtiva = obterCampanhaAtual();

  const handleSalvarManual = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const isPet = candidatoSelecionado !== 'humano';
      const payload = {
        id_usuario: dadosUsuario.id_usuario,
        id_posto: idPosto,
        id_campanha: campanhaSelecionada,
        id_pet: isPet ? candidatoSelecionado : null
      };

      await campaignService.registerManualApplication(payload);
      alert("Sucesso! Vacina aplicada e estoque reduzido.");
      
      if (onSucesso) onSucesso(); 
    } catch (error) {
      alert("Erro ao salvar aplicação: " + (error.error || error));
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return <p className="vax-loading-text">Carregando dados necessários...</p>;

  return (
    <div className="registro-manual-container animate-fade-in">
      <h4>Inscrição Direta em Campanha</h4>
      <p className="descricao-manual">Cidadão sem agendamento prévio. Escolha uma campanha e o paciente compatível.</p>

      <form onSubmit={handleSalvarManual} className="form-grupo">
        
        <select
          value={campanhaSelecionada}
          onChange={(e) => setCampanhaSelecionada(e.target.value)}
          required
          disabled={salvando}
          className="select-vax"
        >
          <option value="">Selecione a Campanha Vigente</option>
          {campanhas.map((c) => (
            <option key={c.id_campanha} value={c.id_campanha}>
              {c.titulo} — {c.nome_vacina} (Público: {c.publico})
            </option>
          ))}
        </select>

        {campanhaSelecionada && (
          <div className="bloco-paciente animate-fade-in" style={{ marginTop: '15px' }}>
            {candidatosCompativeis.length === 0 ? (
              <div className="alerta-validacao erro">
                <span className="icone-info">⚠️</span>
                <p>
                  {/* 3ª PROTEÇÃO CRÍTICA: Adicionado a interrogação campanhaAtiva?.publico */}
                  <strong>Nenhum paciente compatível!</strong> A campanha é para <strong>{campanhaAtiva?.publico}s</strong>, 
                  mas não há nenhum registro desse tipo vinculado a este usuário.
                </p>
              </div>
            ) : (
              <>
                <select
                  value={candidatoSelecionado}
                  onChange={(e) => setCandidatoSelecionado(e.target.value)}
                  required
                  disabled={salvando}
                  className="select-vax select-destaque"
                >
                  <option value="">Selecione quem vai tomar a vacina</option>
                  {candidatosCompativeis.map((cand) => (
                    <option key={cand.id} value={cand.id}>
                      {cand.nome} {cand.tag ? `(${cand.tag})` : ''}
                    </option>
                  ))}
                </select>

                <div className="alerta-validacao sucesso" style={{ marginTop: '10px' }}>
                  <span className="icone-info">✅</span>
                  <p>Regra atendida: Público-alvo compatível com a campanha.</p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="botoes-acoes" style={{ marginTop: '25px' }}>
          <button type="button" onClick={onSucesso} className="btn-voltar" disabled={salvando}>
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-confirmar" 
            disabled={!campanhaSelecionada || !candidatoSelecionado || salvando}
          >
            {salvando ? 'Registrando...' : 'Registrar Vacina'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistroManualCampanha;