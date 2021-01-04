import userApi from './userApi';

const api = {
  user: userApi,
};

export const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export default api;
