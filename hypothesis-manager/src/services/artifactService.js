import api from './api';

const ARTIFACT_ENDPOINTS = {
  BY_HYPOTHESIS: (hypothesisId) => `/artifacts/${hypothesisId}`,
  GENERATE: (hypothesisId, phase) => `/artifacts/${hypothesisId}/generate/${phase}`,
  CREATE: (hypothesisId) => `/artifacts/${hypothesisId}`,
  UPDATE: (id) => `/artifacts/${id}`,
  DELETE: (id) => `/artifacts/${id}`
};

const createArtifactService = (operation, errorMessage) => {
  return async (...args) => {
    try {
      const response = await operation(...args);
      return response.data;
    } catch (error) {
      console.error(errorMessage, error);
      throw error;
    }
  };
};

export const fetchArtifactsByHypothesis = createArtifactService(
  async (hypothesisId) => api.get(ARTIFACT_ENDPOINTS.BY_HYPOTHESIS(hypothesisId)),
  'Error fetching artifacts:'
);

export const generateArtifacts = createArtifactService(
  async (hypothesisId, phase) => api.post(ARTIFACT_ENDPOINTS.GENERATE(hypothesisId, phase)),
  'Error generating artifacts:'
);

export const createArtifact = createArtifactService(
  async (hypothesisId, artifactData) => api.post(ARTIFACT_ENDPOINTS.CREATE(hypothesisId), artifactData),
  'Error creating artifact:'
);

export const updateArtifact = createArtifactService(
  async (id, artifactData) => api.put(ARTIFACT_ENDPOINTS.UPDATE(id), artifactData),
  'Error updating artifact:'
);

export const deleteArtifact = createArtifactService(
  async (id) => api.delete(ARTIFACT_ENDPOINTS.DELETE(id)),
  'Error deleting artifact:'
);
