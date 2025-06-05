// ===== phases/iterar.js - Prompts para la fase de Iterar =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const iterarPrompts = {
  'Plan de Optimización': `
    ${COHERENCE_INSTRUCTIONS.general}
    ${COHERENCE_INSTRUCTIONS.crossPhase}
    
    Para el "Plan de Optimización", detalla:
    
    1. OPTIMIZACIONES DE PRODUCTO:
       - UX/UI: mejoras basadas en heatmaps y analytics
       - Performance: tiempos de carga, estabilidad
       - Features: pulir las existentes vs agregar nuevas
    
    2. OPTIMIZACIONES DE CRECIMIENTO:
       - Funnel: dónde hay mayor oportunidad
       - Canales: optimizar CAC por canal
       - Retención: reducir churn rate
    
    3. OPTIMIZACIONES OPERACIONALES:
       - Procesos internos a automatizar
       - Costos a reducir sin impactar calidad
       - Eficiencias en el equipo
    
    IMPORTANTE: Optimiza basándote en todo el ciclo de aprendizaje previo.`,
  
  'Priorización RICE': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Priorización RICE", evalúa cada iniciativa:
    
    1. REACH (ALCANCE):
       - Número de usuarios impactados por período
       - Segmentos específicos beneficiados
       - Potencial viral o de crecimiento
    
    2. IMPACT (IMPACTO):
       - Escala: Masivo(3), Alto(2), Medio(1), Bajo(0.5), Mínimo(0.25)
       - Justificación del impacto estimado
       - Métricas que se verán afectadas
    
    3. CONFIDENCE (CONFIANZA):
       - Porcentaje de certeza en las estimaciones
       - Evidencia que soporta la confianza
       - Riesgos que reducen la confianza
    
    4. EFFORT (ESFUERZO):
       - Persona-semanas estimadas
       - Recursos necesarios
       - Dependencias y bloqueos potenciales
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Roadmap de Iteración': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Roadmap de Iteración", planifica:
    
    1. MES 1 - QUICK WINS:
       - 5-7 mejoras de bajo esfuerzo y alto impacto
       - Objetivo: momentum y moral del equipo
       - Métricas: mejoras incrementales visibles
    
    2. MES 2-3 - MEJORAS SUSTANCIALES:
       - 3-4 iniciativas de mayor envergadura
       - Objetivo: mover métricas principales
       - Hitos específicos de entrega
    
    3. MES 4-6 - INNOVACIÓN:
       - 1-2 apuestas grandes
       - Objetivo: diferenciación y crecimiento
       - Criterios de éxito/fracaso claros
    
    ${COHERENCE_INSTRUCTIONS.crossPhase}`,
  
  'Matriz de Impacto': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Matriz de Impacto", mapea:
    
    1. ALTO IMPACTO + BAJO ESFUERZO:
       - Lista de todas las iniciativas en este cuadrante
       - Orden de implementación
       - Responsables asignados
    
    2. ALTO IMPACTO + ALTO ESFUERZO:
       - Iniciativas que requieren planificación
       - Fases de implementación
       - Recursos necesarios
    
    3. ANÁLISIS DE TRADE-OFFS:
       - Qué NO haremos y por qué
       - Costo de oportunidad de cada decisión
       - Revisión periódica de prioridades
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Estrategia de Crecimiento': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Estrategia de Crecimiento", define:
    
    1. MOTORES DE CRECIMIENTO:
       - Viral: coeficiente viral actual y objetivo
       - Pagado: CAC/LTV por canal y optimización
       - Orgánico: SEO, contenido, comunidad
    
    2. EXPERIMENTOS DE CRECIMIENTO:
       - 10 experimentos priorizados
       - Hipótesis y métrica principal de cada uno
       - Recursos y timeline por experimento
    
    3. ESCALAMIENTO:
       - Triggers para escalar (métricas específicas)
       - Recursos necesarios para escalar
       - Riesgos de escalar prematuramente
    
    ${COHERENCE_INSTRUCTIONS.crossPhase}`,
  
  'Sistema de Feedback Loop': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Sistema de Feedback Loop", implementa:
    
    1. RECOLECCIÓN CONTINUA:
       - Fuentes de feedback automatizadas
       - Frecuencia de recolección
       - Herramientas y integraciones
    
    2. ANÁLISIS Y PRIORIZACIÓN:
       - Proceso semanal de revisión
       - Criterios de priorización
       - Comunicación de decisiones
    
    3. IMPLEMENTACIÓN Y MEDICIÓN:
       - Ciclos de desarrollo cortos
       - Medición de impacto post-implementación
       - Comunicación de resultados a usuarios
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`
};

module.exports = { iterarPrompts };