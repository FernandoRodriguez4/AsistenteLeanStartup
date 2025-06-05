const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Configuración
const AUTH_CONFIG = {
  TOKEN_PREFIX: 'Bearer',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_for_dev',
  MESSAGES: {
    NO_TOKEN: 'No está autorizado para acceder a este recurso',
    INVALID_TOKEN: 'Token inválido',
    USER_NOT_FOUND: 'El usuario ya no existe',
    AUTH_ERROR: 'Error de autenticación'
  }
};

// Función para extraer token del header
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith(AUTH_CONFIG.TOKEN_PREFIX)) {
    return null;
  }
  return authHeader.split(' ')[1];
};

// Función para verificar y decodificar token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
  } catch (error) {
    console.error("Error al verificar token JWT:", error);
    return null;
  }
};

// Función para buscar usuario
const findUserById = async (userId) => {
  try {
    return await User.findByPk(userId);
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    return null;
  }
};

// Middleware de autenticación principal
module.exports = async (req, res, next) => {
  try {
    console.log("Verificando autenticación");
    
    // 1. Extraer token
    const token = extractToken(req.headers.authorization);
    if (!token) {
      console.log("No se proporcionó token");
      return res.status(401).json({ message: AUTH_CONFIG.MESSAGES.NO_TOKEN });
    }
    
    console.log("Token encontrado en request");
    
    // 2. Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: AUTH_CONFIG.MESSAGES.INVALID_TOKEN });
    }
    
    console.log("Token verificado correctamente para usuario ID:", decoded.id);
    
    // 3. Verificar que el usuario existe
    const user = await findUserById(decoded.id);
    if (!user) {
      console.log("Usuario no encontrado en base de datos");
      return res.status(401).json({ message: AUTH_CONFIG.MESSAGES.USER_NOT_FOUND });
    }
    
    // 4. Conceder acceso
    req.user = user;
    console.log("Autenticación exitosa para usuario:", user.email);
    next();
    
  } catch (error) {
    console.error("Error general en middleware de autenticación:", error);
    return res.status(500).json({ 
      message: AUTH_CONFIG.MESSAGES.AUTH_ERROR, 
      error: error.message 
    });
  }
};