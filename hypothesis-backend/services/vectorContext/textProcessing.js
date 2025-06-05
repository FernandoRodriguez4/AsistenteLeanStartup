// ===== vectorContext/textProcessing.js - Procesamiento de texto y TF-IDF =====

const config = require('./config');

class TextProcessing {
  constructor() {
    this.stopWords = config.STOP_WORDS;
    this.vocabulary = new Map();
    this.documentFrequency = new Map();
    this.totalDocuments = 0;
  }

  // Módulo de procesamiento de texto
  preprocessText(text) {
    const cleanedText = this.cleanText(text);
    const words = this.tokenizeText(cleanedText);
    return this.filterWords(words);
  }

  cleanText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\sáéíóúñü]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  tokenizeText(text) {
    return text.split(' ');
  }

  filterWords(words) {
    return words
      .filter(word => word.length > config.VECTOR_CONFIG.MIN_WORD_LENGTH)
      .filter(word => !this.stopWords.has(word));
  }

  // Módulo de cálculo TF-IDF
  calculateTF(words) {
    const termFrequency = this.calculateRawTermFrequency(words);
    return this.normalizeTermFrequency(termFrequency, words.length);
  }

  calculateRawTermFrequency(words) {
    const tf = new Map();
    words.forEach(word => {
      tf.set(word, (tf.get(word) || 0) + 1);
    });
    return tf;
  }

  normalizeTermFrequency(termFrequency, totalWords) {
    const normalized = new Map();
    termFrequency.forEach((count, word) => {
      normalized.set(word, count / totalWords);
    });
    return normalized;
  }

  updateVocabulary(words) {
    const uniqueWords = new Set(words);
    this.updateVocabularyIndices(uniqueWords);
    this.updateDocumentFrequencies(uniqueWords);
    this.totalDocuments++;
  }

  updateVocabularyIndices(uniqueWords) {
    uniqueWords.forEach(word => {
      if (!this.vocabulary.has(word)) {
        this.vocabulary.set(word, this.vocabulary.size);
      }
    });
  }

  updateDocumentFrequencies(uniqueWords) {
    uniqueWords.forEach(word => {
      this.documentFrequency.set(word, (this.documentFrequency.get(word) || 0) + 1);
    });
  }

  calculateIDF(word) {
    const df = this.documentFrequency.get(word) || 1;
    return Math.log(this.totalDocuments / df);
  }

  // Extracción de palabras clave
  extractKeywords(content) {
    const words = this.preprocessText(content);
    const wordFrequencies = this.calculateWordFrequencies(words);
    return this.getTopKeywords(wordFrequencies, config.SEARCH_CONFIG.TOP_KEYWORDS);
  }

  calculateWordFrequencies(words) {
    const frequencies = {};
    words.forEach(word => {
      frequencies[word] = (frequencies[word] || 0) + 1;
    });
    return frequencies;
  }

  getTopKeywords(frequencies, limit) {
    return Object.entries(frequencies)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([word]) => word)
      .join(', ');
  }
}

module.exports = TextProcessing;