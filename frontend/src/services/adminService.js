import { api } from './api';

export const adminService = {
  getUsers: () => api.get('/api/admin/users'),
  getCompanies: () => api.get('/api/admin/companies'),
  getContacts: () => api.get('/api/admin/contacts'),
  getReport: () => api.get('/api/admin/report'),
  exportData: (type) => api.get(`/api/admin/export?type=${encodeURIComponent(type)}`),
  getLogs: () => api.get('/api/admin/logs'),
  getHealth: () => api.get('/api/admin/health'),
};
