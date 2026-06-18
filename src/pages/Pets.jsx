import React, { useState, useEffect } from 'react';
import { PlusCircle, PawPrint, Trash2 } from 'lucide-react';

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
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}><PawPrint size={26} color="#10B981" /> Meus Pets</h2>
        <p style={styles.subtitle}>Gerencie a carteira de vacinação dos seus animais de estimação.</p>
      </header>

      <div style={styles.contentLayout}>
        {/* Formulário de Cadastro Lateral */}
        <form onSubmit={handleCadastrarPet} style={styles.formCard}>
          <h3 style={styles.formTitle}><PlusCircle size={18} /> Adicionar Novo Pet</h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome do Animal</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Max" style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Espécie</label>
            <select value={especie} onChange={(e) => setEspecie(e.target.value)} style={styles.input}>
              <option value="Cão">🐶 Cão</option>
              <option value="Gato">🐱 Gato</option>
              <option value="Outro">🐾 Outro</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Idade (Anos)</label>
            <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Ex: 2" style={styles.input} />
          </div>

          <button type="submit" style={styles.btnSubmit}>Cadastrar Pet</button>
        </form>

        {/* Grid de Listagem de Animais */}
        <div style={styles.grid}>
          {pets.map(pet => (
            <div key={pet.idPet} style={styles.petCard}>
              <div style={styles.avatar}>
                {pet.especie === 'Cão' ? '🐶' : pet.especie === 'Gato' ? '🐱' : '🐾'}
              </div>
              <h4 style={styles.petName}>{pet.nome}</h4>
              <p style={styles.petInfo}><strong>Espécie:</strong> {pet.especie}</p>
              <p style={styles.petInfo}><strong>Idade:</strong> {pet.idade} anos</p>
              <button onClick={() => handleDeletarPet(pet.idPet)} style={styles.btnDelete}>
                <Trash2 size={16} /> Remover
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px 40px', maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '30px' },
  title: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', color: '#0A2540' },
  subtitle: { color: '#64748B', fontSize: '15px', marginTop: '5px' },
  contentLayout: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' },
  formCard: { backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' },
  formTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#0A2540' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', backgroundColor: '#F8FAFC' },
  btnSubmit: { width: '100%', padding: '12px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', height: 'fit-content' },
  petCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center', border: '1px solid #E2E8F0', relative: 'position' },
  avatar: { fontSize: '40px', marginBottom: '10px' },
  petName: { fontSize: '18px', fontWeight: '700', color: '#0A2540', marginBottom: '8px' },
  petInfo: { fontSize: '13px', color: '#64748B', marginBottom: '4px' },
  btnDelete: { display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '15px', background: 'none', border: 'none', color: '#DC2626', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }
};

export default Pets;