import api from "./api"; // Ajuste o caminho relativo para a sua instância do axios

const campaignService = {
  /**
   * 1. Busca todas as campanhas ativas que possuem estoque acima de zero no posto selecionado
   * @param {number} idPosto - ID do posto logado
   * @returns {Promise<Array>} Lista de campanhas [{ id_campanha, titulo, publico, nome_vacina }, ...]
   */
  getCampaigns: async (idPosto) => {
    try {
      const response = await api.get(`/campaigns/campaigns?id_posto=${idPosto}`);
      return response.data;
    } catch (error) {
      console.error("Erro no serviço ao buscar campanhas do posto:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 2. Busca a fila de intenções ativas de um cidadão (humano ou pet) cruzando e-mail e data de nascimento
   * @param {string} email - E-mail do usuário/tutor
   * @param {string} dataNascimento - Data de nascimento do usuário (YYYY-MM-DD)
   * @param {number} idPosto - ID do posto atual
   * @returns {Promise<Object>} { success: true, user, intencoes: [...] }
   */
  checkIntentions: async (email, dataNascimento, idPosto) => {
    try {
      const response = await api.post("/campaigns/check-intentions", {
        email,
        data_nascimento: dataNascimento,
        id_posto: idPosto,
      });
      return response.data;
    } catch (error) {
      console.error("Erro no serviço ao checar intenções do cidadão:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 3. Confirma a presença e aplicação da vacina da campanha, movendo para o histórico e limpando a fila
   * @param {number} idIntencao - ID da intenção de vacinação que está recebendo a baixa
   * @param {number} idPosto - ID do posto onde a vacina está sendo aplicada
   * @returns {Promise<Object>} Objeto de sucesso do servidor
   */
  confirmIntention: async (idIntencao, idPosto) => {
    try {
      const response = await api.post("/campaigns/confirm-intention", {
        id_intencao: idIntencao,
        id_posto: idPosto,
      });
      return response.data;
    } catch (error) {
      console.error("Erro no serviço ao confirmar intenção de campanha:", error);
      throw error.response?.data || error.message;
    }
  },
  


  getUserPets: async (idUsuario) => {
    try {
      const response = await api.get(`/campaigns/user-pets/${idUsuario}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 5. Registra a aplicação direta
   */
  registerManualApplication: async (payload) => {
    try {
      const response = await api.post("/campaigns/register-manual", payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar aplicação:", error);
      throw error.response?.data || error.message;
    }
  },

};



export default campaignService;