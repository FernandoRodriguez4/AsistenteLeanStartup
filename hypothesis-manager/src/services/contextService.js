import api from './api';

const CONTEXT_ENDPOINTS = {
  STATS: (hypothesisId) => `/artifacts/${hypothesisId}/context-stats`
};

export const getContextStats = async (hypothesisId) => {
  try {
    const endpoint = CONTEXT_ENDPOINTS.STATS(hypothesisId);
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error getting context stats:', error);
    throw error;
  }
};