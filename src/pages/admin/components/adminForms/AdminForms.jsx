import React, { useState, useEffect } from 'react';
import { Package, CalendarPlus } from 'lucide-react';
import { adminService } from '../../../../services/adminService';
import AdminCard from '../../components/AdminCard';
import './AdminForms.css';

export default function AdminForms({ onUpdate }) {
  const [postos, setPostos] = useState([]);
  const [vacinas, setVacinas] = useState([]);
  
  const [estoque, setEstoque] = useState({ id_posto: '', id_vacina: '', quantidade: '' });

  const [campanha, setCampanha] = useState({
    titulo: '',
    descricao: '',
    periodo: '',
    publico: '',
    id_vacina: '',
    imagem_url: '',
    destaque: false,
    ids_postos: []
  });

  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const [listaPostos, listaVacinas] = await Promise.all([
          adminService.getPostos(),
          adminService.getVacinas()
        ]);
        setPostos(listaPostos);
        setVacinas(listaVacinas);
      } catch (error) {
        console.error("Erro ao carregar opções para o formulário", error);
      }
    };
    carregarOpcoes();
  }, []);

  // FILTRAGEM DINÂMICA: Filtra as vacinas cujo "tipo" seja igual ao "publico" selecionado
  const vacinasFiltradasParaCampanha = vacinas.filter((v) => {
    // 1. Garante que a vacina tem um tipo e que um público foi selecionado
    if (!v.tipo || !campanha.publico) return false;

    const tipoBanco = v.tipo.trim().toLowerCase();
    const publicoSelecionado = campanha.publico.trim().toLowerCase();

    // 2. Mapeamento inteligente (Se no banco for 'canino', ele aceita 'cachorro', etc.)
    if (publicoSelecionado === 'cachorro' && (tipoBanco === 'cachorro' || tipoBanco === 'canino')) {
      return true;
    }
    if (publicoSelecionado === 'gato' && (tipoBanco === 'gato' || tipoBanco === 'felino')) {
      return true;
    }
    if (publicoSelecionado === 'humano' && tipoBanco === 'humano') {
      return true;
    }

    // 3. Fallback caso os nomes sejam exatamente iguais
    return tipoBanco === publicoSelecionado;
  });

  const handleAtualizarEstoque = async (e) => {
    e.preventDefault();
    if (!estoque.id_posto || !estoque.id_vacina || !estoque.quantidade) {
      return alert('Por favor, preencha todos os campos do estoque!');
    }
    try {
      await adminService.atualizarEstoque(estoque);
      alert('Estoque atualizado com sucesso!');
      setEstoque({ id_posto: '', id_vacina: '', quantidade: '' });
      if (onUpdate) onUpdate(); 
    } catch (error) {
      alert('Erro ao atualizar estoque');
    }
  };

  const handlePostoCheckboxChange = (id_posto) => {
    setCampanha(prev => {
      const jaSelecionado = prev.ids_postos.includes(id_posto);
      const novosPostos = jaSelecionado 
        ? prev.ids_postos.filter(id => id !== id_posto)
        : [...prev.ids_postos, id_posto];
      return { ...prev, ids_postos: novosPostos };
    });
  };

  const handlePublicarCampanha = async (e) => {
    e.preventDefault();
    if (!campanha.titulo || !campanha.publico || !campanha.id_vacina || campanha.ids_postos.length === 0) {
      return alert('Campos obrigatórios: Título, Público, Vacina e ao menos um Posto!');
    }

    try {
      await adminService.criarCampanha(campanha);
      alert('Nova campanha publicada com sucesso!');
      setCampanha({
        titulo: '',
        descricao: '',
        periodo: '',
        publico: '',
        id_vacina: '',
        imagem_url: '',
        destaque: false,
        ids_postos: []
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      alert('Erro ao publicar a campanha. Verifique os dados.');
    }
  };

  return (
    <div className="admin-grid">
      
      {/* Formulário 1: Insumos */}
      <AdminCard title="Atualizar Insumos" icon={Package} iconColor="var(--admin-danger)">
        <form onSubmit={handleAtualizarEstoque}>
          <div className="admin-group">
            <label className="admin-label">Selecione o Ponto de Vacinação</label>
            <select 
              className="admin-input" 
              value={estoque.id_posto} 
              onChange={(e) => setEstoque({...estoque, id_posto: e.target.value})}
            >
              <option value="" disabled>Escolha um posto...</option>
              {postos.map((p) => (
                <option key={p.id_posto} value={p.id_posto}>{p.nome_posto}</option>
              ))}
            </select>
          </div>

          <div className="admin-group">
            <label className="admin-label">Selecione a Vacina (Filtro Geral)</label>
            <select 
              className="admin-input" 
              value={estoque.id_vacina} 
              onChange={(e) => setEstoque({...estoque, id_vacina: e.target.value})}
            >
              <option value="" disabled>Escolha uma vacina...</option>
              {vacinas.map((v) => (
                <option key={v.id_vacina} value={v.id_vacina}>
                  {v.nome_vacina} ({v.tipo})
                </option>
              ))}
            </select>
          </div>

          <div className="admin-group">
            <label className="admin-label">Quantidade de Doses (Adicionar)</label>
            <input 
              type="number" 
              className="admin-input" 
              placeholder="Ex: 50"
              value={estoque.quantidade} 
              onChange={(e) => setEstoque({...estoque, quantidade: e.target.value})} 
            />
          </div>

          <button type="submit" className="admin-btn admin-btn-danger">Atualizar Lote</button>
        </form>
      </AdminCard>

      {/* Formulário 2: Campanha Completa */}
      <AdminCard title="Publicar Campanha" icon={CalendarPlus} iconColor="var(--primary-blue)">
        <form onSubmit={handlePublicarCampanha}>
          
          <div className="admin-group">
            <label className="admin-label">Título da Campanha *</label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Ex: Campanha de Vacinação Antirrábica 2026"
              value={campanha.titulo}
              onChange={(e) => setCampanha({...campanha, titulo: e.target.value})}
            />
          </div>

          <div className="admin-group">
            <label className="admin-label">Público-Alvo *</label>
            <select 
              className="admin-input"
              value={campanha.publico}
              onChange={(e) => setCampanha({
                ...campanha, 
                publico: e.target.value,
                id_vacina: '' // <--- IMPORTANTE: Reseta a vacina selecionada para evitar inconsistências
              })}
            >
              <option value="" disabled>Selecione quem receberá...</option>
              <option value="Humano">Humano</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
            </select>
          </div>

          <div className="admin-group">
            <label className="admin-label">Vacina Ofertada *</label>
            <select 
              className="admin-input"
              value={campanha.id_vacina}
              onChange={(e) => setCampanha({...campanha, id_vacina: e.target.value})}
              disabled={!campanha.publico} // <--- Bloqueia o select se o público ainda não foi escolhido
            >
              {!campanha.publico ? (
                <option value="" disabled>Selecione primeiro o público-alvo...</option>
              ) : (
                <>
                  <option value="" disabled>Escolha a vacina para {campanha.publico}...</option>
                  {vacinasFiltradasParaCampanha.map((v) => (
                    <option key={v.id_vacina} value={v.id_vacina}>{v.nome_vacina}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="admin-group">
            <label className="admin-label">Período de Vigência</label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Ex: 01/08 a 31/08" 
              value={campanha.periodo}
              onChange={(e) => setCampanha({...campanha, periodo: e.target.value})}
            />
          </div>

          <div className="admin-group">
            <label className="admin-label">Descrição Informativa</label>
            <textarea 
              className="admin-input" 
              rows="2" 
              placeholder="Informações sobre locais, documentos e faixas etárias..."
              style={{ resize: 'none', fontFamily: 'inherit' }}
              value={campanha.descricao}
              onChange={(e) => setCampanha({...campanha, descricao: e.target.value})}
            />
          </div>

          <div className="admin-group">
            <label className="admin-label">URL da Imagem de Capa</label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="https://exemplo.com/banner.png" 
              value={campanha.imagem_url}
              onChange={(e) => setCampanha({...campanha, imagem_url: e.target.value})}
            />
          </div>

          <div className="admin-group">
            <label className="admin-label">Postos Participantes (Selecione um ou mais) *</label>
            <div className="admin-checkbox-list">
              {postos.map((p) => (
                <label key={p.id_posto} className="admin-checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={campanha.ids_postos.includes(p.id_posto)}
                    onChange={() => handlePostoCheckboxChange(p.id_posto)}
                  />
                  {p.nome_posto}
                </label>
              ))}
            </div>
          </div>

          <div className="admin-group-inline">
            <input 
              type="checkbox" 
              id="destaque"
              checked={campanha.destaque}
              onChange={(e) => setCampanha({...campanha, destaque: e.target.checked})}
            />
            <label htmlFor="destaque" className="admin-label" style={{ margin: 0, cursor: 'pointer' }}>
              Exibir em destaque no carrossel
            </label>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary">Publicar Campanha</button>
        </form>
      </AdminCard>

    </div>
  );
}