import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT,
});

export const createOrder = async (data) => {
  try {
  console.log(data.params,"data in api")
    const {
      Title,
      Status,
      users,
      date,
      time,
      details,
      amount,
      service,
      address,
      tasktime,
      images,
      location,
    } = data.params;
    const response = await API.post(`order/postanOrder`,{
      Title,
      Status,
      users,
      date,
      time,
      details,
      amount,
      service,
      address,
      tasktime,
      images,
      location,
    }, {
      headers: {
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
