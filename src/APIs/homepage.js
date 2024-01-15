import axios from "axios";
const API = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });

export const getAllWorkers = async (data) => {
  try {
    const response = await API.get(`user/allWorkers/${data.userId}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return response.data.workers;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWorkersByType = async (params) => {
  try {
    const { userId, type, token } = params;
    const response = await API.get(`user/allWorkers/${userId}/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.workers;
  } catch (error) {
    throw error.response.data;
  }
};
