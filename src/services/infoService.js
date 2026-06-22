import api from "./api";

export const buscarPostos = async () => {
  const response = await api.get("/info/postos");
  return response.data;
};

export const buscarCampanhas = async () => {
  const response = await api.get("/info/campanhas");
  return response.data;
};

export const registrarIntencaoAPI = async (dados) => {
  const response = await api.post("/info/intencao", dados);
  return response.data;
};

export const atualizarAlertaPostoAPI = async (idPosto, novoStatusAlerta) => {
  const response = await api.put(`/info/postos/${idPosto}/alerta`, { 
    alertaInstabilidade: novoStatusAlerta 
  });
  return response.data;
};