import api from "./api";

export const loginAPI = async (email, senha) => {
  try {
    const { data } = await api.post("/auth/login", {
      email,
      senha,
    });

    if (!data.auth) {
      throw new Error(data.message || "E-mail ou senha incorretos.");
    }

    return data;
  } catch (error) {
    console.error("Erro no serviço de login:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Erro ao realizar login"
    );
  }
};

export const cadastrarUsuarioAPI = async (dadosUsuario) => {
  try {
    const { data } = await api.post("/auth/cadastro", dadosUsuario);

    if (!data.success) {
      throw new Error(data.message || "Erro ao realizar o cadastro.");
    }

    return data;
  } catch (error) {
    console.error("Erro no serviço de cadastro:", error);

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Erro ao realizar cadastro"
    );
  }
};