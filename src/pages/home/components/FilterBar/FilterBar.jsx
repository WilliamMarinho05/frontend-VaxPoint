// src/components/FilterBar/FilterBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Search, Filter, Check } from 'lucide-react';
import './FilterBar.css';

function FilterBar({ 
  abaAtiva, 
  setAbaAtiva, 
  filtroBusca, 
  setFiltroBusca,
  vacinasHumanas,        // Recebido dinamicamente da Home
  vacinasPets,           // Recebido dinamicamente da Home
  vacinasSelecionadas, 
  setVacinasSelecionadas, 
  filtroRegiao, 
  setFiltroRegiao,
  filtroPublico,         // Novo estado do banco ('Humano', 'Cachorro', 'Gato')
  setFiltroPublico       // Atualizador do público
}) {
  const [expandido, setExpandido] = useState(false);
  const containerRef = useRef(null); 

  // Lógica para fechar a gaveta ao clicar fora do container do filtro
  useEffect(() => {
    const escutarCliquesFora = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setExpandido(false);
      }
    };

    if (expandido) {
      document.addEventListener('mousedown', escutarCliquesFora);
    }

    return () => {
      document.removeEventListener('mousedown', escutarCliquesFora);
    };
  }, [expandido]);

  const alternarVacina = (nomeVacina) => {
    if (vacinasSelecionadas.includes(nomeVacina)) {
      setVacinasSelecionadas(vacinasSelecionadas.filter(v => v !== nomeVacina));
    } else {
      setVacinasSelecionadas([...vacinasSelecionadas, nomeVacina]);
    }
  };

  const limparTodosOsFiltros = () => {
    setFiltroBusca('');
    setVacinasSelecionadas([]);
    setFiltroRegiao('');
    if (setFiltroPublico) setFiltroPublico(''); // Reseta o público se a função existir
  };

  return (
    <section className="home-controls-wrapper" ref={containerRef}>
      
      {/* 1. PARTE SUPERIOR: Abas + Botão de Filtro Avançado alinhado */}
      <div className="home-controls-header-row">
        <div className="home-controls">
          <div className="toggle-switch-container">
            <button
              className={`toggle-tab btn-postos ${abaAtiva === 'postos' ? 'ativa' : ''}`}
              onClick={() => { setAbaAtiva('postos'); limparTodosOsFiltros(); }}
            >
              <MapPin size={18} /> Postos
            </button>
            
            <button
              className={`toggle-tab btn-campanhas ${abaAtiva === 'campanhas' ? 'ativa' : ''}`}
              onClick={() => { setAbaAtiva('campanhas'); limparTodosOsFiltros(); }}
            >
              <Calendar size={18} /> Campanhas
            </button>
          </div>
        </div>

        <button 
          type="button" 
          className={`top-filter-btn ${expandido ? 'ativo' : ''} ${vacinasSelecionadas.length > 0 || filtroRegiao || filtroPublico ? 'com-filtros-ativos' : ''}`}
          onClick={() => setExpandido(!expandido)}
        >
          <Filter size={16} />
          <span>Filtros</span>
          {(vacinasSelecionadas.length > 0 || filtroRegiao !== '' || filtroPublico) && (
            <span className="filter-badge">!</span>
          )}
        </button>
      </div>

      {/* 2. PARTE INTERMEDIÁRIA: Barra de Busca (Ocupando 100% da largura) */}
      <div className="home-search-bar-full">
        <div className="home-input-with-icon">
          <Search size={18} className="home-search-icon" />
          <input 
            type="text"
            placeholder={abaAtiva === 'postos' ? "Buscar por posto ou endereço..." : "Pesquisar por campanhas..."}
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            className="home-functional-input"
          />
        </div>
      </div>

      {/* 3. PARTE INFERIOR: Gaveta de Filtros Retrátil */}
      {expandido && (
        <div className="filter-dropdown-drawer animate-fade">
          
          {/* FILTRO DE REGIÃO (Disponível em ambas as abas, filtrando os postos vinculados na campanha) */}
          <div className="filter-group">
            <span className="filter-group-title">Filtrar por Região:</span>
            <div className="squares-row">
              <button 
                type="button"
                className={`square-button ${filtroRegiao === '' ? 'active' : ''}`}
                onClick={() => setFiltroRegiao('')}
              >
                Todas as Regiões
              </button>
              <button 
                type="button"
                className={`square-button ${filtroRegiao === 'Norte' ? 'active' : ''}`}
                onClick={() => setFiltroRegiao('Norte')}
              >
                Região Norte
              </button>
              <button 
                type="button"
                className={`square-button ${filtroRegiao === 'Sul' ? 'active' : ''}`}
                onClick={() => setFiltroRegiao('Sul')}
              >
                Região Sul
              </button>
            </div>
          </div>

          {/* 🌟 NOVO: FILTRO DE PÚBLICO-ALVO EXCLUSIVO DE CAMPANHAS */}
          {abaAtiva === 'campanhas' && (
            <div className="filter-group">
              <span className="filter-group-title">Público da Campanha:</span>
              <div className="squares-row">
                <button 
                  type="button"
                  className={`square-button ${filtroPublico === '' ? 'active' : ''}`}
                  onClick={() => { setFiltroPublico(''); setVacinasSelecionadas([]); }}
                >
                  Todos
                </button>
                <button 
                  type="button"
                  className={`square-button ${filtroPublico === 'Humano' ? 'active' : ''}`}
                  onClick={() => { setFiltroPublico('Humano'); setVacinasSelecionadas([]); }}
                >
                  Humanos 👤
                </button>
                <button 
                  type="button"
                  className={`square-button ${filtroPublico === 'Cachorro' ? 'active' : ''}`}
                  onClick={() => { setFiltroPublico('Cachorro'); setVacinasSelecionadas([]); }}
                >
                  Cães 🐶
                </button>
                <button 
                  type="button"
                  className={`square-button ${filtroPublico === 'Gato' ? 'active' : ''}`}
                  onClick={() => { setFiltroPublico('Gato'); setVacinasSelecionadas([]); }}
                >
                  Gatos 🐱
                </button>
              </div>
            </div>
          )}

          {/* FILTRO DE VACINAS (Adaptável dinamicamente com base no público ou aba) */}
            <div className="filter-group">
            <span className="filter-group-title">
                Filtrar por Vacinas em Estoque:
            </span>
            <div className="squares-row">
                {/* Lógica Corrigida: Se for 'Todos' nas campanhas, junta os dois catálogos! */}
                {(abaAtiva === 'postos' 
                ? vacinasHumanas 
                : filtroPublico === 'Humano' 
                    ? vacinasHumanas 
                    : filtroPublico === 'Cachorro' || filtroPublico === 'Gato'
                    ? vacinasPets
                    : [...vacinasHumanas, ...vacinasPets] // Se for 'Todos', mostra tudo junto
                ).map((vacina, index) => {
                const estaAtiva = vacinasSelecionadas.includes(vacina);
                return (
                    <button
                    key={index}
                    type="button"
                    className={`square-button ${estaAtiva ? 'active' : ''}`}
                    onClick={() => alternarVacina(vacina)}
                    >
                    {estaAtiva && <Check size={14} className="check-icon" />}
                    {vacina}
                    </button>
                );
                })}
            </div>
            </div>

          <div className="drawer-footer">
            <button type="button" className="clear-filters-link" onClick={limparTodosOsFiltros}>
              Limpar Filtros
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default FilterBar;