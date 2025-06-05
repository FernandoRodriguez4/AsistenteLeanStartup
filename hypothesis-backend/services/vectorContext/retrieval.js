// ===== vectorContext/retrieval.js - Recuperación y búsqueda =====

const config = require('./config');

class RetrievalModule {
  constructor(storage, vectorOps, contextGenerator, coherence) {
    this.storage = storage;
    this.vectorOps = vectorOps;
    this.contextGenerator = contextGenerator;
    this.coherence = coherence;
  }

  // Módulo de recuperación con coherencia mejorada
  async getRelevantContext(hypothesisId, newArtifactPhase, newArtifactName) {
    try {
      const collection = await this.storage.getCollectionIfExists(hypothesisId);
      if (!collection) return null;
      
      const query = this.contextGenerator.buildSearchQuery(newArtifactPhase, newArtifactName);
      const queryEmbedding = await this.vectorOps.generateEmbedding(query);
      
      // Obtener más resultados para poder filtrar por coherencia
      const results = await this.searchInCollectionWithCoherence(collection, queryEmbedding);
      
      // Aplicar ponderación por coherencia de fase
      const scoredResults = this.coherence.applyCoherenceScoring(results, newArtifactPhase);
      
      // Retornar los más relevantes con guías de coherencia
      return this.coherence.buildCoherentContext(scoredResults, newArtifactPhase);
    } catch (error) {
      console.error(`Error al obtener contexto relevante:`, error);
      return null;
    }
  }
  
  async searchInCollectionWithCoherence(collection, queryEmbedding) {
    return await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: config.SEARCH_CONFIG.COHERENCE_RESULTS
    });
  }
  
  async searchInCollection(collection, queryEmbedding) {
    return await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: config.SEARCH_CONFIG.DEFAULT_RESULTS
    });
  }
  
  processSearchResults(results) {
    if (!this.coherence.hasValidResults(results)) {
      return null;
    }
    
    return results.documents[0].map((doc, i) => ({
      content: doc,
      metadata: results.metadatas[0][i],
      similarity: results.distances ? (1 - results.distances[0][i]) : null
    }));
  }
}

module.exports = RetrievalModule;