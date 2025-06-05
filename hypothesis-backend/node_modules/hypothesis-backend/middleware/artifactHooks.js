const vectorContextService = require('../services/vectorContextService');

// Función auxiliar para logging consistente
const logHookAction = (action, artifactId, error = null) => {
  const prefix = 'Hook:';
  if (error) {
    console.error(`${prefix} Error al ${action} contexto para artefacto ${artifactId}:`, error);
  } else {
    console.log(`${prefix} Contexto ${action} para artefacto ${artifactId}`);
  }
};

// Función genérica para ejecutar operaciones de contexto
const executeContextOperation = async (operation, artifactId, actionName) => {
  try {
    await operation();
    logHookAction(actionName, artifactId);
  } catch (error) {
    logHookAction(actionName, artifactId, error);
  }
};

// Hook para después de crear un artefacto
exports.afterArtifactCreate = async (artifact) => {
  await executeContextOperation(
    () => vectorContextService.storeArtifactContext(artifact),
    artifact.id,
    'almacenado'
  );
};

// Hook para después de actualizar un artefacto
exports.afterArtifactUpdate = async (artifact) => {
  await executeContextOperation(
    () => vectorContextService.updateArtifactContext(artifact),
    artifact.id,
    'actualizado'
  );
};

// Hook para después de eliminar un artefacto
exports.afterArtifactDelete = async (artifactId) => {
  await executeContextOperation(
    () => vectorContextService.deleteArtifactContext(artifactId),
    artifactId,
    'eliminado'
  );
};