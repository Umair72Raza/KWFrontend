import axios from "axios";
const API = axios.create({ baseURL: import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT });

export const sendOTP = async (email) => {
  try {
    const response = await API.post(`user/forgot-password`, { email: email });
    return response;
  } catch (error) {
    throw error.response.data; // Throw the response error data
  }
};

export const newPasswordSetter = async (email, newPass) => {
  try {
    const response = await API.put(`user/newPassword`, {
      email: email,
      password: newPass,
    });
    return response;
  } catch (error) {
    throw error.response.data; // Throw the response error data
  }
};

export const OTPverify = async (otp) => {
  try {
    const response = await API.put(`user/reset-password/${otp}`);

    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (email, password) => {
  const response = await API.post(`user/loginUser`, {
    email: email,
    password: password,
  });
  return response.data;
};

export const signUpUser = async (
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  longitude,
  latitude,
  address,
  country,
  services
) =>
  API.post(`user/signUp`, {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    longitude,
    latitude,
    address,
    country,
    services,
  });

// /updateOnlineStatus/:id
export const toggleStatus = async (data) => {
  try {
    const { id, status } = data;
    const response = await API.put(
      `user/updateOnlineStatus/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
