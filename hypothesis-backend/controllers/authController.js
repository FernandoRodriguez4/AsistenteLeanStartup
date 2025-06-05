const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { handleError, validateRequiredFields, logOperation } = require('../helpers/controllerUtils');

const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_for_development',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d'
};

const generateToken = (id) => jwt.sign({ id }, JWT_CONFIG.SECRET, { expiresIn: JWT_CONFIG.EXPIRES_IN });

const createUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  token: generateToken(user.id)
});

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    logOperation('Registro', { email });
    
    // Corregido: orden correcto de parámetros
    const validation = validateRequiredFields(req.body, ['name', 'email', 'password']);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Campos requeridos faltantes',
        missingFields: validation.missingFields 
      });
    }
    
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });
    
    const user = await User.create({ name, email, password });
    res.status(201).json(createUserResponse(user));
  } catch (error) {
    handleError(res, error, 'Error al registrar usuario');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logOperation('Login', { email });
    
    // Corregido: orden correcto de parámetros
    const validation = validateRequiredFields(req.body, ['email', 'password']);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Campos requeridos faltantes',
        missingFields: validation.missingFields 
      });
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });
    
    res.json(createUserResponse(user));
  } catch (error) {
    handleError(res, error, 'Error al iniciar sesión');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    handleError(res, error, 'Error al obtener información del usuario');
  }
};