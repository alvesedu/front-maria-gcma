import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT a cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros de resposta (ex: 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirecionar para a página de login se não autorizado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // Métodos de autenticação
  async login(credentials) {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async logout() {
    localStorage.removeItem('token');
  }

  // Métodos para usuários
  async getUsers() {
    const response = await api.get('/users');
    return response.data;
  }

  async getUser(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(userData) {
    const response = await api.post('/createUser', userData);
    return response.data;
  }

  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }

  // Métodos para questionários de autor
  async getAuthorQuestionnaires() {
    const response = await api.get('/questionnaires');
    return response.data;
  }

  async getAuthorQuestionnaire(id) {
    const response = await api.get(`/questionnaires/${id}`);
    return response.data;
  }

  async searchAuthorByCpfOrRg(cpf = null, rg = null) {
    const params = {};
    if (cpf) params.cpf = cpf;
    if (rg) params.rg = rg;
    const response = await api.get('/questionnaires', { params });
    return response.data;
  }

  async createAuthorQuestionnaire(questionnaireData) {
    const response = await api.post('/questionnaires', questionnaireData);
    return response.data;
  }

  async updateAuthorQuestionnaire(id, questionnaireData) {
    const response = await api.put(`/questionnaires/${id}`, questionnaireData);
    return response.data;
  }

  async deleteAuthorQuestionnaire(id) {
    const response = await api.delete(`/questionnaires/${id}`);
    return response.data;
  }

  // Métodos para questionários de vítima
  async getVictimQuestionnaires() {
    const response = await api.get('/vquestionnaires');
    return response.data;
  }

  async getVictimQuestionnaire(id) {
    const response = await api.get(`/vquestionnaires/${id}`);
    return response.data;
  }

  async searchVictimByCpfOrRg(cpf = null, rg = null) {
    const params = {};
    if (cpf) params.cpf = cpf;
    if (rg) params.rg = rg;
    const response = await api.get('/vquestionnaires', { params });
    return response.data;
  }

  async createVictimQuestionnaire(questionnaireData) {
    const response = await api.post('/vquestionnaires', questionnaireData);
    return response.data;
  }

  async updateVictimQuestionnaire(id, questionnaireData) {
    const response = await api.put(`/vquestionnaires/${id}`, questionnaireData);
    return response.data;
  }

  async deleteVictimQuestionnaire(id) {
    const response = await api.delete(`/vquestionnaires/${id}`);
    return response.data;
  }

   /** Retorna um array [{ _id: 'YYYY-MM', count: Number }, …] */
  async getVictimsPerMonth() {
    const res = await api.get('/reports/victims-per-month');
    return res.data;
  }

  /** Retorna um array [{ _id: 'FÍSICA', count: Number }, …] */
  async getViolenceTypesBreakdown() {
    const res = await api.get('/reports/violence-types');
    return res.data;
  }

  /** Retorna um array [{ _id: 'ANANINDEUA', count: Number }, …] */
  async getAuthorsByMunicipality() {
    const res = await api.get('/reports/authors-by-municipality');
    return res.data;
  }

   async getAvgChildren() {
    const res = await api.get('/reports/avg-children');
    return [
      { category: 'Vítimas', avg: res.data.victimsAvg || 0 },
      { category: 'Autores', avg: res.data.authorsAvg || 0 },
    ];
  }

  async getHousingIncome() {
    const res = await api.get('/reports/housing-income');
    return res.data;
  }

  async getAgeDistribution() {
    const res = await api.get('/reports/age-distribution');
    const allRanges = new Set([
      ...res.data.victims.map(d => d.label),
      ...res.data.authors.map(d => d.label),
    ]);
    return Array.from(allRanges).map(range => {
      const v = res.data.victims.find(d => d.label === range);
      const a = res.data.authors.find(d => d.label === range);
      return {
        range,
        victims: v?.count || 0,
        authors: a?.count || 0,
      };
    });
   }
}

export default new ApiService();

