import axios from "axios";
const API = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });

export const getAllTheUsers = async (token) => {
  try {
    const response = await API.get(`admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllTheWorkers = async (token) => {
  try {
    const response = await API.get(`admin/workers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const togglePersonAccess = async (token, id, access) => {
  try {
    
    const response = await API.put(
      `admin/users/${id}`,
      { access },
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

export const getAllServicesAdmin = async () => {
  try {
    const response = await API.get(`admin/services`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createNewService = async (token, name, id) => {
  try {
    const response = await API.post(
      `admin/newService/`,
      { name, id },
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


export const deleteAService = async(token, id) => {
  try {
    const response = await API.delete(
      `admin/services/${id}`,
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

///users/:id
export const getAllUserOrders = async (token, id) => {
  try {
    const response = await API.get(`admin/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchFeedbacksofUser = async (data) => {
    try {
      const {_id,token} = data
      const response = await API.get(`admin/feedbacks/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };


  