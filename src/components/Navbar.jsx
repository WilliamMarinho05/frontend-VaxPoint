import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PawPrint, Clock, ShieldAlert, LogOut, User, Syringe } from 'lucide-react';
import logoImg from '../assets/logo.png';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const userRaw = localStorage.getItem('vaxpoint_user');
  const user = userRaw ? JSON.parse(userRaw) : { nome: "Usuário", is_admin: 0 };

  const handleLogout = () => {
    localStorage.removeItem('vaxpoint_user');
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    isActive ? "navbar-link active" : "navbar-link";

  const adminLinkClass = ({ isActive }) =>
    isActive ? "navbar-link-admin active" : "navbar-link-admin";

  return (
    <nav className="navbar-container">

      {/* Logo */}
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <img src={logoImg} alt="VaxPoint Logo" className="navbar-logo-img" />
        <span className="navbar-brand-name" translate="no">VaxPoint</span>
      </div>

      {/* Links */}
      <div className="navbar-links">

        <NavLink to="/" className={linkClass} translate="no">
          <Home size={18} /> Início
        </NavLink>

        {user.is_admin === 1 ? (
          <>
            <NavLink to="/registrar-vacina" className={linkClass} translate="no">
              <Syringe size={18} /> Registrar Vacina
            </NavLink>

            <NavLink to="/admin" className={adminLinkClass} translate="no">
              <ShieldAlert size={18} /> Painel Admin
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/pets" className={linkClass} translate="no">
              <PawPrint size={18} /> Meus Pets
            </NavLink>

            <NavLink to="/historico" className={linkClass} translate="no">
              <Clock size={18} /> Histórico
            </NavLink>
          </>
        )}
      </div>

      {/* Usuário */}
      <div className="navbar-user-section">
        <div className="navbar-profile-badge">
          <User size={16} color="#013991" />
          <span className="navbar-user-name">{user.nome}</span>
        </div>

        <button onClick={handleLogout} className="navbar-btn-logout">
          <LogOut size={18} />
        </button>
      </div>

    </nav>
  );
}

export default Navbar;