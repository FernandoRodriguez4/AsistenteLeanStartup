import axios from 'axios';

const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  HEADERS: { 'Content-Type': 'application/json' },
  STORAGE_KEY: 'user',
  TOKEN_PREFIX: 'Bearer'
};

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS
});

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(API_CONFIG.STORAGE_KEY));
  } catch {
    return null;
  }
};

const attachAuthToken = (config) => {
  const user = getStoredUser();
  const hasValidToken = user && user.token;
  
  if (hasValidToken) {
    config.headers.Authorization = `${API_CONFIG.TOKEN_PREFIX} ${user.token}`;
  }
  
  return config;
};

api.interceptors.request.use(attachAuthToken, Promise.reject);

export default api;