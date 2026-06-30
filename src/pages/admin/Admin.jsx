import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/adminService';
import AdminMetrics from './components/adminMetrics/AdminMetrics';
import AdminChartVacinas from './components/adminChartVacinas/AdminChartVacinas';
import AdminForms from './components/adminForms/AdminForms';
import './Admin.css';

function Admin() {
  const [regiao, setRegiao] = useState('');
  const [metricas, setMetricas] = useState(null);
  const [dadosVacinas, setDadosVacinas] = useState([]);
  const [postos, setPostos] = useState([]);

  // Função para carregar tudo
  const carregarDados = async () => {
    try {
      const [met, vac] = await Promise.all([
        adminService.getMetrics(regiao),
        adminService.getChartVacinas(regiao),
      ]);
      setMetricas(met);
      setDadosVacinas(vac);
    } catch (error) {
      console.error("Erro ao carregar dados do admin", error);
    }
  };

  // Recarrega sempre que a região mudar
  useEffect(() => {
    carregarDados();
  }, [regiao]);

  useEffect(() => {
  const carregarPostos = async () => {
    try {
      const lista = await adminService.getPostos();
      setPostos(lista);
    } catch (error) {
      console.error("Erro ao carregar postos", error);
    }
  };

  carregarPostos();
  }, []);

  return (
    <div className="admin-container animate-fade">
      <header className="admin-header">
        <div className="admin-header-main">
          <h2 className="admin-title">
            <ShieldAlert size={26} color="#DC2626" /> Painel de Controle
          </h2>
          <div className="admin-badge-status">
            <ShieldCheck size={16} /> Modo Admin
          </div>
        </div>
        
        {/* Filtro Geográfico adaptável */}
        <div style={{ marginTop: '15px' }}>
          <label className="admin-label" style={{ display: 'inline-block', marginRight: '10px' }}>Filtrar por Região/Posto:</label>
          <select
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
            className="admin-select"
          >
            <option value="">Todas as Regiões (Geral)</option>

            <option value="Norte">Região Norte</option>
            <option value="Sul">Região Sul</option>

            <optgroup label="Postos">
              {postos.map((posto) => (
                <option
                  key={posto.id_posto}
                  value={posto.id_posto}
                >
                  {posto.nome_posto}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </header>

      {/* Renderiza os componentes filhos passando os dados como Props */}
      <AdminMetrics metricas={metricas} />

      {/* Agora estilizado nativamente pela classe mapeada no Admin.css */}
      <section className="admin-chart-section">
        <AdminChartVacinas dadosVacinas={dadosVacinas} />
      </section>

      {/* Passa a função carregarDados para que os formulários possam atualizar a tela ao enviar algo */}
      <AdminForms onUpdate={carregarDados} />
    </div>
  );
}

export default Admin;