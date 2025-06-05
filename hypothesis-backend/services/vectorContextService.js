// ===== vectorContextService.js - Proxy para mantener compatibilidad =====

require('dotenv').config();

// Importar la nueva clase modularizada
const VectorContextService = require('./vectorContext');

// Crear y exportar una instancia única (singleton)
module.exports = new VectorContextService();