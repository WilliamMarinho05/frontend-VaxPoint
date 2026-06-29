import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, PawPrint, Clock, ShieldAlert, LogOut, User, Syringe } from 'lucide-react';
import logoImg from '../assets/logo.png';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  
  // Recupera o usuário logado para saber se é admin ou não
  const userRaw = localStorage.getItem('vaxpoint_user');
  const user = userRaw ? JSON.parse(userRaw) : { nome: "Usuário", is_admin: 0 };

  const handleLogout = () => {
    localStorage.removeItem('vaxpoint_user');
    navigate('/login');
  };

  return (
    <nav className="navbar-container">
      {/* Lado Esquerdo: Logo e Nome */}
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <img src={logoImg} alt="VaxPoint Logo" className="navbar-logo-img" />
        <span className="navbar-brand-name" translate="no">VaxPoint</span>
      </div>

      {/* Centro: Links de Navegação travados contra tradução automática */}
      <div className="navbar-links">
        <Link to="/" className="navbar-link" translate="no">
          <Home size={18} /> Início
        </Link>

        {user.is_admin === 1 ? (
          <>
            {/* LINKS EXCLUSIVOS DO ADM / POSTINHO */}
            <Link to="/registrar-vacina" className="navbar-link" translate="no">
              <Syringe size={18} /> Registrar Vacina
            </Link>
            <Link to="/admin" className="navbar-link-admin" translate="no">
              <ShieldAlert size={18} /> Painel Admin
            </Link>
          </>
        ) : (
          <>
            {/* LINKS EXCLUSIVOS DO CIDADÃO COMUM */}
            <Link to="/pets" className="navbar-link" translate="no">
              <PawPrint size={18} /> Meus Pets
            </Link>
            <Link to="/historico" className="navbar-link" translate="no">
              <Clock size={18} /> Histórico
            </Link>
          </>
        )}
      </div>

      {/* Lado Direito: Perfil e Sair */}
      <div className="navbar-user-section">
        <div className="navbar-profile-badge">
          <User size={16} color="#013991" />
          <span className="navbar-user-name">{user.nome}</span>
        </div>
        <button onClick={handleLogout} className="navbar-btn-logout" title="Sair do Sistema">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;