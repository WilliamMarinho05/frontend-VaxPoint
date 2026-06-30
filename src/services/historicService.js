// src/services/historicoService.js
import api from './api'; 

export const historicoService = {
  getHistorico: async () => {
    const response = await api.get('/historico');
    return response.data;
  }
};