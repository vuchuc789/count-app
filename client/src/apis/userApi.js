import axios from 'axios';
import { apiURL } from './index';

const userApi = {
  checkLoggedIn: async () => {
    const response = await axios.get(apiURL + '/api/user/id', {
      withCredentials: true,
    });

    return response.data;
  },
  register: async (nickname) => {
    const response = await axios.post(
      apiURL + '/api/user/register',
      {
        nickname,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  },
  login: async (userId) => {
    const response = await axios.post(
      apiURL + '/api/user/sign-in',
      {
        userId,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  },
  getNickname: async () => {
    const response = await axios.get(apiURL + '/api/user/nickname', {
      withCredentials: true,
    });

    return response.data;
  },
};

export default userApi;
