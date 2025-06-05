// ===== phases/aprender.js - Prompts para la fase de Aprender =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const aprenderPrompts = {
  'Framework de Análisis': `
    ${COHERENCE_INSTRUCTIONS.general}
    ${COHERENCE_INSTRUCTIONS.crossPhase}
    
    Para el "Framework de Análisis", desarrolla:
    
    1. PROCESO DE ANÁLISIS:
       - Pasos específicos desde datos crudos hasta insights
       - Herramientas y técnicas de análisis
       - Roles y responsabilidades en el proceso
    
    2. CATEGORIZACIÓN DE INSIGHTS:
       - Validaciones: qué hipótesis se confirmaron
       - Refutaciones: qué hipótesis se rechazaron  
       - Descubrimientos: insights no anticipados
    
    3. PRIORIZACIÓN DE ACCIONES:
       - Matriz de impacto vs esfuerzo
       - Dependencias entre acciones
       - Timeline de implementación
    
    IMPORTANTE: Analiza los datos recopilados en la fase de medición.`,
  
  'Matriz de Aprendizajes': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Matriz de Aprendizajes", estructura:
    
    1. APRENDIZAJES POR CATEGORÍA:
       - Sobre el problema: ¿qué aprendimos?
       - Sobre la solución: ¿qué funciona y qué no?
       - Sobre el cliente: ¿qué los motiva realmente?
       - Sobre el modelo de negocio: ¿es viable?
    
    2. NIVEL DE CONFIANZA:
       - Alta confianza: validado con datos significativos
       - Media confianza: indicios pero necesita más validación
       - Baja confianza: hipótesis con evidencia limitada
    
    3. IMPLICACIONES:
       - Cambios necesarios en el producto
       - Ajustes en la estrategia
       - Nuevos experimentos requeridos
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Validación de Hipótesis': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Validación de Hipótesis", evalúa:
    
    1. HIPÓTESIS PRINCIPAL:
       - Estado actual: validada/refutada/parcial
       - Evidencia que soporta la conclusión
       - Nivel de confianza en la conclusión
    
    2. HIPÓTESIS SECUNDARIAS:
       - Lista de todas las asunciones testeadas
       - Resultado de cada test
       - Impacto en la hipótesis principal
    
    3. DECISIÓN ESTRATÉGICA:
       - Continuar con ajustes menores
       - Pivotar parcialmente
       - Pivotar completamente
       - Abandonar
    
    ${COHERENCE_INSTRUCTIONS.crossPhase}`,
  
  'Identificación de Patrones': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Identificación de Patrones", analiza:
    
    1. PATRONES DE COMPORTAMIENTO:
       - Comportamientos recurrentes observados
       - Segmentación de usuarios por comportamiento
       - Triggers que generan cada comportamiento
    
    2. PATRONES DE USO:
       - Features más y menos utilizadas
       - Flujos de navegación comunes
       - Momentos de abandono recurrentes
    
    3. PATRONES DE FEEDBACK:
       - Temas recurrentes en comentarios
       - Solicitudes más frecuentes
       - Quejas y frustraciones comunes
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Guía de Entrevistas': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Guía de Entrevistas", prepara:
    
    1. PROTOCOLO DE ENTREVISTA:
       - Guión de apertura y rapport
       - 10-15 preguntas abiertas principales
       - Preguntas de profundización
       - Cierre y siguientes pasos
    
    2. TÉCNICAS DE ENTREVISTA:
       - Cómo evitar sesgo de confirmación
       - Técnicas para profundizar (5 por qués)
       - Manejo de silencios y respuestas vagas
    
    3. ANÁLISIS POST-ENTREVISTA:
       - Template de síntesis
       - Codificación de temas
       - Identificación de insights clave
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Plan de Iteración': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Plan de Iteración", define:
    
    1. PRIORIDADES DE ITERACIÓN:
       - Top 5 mejoras basadas en aprendizajes
       - Justificación con datos para cada una
       - Impacto esperado
    
    2. SPRINTS DE ITERACIÓN:
       - Plan para próximos 3 sprints
       - Objetivos específicos por sprint
       - Métricas de éxito por sprint
    
    3. PROCESO DE VALIDACIÓN:
       - Cómo validar cada iteración
       - Criterios para rollback
       - Documentación de resultados
    
    ${COHERENCE_INSTRUCTIONS.crossPhase}`
};

module.exports = { aprenderPrompts };