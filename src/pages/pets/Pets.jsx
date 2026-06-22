import React, { useState, useEffect } from 'react';
import { PlusCircle, PawPrint } from 'lucide-react';
import PetCard from './components/PetCard/PetCard';
import PetFormModal from './components/PetFormModal/PetFormModal';
import PetCarteiraModal from './components/PetCarteiraModal/PetCarteiraModal';
import './Pets.css';

// Importa os novos serviços do Axios
import { 
  buscarPetsAPI, 
  buscarRacasAPI, 
  buscarVacinasDoPetAPI, 
  criarPetAPI, 
  atualizarPetAPI, 
  deletarPetAPI 
} from '../../services/petService'; // Ajuste o caminho do import conforme sua pasta

function Pets() {
  const [pets, setPets] = useState([]);
  const [racasDisponiveis, setRacasDisponiveis] = useState([]);
  const [historicoVacinas, setHistoricoVacinas] = useState({});

  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [petSelecionadoHistorico, setPetSelecionadoHistorico] = useState(null);
  const [editandoPet, setEditandoPet] = useState(null);

  // Carrega a lista de Pets e as Raças Disponíveis ao montar a tela
  useEffect(() => {
    buscarPets();
    buscarRacas();
  }, []);

  // Busca as vacinas sob demanda quando o usuário clica para abrir a carteira
  useEffect(() => {
    if (petSelecionadoHistorico) {
      buscarVacinasDoPet(petSelecionadoHistorico.id_pet);
    }
  }, [petSelecionadoHistorico]);

  const buscarPets = async () => {
    try {
      const dados = await buscarPetsAPI();
      setPets(dados);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      alert("Não foi possível carregar a lista de pets.");
    }
  };

  const buscarRacas = async () => {
    try {
      const dados = await buscarRacasAPI();
      setRacasDisponiveis(dados);
    } catch (error) {
      console.error("Erro ao buscar raças:", error);
    }
  };

  const buscarVacinasDoPet = async (idPet) => {
    try {
      const dados = await buscarVacinasDoPetAPI(idPet);
      setHistoricoVacinas(prev => ({
        ...prev,
        [idPet]: dados
      }));
    } catch (error) {
      console.error("Erro ao carregar histórico de vacinas:", error);
    }
  };

  const calcularIdade = (dataNascString) => {
    if (!dataNascString) return 'Idade desconhecida';
    const [anoNasc, mesNasc] = dataNascString.split('-').map(Number);
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth() + 1;
    let anos = anoAtual - anoNasc;
    let meses = mesAtual - mesNasc;
    if (meses < 0) { anos--; meses += 12; }
    if (anos === 0) return `${meses} mes(es)`;
    return `${anos} ano(s) ${meses > 0 ? `e ${meses} mes(es)` : ''}`;
  };

  const abrirFormularioNovo = () => {
    setEditandoPet(null);
    setModalFormAberto(true);
  };

  const abrirFormularioEdicao = (pet, e) => {
    e.stopPropagation();
    setEditandoPet(pet);
    setModalFormAberto(true);
  };

  const handleSalvarPet = async (formData) => {
    try {
      const payload = {
        nome: formData.nome,
        especie: formData.especie,
        id_raca: parseInt(formData.idRaca),
        porte: formData.porte,
        peso: parseFloat(formData.peso),
        sexo: formData.sexo,
        data_nascimento: formData.dataNasc ? `${formData.dataNasc}-01` : null,
        data_nascimento: formData.dataNasc,
        numero_microchip: formData.microchip || null,
        foto_url: formData.foto || null
      };

      if (editandoPet) {
        await atualizarPetAPI(editandoPet.id_pet, payload);
      } else {
        await criarPetAPI(payload);
      }

      buscarPets(); // Atualiza a grade de cards com os dados novos do banco
      setModalFormAberto(false);
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      alert("Houve um erro ao tentar salvar o pet no banco de dados.");
    }
  };

  const handleDeletarPet = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Remover este pet apagará também todo o histórico de vacinas dele no banco. Continuar?")) {
      try {
        await deletarPetAPI(id);
        setPets(prevPets => prevPets.filter(p => p.id_pet !== id));
      } catch (error) {
        console.error("Erro ao remover pet:", error);
        alert("Não foi possível excluir o pet.");
      }
    }
  };

  return (
    <div className="pets-container">
      <header className="pets-header-flex">
        <div>
          <h2 className="pets-title"><PawPrint size={26} color="#10B981" /> Meus Pets</h2>
          <p className="pets-subtitle">Consulte a carteira e dados veterinários individuais dos seus animais.</p>
        </div>
        <button className="pets-btn-add-trigger" onClick={abrirFormularioNovo}>
          <PlusCircle size={18} /> Adicionar Pet
        </button>
      </header>

      <div className="pets-grid">
        {pets.map(pet => (
          <PetCard 
            key={pet.id_pet} 
            pet={pet} 
            onVerCarteira={setPetSelecionadoHistorico}
            onEditar={abrirFormularioEdicao}
            onDeletar={handleDeletarPet}
            calcularIdade={calcularIdade}
          />
        ))}
        {pets.length === 0 && <p className="pets-empty-text">Nenhum pet cadastrado.</p>}
      </div>

      <PetFormModal 
        isOpen={modalFormAberto}
        onClose={() => setModalFormAberto(false)}
        onSalvar={handleSalvarPet}
        editandoPetId={editandoPet?.id_pet}
        racasDisponiveis={racasDisponiveis}
        dadosIniciais={editandoPet}
      />

      <PetCarteiraModal 
        pet={petSelecionadoHistorico}
        historicoVacinas={historicoVacinas}
        onClose={() => setPetSelecionadoHistorico(null)}
      />
    </div>
  );
}

export default Pets;