import axios from "axios";
const API = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });


export const AddFeedback= async (data)=>{
  try {   
    const response = await API.post(`feedback/addFeedback`, data.params,{
      headers: {
        Authorization: `Bearer ${data.token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
