import api from "./api";

// Busca todos os pets do usuário logado
export const buscarPetsAPI = async () => {
  const response = await api.get("/pets");
  return response.data;
};

// Busca todas as raças cadastradas no sistema (para carregar o select do formulário)
export const buscarRacasAPI = async () => {
  // Ajuste aqui para incluir o prefixo correto do seu arquivo de rotas:
  const response = await api.get("/pets/racas"); 
  return response.data;
};
// Busca o histórico de vacinas de um pet específico
export const buscarVacinasDoPetAPI = async (idPet) => {
  const response = await api.get(`/vacinas/${idPet}`);
  return response.data;
};

// Cria um novo pet no banco de dados
export const criarPetAPI = async (dadosPet) => {
  const response = await api.post("/pets", dadosPet);
  return response.data;
};

// Atualiza os dados de um pet existente
export const atualizarPetAPI = async (idPet, dadosPet) => {
  const response = await api.put(`/pets/${idPet}`, dadosPet);
  return response.data;
};

// Remove um pet e seu histórico de vacinas
export const deletarPetAPI = async (idPet) => {
  const response = await api.delete(`/pets/${idPet}`);
  return response.data;
};