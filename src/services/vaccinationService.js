import api from "./api"; // Ajuste o caminho relativo para o seu arquivo de configuração do axios

const vaccinationService = {
  /**
   * 1. Busca todas as vacinas do tipo 'Humano' cadastradas no sistema
   * @returns {Promise<Array>} Lista de vacinas [{ id_vacina, nome_vacina }, ...]
   */
  // Altere essa função dentro do seu vaccinationService.js
getHumanVaccines: async (idPosto) => {
  try {
    // Se passar o idPosto, a URL fica /vaccination/vaccines?id_posto=1
    const response = await api.get('/vaccination/vaccines', {
      params: idPosto ? { id_posto: idPosto } : {}
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vacinas humanas:", error);
    throw error.response?.data || error.message;
  }
},

  /**
   * 2. Busca todos os postos de saúde cadastrados
   * @returns {Promise<Array>} Lista de postos [{ id_posto, nome_posto }, ...]
   */
  getHealthPosts: async () => {
    try {
      const response = await api.get("/vaccination/posts");
      return response.data;
    } catch (error) {
      console.error("Erro no serviço ao buscar postos:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 3. Verifica se um cidadão existe cruzando e-mail e data de nascimento
   * @param {string} email - E-mail do usuário
   * @param {string} dataNascimento - Data de nascimento (YYYY-MM-DD)
   * @returns {Promise<Object>} Objeto com success e os dados do usuário { success, user: { id_usuario, nome } }
   */
  checkUserExistence: async (email, dataNascimento) => {
    try {
      const response = await api.post("/vaccination/check-user", {
        email,
        data_nascimento: dataNascimento,
      });
      return response.data;
    } catch (error) {
      console.error("Erro no serviço ao verificar usuário:", error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * 4. Registra a aplicação de uma vacina de rotina e abate o estoque do posto
   * @param {number} idUsuario - ID do cidadão que recebeu a dose
   * @param {number} idVacina - ID da vacina aplicada
   * @param {number} idPosto - ID do posto onde ocorreu o atendimento
   * @returns {Promise<Object>} Mensagem de sucesso do servidor
   */
  confirmRoutineApplication: async (idUsuario, idVacina, idPosto) => {
    try {
      const response = await api.post("/vaccination/confirm-routine", {
        id_usuario: idUsuario,
        id_vacina: idVacina,
        id_posto: idPosto,
      });
      return response.data;
    } catch (error) {
      console.error("Erro no serviço ao confirmar aplicação:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default vaccinationService;