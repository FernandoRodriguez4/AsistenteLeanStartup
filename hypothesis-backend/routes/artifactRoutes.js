const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const artifactController = require('../controllers/artifactController');
const aiController = require('../controllers/aiController');

// Aplicar autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de artefactos básicos
router.route('/:hypothesisId')
  .get(artifactController.getArtifactsByHypothesis)
  .post(artifactController.createArtifact);

// Rutas de generación
router.post('/:hypothesisId/generate/:phase', artifactController.generateArtifacts);
router.post('/:hypothesisId/generate-ai/:phase', aiController.generateArtifactWithAI);

// Rutas de artefactos individuales
router.route('/:id')
  .put(artifactController.updateArtifact)
  .delete(artifactController.deleteArtifact);

// Rutas de IA
router.post('/:id/improve', aiController.improveArtifactWithAI);

// Ruta de estadísticas de contexto
router.get('/:hypothesisId/context-stats', aiController.getContextStats);

module.exports = router;