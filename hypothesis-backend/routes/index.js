const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./authRoutes');
const hypothesisRoutes = require('./hypothesisRoutes');
const artifactRoutes = require('./artifactRoutes');

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/hypotheses', hypothesisRoutes);
router.use('/artifacts', artifactRoutes);

// Ruta de salud
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta 404 para endpoints no encontrados
router.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

module.exports = router;