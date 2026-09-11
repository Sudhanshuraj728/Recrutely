import { api } from './api';

export const authService = {
  getCurrentUser: () => api.get('/api/auth/user'),
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),
  logout: () => api.post('/api/auth/logout', {}),
  unlinkLinkedIn: () => api.post('/api/auth/unlink-linkedin', {}),
  oauth: {
    google: '/auth/google',
    linkedin: '/auth/linkedin',
  },
};
