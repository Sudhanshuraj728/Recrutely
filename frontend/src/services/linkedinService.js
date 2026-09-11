import { api } from './api';

export const linkedinService = {
  getStatus: () => api.get('/api/linkedin/status'),
  getCompanyEmployees: (companyName) =>
    api.get(`/api/linkedin/company-employees/${encodeURIComponent(companyName)}`),
};
