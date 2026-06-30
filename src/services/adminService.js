import api from "./api";

export const adminService = {

    getMetrics: async (regiao = '') => {
        const response = await api.get(`/admin/metrics?regiao=${regiao}`);
        return response.data;
    },

    getChartVacinas: async (regiao = '') => {
        const { data } = await api.get(`/admin/chart/vacinas?regiao=${regiao}`);

        return Array.isArray(data) ? data : [];
    },

    atualizarEstoque: async (dadosEstoque) => {
        const response = await api.post('/admin/estoque', dadosEstoque);
        return response.data;
    },

    getPostos: async () => {
        const response = await api.get('/admin/postos');
        return response.data;
    },

    getVacinas: async () => {
        const response = await api.get('/admin/vacinas');
        return response.data;
    },

    criarCampanha: async (dadosCampanha) => {
        const response = await api.post('/admin/campanha', dadosCampanha);
        return response.data;
    }
};