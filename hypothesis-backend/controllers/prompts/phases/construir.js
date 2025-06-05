// ===== phases/construir.js - Prompts para la fase de Construir =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const construirPrompts = {
  'MVP Personalizado': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el artefacto "MVP Personalizado", desarrolla los siguientes puntos específicos:
    
    1. CARACTERÍSTICAS CRÍTICAS DEL MVP:
       - Identifica 3-7 características esenciales que DEBEN estar en el MVP
       - Explica por qué cada característica es crítica para validar la hipótesis principal
       - Describe las funcionalidades mínimas de cada característica
       - Señala qué características pueden dejarse para iteraciones futuras y por qué
    
    2. PLAN DE DESARROLLO:
       - Cronograma detallado con fases específicas y duraciones estimadas
       - Recursos necesarios (técnicos, humanos, financieros)
       - Metodología de desarrollo recomendada considerando las limitaciones
       - Tecnologías o frameworks sugeridos para desarrollar el MVP rápidamente
    
    3. DISEÑO DE EXPERIMENTOS:
       - Diseña 2-3 experimentos específicos para validar las asunciones más críticas
       - Define métricas de éxito cuantificables para cada experimento
       - Establece umbrales de éxito/fracaso claros para cada métrica
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Mapa de Empatía Personalizado': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Mapa de Empatía Personalizado", desarrolla:
    
    1. PERFIL DETALLADO DEL CLIENTE:
       - ¿Qué PIENSA y SIENTE? Sus preocupaciones principales, aspiraciones, miedos
       - ¿Qué OYE? Influencias, medios que consume, opiniones que recibe
       - ¿Qué VE? Su entorno, competencia, opciones disponibles
       - ¿Qué DICE y HACE? Comportamiento público, actitud, apariencia
    
    2. PUNTOS DE DOLOR ESPECÍFICOS:
       - Lista 5-7 frustraciones principales relacionadas con el problema
       - Prioriza por intensidad e impacto en su vida diaria
    
    3. GANANCIAS DESEADAS:
       - ¿Qué desea lograr realmente?
       - ¿Cómo mediría el éxito desde su perspectiva?
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Backlog de Funcionalidades': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Backlog de Funcionalidades", estructura:
    
    1. ÉPICAS PRINCIPALES:
       - Define 3-5 épicas que representen las áreas principales del producto
       - Para cada épica, explica su valor de negocio
    
    2. USER STORIES PRIORITIZADAS:
       - Escribe 10-15 user stories siguiendo el formato: "Como [usuario], quiero [funcionalidad], para [beneficio]"
       - Asigna puntos de historia basados en complejidad
       - Ordena por valor vs esfuerzo
    
    3. CRITERIOS DE ACEPTACIÓN:
       - Para las 5 historias principales, define criterios claros de aceptación
       - Incluye casos edge y consideraciones técnicas
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Experimentos de Validación': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para "Experimentos de Validación", diseña:
    
    1. EXPERIMENTO DE PROBLEMA:
       - Hipótesis específica sobre el problema
       - Método de validación (entrevistas, encuestas, observación)
       - Tamaño de muestra y criterios de selección
       - Preguntas o métricas específicas
       - Criterio de éxito/fracaso
    
    2. EXPERIMENTO DE SOLUCIÓN:
       - Prototipo o mockup a utilizar
       - Métricas de engagement a medir
       - Método de recolección de datos
       - Timeline del experimento
    
    3. EXPERIMENTO DE MODELO DE NEGOCIO:
       - Test de disposición a pagar
       - Canales de adquisición a probar
       - Métricas de unit economics objetivo
    
    ${COHERENCE_INSTRUCTIONS.crossPhase}`,
  
  'Plan de Recursos': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para el "Plan de Recursos", detalla:
    
    1. RECURSOS HUMANOS:
       - Roles críticos necesarios y cuándo incorporarlos
       - Habilidades específicas requeridas
       - Opciones de contratación (tiempo completo, freelance, cofundadores)
    
    2. RECURSOS TÉCNICOS:
       - Stack tecnológico recomendado y justificación
       - Herramientas y servicios necesarios
       - Costos estimados mensuales
    
    3. RECURSOS FINANCIEROS:
       - Presupuesto para los primeros 6 meses
       - Burn rate objetivo
       - Hitos para buscar financiamiento
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Estrategia de Early Adopters': `
    ${COHERENCE_INSTRUCTIONS.general}
    
    Para la "Estrategia de Early Adopters", desarrolla:
    
    1. PERFIL DEL EARLY ADOPTER:
       - Características psicográficas específicas
       - Dónde encontrarlos (online y offline)
       - Qué los motiva a probar soluciones nuevas
    
    2. CANALES DE ADQUISICIÓN:
       - Top 3 canales más efectivos para alcanzarlos
       - Mensajes específicos para cada canal
       - Presupuesto y ROI esperado por canal
    
    3. PROGRAMA DE ONBOARDING:
       - Experiencia del primer uso
       - Incentivos para early adopters
       - Sistema de referidos
    
    ${COHERENCE_INSTRUCTIONS.samePhase}`
};

module.exports = { construirPrompts };