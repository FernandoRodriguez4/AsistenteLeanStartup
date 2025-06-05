// ===== phases/medir.js - Prompts para la fase de Medir =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const medirPrompts = {
  'Framework de KPIs Personalizado': `
    ${COHERENCE_INSTRUCTIONS.general}
    ${COHERENCE_INSTRUCTIONS.crossPhase}
    
    Para el "Framework de KPIs Personalizado", establece:
    
    1. MÉTRICAS NORTH STAR:
       - Define LA métrica principal que indica éxito
       - Explica por qué esta métrica sobre todas las demás
       - Cómo se calcula exactamente
    
    2. MÉTRICAS SECUNDARIAS:
       - 5-7 KPIs que alimentan la métrica North Star
       - Para cada una: definición, fórmula, frecuencia de medición
       - Benchmarks de la industria si están disponibles
    
    3. MÉTRICAS DE SALUD:
       - Indicadores de problemas potenciales
       - Umbrales de alerta
       - Plan de acción si se cruzan los umbrales
    
    IMPORTANTE: Las métricas deben medir el éxito del MVP construido en la fase anterior.`,
  
  'Plan de Analítica': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Plan de Analítica", especifica:
    
    1. ARQUITECTURA DE DATOS:
       - Eventos críticos a trackear
       - Propiedades de usuarios y eventos
       - Herramientas de analytics recomendadas
    
    2. DASHBOARDS PRINCIPALES:
       - Dashboard ejecutivo: métricas clave
       - Dashboard operacional: métricas diarias
       - Dashboard de producto: comportamiento de usuarios
    
    3. PROCESOS DE ANÁLISIS:
       - Rutina semanal de revisión de métricas
       - Análisis mensual profundo
       - Experimentos continuos
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Diseño de Tests A/B': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Diseño de Tests A/B", estructura:
    
    1. PRIORIZACIÓN DE TESTS:
       - Lista de 10 posibles tests ordenados por impacto potencial
       - Para los top 3: hipótesis, variantes, métricas objetivo
    
    2. DISEÑO ESTADÍSTICO:
       - Tamaño de muestra necesario
       - Duración estimada del test
       - Nivel de confianza y poder estadístico
    
    3. PLAN DE IMPLEMENTACIÓN:
       - Roadmap de tests para 3 meses
       - Recursos necesarios
       - Proceso de documentación de resultados
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Embudo de Conversión': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Embudo de Conversión", detalla:
    
    1. ETAPAS DEL EMBUDO:
       - Define cada etapa desde awareness hasta retención
       - Acciones específicas del usuario en cada etapa
       - Tasas de conversión objetivo entre etapas
    
    2. ANÁLISIS DE FRICCIÓN:
       - Identifica los 3 principales puntos de abandono
       - Hipótesis sobre causas de abandono
       - Experimentos para reducir fricción
    
    3. OPTIMIZACIÓN:
       - Quick wins para mejorar conversión
       - Iniciativas a mediano plazo
       - Rediseños mayores si fueran necesarios
    
    ${COHERENCE_INSTRUCTIONS.crossPhase}`,
  
  'Sistema de Retroalimentación': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Sistema de Retroalimentación", diseña:
    
    1. CANALES DE FEEDBACK:
       - In-app: dónde y cuándo solicitar
       - Email: frecuencia y segmentación
       - Entrevistas: criterios de selección de usuarios
    
    2. PROCESAMIENTO:
       - Categorización de feedback
       - Priorización basada en frecuencia e impacto
       - SLA de respuesta por tipo de feedback
    
    3. CIERRE DEL LOOP:
       - Cómo comunicar cambios a usuarios
       - Programa de beta testers
       - Reconocimiento a contribuidores
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Dashboard de Métricas': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Dashboard de Métricas", especifica:
    
    1. MÉTRICAS EN TIEMPO REAL:
       - Usuarios activos actuales
       - Transacciones/acciones en progreso
       - Estado de sistemas críticos
    
    2. MÉTRICAS DIARIAS:
       - Nuevos usuarios y activaciones
       - Engagement y retención
       - Revenue y métricas financieras
    
    3. TENDENCIAS Y PROYECCIONES:
       - Crecimiento MoM y YoY
       - Proyecciones basadas en tendencias
       - Alertas de desviaciones significativas
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`
};

module.exports = { medirPrompts };