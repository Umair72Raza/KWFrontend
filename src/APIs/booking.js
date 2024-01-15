import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:3000/order" });

export const createOrder= async (data)=>{
  try {   
    const response = await API.post(`/postanOrder`, data.params,{
      headers: {
        Authorization: `Bearer ${data.token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}


