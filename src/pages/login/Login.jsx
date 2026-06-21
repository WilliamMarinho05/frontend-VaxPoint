import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !senha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    let usuarioMocado = {
      nome: "Maria Clara",
      email: email,
      is_admin: 0
    };

    if (email.toLowerCase() === 'admin@vaxpoint.com') {
      usuarioMocado.nome = "Administrador";
      usuarioMocado.is_admin = 1;
    }

    setCarregando(true);
    localStorage.setItem('vaxpoint_user', JSON.stringify(usuarioMocado));

    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  // --- TELA DE CARREGAMENTO (SPLASH SCREEN APÓS O CLIQUE) ---
  if (carregando) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="loading-logo-container">
            <img src={logoImg} alt="VaxPoint Logo" className="loading-logo" />
          </div>
          <h1 className="loading-title">VaxPoint</h1>
          <p className="loading-subtitle">Saúde humana e animal em um só clique</p>
          
          <div className="loading-progress-bar-bg">
            <div className="loading-progress-bar-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DE LOGIN COM A LOGO NO TOPO ---
  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* Logo do projeto inserida aqui no topo do card */}
        <div className="login-card-logo-container">
          <img src={logoImg} alt="VaxPoint Logo" className="login-card-logo" />
        </div>

        <h2 className="login-title">Entrar no VaxPoint</h2>
        <p className="login-subtitle">Acesse sua carteira de vacinação unificada</p>

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label className="login-label">E-mail</label>
            <input 
              type="email" 
              placeholder="mariclaralima2304@rede.ulbra.br" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="login-input" 
            />
          </div>

          <div className="login-input-group">
            <label className="login-label">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              className="login-input" 
            />
          </div>

          <button type="submit" className="login-btn-submit">Entrar no Sistema</button>
        </form>

        <div className="login-signup-container">
          <span>Não tem uma conta? </span>
          <Link to="/cadastro" className="login-signup-link">Cadastre-se aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;