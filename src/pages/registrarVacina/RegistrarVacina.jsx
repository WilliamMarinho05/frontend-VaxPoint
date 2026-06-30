import React, { useState } from 'react';
import { Syringe } from 'lucide-react';
import VacinaRotina from './components/vacinaRotina/VacinaRotina';
import VacinaCampanha from './components/vacinaCampanha/VacinaCampanha';
import './RegistrarVacina.css';

function RegistrarVacina() {
  const [aba, setAba] = useState('rotina'); // 'rotina' ou 'campanha'

  return (
    <div className="atendimento-wrapper">

      {/* CARD PRINCIPAL */}
      <div className="atendimento-container">

        <header className="atendimento-header">
          
          <h2>
            <Syringe size={28} /> Atendimento e Registro de Vacinação
          </h2>

          {/* BOTÕES AGORA ABAIXO DO TÍTULO */}
          <div className="toggle-switch-container">

            <button
              className={`tab-float ${aba === 'rotina' ? 'active' : ''}`}
              onClick={() => setAba('rotina')}
            >
              Rotina
            </button>

            <button
              className={`tab-float ${aba === 'campanha' ? 'active' : ''}`}
              onClick={() => setAba('campanha')}
            >
              Campanha
            </button>

          </div>

        </header>

        <main className="atendimento-content">
          {aba === 'rotina' ? <VacinaRotina /> : <VacinaCampanha />}
        </main>

      </div>

    </div>
  );
}

export default RegistrarVacina;