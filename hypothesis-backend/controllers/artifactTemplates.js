// Archivo separado para mantener los templates y reducir el tamaño de aiController

const artifactTypes = {
  construir: [
    { name: 'MVP Personalizado', description: 'Plan detallado para construir tu producto mínimo viable.' },
    { name: 'Mapa de Empatía Personalizado', description: 'Análisis profundo de tu segmento de clientes.' },
    { name: 'Backlog de Funcionalidades', description: 'Priorización de características críticas para tu MVP.' },
    { name: 'Experimentos de Validación', description: 'Diseño de experimentos para validar tus supuestos clave.' },
    { name: 'Plan de Recursos', description: 'Estrategia para optimizar los recursos necesarios.' },
    { name: 'Estrategia de Early Adopters', description: 'Plan para conseguir tus primeros usuarios.' }
  ],
  medir: [
    { name: 'Framework de KPIs Personalizado', description: 'Indicadores clave de rendimiento para tu hipótesis.' },
    { name: 'Plan de Analítica', description: 'Estrategia para implementar análisis de datos.' },
    { name: 'Diseño de Tests A/B', description: 'Experimentos para optimizar tu solución.' },
    { name: 'Embudo de Conversión', description: 'Análisis de las etapas clave de conversión.' },
    { name: 'Sistema de Retroalimentación', description: 'Métodos para recopilar feedback de usuarios.' },
    { name: 'Dashboard de Métricas', description: 'Visualización de datos clave para tu startup.' }
  ],
  aprender: [
    { name: 'Framework de Análisis', description: 'Sistema para interpretar los datos recopilados.' },
    { name: 'Matriz de Aprendizajes', description: 'Organización de insights obtenidos.' },
    { name: 'Validación de Hipótesis', description: 'Evaluación de la validez de tu hipótesis principal.' },
    { name: 'Identificación de Patrones', description: 'Análisis de comportamientos recurrentes.' },
    { name: 'Guía de Entrevistas', description: 'Protocolo para obtener insights cualitativos.' },
    { name: 'Plan de Iteración', description: 'Estrategia para aplicar los aprendizajes obtenidos.' }
  ],
  pivotar: [
    { name: 'Matriz de Decisión', description: 'Evaluación de posibles pivotes para tu startup.' },
    { name: 'Análisis de Oportunidades', description: 'Exploración de nuevas direcciones de negocio.' },
    { name: 'Plan de Transición', description: 'Estrategia para implementar el pivote.' },
    { name: 'Comunicación de Cambios', description: 'Guía para informar a stakeholders.' },
    { name: 'Redefinición de Mercado', description: 'Análisis del nuevo segmento objetivo.' },
    { name: 'Validación Rápida', description: 'Experimentos para validar el nuevo enfoque.' }
  ],
  iterar: [
    { name: 'Plan de Optimización', description: 'Mejoras incrementales para tu solución.' },
    { name: 'Priorización RICE', description: 'Framework para priorizar mejoras.' },
    { name: 'Roadmap de Iteración', description: 'Cronograma para implementar mejoras.' },
    { name: 'Matriz de Impacto', description: 'Evaluación del impacto potencial de cada mejora.' },
    { name: 'Estrategia de Crecimiento', description: 'Plan para escalar una vez validada la solución.' },
    { name: 'Sistema de Feedback Loop', description: 'Proceso continuo de mejora basada en datos.' }
  ]
};

const getTemplatesForPhase = (phase) => {
  // Aquí irían los templates completos de artifactController.js
  // Por brevedad, retorno estructura básica
  return artifactTypes[phase] || [];
};

const getSpecificPrompt = (phase, artifactName) => {
  // Aquí irían los prompts específicos de aiController.js
  return `Genera contenido detallado y personalizado para ${artifactName} en la fase ${phase}.`;
};

const getDefaultContent = (phase, artifactName, hypothesisData) => {
  return `# ${artifactName} para ${hypothesisData.name}

## Contexto
Este artefacto proporciona un marco básico para la fase de ${phase}.

## Problema
${hypothesisData.problem}

## Solución propuesta
${hypothesisData.solution}

## Próximos pasos
1. Personalizar este artefacto según las necesidades específicas
2. Implementar las recomendaciones sugeridas
3. Validar con datos reales

**Nota**: Este es un artefacto plantilla. Para contenido personalizado, utilice la generación con IA.`;
};

module.exports = {
  artifactTypes,
  getTemplatesForPhase,
  getSpecificPrompt,
  getDefaultContent
};