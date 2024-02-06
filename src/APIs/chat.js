import axios from "axios";
const API = axios.create({ baseURL: import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT });

export const GetChats = async (UserId, token) => {
  try {
    const response = await API.get(`chats/chatWithWorkers/${UserId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const GetMessages = async (chatId, token) => {
  try {
    const response = await API.get(`messages/allMessages/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.log(error.response, "getting messages")
    throw error.response.data;
  }
};

export const SendMessage = async (formData) => {
  try {
    const token = formData.get('token');
    
    const response = await API.post(`messages/sendMessage`,formData , {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};


export const ToggleSeen = async (chatId, token, seen) => {
  try {
    const response = await API.put(`chats/chatSeenToggle/${chatId}`, {
      seen
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
