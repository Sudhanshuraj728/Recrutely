import { api } from './api';

export const resumeService = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.request('/api/resumes/upload', {
      method: 'POST',
      body: formData,
    });
  },
  analyzeResume: ({ filename, originalName, companySlug, jobRole, jobDescription }) =>
    api.post('/api/resumes/analyze', {
      filename,
      originalName,
      companySlug,
      jobRole,
      jobDescription,
    }),
};
