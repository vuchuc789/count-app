import userApi from './userApi';
import timekeeperApi from './timekeeperApi';

const api = {
  user: userApi,
  timekeeper: timekeeperApi,
};

export const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export default api;
