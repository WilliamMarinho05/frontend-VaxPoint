import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Calendar, Users } from 'lucide-react';
import { cadastrarUsuarioAPI } from '../../services/authService';
import logoImg from '../../assets/logo.png';
import './Cadastro.css';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState(''); // Estado para YYYY-MM-DD
  const [sexo, setSexo] = useState(''); // Estado para Homem ou Mulher
  
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha || !dataNascimento || !sexo) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const dadosNovos = {
        nome,
        email,
        senha,
        data_nascimento: dataNascimento,
        sexo
      };

      const resposta = await cadastrarUsuarioAPI(dadosNovos);

      alert(`Conta criada com sucesso! Bem-vindo, ${nome}!`);
      
      navigate('/login'); 

    } catch (error) {
      alert(error.message || 'Falha ao realizar o cadastro no sistema.');
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        
        {/* Botão de voltar para o Login */}
        <div className="cadastro-back-button" onClick={() => navigate('/login')}>
          <ArrowLeft size={16} /> Voltar para o Login
        </div>

        {/* Bloco da Logo */}
        <div className="cadastro-logo-section">
          <img src={logoImg} alt="VaxPoint Logo" className="cadastro-logo-img" />
          <h1 className="cadastro-logo-text">Vax<span>Point</span></h1>
          <p className="cadastro-subtext">Crie sua conta para monitoramento vacinal</p>
        </div>

        {/* Formulário de Cadastro (RF-01) */}
        <form onSubmit={handleCadastro} className="cadastro-form">
          <div className="cadastro-input-group">
            <User size={20} color="#64748B" className="cadastro-icon" />
            <input 
              type="text" 
              placeholder="Nome Completo" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="cadastro-input"
            />
          </div>

          <div className="cadastro-input-group">
            <Mail size={20} color="#64748B" className="cadastro-icon" />
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cadastro-input"
            />
          </div>

          {/* Campo Data de Nascimento Completa (Dia/Mês/Ano nativo) */}
          <div className="cadastro-input-group">
            <Calendar size={20} color="#64748B" className="cadastro-icon" />
            <input 
              type="date" 
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="cadastro-input"
            />
          </div>

          {/* Campo Seleção de Gênero */}
          <div className="cadastro-input-group">
            <Users size={20} color="#64748B" className="cadastro-icon" />
            <select 
              value={sexo} 
              onChange={(e) => setSexo(e.target.value)}
              className="cadastro-input"
              style={{ cursor: 'pointer' }}
            >
              <option value="" disabled hidden>Selecione seu Gênero</option>
              <option value="Homem">Homem</option>
              <option value="Mulher">Mulher</option>
            </select>
          </div>

          <div className="cadastro-input-group">
            <Lock size={20} color="#64748B" className="cadastro-icon" />
            <input 
              type="password" 
              placeholder="Crie uma senha" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="cadastro-input"
            />
          </div>

          <div className="cadastro-input-group">
            <Lock size={20} color="#64748B" className="cadastro-icon" />
            <input 
              type="password" 
              placeholder="Confirme a sua senha" 
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="cadastro-input"
            />
          </div>

          <button type="submit" className="cadastro-btn-primary">
            Criar Minha Conta
          </button>
        </form>

        <div className="cadastro-links-container">
          <p className="cadastro-link-text">
            Já tem uma conta? <span className="cadastro-link" onClick={() => navigate('/login')}>Faça Login</span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Cadastro;