import { api } from './api';

export const contactService = {
  sendMessage: ({ name, email, message }) =>
    api.post('/api/contact', { name, email, message }),
};
