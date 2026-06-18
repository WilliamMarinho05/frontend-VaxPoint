import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../assets/logo.png'; // Caminho oficial da sua logo

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
      <div style={styles.loadingOverlay}>
        <div style={styles.loadingContent}>
          <div style={styles.logoContainer}>
            <img src={logoImg} alt="VaxPoint Logo" style={styles.loadingLogo} />
          </div>
          <h1 style={styles.loadingTitle}>VaxPoint</h1>
          <p style={styles.loadingSubtitle}>Saúde humana e animal em um só clique</p>
          
          <div style={styles.progressBarBg}>
            <div style={styles.progressBarFill}></div>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DE LOGIN COM A LOGO NO TOPO ---
  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        
        {/* Logo do projeto inserida aqui no topo do card */}
        <div style={styles.cardLogoContainer}>
          <img src={logoImg} alt="VaxPoint Logo" style={styles.cardLogo} />
        </div>

        <h2 style={styles.title}>Entrar no VaxPoint</h2>
        <p style={styles.subtitle}>Acesse sua carteira de vacinação unificada</p>

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input 
              type="email" 
              placeholder="mariclaralima2304@rede.ulbra.br" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              style={styles.input} 
            />
          </div>

          <button type="submit" style={styles.btnSubmit}>Entrar no Sistema</button>
        </form>

        <div style={styles.signupContainer}>
          <span>Não tem uma conta? </span>
          <Link to="/cadastro" style={styles.signupLink}>Cadastre-se aqui</Link>
        </div>

        <p style={styles.footerText}>
          Dica para a apresentação: Use o e-mail <strong>admin@vaxpoint.com</strong> para testar a visão do Administrador.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    padding: '40px 40px 45px 40px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
    width: '100%',
    maxWidth: '500px',
    border: '1px solid #E2E8F0',
    textAlign: 'center',
  },
  // Estilo para centralizar a logo no topo da caixinha branca
  cardLogoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px'
  },
  cardLogo: {
    width: '80px',
    height: 'auto',
    objectFit: 'contain'
  },
  title: { fontSize: '28px', fontWeight: '700', color: '#013991', marginBottom: '8px', fontFamily: 'sans-serif' },
  subtitle: { fontSize: '14px', color: '#64748B', marginBottom: '35px' },
  inputGroup: { marginBottom: '22px', textAlign: 'left' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#013991', marginBottom: '8px' },
  input: { width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#EFF6FF', outline: 'none', fontSize: '14px', color: '#0A2540', transition: 'all 0.2s' },
  btnSubmit: { 
    width: '100%', 
    padding: '14px', 
    backgroundColor: '#013991', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '8px', 
    fontWeight: '600', 
    cursor: 'pointer', 
    fontSize: '16px', 
    marginTop: '15px',
    boxShadow: '0 4px 12px rgba(1, 57, 145, 0.2)',
    transition: 'all 0.2s'
  },
  signupContainer: {
    marginTop: '25px',
    fontSize: '14px',
    color: '#64748B'
  },
  signupLink: {
    color: '#3D997C',
    fontWeight: '600',
    textDecoration: 'none',
    marginLeft: '5px'
  },
  footerText: { fontSize: '12px', color: '#94A3B8', marginTop: '30px', textAlign: 'center', lineHeight: '1.5' },

  // --- ESTILOS DA TELA DE CARREGAMENTO IMERSIVA ---
  loadingOverlay: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #013991 0%, #3D997C 100%)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  loadingContent: {
    textAlign: 'center',
    color: '#ffffff',
  },
  logoContainer: {
    marginBottom: '25px',
  },
  loadingLogo: {
    width: '110px',
    height: 'auto',
  },
  loadingTitle: {
    fontSize: '48px',
    fontWeight: '800',
    letterSpacing: '-1px',
    marginBottom: '6px',
    fontFamily: 'sans-serif'
  },
  loadingSubtitle: {
    fontSize: '16px',
    fontWeight: '400',
    opacity: 0.9,
    marginBottom: '40px',
  },
  progressBarBg: {
    width: '240px',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: '10px',
    margin: '0 auto',
    overflow: 'hidden'
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    animation: 'carregarBarra 2.5s linear forwards'
  }
};

try {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    styleSheet.insertRule(`
      @keyframes carregarBarra {
        0% { width: 0%; }
        100% { width: 100%; }
      }
    `, styleSheet.cssRules.length);
  }
} catch (e) {
  console.log("Animação carregada");
}

export default Login;