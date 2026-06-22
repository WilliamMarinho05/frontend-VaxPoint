import api from "./api";

export const buscarPostos = async () => {
  const response = await api.get("/info/postos");
  return response.data;
};

export const buscarCampanhas = async () => {
  const response = await api.get("/info/campanhas");
  return response.data;
};