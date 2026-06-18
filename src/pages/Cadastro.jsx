import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import logoImg from '../assets/logo.png'; // Importando a sua logo transparente

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();

    // Validações básicas de formulário
    if (!nome || !email || !senha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    // Simulando o registro de uma conta com dados básicos (RF-01)
    const novoUsuario = {
      idUsuario: Math.floor(Math.random() * 1000) + 3, // ID aleatório
      nome: nome,
      email: email,
      tipoUsuario: "COMUM",
      is_admin: 0
    };

    // Salva o perfil recém-criado como o usuário logado atual
    localStorage.setItem('vaxpoint_user', JSON.stringify(novoUsuario));
    alert(`Conta criada com sucesso! Bem-vindo, ${nome}!`);
    
    // Redireciona imediatamente para o Painel Principal (Home)
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Botão de voltar para o Login */}
        <div style={styles.backButton} onClick={() => navigate('/login')}>
          <ArrowLeft size={16} /> Voltar para o Login
        </div>

        {/* Bloco da Logo */}
        <div style={styles.logoSection}>
          <img src={logoImg} alt="VaxPoint Logo" style={styles.logoImg} />
          <h1 style={styles.logoText}>Vax<span>Point</span></h1>
          <p style={styles.subtext}>Crie sua conta para monitoramento vacinal</p>
        </div>

        {/* Formulário de Cadastro (RF-01) */}
        <form onSubmit={handleCadastro} style={styles.form}>
          <div style={styles.inputGroup}>
            <User size={20} color="#64748B" style={styles.icon} />
            <input 
              type="text" 
              placeholder="Nome Completo" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Mail size={20} color="#64748B" style={styles.icon} />
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={20} color="#64748B" style={styles.icon} />
            <input 
              type="password" 
              placeholder="Crie uma senha" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={20} color="#64748B" style={styles.icon} />
            <input 
              type="password" 
              placeholder="Confirme a sua senha" 
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.btnPrimary}>
            Criar Minha Conta
          </button>
        </form>

        <div style={styles.linksContainer}>
          <p style={styles.linkText}>
            Já tem uma conta? <span style={styles.link} onClick={() => navigate('/login')}>Faça Login</span>
          </p>
        </div>

      </div>
    </div>
  );
}

// Estilos inline encapsulados
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#F4F7FC',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    position: 'relative',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    position: 'absolute',
    top: '15px',
    left: '20px',
    fontSize: '13px',
    color: '#64748B',
    cursor: 'pointer',
    fontWeight: '500',
  },
  logoSection: {
    marginTop: '15px',
    marginBottom: '25px',
  },
  logoImg: {
    width: '60px',
    height: 'auto',
    marginBottom: '10px',
  },
  logoText: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0A2540',
  },
  subtext: {
    color: '#64748B',
    fontSize: '14px',
    marginTop: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '10px 15px',
  },
  icon: {
    marginRight: '10px',
  },
  input: {
    border: 'none',
    background: 'none',
    outline: 'none',
    width: '100%',
    color: '#0A2540',
    fontSize: '15px',
  },
  btnPrimary: {
    backgroundColor: '#007BFF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '5px',
  },
  linksContainer: {
    marginTop: '20px',
  },
  linkText: {
    fontSize: '14px',
    color: '#64748B',
  },
  link: {
    color: '#007BFF',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
};

export default Cadastro;