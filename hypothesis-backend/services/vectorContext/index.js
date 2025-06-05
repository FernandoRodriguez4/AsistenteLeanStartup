// ===== vectorContext/index.js - Clase principal que une todos los módulos =====

const TextProcessing = require('./textProcessing');
const VectorOperations = require('./vectorOperations');
const ContextGeneration = require('./contextGeneration');
const StorageModule = require('./storage');
const RetrievalModule = require('./retrieval');
const CoherenceModule = require('./coherence');
const StatisticsModule = require('./statistics');

class VectorContextService {
  constructor() {
    // Inicializar módulos en orden de dependencias
    this.textProcessor = new TextProcessing();
    this.vectorOps = new VectorOperations(this.textProcessor);
    this.contextGenerator = new ContextGeneration(this.textProcessor);
    this.coherence = new CoherenceModule(this.vectorOps);
    this.storage = new StorageModule(this.contextGenerator, this.vectorOps);
    this.retrieval = new RetrievalModule(
      this.storage, 
      this.vectorOps, 
      this.contextGenerator, 
      this.coherence
    );
    this.statistics = new StatisticsModule(this.coherence, this.vectorOps);
  }

  // === Métodos de almacenamiento ===
  async storeArtifactContext(artifact) {
    return await this.storage.storeArtifactContext(artifact);
  }

  async updateArtifactContext(artifact) {
    return await this.storage.updateArtifactContext(artifact);
  }

  async deleteArtifactContext(artifactId) {
    return await this.storage.deleteArtifactContext(artifactId);
  }

  // === Métodos de recuperación ===
  async getRelevantContext(hypothesisId, newArtifactPhase, newArtifactName) {
    return await this.retrieval.getRelevantContext(hypothesisId, newArtifactPhase, newArtifactName);
  }

  // === Métodos de estadísticas ===
  async getContextStats(hypothesisId) {
    return await this.statistics.getContextStats(hypothesisId);
  }

  // === Métodos expuestos de los módulos internos (si se necesitan) ===
  
  // Procesamiento de texto
  preprocessText(text) {
    return this.textProcessor.preprocessText(text);
  }

  extractKeywords(content) {
    return this.textProcessor.extractKeywords(content);
  }

  // Operaciones vectoriales
  generateEmbedding(text) {
    return this.vectorOps.generateEmbedding(text);
  }

  cosineSimilarity(vecA, vecB) {
    return this.vectorOps.cosineSimilarity(vecA, vecB);
  }

  // Generación de contexto
  generateArtifactContext(artifact) {
    return this.contextGenerator.generateArtifactContext(artifact);
  }
}

module.exports = VectorContextService;