import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:3000/user" });

export const sendOTP = async (email) => {
  try {
    const response = await API.post(`/forgot-password`, { email: email });
    return response;
  } catch (error) {
    throw error.response.data; // Throw the response error data
  }
};

export const newPasswordSetter = async (email, newPass) => {
  try {
    console.log(email,newPass)
    const response = await API.put(`/newPassword`, {
      email: email,
      password: newPass,
    });
    console.log(response);
    return response;
  } catch (error) {
    throw error.response.data; // Throw the response error data
  }
};

export const OTPverify = async (otp) => {
  try {
    const response = await API.put(`/reset-password/${otp}`);
    console.log(response);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser =async (email, password) =>{
  const response = await  API.post(`/loginUser`, { email: email, password: password });
return response.data;
 }

export const signUpUser = async (
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  longitude,
  latitude,
  address,
  services
) =>
  API.post(`/signUp`, {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    longitude,
    latitude,
    address,
    services
  });

  // /updateOnlineStatus/:id
  export const toggleStatus=  async (data) => {
    try {
      const {id,status} = data
      console.log(data);
      const response = await API.put(`/updateOnlineStatus/${id}`, {status}, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
