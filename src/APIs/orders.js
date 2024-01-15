import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:3000/order" });

export const fetchOrders = async (data) => {
  try {
    const { users, status, token } = data;
    const response = await API.get(`/getOrderbyIdnStatus/${users}/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data, "getting past orders");
    return response.data;
  } catch (error) {
    console.log(error, "error getting orders");
  }
};

export const fetchAllOrders = async (id) => {
  try {
    const response = await API.get(`/getAllOrderbyId/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchSchOrders = async (data) => {
  try {
    const { users, status, token } = data;
    //const { users, status } = params;
    const response = await API.get(`/getScheduledOrders/${users}/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error, "error getting orders");
  }
};

export const fetchCancOrders = async (data) => {
  try {
    const { users, status, token } = data;
    const response = await API.get(`/getCancelledOrder/${users}/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error, "error getting orders");
  }
};

export const fetchActiveOrders = async (data) => {
  try {
    const { users, status, token } = data;
    const response = await API.get(`/getActiveOrder/${users}/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error, "error getting orders");
  }
};

export const cancelOrder = async (dataWithToken) => {
  try {
    const { data, token } = dataWithToken;
    const response = await API.put("/updateStatus", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error, "error cancelling order");
  }
};

export const activateOrder = async (data) => {
  try {
    console.log(data);
    const response = await API.put("/activateStatus", data);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error, "error cancelling order");
  }
};
export const changeToPast = async (data) => {
  try {
    console.log(data);
    const response = await API.put("/changeToPast", data);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error, "error changning status to past");
  }
};
