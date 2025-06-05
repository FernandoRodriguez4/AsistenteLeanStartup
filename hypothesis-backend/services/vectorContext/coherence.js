// ===== vectorContext/coherence.js - Sistema de coherencia =====

const config = require('./config');

class CoherenceModule {
  constructor(vectorOps) {
    this.vectorOps = vectorOps;
  }

  // Aplicar ponderación por coherencia de fase
  applyCoherenceScoring(results, targetPhase) {
    if (!this.hasValidResults(results)) {
      return [];
    }
    
    return results.documents[0].map((doc, i) => {
      const metadata = results.metadatas[0][i];
      const baseSimilarity = results.distances ? (1 - results.distances[0][i]) : 0.5;
      
      // Calcular peso según la fase
      const phaseWeight = this.calculatePhaseWeight(metadata.phase, targetPhase);
      const finalScore = baseSimilarity * phaseWeight;
      
      return {
        content: doc,
        metadata: metadata,
        similarity: baseSimilarity,
        phaseWeight: phaseWeight,
        finalScore: finalScore,
        phaseRelation: this.getPhaseRelation(metadata.phase, targetPhase)
      };
    }).sort((a, b) => b.finalScore - a.finalScore);
  }
  
  calculatePhaseWeight(contextPhase, targetPhase) {
    if (contextPhase === targetPhase) {
      return config.COHERENCE_WEIGHTS.SAME_PHASE;
    } else if (this.areAdjacentPhases(contextPhase, targetPhase)) {
      return config.COHERENCE_WEIGHTS.ADJACENT_PHASE;
    }
    return config.COHERENCE_WEIGHTS.GLOBAL;
  }
  
  areAdjacentPhases(phase1, phase2) {
    const idx1 = config.PHASE_ORDER.indexOf(phase1);
    const idx2 = config.PHASE_ORDER.indexOf(phase2);
    return Math.abs(idx1 - idx2) === 1;
  }
  
  getPhaseRelation(contextPhase, targetPhase) {
    if (contextPhase === targetPhase) return 'same-phase';
    if (this.areAdjacentPhases(contextPhase, targetPhase)) return 'adjacent-phase';
    return 'cross-phase';
  }
  
  // Construir contexto coherente
  buildCoherentContext(scoredResults, targetPhase) {
    // Tomar los 5 mejores resultados ponderados
    const topResults = scoredResults.slice(0, 5);
    
    // Generar guías de coherencia basadas en el contexto
    const coherenceGuidelines = this.generateCoherenceGuidelines(topResults, targetPhase);
    
    return {
      contexts: topResults,
      coherenceGuidelines: coherenceGuidelines,
      phaseAnalysis: this.analyzePhaseDistribution(topResults)
    };
  }
  
  generateCoherenceGuidelines(relevantContexts, currentPhase) {
    const guidelines = {
      terminology: new Set(),
      keyThemes: new Set(),
      constraints: [],
      recommendations: []
    };
    
    // Extraer terminología común
    relevantContexts.forEach(ctx => {
      if (ctx.metadata.keywords) {
        ctx.metadata.keywords.split(', ').forEach(kw => guidelines.terminology.add(kw));
      }
    });
    
    // Agregar restricciones según la fase
    const phaseIndex = config.PHASE_ORDER.indexOf(currentPhase);
    
    if (phaseIndex > 0) {
      guidelines.constraints.push('Mantener consistencia con decisiones de fases anteriores');
    }
    
    // Recomendaciones según contextos de la misma fase
    const samePhaseContexts = relevantContexts.filter(ctx => ctx.phaseRelation === 'same-phase');
    if (samePhaseContexts.length > 0) {
      guidelines.recommendations.push('Alinear con artefactos existentes de la misma fase');
    }
    
    return {
      terminology: Array.from(guidelines.terminology).slice(0, 10),
      constraints: guidelines.constraints,
      recommendations: guidelines.recommendations,
      phaseContext: `Fase actual: ${currentPhase} (${phaseIndex + 1}/${config.PHASE_ORDER.length})`
    };
  }
  
  analyzePhaseDistribution(contexts) {
    const distribution = {};
    
    contexts.forEach(ctx => {
      const relation = ctx.phaseRelation;
      distribution[relation] = (distribution[relation] || 0) + 1;
    });
    
    return {
      samePhase: distribution['same-phase'] || 0,
      adjacentPhase: distribution['adjacent-phase'] || 0,
      crossPhase: distribution['cross-phase'] || 0
    };
  }

  // Cálculo de coherencia promedio
  async calculateAverageCoherence(artifacts) {
    if (artifacts.length < 2) return 0;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    // Comparar cada par de artefactos
    for (let i = 0; i < artifacts.length - 1; i++) {
      for (let j = i + 1; j < artifacts.length; j++) {
        const embedding1 = JSON.parse(artifacts[i].embedding);
        const embedding2 = JSON.parse(artifacts[j].embedding);
        const similarity = this.vectorOps.cosineSimilarity(embedding1, embedding2);
        totalSimilarity += similarity;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }

  // Recomendaciones de coherencia
  getCoherenceRecommendation(score) {
    if (score > 0.7) {
      return 'Excelente coherencia entre fases. El proyecto mantiene una narrativa sólida.';
    } else if (score > 0.5) {
      return 'Buena coherencia. Considere revisar transiciones entre fases para mayor consistencia.';
    } else if (score > 0.3) {
      return 'Coherencia moderada. Se recomienda alinear mejor los artefactos entre fases.';
    }
    return 'Baja coherencia. Revise y actualice artefactos para mantener consistencia.';
  }

  // Validación de resultados
  hasValidResults(results) {
    return results.documents && 
           results.documents[0] && 
           results.documents[0].length > 0;
  }
}

module.exports = CoherenceModule;