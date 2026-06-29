import React, { useState, useEffect } from 'react';
import vaccinationService from '../../../../services/vaccinationService';
import './VacinaRotina.css';
import '.././CardAtendimento.css';

function VacinaRotina() {
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [vacinaSelecionada, setVacinaSelecionada] = useState('');
  const [postoSelecionado, setPostoSelecionado] = useState('');

  // Estados para o banco de dados
  const [vacinas, setVacinas] = useState([]);
  const [postos, setPostos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // NOVO: Estado para controlar a mensagem visual de erro do cidadão
  const [erroUsuario, setErroUsuario] = useState('');

  // 1. Carrega APENAS os postos logo que a tela abre
  useEffect(() => {
    async function carregarPostos() {
      try {
        const dadosPostos = await vaccinationService.getHealthPosts();
        setPostos(dadosPostos);
      } catch (error) {
        alert("Erro ao carregar postos: " + (error.error || error));
      } finally {
        setCarregando(false);
      }
    }
    carregarPostos();
  }, []);

  // 2. REAGE À MUDANÇA DO POSTO: Busca as vacinas específicas daquele posto selecionado
  useEffect(() => {
    async function atualizarVacinasDoPosto() {
      if (!postoSelecionado) {
        setVacinas([]);
        return;
      }
      try {
        const dadosVacinas = await vaccinationService.getHumanVaccines(postoSelecionado);
        setVacinas(dadosVacinas);
        setVacinaSelecionada(''); // Reseta a vacina selecionada para evitar bugs
      } catch (error) {
        alert("Erro ao carregar vacinas do posto: " + (error.error || error));
      }
    }

    atualizarVacinasDoPosto();
  }, [postoSelecionado]);

  // Limpa o aviso de erro assim que o usuário começar a digitar novamente
  const handleInputChange = (type, value) => {
    setErroUsuario(''); // Apaga o alerta vermelho
    if (type === 'email') setEmail(value);
    if (type === 'date') setDataNascimento(value);
  };

  const handleSubmeter = async (e) => {
    e.preventDefault();
    setErroUsuario(''); // Reseta erros prévios
    
    if (!email || !dataNascimento || !vacinaSelecionada || !postoSelecionado) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    try {
      // ETAPA 1: Verificar se o cidadão está cadastrado no sistema
      const checagemUsuario = await vaccinationService.checkUserExistence(email, dataNascimento);
      
      const idUsuarioEncontrado = checagemUsuario.user.id_usuario;
      const nomeUsuarioEncontrado = checagemUsuario.user.nome;

      // ETAPA 2: Confirmar a aplicação e abater o estoque
      const resultadoAplicacao = await vaccinationService.confirmRoutineApplication(
        idUsuarioEncontrado,
        Number(vacinaSelecionada),
        Number(postoSelecionado)
      );

      if (resultadoAplicacao.success) {
        alert(`Sucesso! Vacina registrada no histórico de ${nomeUsuarioEncontrado}.`);
        
        // Limpa o formulário completo
        setEmail('');
        setDataNascimento('');
        setVacinaSelecionada('');
        setPostoSelecionado('');
      }

    } catch (error) {
      // Se o erro for do tipo 404 (Usuário não encontrado), joga na mensagem bonitinha do front
      if (error.error && error.error.includes("Cidadão não encontrado")) {
        setErroUsuario("Cidadão não encontrado. Verifique o e-mail e a data de nascimento.");
      } else {
        alert("Erro na operação: " + (error.error || error));
      }
    }
  };

  if (carregando) {
    return <section className="card-atendimento"><p>Carregando dados de atendimento...</p></section>;
  }

  return (
    <section className="card-atendimento">
      <h3>Registrar Vacina de Rotina (Humana)</h3>
      <p>Use esta aba para pessoas que compareceram ao posto de saúde espontaneamente e sem agendamento prévio.</p>
      
      <form onSubmit={handleSubmeter} className="form-grupo">
        {/* Linha com E-mail e Data de Nascimento */}
        <div className="form-linha">
          <input 
            type="email" 
            placeholder="E-mail do Cidadão" 
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className={erroUsuario ? 'input-erro' : ''}
          />

          <input 
            type="date" 
            value={dataNascimento}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
            title="Data de Nascimento do Cidadão"
            className={erroUsuario ? 'input-erro' : ''}
          />
        </div>

        {/* AVISO VISUAL BONITINHO DE ERRO */}
        {erroUsuario && (
          <div className="msg-erro-usuario">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            {erroUsuario}
          </div>
        )}
        
        {/* Select do Posto de Saúde */}
        <select
          value={postoSelecionado}
          onChange={(e) => setPostoSelecionado(e.target.value)}
          required
        >
          <option value="">Selecione o Posto de Atendimento Atual</option>
          {postos.map((posto) => (
            <option key={posto.id_posto} value={posto.id_posto}>
              {posto.nome_posto}
            </option>
          ))}
        </select>

        {/* Select de Vacinas */}
        <select 
          value={vacinaSelecionada}
          onChange={(e) => setVacinaSelecionada(e.target.value)}
          required
          disabled={!postoSelecionado} // Fica desativado até escolher o posto
        >
          <option value="">
            {postoSelecionado ? 'Selecione a Vacina Disponível no Estoque' : 'Escolha um posto primeiro...'}
          </option>
          {vacinas.map((vacina) => (
            <option key={vacina.id_vacina} value={vacina.id_vacina}>
              {vacina.nome_vacina}
            </option>
          ))}
        </select>
        
        <button type="submit" className="btn-confirmar">
          Confirmar Aplicação
        </button>
      </form>
    </section>
  );
}

export default VacinaRotina;