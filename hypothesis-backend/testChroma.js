// ===== testChroma.js - Script para probar ChromaDB =====
// Crea este archivo en la raíz de tu proyecto

const { ChromaClient } = require('chromadb');
const vectorContextService = require('./services/vectorContextService');
require('dotenv').config();

const HYPOTHESIS_ID = 18; // Tu hipótesis actual
const TEST_PHASE = 'aprender';
const TEST_ARTIFACT_NAME = 'Framework de Análisis';

async function testChromaConnection() {
  console.log('=== TEST 1: Conexión con ChromaDB ===');
  try {
    const client = new ChromaClient({
      path: process.env.CHROMADB_URL || 'http://localhost:8000'
    });
    
    const heartbeat = await client.heartbeat();
    console.log('✅ Conexión exitosa:', heartbeat);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('Asegúrate de que ChromaDB esté corriendo en http://localhost:8000');
    return false;
  }
  return true;
}

async function testListCollections() {
  console.log('\n=== TEST 2: Listar colecciones ===');
  try {
    const client = new ChromaClient({
      path: process.env.CHROMADB_URL || 'http://localhost:8000'
    });
    
    const collections = await client.listCollections();
    console.log(`✅ Colecciones encontradas: ${collections.length}`);
    collections.forEach(col => {
      console.log(`  - ${col.name} (${col.metadata?.description || 'Sin descripción'})`);
    });
  } catch (error) {
    console.error('❌ Error listando colecciones:', error.message);
  }
}

async function testGetCollection(hypothesisId) {
  console.log(`\n=== TEST 3: Obtener colección para hipótesis ${hypothesisId} ===`);
  try {
    const client = new ChromaClient({
      path: process.env.CHROMADB_URL || 'http://localhost:8000'
    });
    
    const collectionName = `hypothesis_${hypothesisId}`;
    const collection = await client.getCollection({ name: collectionName });
    
    console.log('✅ Colección encontrada:', collectionName);
    
    // Contar documentos
    const count = await collection.count();
    console.log(`  - Documentos almacenados: ${count}`);
    
    return collection;
  } catch (error) {
    console.error('❌ Error obteniendo colección:', error.message);
    return null;
  }
}

async function testQueryCollection(collection) {
  console.log('\n=== TEST 4: Consultar documentos en la colección ===');
  try {
    // Obtener todos los documentos (sin query)
    const allDocs = await collection.get();
    
    console.log(`✅ Total de documentos: ${allDocs.ids.length}`);
    
    // Mostrar primeros 3 documentos
    allDocs.ids.slice(0, 3).forEach((id, index) => {
      console.log(`\n📄 Documento ${index + 1}:`);
      console.log(`  - ID: ${id}`);
      console.log(`  - Metadata:`, allDocs.metadatas[index]);
      console.log(`  - Contenido (primeros 200 chars):`, 
        allDocs.documents[index].substring(0, 200) + '...');
    });
  } catch (error) {
    console.error('❌ Error consultando documentos:', error.message);
  }
}

async function testSemanticSearch(collection, query) {
  console.log(`\n=== TEST 5: Búsqueda semántica: "${query}" ===`);
  try {
    // Generar embedding para la consulta
    const queryEmbedding = await vectorContextService.generateEmbedding(query);
    
    // Buscar documentos similares
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 3
    });
    
    console.log(`✅ Encontrados ${results.ids[0].length} resultados relevantes:`);
    
    results.ids[0].forEach((id, index) => {
      const similarity = results.distances ? (1 - results.distances[0][index]) : 'N/A';
      console.log(`\n🔍 Resultado ${index + 1}:`);
      console.log(`  - ID: ${id}`);
      console.log(`  - Similitud: ${(similarity * 100).toFixed(2)}%`);
      console.log(`  - Fase: ${results.metadatas[0][index].phase}`);
      console.log(`  - Artefacto: ${results.metadatas[0][index].name}`);
      console.log(`  - Extracto:`, results.documents[0][index].substring(0, 150) + '...');
    });
  } catch (error) {
    console.error('❌ Error en búsqueda semántica:', error.message);
  }
}

async function testVectorContextService(hypothesisId, phase, artifactName) {
  console.log(`\n=== TEST 6: VectorContextService.getRelevantContext ===`);
  try {
    const context = await vectorContextService.getRelevantContext(
      hypothesisId, 
      phase, 
      artifactName
    );
    
    if (!context) {
      console.log('❌ No se encontró contexto relevante');
      return;
    }
    
    console.log('✅ Contexto relevante encontrado:');
    console.log(`  - Contextos recuperados: ${context.contexts.length}`);
    console.log(`  - Guías de coherencia:`, context.coherenceGuidelines);
    console.log(`  - Análisis de fases:`, context.phaseAnalysis);
    
    // Mostrar contextos más relevantes
    context.contexts.slice(0, 2).forEach((ctx, index) => {
      console.log(`\n📌 Contexto ${index + 1}:`);
      console.log(`  - Fase: ${ctx.metadata.phase}`);
      console.log(`  - Artefacto: ${ctx.metadata.name}`);
      console.log(`  - Puntuación final: ${(ctx.finalScore * 100).toFixed(2)}%`);
      console.log(`  - Relación de fase: ${ctx.phaseRelation}`);
    });
  } catch (error) {
    console.error('❌ Error obteniendo contexto relevante:', error.message);
  }
}

async function testContextStats(hypothesisId) {
  console.log(`\n=== TEST 7: Estadísticas de contexto ===`);
  try {
    const stats = await vectorContextService.getContextStats(hypothesisId);
    
    if (!stats) {
      console.log('❌ No se encontraron estadísticas');
      return;
    }
    
    console.log('✅ Estadísticas de contexto:');
    console.log(`  - Total de contextos: ${stats.totalContexts}`);
    console.log(`  - Fases completadas: ${stats.completedPhases}/${stats.totalPhases}`);
    console.log(`  - Coherencia global: ${(stats.globalCoherence.score * 100).toFixed(2)}%`);
    console.log(`  - Distribución por fase:`);
    
    stats.phaseDistribution.forEach(phase => {
      const coherence = stats.phaseCoherence[phase.phase] || 0;
      console.log(`    • ${phase.phase}: ${phase.count} artefactos (coherencia: ${(coherence * 100).toFixed(2)}%)`);
    });
    
    console.log(`\n  - Recomendación:`, stats.globalCoherence.recommendation);
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.message);
  }
}

// Función principal
async function runAllTests() {
  console.log('🚀 Iniciando pruebas de ChromaDB...\n');
  
  // Test 1: Conexión
  const connected = await testChromaConnection();
  if (!connected) {
    console.log('\n❌ No se pudo conectar a ChromaDB. Abortando pruebas.');
    return;
  }
  
  // Test 2: Listar colecciones
  await testListCollections();
  
  // Test 3: Obtener colección específica
  const collection = await testGetCollection(HYPOTHESIS_ID);
  
  if (collection) {
    // Test 4: Consultar documentos
    await testQueryCollection(collection);
    
    // Test 5: Búsqueda semántica
    await testSemanticSearch(collection, 'MVP funcionalidades características');
  }
  
  // Test 6: Servicio de contexto
  await testVectorContextService(HYPOTHESIS_ID, TEST_PHASE, TEST_ARTIFACT_NAME);
  
  // Test 7: Estadísticas
  await testContextStats(HYPOTHESIS_ID);
  
  console.log('\n✅ Pruebas completadas!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllTests()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };