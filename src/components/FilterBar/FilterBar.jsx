import React from 'react';
import { MapPin, Calendar, Search, Filter } from 'lucide-react';
import './FilterBar.css';

function FilterBar({ 
  abaAtiva, 
  setAbaAtiva, 
  filtroBusca, 
  setFiltroBusca, 
  filtroRegiao, 
  setFiltroRegiao 
}) {
  return (
    <section className="home-controls-wrapper">
      {/* Abas de Alternância */}
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

      {/* Inputs de Busca e Filtro */}
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
  );
}

export default FilterBar;