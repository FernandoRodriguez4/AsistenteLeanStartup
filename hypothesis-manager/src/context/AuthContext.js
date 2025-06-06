// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser, isAuthenticated } from '../services/authService';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar el usuario desde localStorage cuando el componente se monta
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setError(null);
      const user = await loginService(email, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (name, email, password) => {
    try {
      setError(null);
      const user = await registerService(name, email, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar usuario');
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    logoutService();
    setCurrentUser(null);
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Valor que se proporcionará a través del contexto
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;