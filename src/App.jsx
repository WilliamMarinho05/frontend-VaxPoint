import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação do componente reutilizável que criámos com a sua logo
import Navbar from './components/Navbar';

// Importação das Páginas (que vamos codificar a seguir)
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Pets from './pages/Pets';
import Historico from './pages/Historico';
import Admin from './pages/Admin';

// 🛡️ Componente de Rota Privada Comum
// Bloqueia o acesso se o utilizador não tiver um login mocado no localStorage
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('vaxpoint_user'));
  return user ? (
    <>
      <Navbar /> {/* A Navbar aparece automaticamente em todas as páginas privadas */}
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

// 🛡️ Componente de Rota Privada do Administrador
// Bloqueia o acesso se o utilizador não for admin (is_admin !== 1)
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('vaxpoint_user'));
  if (!user) return <Navigate to="/login" />;
  return user.is_admin === 1 ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/" /> // Se for utilizador comum tentar entrar no admin, volta para a Home
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Privadas Seguras (Protegidas por localStorage) */}
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        
        <Route path="/pets" element={
          <PrivateRoute>
            <Pets />
          </PrivateRoute>
        } />
        
        <Route path="/historico" element={
          <PrivateRoute>
            <Historico />
          </PrivateRoute>
        } />

        {/* Rota do Administrador Restrita */}
        <Route path="/admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />

        {/* Rota de Escape: Qualquer URL errada manda para a Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;