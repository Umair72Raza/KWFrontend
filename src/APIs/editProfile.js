import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT,
});

export const getUsersData = async (id, token) => {
  try {
    const response = await API.get(`user/getUserdata/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProfile = async (id, token, formData) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      latitude,
      longitude,
      country,
      address,
      services,
    } = formData;
    const response = await API.put(
      `user/updateProfile/${id}`,
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        latitude,
        longitude,
        country,
        address,
        services,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
