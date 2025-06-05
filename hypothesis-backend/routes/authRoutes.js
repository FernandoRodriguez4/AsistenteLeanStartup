const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { registerValidation, loginValidation } = require('./validators/authValidators');

// Rutas públicas con validación
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);

// Rutas protegidas
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;