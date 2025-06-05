// ===== vectorContext/contextGeneration.js - Generación de contexto =====

const config = require('./config');

class ContextGeneration {
  constructor(textProcessor) {
    this.textProcessor = textProcessor;
  }

  // Módulo de generación de contexto
  generateArtifactContext(artifact) {
    const contextParts = [
      this.generateBasicInfo(artifact),
      this.generateContentSummary(artifact),
      this.generateKeywordsSection(artifact),
      this.generatePhaseContext(artifact)
    ];
    
    return contextParts.join('\n').trim();
  }
  
  generatePhaseContext(artifact) {
    const phaseIndex = config.PHASE_ORDER.indexOf(artifact.phase);
    const phasePosition = phaseIndex >= 0 ? `${phaseIndex + 1} de ${config.PHASE_ORDER.length}` : 'desconocida';
    return `Posición en metodología: Fase ${phasePosition}
Fase actual: ${artifact.phase}`;
  }

  generateBasicInfo(artifact) {
    return `Nombre: ${artifact.name}
Fase: ${artifact.phase}
Descripción: ${artifact.description}`;
  }

  generateContentSummary(artifact) {
    const maxLength = config.SEARCH_CONFIG.MAX_CONTEXT_LENGTH;
    return `Contenido resumen: ${artifact.content.substring(0, maxLength)}...
Fecha: ${artifact.createdAt}`;
  }

  generateKeywordsSection(artifact) {
    const keywords = this.textProcessor.extractKeywords(artifact.content);
    return `Palabras clave: ${keywords}`;
  }

  // Construcción de queries
  buildSearchQuery(phase, artifactName) {
    return `${artifactName} ${phase} metodología lean startup`;
  }

  // Creación de metadata
  createChromaMetadata(artifact) {
    return {
      artifactId: artifact.id,
      hypothesisId: artifact.hypothesisId,
      phase: artifact.phase,
      name: artifact.name,
      createdAt: artifact.createdAt.toISOString(),
      keywords: this.textProcessor.extractKeywords(artifact.content),
      phaseIndex: config.PHASE_ORDER.indexOf(artifact.phase)
    };
  }
}

module.exports = ContextGeneration;