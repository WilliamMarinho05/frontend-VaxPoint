// components/BuscaFilaCampanha.jsx
import React, { useState } from 'react';
import campaignService from '../../../../../../services/campaignService';
import './BuscaFilaCampanha.css';

const obterEstiloPublico = (idPet, especiePet) => {
  if (!idPet) {
    return { icone: '👤', classe: 'vax-tag-humano', texto: 'Humano', eAnimal: false };
  }
  
  const especie = especiePet?.toLowerCase();
  if (especie === 'cachorro' || especie === 'cão' || especie === 'cao') {
    return { icone: '🐶', classe: 'vax-tag-pet-cachorro', texto: 'Cachorro', eAnimal: true };
  }
  if (especie === 'gato' || especie === 'felino') {
    return { icone: '🐱', classe: 'vax-tag-pet-gato', texto: 'Gato', eAnimal: true };
  }
  
  return { icone: '🐾', classe: 'vax-tag-pet-outros', texto: especiePet || 'Pet', eAnimal: true };
};

function BuscaFilaCampanha({ intencoes, setIntencoes, idPosto, onAlternarModo }) {
  // Estado do filtro: 'todos' | 'humanos' | 'animais'
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const handleConfirmarPresenca = async (idIntencao) => {
    try {
      await campaignService.confirmIntention(idIntencao, idPosto);
      setIntencoes((prev) =>
        prev.filter((item) => Number(item.id_intencao) !== Number(idIntencao))
      );
      alert("Sucesso! Aplicação registrada no histórico e estoque atualizado.");
    } catch (error) {
      alert("Erro ao confirmar aplicação: " + (error.error || error));
    }
  };

  // Alterna o filtro ao clicar no cabeçalho
  const alternarFiltro = () => {
    if (filtroTipo === 'todos') setFiltroTipo('humanos');
    else if (filtroTipo === 'humanos') setFiltroTipo('animais');
    else setFiltroTipo('todos');
  };

  // Aplica a filtragem na lista em tempo real
  const intencoesFiltradas = intencoes.filter(item => {
    if (filtroTipo === 'humanos') return !item.id_pet;
    if (filtroTipo === 'animais') return !!item.id_pet;
    return true; // 'todos'
  });

  // Define o rótulo do botão de filtro
  const obterRotuloFiltro = () => {
    if (filtroTipo === 'humanos') return '👤 Humanos';
    if (filtroTipo === 'animais') return '🐾 Animais';
    return '🔄 Todos';
  };

  return (
    <div className="busca-fila-container animate-fade-in">
      <div className="cabecalho-secao-atendimento">
        <h4>Intenções de Vacinação Encontradas</h4>
        <p className="subtitulo-secao">Selecione o agendamento abaixo e confirme a presença do paciente para dar baixa no estoque.</p>
      </div>
      
      {intencoes.length === 0 ? (
        <div className="aviso-vazio vax-shadow-suave">
          <div className="icone-aviso">🗓️</div>
          <p>Nenhuma intenção prévia foi agendada para este cidadão/tutor neste posto.</p>
          <button onClick={onAlternarModo} className="btn-vax-green">
            Registrar na Campanha Manualmente
          </button>
        </div>
      ) : (
        <div className="tabela-vax-container vax-shadow-suave">
          <table className="tabela-vax-atendimento">
            <thead>
              <tr>
                <th className="col-tipo header-filtravel" onClick={alternarFiltro} title="Clique para filtrar por tipo">
                  <div className="flex-header-filtro">
                    <span>Tipo</span>
                    <button type="button" className={`btn-filtro-coluna ${filtroTipo}`}>
                      {obterRotuloFiltro()}
                    </button>
                  </div>
                </th>
                <th>Nome do Paciente</th>
                <th>Campanha / Vacina</th>
                <th className="col-acao">Ação</th>
              </tr>
            </thead>
            <tbody>
              {intencoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Nenhuma intenção deste tipo ({filtroTipo}) encontrada na lista deste usuário.
                  </td>
                </tr>
              ) : (
                intencoesFiltradas.map((item) => {
                  const { icone, classe, texto } = obterEstiloPublico(item.id_pet, item.especie_pet);
                  
                  return (
                    <tr key={item.id_intencao} className="vax-row-interativa">
                      <td className="col-tipo">
                        <span className={`vax-tag-publico ${classe}`}>
                          {icone} {texto}
                        </span>
                      </td>
                      <td className="col-nome-paciente">
                        {item.id_pet ? (
                          <strong>{item.nome_pet}</strong>
                        ) : (
                          <span>{item.nome_usuario} (Cidadão)</span>
                        )}
                      </td>
                      <td>
                        <div className="celula-campanha-info">
                          <strong className="vax-text-dark-blue">{item.titulo_campanha || 'Campanha Ativa'}</strong>
                          <span className="sub-vacina vax-text-slate">{item.nome_vacina}</span>
                        </div>
                      </td>
                      <td className="col-acao">
                        <button 
                          onClick={() => handleConfirmarPresenca(item.id_intencao)} 
                          className="btn-vax-baixa"
                        >
                          Confirmar Presença
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BuscaFilaCampanha;