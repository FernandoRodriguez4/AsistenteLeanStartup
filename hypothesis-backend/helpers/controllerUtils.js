// helpers/controllerUtils.js
// Utilidades compartidas para todos los controllers

const handleError = (res, error, message = 'Error en la operación', statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ 
    message, 
    error: error.message,
    success: false,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

const validateRequiredFields = (data, fields) => {
  // Validación de tipos para evitar errores
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      missingFields: ['Invalid data object']
    };
  }
  
  if (!Array.isArray(fields)) {
    return {
      isValid: false,
      missingFields: ['Invalid fields array']
    };
  }
  
  const missing = fields.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

const validatePhase = (phase) => {
  const validPhases = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
  return validPhases.includes(phase);
};

const logOperation = (operation, details) => {
  console.log(`${operation}: ${JSON.stringify(details)}`);
};

// IMPORTANTE: Exportar las funciones
module.exports = {
  handleError,
  validateRequiredFields,
  validatePhase,
  logOperation
};