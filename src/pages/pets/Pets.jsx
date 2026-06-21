import React, { useState, useEffect } from 'react';
import { PlusCircle, PawPrint, Trash2 } from 'lucide-react';
import './Pets.css';

function Pets() {
  const [pets, setPets] = useState([]);
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cão');
  const [idade, setIdade] = useState('');

  // Carregar os pets mocados ao iniciar a página
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
    
    // Limpar formulário
    setNome('');
    setIdade('');
    alert(`${nome} cadastrado com sucesso!`);
  };

  const handleDeletarPet = (id) => {
    const filtrados = pets.filter(p => p.idPet !== id);
    setPets(filtrados);
    localStorage.setItem('vaxpoint_pets', JSON.stringify(filtrados));
  };

  return (
    <div className="pets-container">
      <header className="pets-header">
        <h2 className="pets-title"><PawPrint size={26} color="#10B981" /> Meus Pets</h2>
        <p className="pets-subtitle">Gerencie a carteira de vacinação dos seus animais de estimação.</p>
      </header>

      <div className="pets-content-layout">
        {/* Formulário de Cadastro Lateral */}
        <form onSubmit={handleCadastrarPet} className="pets-form-card">
          <h3 className="pets-form-title"><PlusCircle size={18} /> Adicionar Novo Pet</h3>
          
          <div className="pets-input-group">
            <label className="pets-label">Nome do Animal</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Max" className="pets-input" />
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
            <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Ex: 2" className="pets-input" />
          </div>

          <button type="submit" className="pets-btn-submit">Cadastrar Pet</button>
        </form>

        {/* Grid de Listagem de Animais */}
        <div className="pets-grid">
          {pets.map(pet => (
            <div key={pet.idPet} className="pets-card">
              <div className="pets-avatar">
                {pet.especie === 'Cão' ? '🐶' : pet.especie === 'Gato' ? '🐱' : '🐾'}
              </div>
              <h4 className="pets-name">{pet.nome}</h4>
              <p className="pets-info"><strong>Espécie:</strong> {pet.especie}</p>
              <p className="pets-info"><strong>Idade:</strong> {pet.idade} anos</p>
              <button onClick={() => handleDeletarPet(pet.idPet)} className="pets-btn-delete">
                <Trash2 size={16} /> Remover
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pets;