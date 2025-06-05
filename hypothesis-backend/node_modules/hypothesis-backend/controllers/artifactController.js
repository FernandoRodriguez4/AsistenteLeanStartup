const { Hypothesis, Artifact } = require('../models');
const { handleError, validatePhase, logOperation } = require('../helpers/controllerUtils');
const ARTIFACT_TEMPLATES = require('./artifactTemplates');

const findUserHypothesis = async (hypothesisId, userId) => {
  return Hypothesis.findOne({ where: { id: hypothesisId, userId } });
};

const verifyArtifactOwnership = async (artifactId, userId) => {
  const artifact = await Artifact.findByPk(artifactId, {
    include: [{ model: Hypothesis, as: 'hypothesis', attributes: ['userId'] }]
  });
  
  if (!artifact) return { artifact: null, authorized: false };
  return { artifact, authorized: artifact.hypothesis.userId === userId };
};

exports.getArtifactsByHypothesis = async (req, res) => {
  try {
    const { hypothesisId } = req.params;
    logOperation('Obteniendo artefactos', { hypothesisId });
    
    const hypothesis = await findUserHypothesis(hypothesisId, req.user.id);
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    const artifacts = await Artifact.findAll({ where: { hypothesisId } });
    res.json(artifacts);
  } catch (error) {
    handleError(res, error, 'Error al obtener artefactos');
  }
};

exports.generateArtifacts = async (req, res) => {
  try {
    const { hypothesisId, phase } = req.params;
    logOperation('Generando artefactos', { hypothesisId, phase });
    
    const hypothesis = await findUserHypothesis(hypothesisId, req.user.id);
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    if (!validatePhase(phase)) return res.status(400).json({ message: 'Fase no válida' });
    
    await Artifact.destroy({ where: { hypothesisId, phase } });
    
    const templates = ARTIFACT_TEMPLATES.getTemplatesForPhase(phase);
    const createdArtifacts = await Promise.all(
      templates.map(template => Artifact.create({
        hypothesisId,
        phase,
        ...template
      }))
    );
    
    res.status(201).json({ 
      message: `${createdArtifacts.length} artefactos generados para ${phase}`,
      artifacts: createdArtifacts 
    });
  } catch (error) {
    handleError(res, error, 'Error al generar artefactos');
  }
};

exports.createArtifact = async (req, res) => {
  try {
    const { hypothesisId } = req.params;
    const { name, phase, description, content } = req.body;
    
    logOperation('Creando artefacto', { hypothesisId });
    
    const hypothesis = await findUserHypothesis(hypothesisId, req.user.id);
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    const validation = validateRequiredFields(['name', 'phase', 'description', 'content'], req.body);
    if (validation) return res.status(400).json({ message: validation });
    if (!validatePhase(phase)) return res.status(400).json({ message: 'Fase no válida' });
    
    const artifact = await Artifact.create({ hypothesisId, name, phase, description, content });
    res.status(201).json(artifact);
  } catch (error) {
    handleError(res, error, 'Error al crear artefacto');
  }
};

exports.updateArtifact = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Actualizando artefacto', { id });
    
    const { artifact, authorized } = await verifyArtifactOwnership(id, req.user.id);
    if (!artifact) return res.status(404).json({ message: 'Artefacto no encontrado' });
    if (!authorized) return res.status(403).json({ message: 'No autorizado' });
    
    if (req.body.phase && !validatePhase(req.body.phase)) {
      return res.status(400).json({ message: 'Fase no válida' });
    }
    
    await artifact.update(req.body);
    res.json(artifact);
  } catch (error) {
    handleError(res, error, 'Error al actualizar artefacto');
  }
};

exports.deleteArtifact = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Eliminando artefacto', { id });
    
    const { artifact, authorized } = await verifyArtifactOwnership(id, req.user.id);
    if (!artifact) return res.status(404).json({ message: 'Artefacto no encontrado' });
    if (!authorized) return res.status(403).json({ message: 'No autorizado' });
    
    await artifact.destroy();
    res.json({ message: 'Artefacto eliminado correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar artefacto');
  }
};