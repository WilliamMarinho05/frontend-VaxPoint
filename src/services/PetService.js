import api from "./api";

// AJUSTADO: Agora recebe o idUsuario para trazer apenas os pets dele
export const buscarPetsAPI = async () => {
  const response = await api.get("/pets/meus");
  return response.data;
};

// Busca todas as raças cadastradas no sistema (para carregar o select do formulário)
// Substitua apenas a função buscarRacasAPI dentro do seu petService.js:

export const buscarRacasAPI = async () => {
  // Força o caminho completo para garantir que bata no app.use('/api/pets', petRoutes)
  const response = await api.get("/pets/racas"); 
  return response.data;
};

// Busca o histórico de vacinas de um pet específico
export const buscarVacinasDoPetAPI = async (idPet) => {
  const response = await api.get(`/pets/historico/${idPet}`);
  return response.data;
};

// Cria um novo pet no banco de dados (O payload 'dadosPet' já vai com id_usuario de quem está logado!)
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