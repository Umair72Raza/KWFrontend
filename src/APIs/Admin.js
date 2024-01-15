import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:3000/admin" });

export const getAllTheUsers = async (token) => {
  try {
    const response = await API.get(`/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data, "response in the apis ");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllTheWorkers = async (token) => {
  try {
    const response = await API.get(`/workers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data,"response in get worker the apis ");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const togglePersonAccess = async (token, id, access) => {
  try {
    
    const response = await API.put(
      `/users/${id}`,
      { access },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //console.log(response.data,"response in put newAccess apis");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllServicesAdmin = async () => {
  try {
    const response = await API.get(`/services`);
    console.log(response.data,"response in get all services apis");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createNewService = async (token, name, id) => {
  try {
    const response = await API.post(
      `/newService/`,
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
      `/services/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //console.log(response, "response in del service apis");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

///users/:id
export const getAllUserOrders = async (token, id) => {
  try {
    const response = await API.get(`/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log(response, "response in set apis");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchFeedbacksofUser = async (data) => {
    try {
      const {_id,token} = data
      console.log(_id,"id for feedbacks")
      console.log(token,"token in the ap[is admin")
      const response = await API.get(`/feedbacks/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response getting feedbacks", response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };


  