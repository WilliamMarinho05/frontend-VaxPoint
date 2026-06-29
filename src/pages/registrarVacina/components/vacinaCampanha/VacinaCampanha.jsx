import React, { useState } from 'react';
import './VacinaCampanha.css';
import '.././CardAtendimento.css';

function VacinaCampanha() {
  // Moca de dados inicial para não quebrar a tela enquanto você liga a rota
  const [intencoes, setIntencoes] = useState([
    { id_intencao: 1, usuario: "João Silva", pet: "Totó (Cachorro)", vacina: "Antirrábica Animal" },
    { id_intencao: 2, usuario: "Maria Souza", pet: "Nenhum (Humana)", vacina: "Influenza (Gripe)" }
  ]);

  const handleDarBaixa = (idIntencao) => {
    // Aqui entrará a requisição POST para mover a intenção para o histórico e deletá-la
    console.log("Dando baixa na intenção de ID:", idIntencao);
    
    // Atualiza a tabela removendo visualmente a linha que o Admin acabou de vacinar
    setIntencoes(prev => prev.filter(item => item.id_intencao !== idIntencao));
    alert("Aplicação registrada no histórico do paciente!");
  };

  return (
    <section className="card-atendimento">
      <h3>Lista de Intenções Ativas (Campanhas)</h3>
      <p>Confirme a vacinação de quem registrou intenção prévia de participação nas campanhas vigentes.</p>
      
      {intencoes.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>
          Não há nenhuma intenção de vacinação na fila de espera no momento.
        </p>
      ) : (
        <table className="tabela-atendimento">
          <thead>
            <tr>
              <th>Cidadão / Tutor</th>
              <th>Paciente / Pet</th>
              <th>Vacina Solicitada</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {intencoes.map((item) => (
              <tr key={item.id_intencao}>
                <td>{item.usuario}</td>
                <td>{item.pet}</td>
                <td><strong>{item.vacina}</strong></td>
                <td>
                  <button 
                    onClick={() => handleDarBaixa(item.id_intencao)} 
                    className="btn-baixa"
                  >
                    Confirmar Presença
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default VacinaCampanha;