import axios from "axios";
const API = axios.create({ baseURL: import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT });

export const createOrder = async (data) => {
  try {
    const response = await API.post(`order/postanOrder`, data.params, {
      headers: {
        Authorization: `Bearer ${data.token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}


