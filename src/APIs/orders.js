import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT,
});

export const fetchPastOrders = async (data) => {
  try {
    const { users, status, token } = data;
    const response = await API.get(
      `order/getOrderbyIdnStatus/${users}/${status}`,
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

export const fetchAllOrders = async (id) => {
  try {
    const response = await API.get(`order/getAllOrderbyId/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchSchOrders = async (data) => {
  try {
    const { users, status, token } = data;
    const response = await API.get(
      `order/getScheduledOrders/${users}/${status}`,
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

export const fetchCancOrders = async (data) => {
  try {
    const { users, status, token } = data;
    const response = await API.get(
      `order/getCancelledOrder/${users}/${status}`,
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

export const fetchPostedOrders = async (data) => {
  try {
    const { users, status, token } = data;
    const response = await API.get(`order/getPostedOrder/${users}/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//fetchOpenOrders
export const fetchOpenOrders = async (data) => {
  try {
    const { userId, token } = data;
    const response = await API.get(`order/getOpenOrder/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchActiveOrders = async (data) => {
  try {
    const { users, status, token } = data;
    const response = await API.get(`order/getActiveOrder/${users}/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const fetchPendingOrders = async (data) => {
  try {
    const { users, status, token } = data;
    const response = await API.get(`order/getPendingOrder/${users}/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const cancelOrder = async (dataWithToken) => {
  try {
    const { data, token } = dataWithToken;
    const response = await API.put("order/updateStatus", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error.response.data;
  }
};

export const activateOrder = async (data) => {
  try {
    const { orderId, token } = data;
    const data1 = { orderId };
    const response = await API.put("order/activateStatus", data1, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error.response.data;
  }
};

//schedulizeOrder.


export const schedulizeOrder = async (data) => {
  try {
    const { orderId, token, workerId } = data;
    const data1 = { orderId, workerId };
    const response = await API.put("order/schedulizeOrder", data1, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error.response.data;
  }
};

export const changeToPast = async (data) => {
  try {
    const { orderId, token } = data;
  
    const data1 = { orderId };
    const response = await API.put("order/changeToPast", data1, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteTheOrder = async (data) => {
  try {
    const { id, token } = data;
  
    const response = await API.delete(`order/deleteOrder/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const checkStatus = async (data) => {
  try {
    const { id, token } = data;
  
    const response = await API.get(`order/checkOrderStatus/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}