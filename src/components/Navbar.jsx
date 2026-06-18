import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, PawPrint, Clock, ShieldAlert, LogOut, User } from 'lucide-react';
import logoImg from '../assets/logo.png'; // Caminho da logo da aplicação

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
    <nav style={styles.navbar}>
      {/* Lado Esquerdo: Logo e Nome */}
      <div style={styles.brandContainer} onClick={() => navigate('/')}>
        <img src={logoImg} alt="VaxPoint Logo" style={styles.logo} />
        <span style={styles.brandName} translate="no">VaxPoint</span>
      </div>

      {/* Centro: Links de Navegação travados contra tradução automática */}
      <div style={styles.linksContainer}>
        <Link to="/" style={styles.link} translate="no">
          <Home size={18} /> Início
        </Link>
        <Link to="/pets" style={styles.link} translate="no">
          <PawPrint size={18} /> Meus Pets
        </Link>
        <Link to="/historico" style={styles.link} translate="no">
          <Clock size={18} /> Histórico
        </Link>
        
        {/* Exibe o link de Admin apenas se o usuário tiver permissão */}
        {user.is_admin === 1 && (
          <Link to="/admin" style={styles.linkAdmin} translate="no">
            <ShieldAlert size={18} /> Admin
          </Link>
        )}
      </div>

      {/* Lado Direito: Perfil e Sair */}
      <div style={styles.userSection}>
        <div style={styles.profileBadge}>
          <User size={16} color="#013991" />
          <span style={styles.userName}>{user.nome}</span>
        </div>
        <button onClick={handleLogout} style={styles.btnLogout} title="Sair do Sistema">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    height: '70px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  },
  logo: {
    height: '40px',
    width: 'auto'
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#013991',
    fontFamily: 'sans-serif'
  },
  linksContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#475569',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  linkAdmin: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#DC2626', // Vermelho de destaque para a área administrativa
    fontSize: '15px',
    fontWeight: '600',
    transition: 'opacity 0.2s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#EFF6FF',
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid #BFDBFE'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#013991'
  },
  btnLogout: {
    background: 'none',
    border: 'none',
    color: '#64748B',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '50%',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#F1F5F9',
      color: '#000'
    }
  }
};

export default Navbar;