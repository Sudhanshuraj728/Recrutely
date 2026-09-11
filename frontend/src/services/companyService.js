import { api } from './api';

export const companyService = {
  getCompanies: ({ page = 1, limit = 20, industry = '' } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (industry) params.set('industry', industry);
    return api.get(`/api/companies?${params.toString()}`);
  },
  searchCompanies: (query) =>
    api.get(`/api/companies/search?q=${encodeURIComponent(query)}`),
  getCompanyBySlug: (slug) => api.get(`/api/companies/${slug}`),
  getJobs: (slug) => api.get(`/api/companies/${slug}/jobs`),
};
