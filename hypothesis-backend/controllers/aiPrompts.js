// ===== aiPrompts.js - Punto de entrada para mantener compatibilidad =====

// Importar todo desde la nueva estructura
const { specificPrompts, getSpecificPrompt, COHERENCE_INSTRUCTIONS } = require('./prompts');

// Re-exportar para mantener compatibilidad con el código existente
module.exports = {
  specificPrompts,
  getSpecificPrompt,
  COHERENCE_INSTRUCTIONS
};