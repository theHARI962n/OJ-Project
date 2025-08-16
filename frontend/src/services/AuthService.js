import axios from 'axios';
import { API_URL } from '../../api'; 

const API = `${API_URL}/api`;
console.log("API URL is:", API_URL);

export const register = async (userData) => {
  return await axios.post(`${API}/register`, userData);
};

export const login = async (userData) => {
  return await axios.post(`${API}/login`, userData);
};
