import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:3000/user" });
 
export const getAllWorkers= async (data)=>{
  try {   
    
    const response = await API.get(`/allWorkers/${data.userId}`,{
      headers: {
        Authorization: `Bearer ${data.token}`
      }
    });
    console.log(response.data);
    return response.data.workers;
    
  } catch (error) {
    throw error.response.data;
  }
}

export const getWorkersByType= async (params)=>{
  try {   
    const {userId,type,token}=params
    const response = await API.get(`/allWorkers/${userId}/${type}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.workers;
  } catch (error) {
    throw error.response.data;
  }
}

