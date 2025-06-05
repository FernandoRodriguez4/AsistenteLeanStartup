// ===== vectorContext/config.js - Configuración y constantes =====

const config = {
  // Configuración de ChromaDB
  CHROMADB_URL: process.env.CHROMADB_URL || 'http://localhost:8000',
  
  // Sistema de coherencia multi-nivel
  COHERENCE_WEIGHTS: {
    SAME_PHASE: 0.7,      // 70% peso para artefactos de la misma fase
    ADJACENT_PHASE: 0.2,  // 20% peso para fases adyacentes
    GLOBAL: 0.1          // 10% peso para coherencia global
  },
  
  // Orden lógico de las fases
  PHASE_ORDER: [
    'construir',   // Fase 1: Construir MVP
    'medir',       // Fase 2: Medir resultados
    'aprender',    // Fase 3: Aprender de los datos
    'pivotar',     // Fase 4: Pivotar si es necesario
    'iterar'       // Fase 5: Iterar y optimizar
  ],
  
  // Stop words en español
  STOP_WORDS: new Set([
    'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 
    'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las',
    'este', 'esta', 'esto', 'ese', 'esa', 'eso', 'aquel', 'aquella', 'aquello',
    'muy', 'más', 'pero', 'como', 'todo', 'bien', 'sí', 'así', 'donde', 'cuando',
    'hacer', 'puede', 'debe', 'tiene', 'será', 'está', 'han', 'hay', 'fue', 'ser'
  ]),
  
  // Configuración de búsqueda
  SEARCH_CONFIG: {
    DEFAULT_RESULTS: 5,
    COHERENCE_RESULTS: 15,
    MAX_CONTEXT_LENGTH: 500,
    TOP_KEYWORDS: 10
  },
  
  // Límites de vectorización
  VECTOR_CONFIG: {
    MIN_VECTOR_SIZE: 500,
    MIN_WORD_LENGTH: 2
  }
};

module.exports = config;