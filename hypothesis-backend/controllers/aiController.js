const { Hypothesis, Artifact } = require('../models');
const axios = require('axios');
const vectorContextService = require('../services/vectorContextService');
const { handleError, validatePhase, logOperation } = require('../helpers/controllerUtils');
const { getSpecificPrompt } = require('./aiPrompts');
require('dotenv').config();

const AI_CONFIG = {
  SERVICE_URL: process.env.AI_SERVICE_URL || 'https://api.deepseek.com/v1/chat/completions',
  API_KEY: process.env.AI_API_KEY,
  MODEL: "deepseek-chat",
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000
};

const ARTIFACT_TEMPLATES = require('./artifactTemplates');

const createAIRequest = async (prompt) => {
  return axios.post(
    AI_CONFIG.SERVICE_URL,
    {
      model: AI_CONFIG.MODEL,
      messages: [
        { role: "system", content: "Eres un consultor experto en metodología Lean Startup con amplia experiencia ayudando a startups a validar sus hipótesis. Generas artefactos coherentes que se integran perfectamente con el trabajo previo, manteniendo consistencia tanto dentro de cada fase como entre fases diferentes." },
        { role: "user", content: prompt }
      ],
      temperature: AI_CONFIG.TEMPERATURE,
      max_tokens: AI_CONFIG.MAX_TOKENS
    },
    { headers: { 'Authorization': `Bearer ${AI_CONFIG.API_KEY}`, 'Content-Type': 'application/json' } }
  );
};

const buildBasePrompt = (phase, hypothesisData, artifactName) => `
Actúa como un consultor experto especializado en metodología Lean Startup con más de 10 años de experiencia.
Estás generando un artefacto específico llamado "${artifactName}" para la fase de "${phase}".

DETALLES DE LA HIPÓTESIS:
- Nombre: ${hypothesisData.name}
- Problema: ${hypothesisData.problem}
- Solución: ${hypothesisData.solution}
- Segmento de Clientes: ${hypothesisData.customerSegment}
- Propuesta de Valor: ${hypothesisData.valueProposition}

IMPORTANTE: 
- Este artefacto debe estar COMPLETAMENTE BASADO en la hipótesis anterior
- Usa los detalles específicos del problema, solución, segmento y propuesta de valor
- NO generes ejemplos genéricos, todo debe ser específico para esta hipótesis
- Mantén coherencia con el trabajo previo y prepara el terreno para las fases siguientes

Genera contenido detallado y personalizado basándote ÚNICAMENTE en esta hipótesis específica.
`;

const getContextualPrompt = async (hypothesisId, phase, artifactName) => {
  try {
    const contextResult = await vectorContextService.getRelevantContext(hypothesisId, phase, artifactName);
    if (!contextResult || !contextResult.contexts?.length) return '';
    
    const { contexts, coherenceGuidelines } = contextResult;
    
    // Separar contextos por fase
    const samePhaseContexts = contexts.filter(ctx => ctx.metadata.phase === phase);
    const adjacentPhaseContexts = contexts.filter(ctx => ctx.metadata.phase !== phase);
    
    let prompt = '\n\n=== CONTEXTO Y COHERENCIA ===\n';
    
    // Contextos de la misma fase
    if (samePhaseContexts.length > 0) {
      prompt += '\nARTEFACTOS DE LA MISMA FASE (Mantener alta coherencia):\n';
      samePhaseContexts.forEach((ctx, i) => {
        prompt += `\nArtefacto ${i + 1} - ${ctx.metadata.name}:\n${ctx.content}\n`;
        prompt += `Relevancia: ${(ctx.similarity * 100).toFixed(1)}%\n`;
      });
    }
    
    // Contextos de fases relacionadas
    if (adjacentPhaseContexts.length > 0) {
      prompt += '\n\nARTEFACTOS DE FASES RELACIONADAS (Mantener continuidad):\n';
      adjacentPhaseContexts.forEach((ctx, i) => {
        prompt += `\nFase ${ctx.metadata.phase} - ${ctx.metadata.name}:\n${ctx.content}\n`;
      });
    }
    
    // Guías de coherencia
    if (coherenceGuidelines) {
      prompt += '\n\nGUÍAS DE COHERENCIA:\n';
      prompt += `- Terminología clave a mantener: ${coherenceGuidelines.terminology.join(', ')}\n`;
      prompt += `- ${coherenceGuidelines.phaseContext}\n`;
      coherenceGuidelines.constraints.forEach(constraint => {
        prompt += `- ${constraint}\n`;
      });
    }
    
    prompt += '\n\nIMPORTANTE: Mantén coherencia con los artefactos existentes, especialmente con los de la misma fase.';
    
    return prompt;
  } catch (error) {
    console.error('Error al obtener contexto:', error);
    return '';
  }
};

const getPhaseTransitionPrompt = (currentPhase, previousPhases) => {
  if (!previousPhases || previousPhases.length === 0) return '';
  
  let prompt = '\n\n=== TRANSICIÓN ENTRE FASES ===\n';
  prompt += 'Este artefacto debe construir sobre el trabajo de fases anteriores:\n';
  
  previousPhases.forEach(phase => {
    prompt += `- Fase "${phase}": Asegúrate de que las decisiones y aprendizajes de esta fase se reflejen\n`;
  });
  
  prompt += '\nMantén una narrativa coherente que muestre la evolución del proyecto a través de las fases.';
  
  return prompt;
};

const generatePrompt = async (phase, hypothesisData, artifactName) => {
  const basePrompt = buildBasePrompt(phase, hypothesisData, artifactName);
  const contextPrompt = await getContextualPrompt(hypothesisData.id, phase, artifactName);
  const specificPrompt = getSpecificPrompt(phase, artifactName);
  
  // Obtener fases anteriores completadas
  const stats = await vectorContextService.getContextStats(hypothesisData.id);
  const completedPhases = stats?.phaseDistribution?.map(p => p.phase) || [];
  const phaseOrder = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
  const currentPhaseIndex = phaseOrder.indexOf(phase);
  const previousPhases = completedPhases.filter(p => phaseOrder.indexOf(p) < currentPhaseIndex);
  
  const transitionPrompt = getPhaseTransitionPrompt(phase, previousPhases);
  
  return `${basePrompt}${contextPrompt}${transitionPrompt}\n\n${specificPrompt}\n
INSTRUCCIONES FINALES CRÍTICAS:
- TODO el contenido DEBE basarse en la hipótesis proporcionada arriba
- Usa ESPECÍFICAMENTE el problema: "${hypothesisData.problem}"
- Desarrolla para el segmento: "${hypothesisData.customerSegment}"
- Implementa la solución: "${hypothesisData.solution}"
- Entrega la propuesta de valor: "${hypothesisData.valueProposition}"
- NO inventes información, usa SOLO lo proporcionado en la hipótesis
- Utiliza formato markdown para estructurar tu respuesta
- Longitud mínima: 800 palabras
- Mantén coherencia con artefactos existentes
- Usa la terminología establecida en artefactos previos`;
};

const createArtifact = async (hypothesisId, phase, artifactType, content, suffix = '') => {
  return Artifact.create({
    hypothesisId,
    name: artifactType.name + suffix,
    phase,
    description: artifactType.description,
    content
  });
};

const storeVectorContext = async (artifact) => {
  try {
    await vectorContextService.storeArtifactContext(artifact);
    logOperation('Contexto vectorial almacenado', { artifactId: artifact.id });
  } catch (error) {
    console.error('Error al almacenar contexto vectorial:', error);
  }
};

const generateArtifactWithAI = async (req, res) => {
  try {
    const { hypothesisId, phase } = req.params;
    logOperation('Generando artefactos con IA', { hypothesisId, phase });
    
    // Debug mejorado
    console.log('=== DEBUG GENERACIÓN IA ===');
    console.log('API Key presente:', !!AI_CONFIG.API_KEY);
    console.log('API Key longitud:', AI_CONFIG.API_KEY?.length);
    console.log('Service URL:', AI_CONFIG.SERVICE_URL);
    
    if (!AI_CONFIG.API_KEY) {
      console.log('No hay API Key, usando plantillas de respaldo');
      return useFallbackGenerator(req, res);
    }
    
    const hypothesis = await Hypothesis.findOne({
      where: { id: hypothesisId, userId: req.user.id }
    });
    
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    if (!validatePhase(phase)) return res.status(400).json({ message: 'Fase no válida' });
    
    // Verificar coherencia antes de generar
    const stats = await vectorContextService.getContextStats(hypothesisId);
    
    const artifactsForPhase = ARTIFACT_TEMPLATES.artifactTypes[phase];
    const createdArtifacts = [];
    
    for (const artifactType of artifactsForPhase) {
      try {
        console.log(`Generando ${artifactType.name}...`);
        const prompt = await generatePrompt(phase, hypothesis, artifactType.name);
        console.log('Prompt generado, llamando a IA...');
        
        const aiResponse = await createAIRequest(prompt);
        console.log('Respuesta IA recibida');
        
        const content = aiResponse.data.choices[0].message.content;
        
        const artifact = await createArtifact(hypothesisId, phase, artifactType, content, ' (IA)');
        await storeVectorContext(artifact);
        createdArtifacts.push(artifact);
        console.log(`✓ ${artifactType.name} generado exitosamente`);
      } catch (error) {
        console.error(`Error generando ${artifactType.name}:`, {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack
        });
      }
    }
    
    if (!createdArtifacts.length) {
      console.log('No se pudo generar ningún artefacto, usando fallback');
      return handleError(res, new Error('No se pudo generar ningún artefacto'), 'Error al generar artefactos con IA');
    }
    
    // Obtener análisis de coherencia actualizado
    const updatedStats = await vectorContextService.getContextStats(hypothesisId);
    
    res.status(201).json({ 
      message: `${createdArtifacts.length} artefactos generados con IA`,
      artifacts: createdArtifacts,
      coherenceAnalysis: updatedStats.globalCoherence
    });
  } catch (error) {
    console.error('Error general en generateArtifactWithAI:', error);
    return useFallbackGenerator(req, res);
  }
};

const improveArtifactWithAI = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Mejorando artefacto con IA', { id });
    
    if (!AI_CONFIG.API_KEY) {
      return res.status(500).json({ message: 'No se ha configurado la clave API para el servicio de IA' });
    }
    
    const artifact = await Artifact.findByPk(id, {
      include: [{ model: Hypothesis, as: 'hypothesis' }]
    });
    
    if (!artifact) return res.status(404).json({ message: 'Artefacto no encontrado' });
    if (artifact.hypothesis.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    const contextPrompt = await getContextualPrompt(artifact.hypothesisId, artifact.phase, artifact.name);
    
    // Obtener estadísticas de coherencia actuales
    const currentStats = await vectorContextService.getContextStats(artifact.hypothesisId);
    const phaseCoherence = currentStats?.phaseCoherence?.[artifact.phase] || 0;
    
    const aiPrompt = req.body.prompt || `Mejora este artefacto de "${artifact.phase}":
${contextPrompt}

COHERENCIA ACTUAL DE LA FASE: ${(phaseCoherence * 100).toFixed(1)}%
${phaseCoherence < 0.5 ? 'IMPORTANTE: La coherencia de esta fase es baja. Asegúrate de alinear mejor este artefacto con otros de la misma fase.' : ''}

ARTEFACTO ACTUAL: 
${artifact.content}

Mejora este artefacto para que sea:
1. Más específico y detallado
2. Más coherente con otros artefactos de la fase
3. Mejor alineado con las decisiones tomadas en fases anteriores
4. Más accionable y práctico`;
    
    const aiResponse = await createAIRequest(aiPrompt);
    const improvedContent = aiResponse.data.choices[0].message.content;
    
    await artifact.update({
      content: improvedContent,
      name: artifact.name.includes('(Mejorado)') ? artifact.name : `${artifact.name} (Mejorado)`,
      description: `${artifact.description} Versión mejorada con IA para mayor coherencia.`
    });
    
    await vectorContextService.updateArtifactContext(artifact);
    
    // Obtener nueva coherencia
    const updatedStats = await vectorContextService.getContextStats(artifact.hypothesisId);
    const newPhaseCoherence = updatedStats?.phaseCoherence?.[artifact.phase] || 0;
    
    res.json({ 
      message: 'Artefacto mejorado con IA', 
      artifact,
      coherenceImprovement: {
        before: phaseCoherence,
        after: newPhaseCoherence,
        improvement: newPhaseCoherence - phaseCoherence
      }
    });
  } catch (error) {
    handleError(res, error, 'Error al mejorar artefacto con IA');
  }
};

const getContextStats = async (req, res) => {
  try {
    const { hypothesisId } = req.params;
    
    const hypothesis = await Hypothesis.findOne({
      where: { id: hypothesisId, userId: req.user.id }
    });
    
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    const stats = await vectorContextService.getContextStats(hypothesisId);
    
    res.json({ 
      hypothesisId, 
      contextStats: stats,
      globalCoherence: stats?.globalCoherence // La coherencia global ya viene en stats
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener estadísticas de contexto');
  }
};

const getCoherenceReport = async (req, res) => {
  try {
    const { hypothesisId } = req.params;
    
    const hypothesis = await Hypothesis.findOne({
      where: { id: hypothesisId, userId: req.user.id }
    });
    
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    const stats = await vectorContextService.getContextStats(hypothesisId);
    
    if (!stats) {
      return res.status(404).json({ message: 'No hay estadísticas disponibles' });
    }
    
    // La coherencia global ya viene incluida en stats
    const globalAnalysis = stats.globalCoherence || { 
      score: 0, 
      transitions: {}, 
      recommendation: 'No hay suficientes datos para análisis' 
    };
    
    // Generar reporte detallado
    const report = {
      summary: {
        totalArtifacts: stats.totalContexts,
        completedPhases: stats.completedPhases,
        totalPhases: stats.totalPhases,
        globalCoherence: globalAnalysis.score
      },
      phaseDetails: stats.phaseDistribution.map(phase => ({
        phase: phase.phase,
        artifactCount: phase.count,
        coherence: stats.phaseCoherence[phase.phase] || 0,
        status: stats.phaseCoherence[phase.phase] > 0.5 ? 'good' : 'needs-improvement'
      })),
      phaseTransitions: globalAnalysis.transitions,
      recommendations: globalAnalysis.recommendation,
      actionItems: generateActionItems(stats, globalAnalysis)
    };
    
    res.json(report);
  } catch (error) {
    handleError(res, error, 'Error al generar reporte de coherencia');
  }
};

const generateActionItems = (stats, globalAnalysis) => {
  const actionItems = [];
  
  // Verificar fases con baja coherencia
  Object.entries(stats.phaseCoherence).forEach(([phase, coherence]) => {
    if (coherence < 0.5) {
      actionItems.push({
        priority: 'high',
        phase: phase,
        action: `Revisar y mejorar coherencia en fase "${phase}"`,
        detail: 'Los artefactos de esta fase muestran baja coherencia entre sí'
      });
    }
  });
  
  // Verificar transiciones problemáticas
  Object.entries(globalAnalysis.phaseTransitions).forEach(([transition, coherence]) => {
    if (coherence < 0.4) {
      actionItems.push({
        priority: 'medium',
        transition: transition,
        action: `Mejorar transición ${transition}`,
        detail: 'La continuidad entre estas fases necesita fortalecerse'
      });
    }
  });
  
  return actionItems;
};

const useFallbackGenerator = async (req, res) => {
  try {
    const { hypothesisId, phase } = req.params;
    logOperation('Usando generador de respaldo', { hypothesisId, phase });
    
    const hypothesis = await Hypothesis.findOne({
      where: { id: hypothesisId, userId: req.user.id }
    });
    
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    if (!validatePhase(phase)) return res.status(400).json({ message: 'Fase no válida' });
    
    const artifactsForPhase = ARTIFACT_TEMPLATES.artifactTypes[phase];
    const createdArtifacts = [];
    
    for (const artifactType of artifactsForPhase) {
      try {
        const content = ARTIFACT_TEMPLATES.getDefaultContent(phase, artifactType.name, hypothesis);
        const artifact = await createArtifact(hypothesisId, phase, artifactType, content, ' (Plantilla)');
        createdArtifacts.push(artifact);
      } catch (error) {
        console.error(`Error creando plantilla ${artifactType.name}:`, error);
      }
    }
    
    res.status(201).json({ 
      message: `${createdArtifacts.length} artefactos de respaldo generados`,
      artifacts: createdArtifacts,
      note: 'Plantillas generadas porque el servicio de IA no está disponible.'
    });
  } catch (error) {
    handleError(res, error, 'Error al generar artefactos');
  }
};

module.exports = {
  generateArtifactWithAI,
  improveArtifactWithAI,
  getContextStats,
  getCoherenceReport
};