import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:3000/feedback" });


export const AddFeedback= async (data)=>{
  try {   
    const response = await API.post(`/addFeedback`, data.params,{
      headers: {
        Authorization: `Bearer ${data.token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
