// ===== coherenceInstructions.js - Instrucciones de coherencia reutilizables =====

const COHERENCE_INSTRUCTIONS = {
  general: `
INSTRUCCIONES DE COHERENCIA:
- Mantén consistencia con la terminología establecida en artefactos previos
- Asegura que las decisiones y conclusiones sean coherentes con fases anteriores
- Usa el mismo tono y nivel de detalle que los artefactos existentes
- Referencia explícitamente artefactos anteriores cuando sea relevante
- Evita contradicciones con información ya establecida`,
  
  samePhase: `
COHERENCIA DENTRO DE LA FASE:
- Este artefacto debe complementar y expandir los artefactos existentes de la misma fase
- No repitas información ya cubierta, construye sobre ella
- Mantén el mismo enfoque metodológico que otros artefactos de la fase
- Asegura que todos los artefactos de la fase cuenten una historia coherente`,
  
  crossPhase: `
COHERENCIA ENTRE FASES:
- Las conclusiones de fases anteriores deben informar este artefacto
- Muestra cómo este trabajo evoluciona desde las fases previas
- Prepara el terreno para las fases siguientes
- Mantén una narrativa consistente a través del proyecto`
};

module.exports = { COHERENCE_INSTRUCTIONS };