import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:3000/" });

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
