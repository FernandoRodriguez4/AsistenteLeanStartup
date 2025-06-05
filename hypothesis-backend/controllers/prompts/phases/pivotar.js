// ===== phases/pivotar.js - Prompts para la fase de Pivotar =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const pivotarPrompts = {
  'Matriz de Decisión': `
    ${COHERENCE_INSTRUCTIONS.general}
    ${COHERENCE_INSTRUCTIONS.crossPhase}
    
    Para la "Matriz de Decisión", evalúa:
    
    1. OPCIONES DE PIVOTE:
       - Lista 3-5 direcciones posibles
       - Para cada una: descripción, hipótesis principal, cambios necesarios
    
    2. CRITERIOS DE EVALUACIÓN:
       - Tamaño de mercado potencial (puntuación 1-10)
       - Ajuste con capacidades actuales (1-10)
       - Velocidad de implementación (1-10)
       - Potencial de diferenciación (1-10)
       - Riesgo de ejecución (1-10)
    
    3. RECOMENDACIÓN:
       - Opción recomendada con justificación
       - Plan B si la primera opción falla
       - Criterios para evaluar éxito del pivote
    
    IMPORTANTE: Base las opciones en los aprendizajes de la fase anterior.`,
  
  'Análisis de Oportunidades': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Análisis de Oportunidades", investiga:
    
    1. NUEVOS SEGMENTOS:
       - 3 segmentos alternativos identificados
       - Tamaño y características de cada uno
       - Problema específico que enfrentan
    
    2. NUEVAS SOLUCIONES:
       - Variaciones de la solución actual
       - Soluciones completamente diferentes
       - Tecnologías emergentes aplicables
    
    3. NUEVOS MODELOS DE NEGOCIO:
       - Modelos de monetización alternativos
       - Canales de distribución diferentes
       - Partnerships estratégicos potenciales
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Plan de Transición': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Plan de Transición", detalla:
    
    1. FASE 1 - PREPARACIÓN (Semanas 1-2):
       - Comunicación interna del cambio
       - Reorganización de recursos
       - Preparación técnica inicial
    
    2. FASE 2 - IMPLEMENTACIÓN (Semanas 3-8):
       - Desarrollo del nuevo MVP
       - Migración de usuarios si aplica
       - Nuevos experimentos de validación
    
    3. FASE 3 - ESTABILIZACIÓN (Semanas 9-12):
       - Optimización basada en feedback
       - Escalamiento gradual
       - Medición de éxito del pivote
    
    ${COHERENCE_INSTRUCTIONS.crossPhase}`,
  
  'Comunicación de Cambios': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Comunicación de Cambios", prepara:
    
    1. STAKEHOLDERS INTERNOS:
       - Mensaje para el equipo: razones, visión, roles
       - Mensaje para inversores: datos, proyecciones, pedir apoyo
       - Mensaje para advisors: buscar guía específica
    
    2. STAKEHOLDERS EXTERNOS:
       - Clientes actuales: qué cambia, qué permanece, beneficios
       - Prospectos: nuevo posicionamiento
       - Partners: implicaciones de la relación
    
    3. TIMELINE DE COMUNICACIÓN:
       - Quién debe saber primero
       - Canales para cada audiencia
       - FAQs anticipadas
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Redefinición de Mercado': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Redefinición de Mercado", analiza:
    
    1. NUEVO TAM/SAM/SOM:
       - Total Addressable Market del nuevo enfoque
       - Serviceable Addressable Market realista
       - Serviceable Obtainable Market a 1 año
    
    2. NUEVA COMPETENCIA:
       - Competidores directos en el nuevo espacio
       - Competidores indirectos y sustitutos
       - Ventaja competitiva en el nuevo contexto
    
    3. NUEVO POSICIONAMIENTO:
       - Propuesta de valor refinada
       - Mensajes clave diferenciadores
       - Estrategia de go-to-market
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Validación Rápida': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Validación Rápida", diseña:
    
    1. EXPERIMENTO SMOKE TEST:
       - Landing page del nuevo enfoque
       - Métricas de interés a medir
       - Presupuesto para tráfico pagado
    
    2. PROTOTIPO RÁPIDO:
       - Funcionalidades core a prototipar
       - Herramientas no-code/low-code a usar
       - usuarios para test inicial
    
    3. CRITERIOS GO/NO-GO:
       - Métricas mínimas para proceder
       - Timeline para decisión
       - Plan si no se cumplen criterios
    
    ${COHERENCE_INSTRUCTIONS.crossPhase}`
};

module.exports = { pivotarPrompts };