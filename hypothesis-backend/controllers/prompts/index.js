// ===== prompts/index.js - Archivo principal que exporta todos los prompts =====

const { COHERENCE_INSTRUCTIONS } = require('./coherenceInstructions');
const { construirPrompts } = require('./phases/construir');
const { medirPrompts } = require('./phases/medir');
const { aprenderPrompts } = require('./phases/aprender');
const { pivotarPrompts } = require('./phases/pivotar');
const { iterarPrompts } = require('./phases/iterar');

// Combinar todos los prompts específicos en un solo objeto
const specificPrompts = {
  construir: construirPrompts,
  medir: medirPrompts,
  aprender: aprenderPrompts,
  pivotar: pivotarPrompts,
  iterar: iterarPrompts
};

/**
 * Obtiene el prompt específico para un artefacto
 * @param {string} phase - La fase del proceso (construir, medir, etc.)
 * @param {string} artifactName - El nombre del artefacto
 * @returns {string} El prompt específico o uno genérico si no existe
 */
const getSpecificPrompt = (phase, artifactName) => {
  // Si existe un prompt específico, úsalo
  if (specificPrompts[phase] && specificPrompts[phase][artifactName]) {
    return `
RECUERDA: DEBES basar TODO el contenido en la hipótesis específica proporcionada.
No uses ejemplos genéricos. Cada punto debe relacionarse directamente con:
- El problema identificado en la hipótesis
- La solución propuesta
- El segmento de clientes definido
- La propuesta de valor específica

${specificPrompts[phase][artifactName]}`;
  }
  
  // Si no, usa el prompt genérico con instrucciones de coherencia
  return `
    ${COHERENCE_INSTRUCTIONS.general}
    
    IMPORTANTE: Basa TODO el contenido en la hipótesis específica proporcionada arriba.
    
    Por favor, genera contenido detallado, práctico y personalizado para este artefacto.
    Incluye:
    1. Introducción al propósito del artefacto EN EL CONTEXTO DE ESTA HIPÓTESIS
    2. Análisis de la situación actual basado ESPECÍFICAMENTE en el problema de la hipótesis
    3. Recomendaciones específicas y accionables PARA ESTA SOLUCIÓN
    4. Ejemplos concretos adaptados AL SEGMENTO DE CLIENTES DEFINIDO
    5. Próximos pasos claros PARA ESTA PROPUESTA DE VALOR
    
    NO generes contenido genérico. Todo debe ser específico para esta hipótesis.
    
    Organiza tu respuesta en secciones con formato markdown para facilitar su lectura.`;
};

module.exports = {
  specificPrompts,
  getSpecificPrompt,
  COHERENCE_INSTRUCTIONS
};