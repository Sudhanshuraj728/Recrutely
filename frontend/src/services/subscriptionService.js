import { api } from './api';

export const subscriptionService = {
  getStatus: () => api.get('/api/subscription/status'),
  getPricing: () => api.get('/api/subscription/pricing'),
  initiateUpgrade: () => api.post('/api/subscription/initiate-upgrade', {}),
  confirmUpgrade: ({ paymentId, orderId, signature }) =>
    api.post('/api/subscription/confirm-upgrade', {
      paymentId,
      orderId,
      signature,
    }),
};
