import api from './api';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login'
};

const USER_STORAGE_KEY = 'user';

const persistUserData = (userData) => {
  if (userData.token) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  }
  return userData;
};

const createAuthRequest = async (endpoint, credentials) => {
  try {
    const response = await api.post(endpoint, credentials);
    return persistUserData(response.data);
  } catch (error) {
    console.error(`Error during ${endpoint} request:`, error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  const credentials = { name, email, password };
  return createAuthRequest(AUTH_ENDPOINTS.REGISTER, credentials);
};

export const login = async (email, password) => {
  const credentials = { email, password };
  return createAuthRequest(AUTH_ENDPOINTS.LOGIN, credentials);
};

export const logout = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const user = getCurrentUser();
  return Boolean(user?.token);
};
