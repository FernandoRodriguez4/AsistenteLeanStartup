// ===== vectorContext/statistics.js - Estadísticas y análisis =====

const { ArtifactContext } = require('../../models');
const config = require('./config');

class StatisticsModule {
  constructor(coherence, vectorOps) {
    this.coherence = coherence;
    this.vectorOps = vectorOps;
  }

  // Módulo de estadísticas con análisis de coherencia
  async getContextStats(hypothesisId) {
    try {
      const totalContexts = await this.countContexts(hypothesisId);
      const phaseDistribution = await this.getPhaseDistribution(hypothesisId);
      const phaseCoherence = await this.calculatePhaseCoherence(hypothesisId);
      const globalCoherence = await this.calculateGlobalCoherence(hypothesisId);
      
      return {
        totalContexts,
        phaseDistribution: this.formatPhaseDistribution(phaseDistribution),
        phaseCoherence: phaseCoherence,
        globalCoherence: globalCoherence,
        completedPhases: Object.keys(phaseCoherence).length,
        totalPhases: config.PHASE_ORDER.length
      };
    } catch (error) {
      console.error(`Error al obtener estadísticas de contexto:`, error);
      return null;
    }
  }
  
  async calculatePhaseCoherence(hypothesisId) {
    const coherenceByPhase = {};
    
    for (const phase of config.PHASE_ORDER) {
      const phaseArtifacts = await ArtifactContext.findAll({
        where: { hypothesisId, phase },
        limit: 10
      });
      
      if (phaseArtifacts.length >= 2) {
        const coherence = await this.coherence.calculateAverageCoherence(phaseArtifacts);
        if (coherence > 0) {
          coherenceByPhase[phase] = coherence;
        }
      }
    }
    
    return coherenceByPhase;
  }
  
  async calculateGlobalCoherence(hypothesisId) {
    try {
      const allContexts = await ArtifactContext.findAll({
        where: { hypothesisId },
        order: [['phaseIndex', 'ASC'], ['createdAt', 'ASC']],
        limit: 50
      });
      
      if (allContexts.length < 2) {
        return { score: 1, message: 'Insuficientes artefactos para análisis' };
      }
      
      // Analizar coherencia entre fases adyacentes
      let totalTransitionCoherence = 0;
      let transitionCount = 0;
      const phaseTransitions = {};
      
      for (let i = 0; i < allContexts.length - 1; i++) {
        const current = allContexts[i];
        const next = allContexts[i + 1];
        
        // Si son de fases diferentes, calcular coherencia de transición
        if (current.phase !== next.phase) {
          const embedding1 = JSON.parse(current.embedding);
          const embedding2 = JSON.parse(next.embedding);
          const similarity = this.vectorOps.cosineSimilarity(embedding1, embedding2);
          
          const transitionKey = `${current.phase}->${next.phase}`;
          phaseTransitions[transitionKey] = similarity;
          totalTransitionCoherence += similarity;
          transitionCount++;
        }
      }
      
      const avgCoherence = transitionCount > 0 ? totalTransitionCoherence / transitionCount : 1;
      
      return {
        score: avgCoherence,
        transitions: phaseTransitions,
        recommendation: this.coherence.getCoherenceRecommendation(avgCoherence)
      };
    } catch (error) {
      console.error('Error calculando coherencia global:', error);
      return { score: 0, message: 'Error en cálculo' };
    }
  }

  async countContexts(hypothesisId) {
    return await ArtifactContext.count({
      where: { hypothesisId }
    });
  }

  async getPhaseDistribution(hypothesisId) {
    const { Sequelize } = require('sequelize');
    
    return await ArtifactContext.findAll({
      where: { hypothesisId },
      attributes: [
        'phase',
        [Sequelize.fn('COUNT', Sequelize.col('phase')), 'count']
      ],
      group: ['phase']
    });
  }

  formatPhaseDistribution(distribution) {
    return distribution.map(item => ({
      phase: item.phase,
      count: parseInt(item.dataValues.count)
    }));
  }
}

module.exports = StatisticsModule;