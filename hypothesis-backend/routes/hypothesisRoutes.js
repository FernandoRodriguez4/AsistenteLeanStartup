// routes/hypothesisRoutes.js

const express = require('express');
const router = express.Router();
const hypothesisController = require('../controllers/hypothesisController');
const authMiddleware = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de hipótesis
router.get('/', hypothesisController.getHypotheses);
router.get('/:id', hypothesisController.getHypothesisById);
router.post('/', hypothesisController.createHypothesis);
router.put('/:id', hypothesisController.updateHypothesis);
router.delete('/:id', hypothesisController.deleteHypothesis);

module.exports = router;