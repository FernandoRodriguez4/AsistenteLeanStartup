const { Hypothesis, Artifact } = require('../models');
const { handleError, validateRequiredFields, logOperation } = require('../helpers/controllerUtils');

const findUserHypothesis = async (id, userId, includeArtifacts = false) => {
  const options = { where: { id, userId } };
  if (includeArtifacts) options.include = [{ model: Artifact, as: 'artifacts' }];
  return Hypothesis.findOne(options);
};

const hypothesisFields = ['name', 'problem', 'solution', 'customerSegment', 'valueProposition'];

exports.getHypotheses = async (req, res) => {
  try {
    logOperation('Obteniendo hipótesis', { userId: req.user.id });
    
    const hypotheses = await Hypothesis.findAll({
      where: { userId: req.user.id },
      include: [{ model: Artifact, as: 'artifacts' }]
    });
    
    res.json(hypotheses || []);
  } catch (error) {
    handleError(res, error, 'Error al obtener hipótesis');
  }
};

exports.getHypothesisById = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Obteniendo hipótesis', { id });
    
    const hypothesis = await findUserHypothesis(id, req.user.id, true);
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    res.json(hypothesis);
  } catch (error) {
    handleError(res, error, 'Error al obtener hipótesis');
  }
};

exports.createHypothesis = async (req, res) => {
  try {
    logOperation('Creando hipótesis', req.body);
    
    // Corregido: pasar req.body primero, luego hypothesisFields
    const validation = validateRequiredFields(req.body, hypothesisFields);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Campos requeridos faltantes',
        missingFields: validation.missingFields 
      });
    }
    
    const hypothesis = await Hypothesis.create({
      userId: req.user.id,
      ...req.body
    });
    
    res.status(201).json(hypothesis);
  } catch (error) {
    handleError(res, error, 'Error al crear hipótesis');
  }
};

exports.updateHypothesis = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Actualizando hipótesis', { id });
    
    const hypothesis = await findUserHypothesis(id, req.user.id);
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    await hypothesis.update(req.body);
    res.json(hypothesis);
  } catch (error) {
    handleError(res, error, 'Error al actualizar hipótesis');
  }
};

exports.deleteHypothesis = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Eliminando hipótesis', { id });
    
    const hypothesis = await findUserHypothesis(id, req.user.id);
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    await hypothesis.destroy();
    res.json({ message: 'Hipótesis eliminada' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar hipótesis');
  }
};