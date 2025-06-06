import api from './api';

const HYPOTHESIS_ENDPOINTS = {
  LIST: '/hypotheses',
  DETAIL: (id) => `/hypotheses/${id}`,
  CREATE: '/hypotheses',
  UPDATE: (id) => `/hypotheses/${id}`,
  DELETE: (id) => `/hypotheses/${id}`
};

const createHypothesisService = (operation, errorMessage) => {
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

export const fetchHypotheses = createHypothesisService(
  async () => api.get(HYPOTHESIS_ENDPOINTS.LIST),
  'Error fetching hypotheses:'
);

export const fetchHypothesisById = createHypothesisService(
  async (id) => api.get(HYPOTHESIS_ENDPOINTS.DETAIL(id)),
  'Error fetching hypothesis:'
);

export const saveHypothesis = createHypothesisService(
  async (hypothesisData) => api.post(HYPOTHESIS_ENDPOINTS.CREATE, hypothesisData),
  'Error saving hypothesis:'
);

export const updateHypothesis = createHypothesisService(
  async (id, hypothesisData) => api.put(HYPOTHESIS_ENDPOINTS.UPDATE(id), hypothesisData),
  'Error updating hypothesis:'
);

export const deleteHypothesis = createHypothesisService(
  async (id) => api.delete(HYPOTHESIS_ENDPOINTS.DELETE(id)),
  'Error deleting hypothesis:'
);