import axios from 'axios';

const API = 'http://localhost:5050/api';

export const register = async (userData) => {
  return await axios.post(`${API}/register`, userData);
};

export const login = async (userData) => {
  return await axios.post(`${API}/login`, userData);
};
