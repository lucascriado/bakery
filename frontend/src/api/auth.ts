import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Altere para o URL do seu backend

export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const getProtectedData = async (token: string) => {
  const response = await axios.get(`${API_URL}/protected`, {
    headers: {
      'x-access-token': token
    }
  });
  return response.data;
};
