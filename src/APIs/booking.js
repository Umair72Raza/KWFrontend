import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT,
});

export const createOrder = async (formData,token) => {
  try {
  // console.log(data.params,"data in api")
  //   const {
  //     Title,
  //     Status,
  //     users,
  //     date,
  //     time,
  //     details,
  //     amount,
  //     service,
  //     address,
  //     tasktime,
  //     images,
  //     location,
  //   } = data.params;
    console.log(formData,"data in api")
    const response = await API.post(`order/postanOrder`,formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editOrder = async(formData,token, id) => {
  try {
      console.log(formData,"data in api")
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      const response = await API.put(`order/editanOrder/${id}`,formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
}