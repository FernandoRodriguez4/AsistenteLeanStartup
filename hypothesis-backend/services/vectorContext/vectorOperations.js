// ===== vectorContext/vectorOperations.js - Operaciones con vectores =====

const config = require('./config');

class VectorOperations {
  constructor(textProcessor) {
    this.textProcessor = textProcessor;
  }

  // Módulo de vectorización
  generateTFIDFVector(text) {
    const words = this.textProcessor.preprocessText(text);
    const tf = this.textProcessor.calculateTF(words);
    const vector = this.createVector(tf);
    return this.normalizeVector(vector);
  }

  createVector(termFrequency) {
    const vectorSize = Math.max(config.VECTOR_CONFIG.MIN_VECTOR_SIZE, this.textProcessor.vocabulary.size);
    const vector = new Array(vectorSize).fill(0);
    
    termFrequency.forEach((tfValue, word) => {
      if (this.textProcessor.vocabulary.has(word)) {
        const index = this.textProcessor.vocabulary.get(word) % vectorSize;
        const idf = this.textProcessor.calculateIDF(word);
        vector[index] = tfValue * idf;
      }
    });
    
    return vector;
  }

  normalizeVector(vector) {
    const magnitude = this.calculateVectorMagnitude(vector);
    if (magnitude > 0) {
      return vector.map(value => value / magnitude);
    }
    return vector;
  }

  calculateVectorMagnitude(vector) {
    return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  }

  async generateEmbedding(text) {
    const words = this.textProcessor.preprocessText(text);
    this.textProcessor.updateVocabulary(words);
    return this.generateTFIDFVector(text);
  }

  // Operaciones de similitud
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;
    
    const dotProduct = this.calculateDotProduct(vecA, vecB);
    const magnitudeA = this.calculateVectorMagnitude(vecA);
    const magnitudeB = this.calculateVectorMagnitude(vecB);
    
    const magnitude = magnitudeA * magnitudeB;
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  calculateDotProduct(vecA, vecB) {
    return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  }
}

module.exports = VectorOperations;