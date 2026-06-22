import React, { useState, useEffect } from 'react';
import { PlusCircle, PawPrint, Trash2, Syringe, Calendar, X, ShieldAlert } from 'lucide-react';
import './Pets.css';

function Pets() {
  const [pets, setPets] = useState([]);
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cão');
  const [idade, setIdade] = useState('');
  
  // Estado para a modal de histórico
  const [petSelecionado, setPetSelecionado] = useState(null);

  // Histórico mockado de vacinas vinculadas por idPet
  const [historicoVacinas] = useState({
    1: [
      { id: 10, vacina: "Antirrábica Canina", data: "12/03/2025", posto: "USF 307 Norte", status: "Aplicada" },
      { id: 11, vacina: "V10 Óctupla", data: "20/01/2026", posto: "Centro de Saúde das Arnos", status: "Aplicada" }
    ],
    2: [
      { id: 12, vacina: "Antirrábica Felina", data: "05/04/2025", posto: "USF Taquaralto", status: "Aplicada" }
    ]
  });

  useEffect(() => {
    const petsSalvos = JSON.parse(localStorage.getItem('vaxpoint_pets')) || [
      { idPet: 1, nome: "Thor", especie: "Cão", idade: 3 },
      { idPet: 2, nome: "Mia", especie: "Gato", idade: 1 }
    ];
    setPets(petsSalvos);
    if (!localStorage.getItem('vaxpoint_pets')) {
      localStorage.setItem('vaxpoint_pets', JSON.stringify(petsSalvos));
    }
  }, []);

  const handleCadastrarPet = (e) => {
    e.preventDefault();
    if (!nome || !idade) {
      alert('Preencha todos os campos do pet!');
      return;
    }

    const novoPet = {
      idPet: Date.now(),
      nome,
      especie,
      idade: parseInt(idade)
    };

    const listaAtualizada = [...pets, novoPet];
    setPets(listaAtualizada);
    localStorage.setItem('vaxpoint_pets', JSON.stringify(listaAtualizada));
    
    setNome('');
    setIdade('');
  };

  const handleDeletarPet = (id, e) => {
    e.stopPropagation(); // Evita abrir a modal ao clicar no botão de remover
    if (window.confirm("Deseja mesmo remover este pet do sistema?")) {
      const filtrados = pets.filter(p => p.idPet !== id);
      setPets(filtrados);
      localStorage.setItem('vaxpoint_pets', JSON.stringify(filtrados));
    }
  };

  // Retorna as vacinas do pet atual ou um array vazio caso seja novo
  const obterVacinasDoPet = (idPet) => {
    return historicoVacinas[idPet] || [];
  };

  return (
    <div className="pets-container">
      <header className="pets-header">
        <h2 className="pets-title"><PawPrint size={26} color="#10B981" /> Meus Pets</h2>
        <p className="pets-subtitle">Gerencie e consulte a carteira de vacinação individual dos seus animais de estimação.</p>
      </header>

      <div className="pets-content-layout">
        {/* Formulário de Cadastro Lateral */}
        <form onSubmit={handleCadastrarPet} className="pets-form-card">
          <h3 className="pets-form-title"><PlusCircle size={18} /> Adicionar Novo Pet</h3>
          
          <div className="pets-input-group">
            <label className="pets-label">Nome do Animal</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Max" className="pets-input" required />
          </div>

          <div className="pets-input-group">
            <label className="pets-label">Espécie</label>
            <select value={especie} onChange={(e) => setEspecie(e.target.value)} className="pets-input">
              <option value="Cão">🐶 Cão</option>
              <option value="Gato">🐱 Gato</option>
              <option value="Outro">🐾 Outro</option>
            </select>
          </div>

          <div className="pets-input-group">
            <label className="pets-label">Idade (Anos)</label>
            <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Ex: 2" className="pets-input" required />
          </div>

          <button type="submit" className="pets-btn-submit">Cadastrar Pet</button>
        </form>

        {/* Grid de Listagem de Animais */}
        <div className="pets-grid">
          {pets.map(pet => (
            <div key={pet.idPet} className="pets-card" onClick={() => setPetSelecionado(pet)}>
              <div className="pets-avatar">
                {pet.especie === 'Cão' ? '🐶' : pet.especie === 'Gato' ? '🐱' : '🐾'}
              </div>
              <h4 className="pets-name">{pet.nome}</h4>
              <p className="pets-info"><strong>Espécie:</strong> {pet.especie}</p>
              <p className="pets-info"><strong>Idade:</strong> {pet.idade} anos</p>
              
              <span className="pets-click-badge">📋 Ver Histórico</span>

              <button onClick={(e) => handleDeletarPet(pet.idPet, e)} className="pets-btn-delete">
                <Trash2 size={14} /> Remover
              </button>
            </div>
          ))}
          {pets.length === 0 && <p className="pets-empty-text">Nenhum pet cadastrado.</p>}
        </div>
      </div>

      {/* MODAL: CARTEIRA DE VACINAÇÃO INDIVIDUAL */}
      {petSelecionado && (
        <div className="pets-modal-overlay" onClick={() => setPetSelecionado(null)}>
          <div className="pets-modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="pets-modal-header">
              <div className="pets-modal-title-box">
                <Syringe size={22} color="#0070f3" />
                <h3>Carteira de Vacinação: {petSelecionado.nome}</h3>
              </div>
              <button className="pets-modal-close-icon" onClick={() => setPetSelecionado(null)}>
                <X size={20} />
              </button>
            </header>

            <div className="pets-modal-body">
              {obterVacinasDoPet(petSelecionado.idPet).length > 0 ? (
                <div className="pets-timeline">
                  {obterVacinasDoPet(petSelecionado.idPet).map((item) => (
                    <div key={item.id} className="pets-timeline-item">
                      <div className="pets-timeline-marker"></div>
                      <div className="pets-timeline-content">
                        <h4 className="pets-timeline-vaccine">{item.vacina}</h4>
                        <p className="pets-timeline-meta">
                          <span><Calendar size={13} /> {item.data}</span>
                          <span>📍 {item.posto}</span>
                        </p>
                        <span className="pets-badge-status-applied">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pets-no-history">
                  <ShieldAlert size={36} color="#94a3b8" />
                  <p>Nenhuma vacina aplicada registrada para {petSelecionado.nome} até o momento.</p>
                </div>
              )}
            </div>

            <footer className="pets-modal-footer">
              <button className="pets-modal-btn-close" onClick={() => setPetSelecionado(null)}>Fechar Carteira</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pets;