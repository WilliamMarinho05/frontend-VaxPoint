import React, { useState } from 'react';
import { Syringe } from 'lucide-react';
import VacinaRotina from './components/vacinaRotina/VacinaRotina';
import VacinaCampanha from './components/vacinaCampanha/VacinaCampanha';
import './RegistrarVacina.css';

function RegistrarVacina() {
  const [aba, setAba] = useState('rotina'); // 'rotina' ou 'campanha'

  return (
    <div className="atendimento-container">
      <header className="atendimento-header">
        <h2><Syringe size={28} /> Atendimento e Registro de Vacinação</h2>
        <div className="atendimento-tabs">
          <button 
            className={aba === 'rotina' ? 'active' : ''} 
            onClick={() => setAba('rotina')}
          >
            Vacinação de Rotina
          </button>
          <button 
            className={aba === 'campanha' ? 'active' : ''} 
            onClick={() => setAba('campanha')}
          >
            Baixa em Campanhas
          </button>
        </div>
      </header>

      <main className="atendimento-content">
        {aba === 'rotina' ? <VacinaRotina /> : <VacinaCampanha />}
      </main>
    </div>
  );
}

export default RegistrarVacina;