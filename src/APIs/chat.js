import axios from "axios";
const API = axios.create({ baseURL: import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT });

export const GetChats = async (UserId, token) => {
  try {
    const response = await API.get(`/chats/chat/${UserId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const GetMessages = async (chatId,token) => {
  try {
    const response = await API.get(`/messages/allMessages/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const SendMessage = async (receiverId, text, initiatorId,token) => {
  try {
    const response = await API.post(`/messages/sendMessage`, {
      receiverId,
      text,
      initiatorId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
