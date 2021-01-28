import axios from 'axios';
import { apiURL } from './index';

const timekeeperApi = {
  createNewTimekeeper: async (timekeeperObject) => {
    const { title, message, timestamp } = timekeeperObject;
    const response = await axios.post(
      apiURL + '/api/timekeeper',
      {
        title,
        message,
        timestamp,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  },
  getAllTimekeepers: async () => {
    const response = await axios.get(apiURL + '/api/timekeeper', {
      withCredentials: true,
    });

    return response.data;
  },
  deleteATimekeeper: async (timekeeperId) => {
    const response = await axios.delete(
      apiURL + `/api/timekeeper/${timekeeperId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  },
  updateATimekeeper: async (newTimekeeperObject) => {
    const { id, ...editedProperties } = newTimekeeperObject;
    const response = await axios.put(
      apiURL + `/api/timekeeper/${id}`,
      editedProperties,
      {
        withCredentials: true,
      }
    );

    return response.data;
  },
};

export default timekeeperApi;
