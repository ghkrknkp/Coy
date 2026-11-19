import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Network request failed'
    };
    return Promise.reject(customError);
  }
);

export const api = {
  /**
   * Fetch profiles that the demo user has not yet swiped on
   */
  async getFeed(limit = 10, offset = 0) {
    const response = await apiClient.get('/feed', { params: { limit, offset } });
    return response.data;
  },

  /**
   * Submit a swipe action ('LIKE' or 'PASS')
   */
  async swipe(profileId, action) {
    const response = await apiClient.post('/swipe', { profileId, action });
    return response.data;
  },

  /**
   * Fetch mutual matches for the demo user
   */
  async getMatches() {
    const response = await apiClient.get('/matches');
    return response.data;
  },

  /**
   * Fetch message history for a match
   */
  async getMessages(matchId) {
    const response = await apiClient.get(`/matches/${matchId}/messages`);
    return response.data;
  },

  /**
   * Send a message and receive an AI persona / chatbot response
   */
  async sendMessage(matchId, text, apiKey = '') {
    const response = await apiClient.post(`/matches/${matchId}/messages`, { text, apiKey });
    return response.data;
  },

  /**
   * Reset demo state
   */
  async resetDemo() {
    const response = await apiClient.post('/reset');
    return response.data;
  },

  /**
   * Health check
   */
  async getHealth() {
    const response = await apiClient.get('/health');
    return response.data;
  }
};

export default api;
