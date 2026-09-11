import { api } from './api';

export const applicationService = {
  list: () => api.get('/api/applications'),
  create: (payload) => api.post('/api/applications', payload),
  update: (id, payload) => api.patch(`/api/applications/${id}`, payload),
  remove: (id) => api.del(`/api/applications/${id}`),
};
