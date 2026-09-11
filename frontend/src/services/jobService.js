import { companyService } from './companyService';

export const jobService = {
  async getJobsByCompanySlug(slug) {
    const response = await companyService.getJobs(slug);
    return {
      success: response?.success,
      data: response?.data?.jobs || [],
      company: response?.data?.company || null,
    };
  },
};
